import { Money } from "@/domain/shared/money";
import { CartItem, cartItemLineTotal, makeCartItemId } from "./cart-item";

/**
 * Cart — agrégat racine du domaine Cart.
 *
 * Toutes les fonctions sont pures et immuables: elles reçoivent un Cart et
 * retournent un nouveau Cart. C'est cette couche, et uniquement elle, qui
 * connaît les règles d'ajout/suppression/calcul. L'infrastructure
 * (Zustand store) ne fait qu'appeler ces fonctions et persister le résultat.
 */
export interface Cart {
  items: CartItem[];
}

export function emptyCart(): Cart {
  return { items: [] };
}

export interface AddToCartInput {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  priceCents: number;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
}

export function addItemToCart(cart: Cart, input: AddToCartInput): Cart {
  if (input.quantity <= 0) {
    throw new Error("La quantité doit être supérieure à 0.");
  }

  const id = makeCartItemId(input.productId, input.variantId);
  const existing = cart.items.find((item) => item.id === id);

  if (existing) {
    return {
      items: cart.items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + input.quantity }
          : item,
      ),
    };
  }

  const newItem: CartItem = {
    id,
    productId: input.productId,
    productSlug: input.productSlug,
    productName: input.productName,
    imageUrl: input.imageUrl,
    variantId: input.variantId,
    variantLabel: input.variantLabel,
    priceCents: input.priceCents,
    quantity: input.quantity,
  };

  return { items: [...cart.items, newItem] };
}

export function removeItemFromCart(cart: Cart, itemId: string): Cart {
  return { items: cart.items.filter((item) => item.id !== itemId) };
}

export function updateCartItemQuantity(
  cart: Cart,
  itemId: string,
  quantity: number,
): Cart {
  if (quantity <= 0) {
    return removeItemFromCart(cart, itemId);
  }
  return {
    items: cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    ),
  };
}

export function cartSubtotal(cart: Cart): Money {
  return cart.items.reduce(
    (total, item) => total.add(cartItemLineTotal(item)),
    Money.zero(),
  );
}

/** Pour la V1 (pas de frais de livraison/coupons), total === sous-total. */
export function cartTotal(cart: Cart): Money {
  return cartSubtotal(cart);
}

export function cartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}

export function isCartEmpty(cart: Cart): boolean {
  return cart.items.length === 0;
}
