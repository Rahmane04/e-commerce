import { OrderRepository } from "@/application/ports/order-repository";
import { Order, OrderStatus } from "@/domain/order/order";
import { authedFetch, fetchJson, publicFetch } from "@/infrastructure/http/authed-fetch";

export interface ApiOrderItem {
  productId?: string | number;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  variantId?: string | number | null;
  variantLabel?: string | null;
}

export interface ApiOrder {
  id: number | string;
  status: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  deliveryNotes?: string | null;
  totalCents: number;
  createdAt?: string | null;
  items: ApiOrderItem[];
}

export function toDomainOrder(api: ApiOrder): Order {
  const createdAt = api.createdAt ?? new Date().toISOString();
  const status = (api.status as OrderStatus) || "en_attente";

  return {
    id: String(api.id),
    status,
    customer: {
      fullName: api.customerName ?? "",
      phone: api.customerPhone ?? "",
      email: api.customerEmail ?? undefined,
      city: "",
      address: api.deliveryAddress ?? "",
      notes: api.deliveryNotes ?? undefined,
    },
    totalCents: api.totalCents,
    items: (api.items ?? []).map((i) => ({
      productId: String(i.productId ?? ""),
      productName: i.productName,
      variantId: i.variantId ? String(i.variantId) : undefined,
      variantLabel: i.variantLabel ?? undefined,
      quantity: i.quantity,
      priceCents: i.unitPriceCents,
    })),
    statusHistory: [
      {
        status,
        changedAt: createdAt,
      },
    ],
    createdAt,
  };
}

export class ApiOrderRepository implements OrderRepository {
  async findAll(): Promise<Order[]> {
    const data = await fetchJson<ApiOrder[]>("/orders");
    return data.map(toDomainOrder);
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const data = await fetchJson<ApiOrder>(`/orders/${id}`);
      return toDomainOrder(data);
    } catch {
      return null;
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.findAll();
    return orders.filter((o) => o.status === status);
  }

  async findByPeriod(from: string, to: string): Promise<Order[]> {
    const orders = await this.findAll();
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= fromDate && d <= toDate;
    });
  }

  /**
   * Création d'une commande via POST /orders (route publique non authentifiée).
   */
  async create(order: Order): Promise<Order> {
    const payload = {
      customer_name: order.customer.fullName,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email ?? null,
      delivery_address: order.customer.city
        ? `${order.customer.address}, ${order.customer.city}`
        : order.customer.address,
      delivery_notes: order.customer.landmark
        ? `Repère : ${order.customer.landmark}${order.customer.notes ? ` — ${order.customer.notes}` : ""}`
        : order.customer.notes ?? null,
      items: order.items.map((item) => {
        const prodId = parseInt(item.productId, 10);
        const varId = item.variantId ? parseInt(item.variantId, 10) : null;
        return {
          product_id: isNaN(prodId) ? item.productId : prodId,
          variant_id: varId && !isNaN(varId) ? varId : null,
          quantity: item.quantity,
        };
      }),
    };

    const res = await publicFetch("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const created = (await res.json()) as ApiOrder;
    return toDomainOrder(created);
  }

  async confirm(id: string): Promise<Order> {
    const res = await authedFetch(`/orders/${id}/confirm`, { method: "POST" });
    const data = (await res.json()) as ApiOrder;
    return toDomainOrder(data);
  }

  async ship(id: string): Promise<Order> {
    const res = await authedFetch(`/orders/${id}/ship`, { method: "POST" });
    const data = (await res.json()) as ApiOrder;
    return toDomainOrder(data);
  }

  async deliver(id: string): Promise<Order> {
    const res = await authedFetch(`/orders/${id}/deliver`, { method: "POST" });
    const data = (await res.json()) as ApiOrder;
    return toDomainOrder(data);
  }

  async cancel(id: string): Promise<Order> {
    const res = await authedFetch(`/orders/${id}/cancel`, { method: "POST" });
    const data = (await res.json()) as ApiOrder;
    return toDomainOrder(data);
  }

  async updateStatus(id: string, newStatus: OrderStatus, _note?: string): Promise<Order> {
    switch (newStatus) {
      case "confirmee":
        return this.confirm(id);
      case "expediee":
        return this.ship(id);
      case "livree":
        return this.deliver(id);
      case "annulee":
        return this.cancel(id);
      default:
        throw new Error(`Transition de statut invalide ou non supportée : ${newStatus}`);
    }
  }
}

export const orderRepository = new ApiOrderRepository();
