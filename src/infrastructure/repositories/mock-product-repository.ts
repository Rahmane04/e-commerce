import { ProductRepository } from "@/application/ports/product-repository";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

/**
 * Adapter (au sens hexagonal) pour la V1: sert les données mockées en
 * mémoire. Les délais artificiels simulent une latence réseau pour que
 * l'UI (skeletons, états de chargement) soit testée dans des conditions
 * réalistes dès maintenant.
 *
 * En V2, `ApiProductRepository` implémentera le même port en appelant
 * l'API Laravel — aucun changement requis côté application/UI.
 */
export class MockProductRepository implements ProductRepository {
  private async delay(ms = 150) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async findAll() {
    await this.delay();
    return products;
  }

  async findBySlug(slug: string) {
    await this.delay();
    return products.find((p) => p.slug === slug) ?? null;
  }

  async findByCategory(categorySlug: string) {
    await this.delay();
    return products.filter((p) => p.categorySlug === categorySlug);
  }

  async search(query: string) {
    await this.delay();
    const normalized = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalized) ||
        p.description.toLowerCase().includes(normalized),
    );
  }

  async findFeatured() {
    await this.delay();
    return products.filter((p) => p.featured);
  }

  async findCategories() {
    await this.delay();
    return categories;
  }
}

/** Instance partagée — remplacée par injection plus explicite si le projet grandit. */
export const productRepository = new MockProductRepository();
