"use client";

import { useState } from "react";
import { Product } from "@/domain/product/product";
import { useCartStore } from "@/infrastructure/store/cart-store";
import { ProductVariants } from "./product-variants";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Money } from "@/domain/shared/money";

interface ProductClientProps {
  product: Product;
  inStock: boolean;
}

export function ProductClient({ product, inStock }: ProductClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isUpdating = useCartStore((state) => state.isUpdating);

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants && product.variants.length > 0 && product.variants[0].stock && product.variants[0].stock > 0
      ? product.variants[0].id
      : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants
    ? product.variants!.find((v) => v.id === selectedVariantId)
    : undefined;

  const currentStock = hasVariants
    ? selectedVariant?.stock ?? 0
    : product.stock;

  const isSelectionValid = !hasVariants || selectedVariantId !== undefined;
  const canOrder = inStock && isSelectionValid && currentStock > 0;

  const handleAddToCart = async () => {
    if (!canOrder) return;
    try {
      await addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        variantLabel: selectedVariant?.value,
        quantity,
      });
      toast.success("Produit ajouté au panier", {
        description: `${quantity}x ${product.name}`,
      });
    } catch (err) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  const handleDirectOrder = async () => {
    if (!canOrder) return;
    await handleAddToCart();
    router.push("/commande");
  };

  const handleWhatsApp = () => {
    if (!canOrder) return;
    const variantStr = selectedVariant ? ` (${selectedVariant.value})` : "";
    const priceStr = Money.fromCents(product.priceCents).format();
    const text = `Bonjour, je souhaite commander ce produit :\n\n- ${product.name}${variantStr}\n- Quantité : ${quantity}\n- Prix unitaire : ${priceStr}\n\nLien : ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8">
      {hasVariants && (
        <ProductVariants
          variants={product.variants!}
          selectedVariantId={selectedVariantId}
          onSelect={(id) => {
            setSelectedVariantId(id);
            setQuantity(1); // Reset qty quand on change de variante
          }}
        />
      )}

      {/* Quantité */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Quantité</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-32 items-center justify-between rounded-md border border-input bg-transparent px-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || !canOrder}
              className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              -
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
              disabled={quantity >= currentStock || !canOrder}
              className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              +
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentStock > 0 ? `${currentStock} en stock` : "Rupture de stock"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={!canOrder || isUpdating}
            variant="outline"
            className="flex-1 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#f5f0e6]"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
          <Button
            onClick={handleDirectOrder}
            disabled={!canOrder || isUpdating}
            className="flex-1 bg-[#1a1a2e] text-[#f5f0e6] hover:bg-[#1a1a2e]/90"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Commander
          </Button>
        </div>
        <Button
          onClick={handleWhatsApp}
          disabled={!canOrder}
          variant="outline"
          className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Commander via WhatsApp
        </Button>

        {!isSelectionValid && (
          <p className="text-center text-sm text-destructive">
            Veuillez sélectionner une option avant d'ajouter au panier.
          </p>
        )}
      </div>
    </div>
  );
}
