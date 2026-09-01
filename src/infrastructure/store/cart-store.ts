import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Cart,
  cartItemCount,
  cartSubtotal,
  cartTotal,
  emptyCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/domain/cart/cart";
import {
  addProductToCart,
  AddProductToCartCommand,
} from "@/application/cart/cart-use-cases";
import { productRepository } from "@/infrastructure/repositories/mock-product-repository";

interface CartState {
  cart: Cart;
  /** true pendant qu'un ajout est en cours de validation (vérif. stock) */
  isUpdating: boolean;
  error: string | null;
  addItem: (command: AddProductToCartCommand) => Promise<void>;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearError: () => void;
}

/**
 * Ce store est volontairement fin: il ne contient AUCUNE règle métier.
 * Il délègue tout à la couche domain/application et se contente de
 * déclencher un re-render + de persister le résultat en localStorage.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: emptyCart(),
      isUpdating: false,
      error: null,

      addItem: async (command) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedCart = await addProductToCart(
            productRepository,
            get().cart,
            command,
          );
          set({ cart: updatedCart, isUpdating: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Impossible d'ajouter ce produit.";
          set({ isUpdating: false, error: message });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({ cart: removeItemFromCart(state.cart, itemId) }));
      },

      setQuantity: (itemId, quantity) => {
        set((state) => ({
          cart: updateCartItemQuantity(state.cart, itemId, quantity),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "boutique-cart",
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);

// Sélecteurs dérivés (recalculés côté domain — jamais dans le composant)
export const selectCartItemCount = (state: CartState) =>
  cartItemCount(state.cart);
export const selectCartSubtotal = (state: CartState) =>
  cartSubtotal(state.cart);
export const selectCartTotal = (state: CartState) => cartTotal(state.cart);
