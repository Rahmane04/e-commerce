import { notFound } from "next/navigation";
import { productRepository } from "@/infrastructure/repositories/mock-product-repository";
import { Money } from "@/domain/shared/money";
import {
  isProductInStock,
  productDiscountPercentage,
} from "@/domain/product/product";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductClient } from "@/components/product/product-client";
import { categories } from "@/data/categories";
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
  const product = await productRepository.findBySlug(slug);

  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const price = Money.fromCents(product.priceCents).format();
  const oldPrice = product.compareAtPriceCents
    ? Money.fromCents(product.compareAtPriceCents).format()
    : null;
  const inStock = isProductInStock(product);
  const discount = productDiscountPercentage(product);

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e]">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-[#5a5a6e]">
          <Link href="/" className="transition-colors hover:text-[#c5a059]">
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link
                href={`/categorie/${category.slug}`}
                className="transition-colors hover:text-[#c5a059]"
              >
                {category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-[#1a1a2e]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Gallery */}
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={product.images} />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6 border-b border-[#e8e4d9] pb-6">
              <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-[#1a1a2e]">{price}</span>
                {oldPrice && (
                  <span className="text-lg text-[#5a5a6e] line-through">
                    {oldPrice}
                  </span>
                )}
                {discount && (
                  <span className="rounded bg-[#c5a059]/10 px-2 py-1 text-sm font-semibold text-[#c5a059]">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="rounded-full bg-[#1a1a2e] px-3 py-1 text-xs font-bold text-[#f5f0e6]">
                    Nouveau
                  </span>
                )}
                {product.featured && (
                  <span className="rounded-full bg-[#c5a059] px-3 py-1 text-xs font-bold text-[#1a1a2e]">
                    Best-seller
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm prose-[#1a1a2e] mb-8 max-w-none text-[#5a5a6e]">
              <p>{product.description}</p>
            </div>

            {/* Client Components (Variants, Qty, Add to Cart, WhatsApp) */}
            <ProductClient product={product} inStock={inStock} />

            {/* Reassurance */}
            <div className="mt-10 rounded-xl border border-[#e8e4d9] bg-white p-6">
              <ul className="space-y-4 text-sm text-[#5a5a6e]">
                <li className="flex gap-3">
                  <span className="text-[#c5a059]">✦</span>
                  <span>Livraison estimée sous 24h à 48h (selon zone).</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#c5a059]">✦</span>
                  <span>Paiement à la livraison possible.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
