import { ProductRepository } from "@/application/ports/product-repository";
import { Product } from "@/domain/product/product";
import { Category } from "@/domain/product/category";
import { products as initialProducts } from "@/data/products";
import { categories as initialCategories } from "@/data/categories";

/**
 * Adapter (au sens hexagonal) pour la V1: sert les données mockées en
 * mémoire. Les délais artificiels simulent une latence réseau pour que
 * l'UI (skeletons, états de chargement) soit testée dans des conditions
 * réalistes dès maintenant.
 *
 * En V2, `ApiProductRepository` implémentera le même port en appelant
 * l'API Laravel — aucun changement requis côté application/UI.
 *
 * Les méthodes d'écriture mutent un tableau local en mémoire (non persisté
 * entre les rechargements de page). En V2, elles appelleront l'API REST.
 */
export class MockProductRepository implements ProductRepository {
  private products: Product[] = [...initialProducts];
  private categories: Category[] = [...initialCategories];

  private async delay(ms = 150) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ── Lecture ────────────────────────────────────────────────────────────

  async findAll() {
    await this.delay();
    return [...this.products];
  }

  async findBySlug(slug: string) {
    await this.delay();
    return this.products.find((p) => p.slug === slug) ?? null;
  }

  async findById(id: string) {
    await this.delay();
    return this.products.find((p) => p.id === id) ?? null;
  }

  async findByCategory(categorySlug: string) {
    await this.delay();
    return this.products.filter((p) => p.categorySlug === categorySlug);
  }

  async search(query: string) {
    await this.delay();
    const normalized = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalized) ||
        p.description.toLowerCase().includes(normalized),
    );
  }

  async findFeatured() {
    await this.delay();
    return this.products.filter((p) => p.featured);
  }

  async findCategories() {
    await this.delay();
    return [...this.categories];
  }

  // ── Écriture — Produits ─────────────────────────────────────────────────

  async create(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    await this.delay(200);
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.products = [...this.products, newProduct];
    return newProduct;
  }

  async update(
    id: string,
    patch: Partial<Omit<Product, "id" | "createdAt">>,
  ): Promise<Product> {
    await this.delay(200);
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Produit introuvable : ${id}`);
    const updated = { ...this.products[index], ...patch };
    this.products = [
      ...this.products.slice(0, index),
      updated,
      ...this.products.slice(index + 1),
    ];
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.delay(200);
    this.products = this.products.filter((p) => p.id !== id);
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    return this.update(id, { stock: newStock });
  }

  // ── Écriture — Catégories ───────────────────────────────────────────────

  async createCategory(category: Category): Promise<Category> {
    await this.delay(200);
    this.categories = [...this.categories, category];
    return category;
  }

  async updateCategory(
    slug: string,
    patch: Partial<Category>,
  ): Promise<Category> {
    await this.delay(200);
    const index = this.categories.findIndex((c) => c.slug === slug);
    if (index === -1) throw new Error(`Catégorie introuvable : ${slug}`);
    const updated = { ...this.categories[index], ...patch };
    this.categories = [
      ...this.categories.slice(0, index),
      updated,
      ...this.categories.slice(index + 1),
    ];
    return updated;
  }

  async deleteCategory(slug: string): Promise<void> {
    await this.delay(200);
    this.categories = this.categories.filter((c) => c.slug !== slug);
  }
}

/** Instance partagée — remplacée par injection plus explicite si le projet grandit. */
export const productRepository = new MockProductRepository();

