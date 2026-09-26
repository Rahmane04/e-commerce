import { ProductRepository } from "@/application/ports/product-repository";
import { Product } from "@/domain/product/product";

/**
 * Use-cases admin du catalogue — écriture uniquement.
 * La lecture réutilise les use-cases du catalogue public (catalog-use-cases.ts).
 */

export function createProduct(
  repo: ProductRepository,
  data: Omit<Product, "id" | "createdAt">,
) {
  return repo.create(data);
}

export function updateProduct(
  repo: ProductRepository,
  id: string,
  patch: Partial<Omit<Product, "id" | "createdAt">>,
) {
  return repo.update(id, patch);
}

export function deleteProduct(repo: ProductRepository, id: string) {
  return repo.delete(id);
}

export function adjustStock(
  repo: ProductRepository,
  id: string,
  newStock: number,
) {
  if (newStock < 0) throw new Error("Le stock ne peut pas être négatif.");
  return repo.updateStock(id, newStock);
}

export function getProductById(repo: ProductRepository, id: string) {
  return repo.findById(id);
}
