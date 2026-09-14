import { PromotionRepository } from "@/application/ports/promotion-repository";
import { Promotion } from "@/domain/promotion/promotion";
import { mockPromotions } from "@/data/mock-promotions";

export class MockPromotionRepository implements PromotionRepository {
  private promotions: Promotion[] = [...mockPromotions];

  private async delay(ms = 150) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async findAll(): Promise<Promotion[]> {
    await this.delay();
    return [...this.promotions];
  }

  async findById(id: string): Promise<Promotion | null> {
    await this.delay();
    return this.promotions.find((p) => p.id === id) ?? null;
  }

  async create(data: Omit<Promotion, "id" | "createdAt">): Promise<Promotion> {
    await this.delay(200);
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.promotions = [...this.promotions, newPromo];
    return newPromo;
  }

  async update(
    id: string,
    patch: Partial<Omit<Promotion, "id" | "createdAt">>,
  ): Promise<Promotion> {
    await this.delay(200);
    const index = this.promotions.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Promotion introuvable : ${id}`);
    const updated = { ...this.promotions[index], ...patch };
    this.promotions = [
      ...this.promotions.slice(0, index),
      updated,
      ...this.promotions.slice(index + 1),
    ];
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.delay(200);
    this.promotions = this.promotions.filter((p) => p.id !== id);
  }
}

export const promotionRepository = new MockPromotionRepository();
