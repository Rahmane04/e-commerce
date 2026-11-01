import { notFound } from "next/navigation";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { Money } from "@/domain/shared/money";
import {
  isProductInStock,
  productDiscountPercentage,
} from "@/domain/product/product";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductClient } from "@/components/product/product-client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: [product.images[0]?.url],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    productRepository.findBySlug(slug),
    productRepository.findCategories().catch(() => []),
  ]);

  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const price = Money.fromCents(product.priceCents).format();
  const oldPrice = product.compareAtPriceCents
    ? Money.fromCents(product.compareAtPriceCents).format()
    : null;
  const inStock = isProductInStock(product);
  const discount = productDiscountPercentage(product);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Accueil
          </Link>
          <ChevronRight className="h-3 w-3" />
          {category && (
            <>
              <Link
                href={`/categorie/${category.slug}`}
                className="transition-colors hover:text-black"
              >
                {category.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="font-medium text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Gallery */}
          <div className="md:sticky md:top-28 md:self-start">
            <ProductGallery images={product.images} />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6 border-b border-neutral-100 pb-6">
              <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl text-black">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-black">{price}</span>
                {oldPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    {oldPrice}
                  </span>
                )}
                {discount && (
                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="rounded bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Nouveau
                  </span>
                )}
                {product.featured && (
                  <span className="rounded bg-neutral-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Best-seller
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm mb-8 max-w-none text-neutral-600">
              <p>{product.description}</p>
            </div>

            {/* Client Components (Variants, Qty, Add to Cart, WhatsApp) */}
            <ProductClient product={product} inStock={inStock} />

            {/* Reassurance */}
            <div className="mt-10 rounded-xl border border-neutral-100 bg-neutral-50/50 p-6">
              <ul className="space-y-3 text-xs text-neutral-600">
                <li className="flex gap-2.5 items-center">
                  <span className="text-[#c5a059] font-bold">✓</span>
                  <span>Livraison estimée sous 24h à 48h (selon zone).</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <span className="text-[#c5a059] font-bold">✓</span>
                  <span>Paiement sécurisé ou à la livraison.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
