import { OrderRepository } from "@/application/ports/order-repository";
import { Order, OrderStatus } from "@/domain/order/order";
import { mockOrders } from "@/data/mock-orders";

/**
 * Adapter mocké pour les commandes — données en mémoire.
 * En V2, ApiOrderRepository appellera l'API Laravel.
 */
export class MockOrderRepository implements OrderRepository {
  private orders: Order[] = [...mockOrders];

  private async delay(ms = 150) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async findAll(): Promise<Order[]> {
    await this.delay();
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async findById(id: string): Promise<Order | null> {
    await this.delay();
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    await this.delay();
    return this.orders.filter((o) => o.status === status);
  }

  async findByPeriod(from: string, to: string): Promise<Order[]> {
    await this.delay();
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= fromDate && d <= toDate;
    });
  }

  async updateStatus(
    id: string,
    newStatus: OrderStatus,
    note?: string,
  ): Promise<Order> {
    await this.delay(200);
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Commande introuvable : ${id}`);

    const now = new Date().toISOString();
    const updated: Order = {
      ...this.orders[index],
      status: newStatus,
      statusHistory: [
        ...this.orders[index].statusHistory,
        { status: newStatus, changedAt: now, note },
      ],
    };

    this.orders = [
      ...this.orders.slice(0, index),
      updated,
      ...this.orders.slice(index + 1),
    ];
    return updated;
  }

  async create(order: Order): Promise<Order> {
    await this.delay(200);
    const created = { ...order, id: order.id || `CMD-${Date.now()}` };
    this.orders = [created, ...this.orders];
    return created;
  }

  async confirm(id: string): Promise<Order> {
    return this.updateStatus(id, "confirmee");
  }

  async ship(id: string): Promise<Order> {
    return this.updateStatus(id, "expediee");
  }

  async deliver(id: string): Promise<Order> {
    return this.updateStatus(id, "livree");
  }

  async cancel(id: string): Promise<Order> {
    return this.updateStatus(id, "annulee");
  }
}

export const orderRepository = new MockOrderRepository();
