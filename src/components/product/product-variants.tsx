"use client";

import { ProductVariant } from "@/domain/product/product";
import { cn } from "@/lib/utils";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
}

export function ProductVariants({ variants, selectedVariantId, onSelect }: ProductVariantsProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Grouper les variantes par label (ex: "Taille", "Couleur")
  const groups = variants.reduce((acc, variant) => {
    if (!acc[variant.label]) {
      acc[variant.label] = [];
    }
    acc[variant.label].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, groupVariants]) => (
        <div key={label} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{label}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {groupVariants.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              const isOutOfStock = variant.stock !== undefined && variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  onClick={() => {
                    if (!isOutOfStock) onSelect(variant.id);
                  }}
                  disabled={isOutOfStock}
                  className={cn(
                    "relative flex min-w-[3rem] items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
                    isOutOfStock && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-muted-foreground/30 line-through"
                  )}
                  aria-pressed={isSelected}
                  aria-disabled={isOutOfStock}
                >
                  {variant.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
