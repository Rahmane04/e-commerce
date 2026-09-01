"use client";

import { useState, useMemo, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShoppingBag, Star, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/categories";
import { categoryVisuals } from "@/data/category-visuals";
import { products } from "@/data/products";
import {
  isProductOnSale,
  productDiscountPercentage,
} from "@/domain/product/product";
import { Money } from "@/domain/shared/money";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug: slugArray } = use(params);
  const slug = slugArray[0];

  // Catégorie virtuelle "nouveautés"
  const isNouveautes = slug === "nouveautes";

  const category = isNouveautes
    ? { slug: "nouveautes", name: "Nouveautés", description: "Nos dernières arrivées.", subcategories: [] }
    : categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const visual = categoryVisuals[slug] ?? categoryVisuals["vetements"];

  const initialSubcat = slugArray[1] || "tous";
  const [activeSubcat, setActiveSubcat] = useState<string>(initialSubcat);
  
  useEffect(() => {
    setActiveSubcat(slugArray[1] || "tous");
  }, [slugArray[1]]);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const baseProducts = useMemo(() => {
    if (isNouveautes) return products.filter((p) => p.isNew);
    return products.filter((p) => p.categorySlug === slug);
  }, [slug, isNouveautes]);

  const filteredProducts = useMemo(() => {
    let list = activeSubcat === "tous" ? baseProducts : baseProducts.filter((p) => p.subcategorySlug === activeSubcat);
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [baseProducts, activeSubcat, sortBy]);

  const subcategories = isNouveautes ? [] : (category.subcategories ?? []);

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e]">

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1a2e] text-[#f5f0e6]">
        <div className="absolute inset-0">
          <img
            src={visual.heroImage}
            alt={category.name}
            className="h-full w-full object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/85 to-[#1a1a2e]/50" />

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="relative mx-auto max-w-7xl px-4 pt-8 lg:px-6">
          <ol className="flex items-center gap-2 text-sm text-[#f5f0e6]/60">
            <li>
              <Link href="/" className="transition-colors hover:text-[#c5a059]">Accueil</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <span aria-current="page" className="text-[#f5f0e6]">{category.name}</span>
            </li>
          </ol>
        </nav>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 lg:px-6">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-semibold leading-tight lg:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-[#f5f0e6]/80">
              {visual.tagline}
            </p>
            <p className="mt-2 text-sm text-[#c5a059]">
              {filteredProducts.length} article{filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ── Filtres ─────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-[#e8e4d9] bg-[#fcfbf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">

          {/* Pills sous-catégories */}
          {subcategories.length > 0 && (
            <div role="group" aria-label="Filtrer par sous-catégorie" className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubcat("tous")}
                aria-pressed={activeSubcat === "tous"}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeSubcat === "tous"
                    ? "bg-[#1a1a2e] text-[#f5f0e6]"
                    : "border border-[#e8e4d9] bg-white text-[#1a1a2e]/70 hover:border-[#c5a059] hover:text-[#8a6d3b]"
                }`}
              >
                Tous
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSubcat(sub.slug)}
                  aria-pressed={activeSubcat === sub.slug}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeSubcat === sub.slug
                      ? "bg-[#c5a059] text-[#1a1a2e]"
                      : "border border-[#e8e4d9] bg-white text-[#1a1a2e]/70 hover:border-[#c5a059] hover:text-[#8a6d3b]"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Tri */}
          <div className="ml-auto flex items-center gap-2 text-sm text-[#4a4a5e]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <label htmlFor="sort-select" className="sr-only">Trier par</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border border-[#e8e4d9] bg-white px-3 py-1.5 text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
            >
              <option value="default">Ordre par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Grille produits ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        {filteredProducts.length === 0 ? (
          <div role="status" className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-[#c5a059]/40" aria-hidden="true" />
            <p className="text-lg font-medium text-[#4a4a5e]">Aucun article dans cette catégorie pour le moment.</p>
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-[#f5f0e6] transition-colors hover:bg-[#1a1a2e]/80"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => {
              const price = Money.fromCents(product.priceCents).format();
              const oldPrice = product.compareAtPriceCents
                ? Money.fromCents(product.compareAtPriceCents).format()
                : null;
              const discount = productDiscountPercentage(product);
              const subcatName = subcategories.find((s) => s.slug === product.subcategorySlug)?.name ?? category.name;

              return (
                <article
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e8e4d9] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f3efe6]">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#c5a059] px-3 py-1 text-xs font-bold text-[#1a1a2e]">
                        Nouveau
                      </span>
                    )}
                    {product.featured && !product.isNew && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#1a1a2e] px-3 py-1 text-xs font-bold text-[#f5f0e6]">
                        Best-seller
                      </span>
                    )}
                    {discount && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                    <div className="relative z-20">
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#4a4a5e]">
                      {subcatName}
                    </p>
                    <h3 className="mt-1 font-serif text-base font-semibold leading-snug">
                      <Link href={`/produit/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0 z-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <span className="font-bold text-[#1a1a2e]">{price}</span>
                      {oldPrice && (
                        <span className="text-sm text-[#4a4a5e] line-through">{oldPrice}</span>
                      )}
                    </div>
                    {product.stock <= 0 && (
                      <p className="relative z-10 mt-1 text-xs font-medium text-red-500">Rupture de stock</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA bas de page ─────────────────────────────────────────────── */}
      <section className="border-t border-[#e8e4d9] bg-[#f3efe6]/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <div className="flex items-center justify-center gap-1 text-[#c5a059]" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold lg:text-3xl">
            Pas encore trouvé ce que vous cherchez ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[#4a4a5e]">
            Parcourez tous nos univers ou inscrivez-vous pour être notifiée en avant-première de nos nouvelles collections.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-[#f5f0e6] transition-colors hover:bg-[#1a1a2e]/80"
            >
              ← Retour à l'accueil
            </Link>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-md border border-[#1a1a2e]/20 px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-colors hover:border-[#c5a059] hover:text-[#8a6d3b]"
            >
              S'inscrire à la newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
