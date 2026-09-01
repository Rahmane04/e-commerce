"use client";

import { useCartStore } from "@/infrastructure/store/cart-store";
import { toast } from "sonner";
import { Product } from "@/domain/product/product";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isUpdating = useCartStore((state) => state.isUpdating);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    e.stopPropagation();
    
    if (product.stock <= 0) return;
    
    // Pour l'ajout rapide depuis la grille, on choisit la première variante dispo s'il y en a une
    const selectedVariant = product.variants && product.variants.length > 0 && product.variants[0].stock && product.variants[0].stock > 0
      ? product.variants[0]
      : undefined;

    try {
      await addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        variantLabel: selectedVariant?.value,
        quantity: 1,
      });
      toast.success("Produit ajouté au panier", {
        description: `1x ${product.name}`,
      });
    } catch (err) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  if (product.stock <= 0) {
    return null;
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isUpdating}
      aria-busy={isUpdating}
      className="absolute bottom-3 left-3 right-3 translate-y-full rounded-md bg-[#1a1a2e] py-2.5 text-sm font-semibold text-[#f5f0e6] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#1a1a2e]/90"
    >
      {isUpdating ? "Ajout..." : "Ajouter au panier"}
    </button>
  );
}
