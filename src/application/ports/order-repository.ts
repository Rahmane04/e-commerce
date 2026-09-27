import { Order, OrderStatus } from "@/domain/order/order";

/**
 * Port OrderRepository — utilisé par les use-cases admin et le checkout.
 * En V2 : adapter API Laravel (ApiOrderRepository).
 */
export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByPeriod(from: string, to: string): Promise<Order[]>;
  updateStatus(id: string, newStatus: OrderStatus, note?: string): Promise<Order>;
  create(order: Order): Promise<Order>;
  confirm(id: string): Promise<Order>;
  ship(id: string): Promise<Order>;
  deliver(id: string): Promise<Order>;
  cancel(id: string): Promise<Order>;
}
