import { OrderRepository } from "@/application/ports/order-repository";
import { OrderStatus } from "@/domain/order/order";

/**
 * Use-cases admin pour la gestion des commandes.
 */

export function getAllOrders(repo: OrderRepository) {
  return repo.findAll();
}

export function getOrderById(repo: OrderRepository, id: string) {
  return repo.findById(id);
}

export function getOrdersByStatus(repo: OrderRepository, status: OrderStatus) {
  return repo.findByStatus(status);
}

export function getOrdersByPeriod(
  repo: OrderRepository,
  from: string,
  to: string,
) {
  return repo.findByPeriod(from, to);
}

export async function updateOrderStatus(
  repo: OrderRepository,
  id: string,
  newStatus: OrderStatus,
  note?: string,
) {
  const order = await repo.findById(id);
  if (!order) throw new Error(`Commande introuvable : ${id}`);
  return repo.updateStatus(id, newStatus, note);
}
