import { Money } from "@/domain/shared/money";

export interface ProductVariant {
  id: string;
  /** Ex: "Taille", "Couleur" */
  label: string;
  value: string;
  /** Stock spécifique à cette variante, si applicable */
  stock?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
}

/**
 * Product — entité racine du domaine Catalog.
 *
 * Les prix sont stockés en centimes (nombres entiers) pour rester
 * cohérents avec le value object Money. Les fonctions ci-dessous portent
 * les règles métier: rien de tout ça ne doit être recalculé dans un
 * composant React.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  subcategorySlug?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  isPublished?: boolean;
  createdAt: string; // ISO date
}

export function productPrice(product: Product): Money {
  return Money.fromCents(product.priceCents);
}

export function productCompareAtPrice(product: Product): Money | null {
  return product.compareAtPriceCents
    ? Money.fromCents(product.compareAtPriceCents)
    : null;
}

export function isProductInStock(product: Product): boolean {
  return product.stock > 0;
}

export function isProductOnSale(product: Product): boolean {
  return (
    product.compareAtPriceCents !== undefined &&
    product.compareAtPriceCents > product.priceCents
  );
}

/** Pourcentage de réduction arrondi, ex: 20 pour "-20%" */
export function productDiscountPercentage(product: Product): number | null {
  if (!isProductOnSale(product) || !product.compareAtPriceCents) return null;
  const discount =
    (product.compareAtPriceCents - product.priceCents) /
    product.compareAtPriceCents;
  return Math.round(discount * 100);
}

export function primaryProductImage(product: Product): ProductImage {
  return (
    product.images[0] ?? {
      url: "/placeholder-product.svg",
      alt: product.name,
    }
  );
}

/**
 * Image de couverture d'un univers (catégorie racine) : celle d'un vrai produit.
 * Priorité aux produits mis en avant, puis au plus récent ; seuls les produits
 * qui ont une photo comptent. Retourne undefined si l'univers n'en a aucun
 * (l'appelant garde alors son image par défaut).
 */
export function pickCategoryCover(products: Product[], categorySlug: string): ProductImage | undefined {
  const candidates = products.filter((p) => p.categorySlug === categorySlug && p.images.length > 0);
  candidates.sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      b.createdAt.localeCompare(a.createdAt),
  );
  return candidates[0]?.images[0];
}
