import { Product } from "@/domain/product/product";
import { Category } from "@/domain/product/category";

/**
 * Port (au sens hexagonal) exposé par la couche application.
 * En V1, l'adapter est src/infrastructure/repositories/mock-product-repository.ts
 * (données locales). En V2, un adapter équivalent appellera l'API Laravel —
 * le code appelant (use-cases, composants) n'aura rien à changer.
 *
 * Les méthodes de lecture sont utilisées par la boutique publique ET l'admin.
 * Les méthodes d'écriture (create/update/delete) sont réservées à l'admin.
 */
export interface ProductRepository {
  // ── Lecture ────────────────────────────────────────────────────────────
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findByCategory(categorySlug: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findFeatured(): Promise<Product[]>;
  findCategories(): Promise<Category[]>;

  // ── Écriture (admin uniquement) ─────────────────────────────────────────
  create(product: Omit<Product, "id" | "createdAt">): Promise<Product>;
  update(id: string, patch: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product>;
  delete(id: string): Promise<void>;
  updateStock(id: string, newStock: number): Promise<Product>;

  // ── Catégories — écriture ───────────────────────────────────────────────
  createCategory(category: Category): Promise<Category>;
  updateCategory(slug: string, patch: Partial<Category>): Promise<Category>;
  deleteCategory(slug: string): Promise<void>;
}
