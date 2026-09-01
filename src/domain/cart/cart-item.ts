import { Money } from "@/domain/shared/money";

/**
 * CartItem — un produit (et sa variante éventuelle) présent dans le panier.
 * On garde une copie du prix au moment de l'ajout (priceCents) plutôt que
 * de recalculer depuis le catalogue: c'est ce prix "figé" qui doit être
 * facturé, même si le prix du produit change ensuite.
 */
export interface CartItem {
  /** Identifiant unique de la ligne = productId + variantId */
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  variantId?: string;
  variantLabel?: string;
  priceCents: number;
  quantity: number;
}

export function cartItemLineTotal(item: CartItem): Money {
  return Money.fromCents(item.priceCents).multiply(item.quantity);
}

export function makeCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}
