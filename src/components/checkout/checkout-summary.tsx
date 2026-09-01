"use client";

import { useCartStore } from "@/infrastructure/store/cart-store";
import { cartTotal } from "@/domain/cart/cart";
import { Money } from "@/domain/shared/money";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function CheckoutSummary() {
  const { cart, setQuantity, removeItem } = useCartStore();

  if (cart.items.length === 0) {
    return (
      <div className="rounded-xl border border-[#e8e4d9] bg-white p-6 text-center text-[#5a5a6e]">
        Votre panier est vide.
      </div>
    );
  }

  const total = cartTotal(cart);

  return (
    <div className="rounded-xl border border-[#e8e4d9] bg-white p-6">
      <h2 className="mb-4 font-serif text-xl font-semibold text-[#1a1a2e]">
        Récapitulatif de la commande
      </h2>

      <div className="divide-y divide-[#e8e4d9]">
        {cart.items.map((item) => (
          <div key={item.id} className="flex py-4">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="h-20 w-16 rounded-md object-cover bg-muted"
            />
            <div className="ml-4 flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-[#1a1a2e]">
                    {item.productName}
                  </h3>
                  <span className="text-sm font-bold text-[#1a1a2e]">
                    {Money.fromCents(item.priceCents).format()}
                  </span>
                </div>
                {item.variantLabel && (
                  <p className="mt-1 text-xs text-[#5a5a6e]">
                    Option : {item.variantLabel}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center rounded-md border border-[#e8e4d9]">
                  <button
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 text-sm text-[#5a5a6e] hover:text-[#1a1a2e]"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 text-sm text-[#5a5a6e] hover:text-[#1a1a2e]"
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-[#e8e4d9] pt-4">
        <div className="flex justify-between text-base font-medium text-[#1a1a2e]">
          <span>Sous-total</span>
          <span>{total.format()}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-[#5a5a6e]">
          <span>Livraison</span>
          <span>Calculée à l'étape suivante</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-[#e8e4d9] pt-4 text-lg font-bold text-[#1a1a2e]">
          <span>Total (TTC)</span>
          <span>{total.format()}</span>
        </div>
      </div>
    </div>
  );
}
