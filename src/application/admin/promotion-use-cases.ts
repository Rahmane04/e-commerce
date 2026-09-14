import { PromotionRepository } from "@/application/ports/promotion-repository";
import { Promotion } from "@/domain/promotion/promotion";

/**
 * Use-cases admin pour la gestion des promotions.
 */

export function getPromotions(repo: PromotionRepository) {
  return repo.findAll();
}

export function getPromotionById(repo: PromotionRepository, id: string) {
  return repo.findById(id);
}

export function createPromotion(
  repo: PromotionRepository,
  data: Omit<Promotion, "id" | "createdAt">,
) {
  return repo.create(data);
}

export function updatePromotion(
  repo: PromotionRepository,
  id: string,
  patch: Partial<Omit<Promotion, "id" | "createdAt">>,
) {
  return repo.update(id, patch);
}

export function deletePromotion(repo: PromotionRepository, id: string) {
  return repo.delete(id);
}
