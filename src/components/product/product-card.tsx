import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Product,
  isProductInStock,
  isProductOnSale,
  primaryProductImage,
  productCompareAtPrice,
  productDiscountPercentage,
  productPrice,
} from "@/domain/product/product";

export function ProductCard({ product }: { product: Product }) {
  const image = primaryProductImage(product);
  const inStock = isProductInStock(product);
  const onSale = isProductOnSale(product);

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.isNew && <Badge>Nouveau</Badge>}
          {onSale && (
            <Badge variant="secondary">
              -{productDiscountPercentage(product)}%
            </Badge>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="muted">Rupture de stock</Badge>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="font-display text-base text-foreground leading-snug">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">
            {productPrice(product).format()}
          </span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {productCompareAtPrice(product)!.format()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
