import { Product } from "@/domain/product/product";
import { Category } from "@/domain/product/category";

/**
 * Port (au sens hexagonal) exposé par la couche application.
 * En V1, l'adapter est src/infrastructure/repositories/mock-product-repository.ts
 * (données locales). En V2, un adapter équivalent appellera l'API Laravel —
 * le code appelant (use-cases, composants) n'aura rien à changer.
 */
export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategory(categorySlug: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findFeatured(): Promise<Product[]>;
  findCategories(): Promise<Category[]>;
}
