import { Cart, cartTotal } from "@/domain/cart/cart";
import { Customer } from "@/domain/customer/customer";
import { Money } from "@/domain/shared/money";

export type OrderStatus =
  | "en_attente"
  | "confirmee"
  | "expediee"
  | "livree"
  | "annulee";

export interface StatusChange {
  status: OrderStatus;
  changedAt: string; // ISO date
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantLabel?: string;
  quantity: number;
  priceCents: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  totalCents: number;
  status: OrderStatus;
  statusHistory: StatusChange[];
  createdAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  en_attente: ["confirmee", "annulee"],
  confirmee: ["expediee", "annulee"],
  expediee: ["livree"],
  livree: [],
  annulee: [],
};

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return ORDER_TRANSITIONS[current];
}

export function placeOrder(cart: Cart, customer: Customer): Order {
  if (cart.items.length === 0) {
    throw new Error("Le panier est vide.");
  }

  const items: OrderItem[] = cart.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    variantLabel: item.variantLabel,
    quantity: item.quantity,
    priceCents: item.priceCents,
  }));

  const now = new Date().toISOString();

  return {
    id: `CMD-${Date.now()}`,
    items,
    customer,
    totalCents: cartTotal(cart).toCents(),
    status: "en_attente",
    statusHistory: [{ status: "en_attente", changedAt: now }],
    createdAt: now,
  };
}

export function formatOrderForWhatsApp(order: Order): string {
  const nl = "\n";
  const doubleNl = "\n\n";

  let msg = `*NOUVELLE COMMANDE* (${order.id})${doubleNl}`;

  msg += `*Client(e) :* ${order.customer.fullName}${nl}`;
  msg += `*Téléphone :* ${order.customer.phone}${nl}`;
  if (order.customer.email) {
    msg += `*Email :* ${order.customer.email}${nl}`;
  }
  msg += `*Adresse :* ${order.customer.address}, ${order.customer.city}${nl}`;
  if (order.customer.landmark) {
    msg += `*Repère :* ${order.customer.landmark}${nl}`;
  }
  if (order.customer.notes) {
    msg += `*Notes :* ${order.customer.notes}${nl}`;
  }
  
  msg += `${doubleNl}*PRODUITS :*${nl}`;
  
  order.items.forEach((item) => {
    const variantStr = item.variantLabel ? ` (${item.variantLabel})` : "";
    const priceStr = Money.fromCents(item.priceCents).format();
    msg += `- ${item.quantity}x ${item.productName}${variantStr} - ${priceStr}${nl}`;
  });

  const totalStr = Money.fromCents(order.totalCents).format();
  msg += `${doubleNl}*TOTAL : ${totalStr}*`;

  return msg;
}
