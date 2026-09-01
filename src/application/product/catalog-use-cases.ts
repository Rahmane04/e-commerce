import { ProductRepository } from "@/application/ports/product-repository";

/**
 * Use-cases du catalogue. Chaque fonction représente une intention métier
 * ("consulter le catalogue", "chercher un produit") plutôt qu'un simple
 * accès CRUD. Elles ne dépendent que du port ProductRepository, jamais
 * d'une implémentation concrète.
 */

export function getAllProducts(repo: ProductRepository) {
  return repo.findAll();
}

export function getProductBySlug(repo: ProductRepository, slug: string) {
  return repo.findBySlug(slug);
}

export function getProductsByCategory(
  repo: ProductRepository,
  categorySlug: string,
) {
  return repo.findByCategory(categorySlug);
}

export function getFeaturedProducts(repo: ProductRepository) {
  return repo.findFeatured();
}

export async function searchProducts(repo: ProductRepository, query: string) {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  return repo.search(trimmed);
}

export function getCategories(repo: ProductRepository) {
  return repo.findCategories();
}
