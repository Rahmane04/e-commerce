"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { selectCartItemCount, useCartStore } from "@/infrastructure/store/cart-store";

export function CartIndicator() {
  // Ne s'hydrate qu'après le montage: évite un mismatch SSR/CSR puisque
  // le contenu du panier vient du localStorage (uniquement côté client).
  const count = useCartStore(selectCartItemCount);

  return (
    <Link
      href="/commande"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {count > 0 && (
        <span
          aria-live="polite"
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
