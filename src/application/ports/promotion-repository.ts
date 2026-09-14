import { Promotion } from "@/domain/promotion/promotion";

/**
 * Port PromotionRepository — admin uniquement en V1.
 */
export interface PromotionRepository {
  findAll(): Promise<Promotion[]>;
  findById(id: string): Promise<Promotion | null>;
  create(promo: Omit<Promotion, "id" | "createdAt">): Promise<Promotion>;
  update(id: string, patch: Partial<Omit<Promotion, "id" | "createdAt">>): Promise<Promotion>;
  delete(id: string): Promise<void>;
}
