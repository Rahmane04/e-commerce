import Link from "next/link";
import { Sparkles, Truck, ShieldCheck, Star } from "lucide-react";

import { categoryVisuals } from "@/lib/category-visuals";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { Money } from "@/domain/shared/money";
import { productDiscountPercentage } from "@/domain/product/product";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    productRepository.findFeatured().catch(() => []),
    productRepository.findCategories().catch(() => []),
  ]);

  const displayCategories =
    categories.length > 0
      ? categories.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          image: categoryVisuals[cat.slug]?.heroImage ?? categoryVisuals["vetements"].heroImage,
        }))
      : [
          { name: "Vêtements", slug: "vetements", image: categoryVisuals["vetements"].heroImage },
          { name: "Lingerie", slug: "lingerie", image: categoryVisuals["lingerie"].heroImage },
          { name: "Linge de maison", slug: "linge-de-maison", image: categoryVisuals["linge-de-maison"].heroImage },
          { name: "Encens & Parfums", slug: "encens-parfums", image: categoryVisuals["encens-parfums"].heroImage },
          { name: "Accessoires", slug: "accessoires", image: categoryVisuals["accessoires"].heroImage },
        ];

  const featured = featuredProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1a2e] text-[#f5f0e6]">
        <div className="absolute inset-0 opacity-30">
          <img
            src={categoryVisuals["vetements"].heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/60 to-[#1a1a2e]/90" />

        <div className="relative px-5 py-14 text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-3 py-1 text-xs font-medium text-[#e8d5a3]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Nouvelle collection disponible
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight">
            Élégance & confort<br />au quotidien
          </h1>
          <p className="mt-4 text-sm text-[#f5f0e6]/80 leading-relaxed">
            Vêtements, lingerie fine, linge de maison et senteurs.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/categorie/nouveautes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a059] px-6 py-3.5 text-sm font-semibold text-[#1a1a2e] active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Voir les nouveautés
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-xl border border-[#f5f0e6]/30 px-6 py-3.5 text-sm font-semibold text-[#f5f0e6] transition-colors hover:bg-[#f5f0e6]/10 active:bg-[#f5f0e6]/20"
            >
              Nos univers →
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────── */}
      <section aria-label="Nos engagements" className="border-b border-[#e8e4d9] bg-white">
        <div className="flex overflow-x-auto gap-0 divide-x divide-[#e8e4d9] px-0 py-0 scrollbar-none">
          {[
            { icon: Truck, title: "Livraison", sub: "Rapide & soignée" },
            { icon: ShieldCheck, title: "Sécurisé", sub: "Paiement sûr" },
            { icon: Star, title: "Qualité", sub: "Sélection chic" },
          ].map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-1 min-w-[110px] flex-col items-center justify-center gap-1.5 px-4 py-4 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#8a6d3b]">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#1a1a2e]">{title}</p>
              <p className="text-[11px] text-[#4a4a5e]">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Catégories en scroll horizontal ──────────────────── */}
      <section id="categories" className="py-8 px-4">
        <h2 className="mb-4 font-serif text-xl font-semibold">Nos univers</h2>
        {/* Scroll horizontal sur mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
          {displayCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="relative flex-none w-[44vw] max-w-[180px] aspect-[3/4] overflow-hidden rounded-2xl snap-start"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-[#1a1a2e]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-serif text-sm font-semibold text-[#f5f0e6] leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Produits vedettes ─────────────────────────────────── */}
      <section id="produits" className="bg-[#f3efe6]/50 py-8 px-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold">Sélection du moment</h2>
            <p className="mt-0.5 text-sm text-[#4a4a5e]">Les favoris de nos clientes.</p>
          </div>
          <Link
            href="/categorie/nouveautes"
            className="shrink-0 text-xs font-semibold text-[#8a6d3b] hover:underline"
          >
            Tout voir →
          </Link>
        </div>

        {/* Grille 2 colonnes fixe — pas besoin de sm:/lg: sur mobile */}
        <div className="grid grid-cols-2 gap-3">
          {featured.map((product) => {
            const price = Money.fromCents(product.priceCents).format();
            const oldPrice = product.compareAtPriceCents
              ? Money.fromCents(product.compareAtPriceCents).format()
              : null;
            const discount = productDiscountPercentage(product);

            return (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e8e4d9] bg-white shadow-sm"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f3efe6]">
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt ?? product.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Badges */}
                  {product.isNew && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-[#c5a059] px-2.5 py-0.5 text-[10px] font-bold text-[#1a1a2e]">
                      Nouveau
                    </span>
                  )}
                  {product.featured && !product.isNew && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-[#1a1a2e] px-2.5 py-0.5 text-[10px] font-bold text-[#f5f0e6]">
                      Best-seller
                    </span>
                  )}
                  {discount && (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                  {/* CTA ajout panier */}
                  <div className="relative z-20">
                    <AddToCartButton product={product} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#4a4a5e]">
                    {product.categorySlug}
                  </p>
                  <h3 className="mt-1 font-serif text-sm font-semibold leading-snug">
                    <Link href={`/produit/${product.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0 z-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-sm font-bold text-[#1a1a2e]">{price}</span>
                    {oldPrice && (
                      <span className="text-xs text-[#4a4a5e] line-through">{oldPrice}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
}