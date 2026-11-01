"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { Category } from "@/domain/product/category";
import { Product, productDiscountPercentage } from "@/domain/product/product";
import { Money } from "@/domain/shared/money";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { CategoryVisual } from "@/lib/category-visuals";

interface CategoryViewProps {
  category: Category;
  products: Product[];
  visual: CategoryVisual;
  slugArray: string[];
}

export function CategoryView({
  category,
  products,
  visual,
  slugArray,
}: CategoryViewProps) {
  const slug = slugArray[0];
  const isNouveautes = slug === "nouveautes";

  const initialSubcat = slugArray[1] || "tous";
  const [activeSubcat, setActiveSubcat] = useState<string>(initialSubcat);

  useEffect(() => {
    setActiveSubcat(slugArray[1] || "tous");
  }, [slugArray[1]]);

  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filteredProducts = useMemo(() => {
    let list =
      activeSubcat === "tous"
        ? products
        : products.filter((p) => p.subcategorySlug === activeSubcat);

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [products, activeSubcat, sortBy]);

  const subcategories = isNouveautes ? [] : (category.subcategories ?? []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ── EN-TÊTE COMPACT (SANS HERO ENCOMBRANT) ───────────────────── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-2">
            <ol className="flex items-center gap-2 text-xs text-neutral-400">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3 text-neutral-300" />
              </li>
              <li>
                <span aria-current="page" className="font-medium text-black">
                  {category.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Titre et nombre d'articles */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black tracking-tight">
                {category.name}
              </h1>
              {visual.tagline && (
                <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-normal">
                  {visual.tagline}
                </p>
              )}
            </div>
            <span className="text-xs text-neutral-400 font-medium shrink-0">
              {filteredProducts.length} article{filteredProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── BARRE DE FILTRES ET TRI ────────────────────────────────────── */}
      <div className="sticky top-16 md:top-[128px] z-30 border-y border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Pills sous-catégories */}
          {subcategories.length > 0 ? (
            <div
              role="group"
              aria-label="Filtrer par sous-catégorie"
              className="flex w-full overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:w-auto"
            >
              <button
                onClick={() => setActiveSubcat("tous")}
                aria-pressed={activeSubcat === "tous"}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeSubcat === "tous"
                    ? "bg-black text-white shadow-xs"
                    : "border border-neutral-200 bg-white text-black hover:border-black"
                }`}
              >
                Tous
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSubcat(sub.slug)}
                  aria-pressed={activeSubcat === sub.slug}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                    activeSubcat === sub.slug
                      ? "bg-black text-white shadow-xs"
                      : "border border-neutral-200 bg-white text-black hover:border-black"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Tri par prix */}
          <div className="flex items-center justify-end gap-2 text-xs text-neutral-600 sm:w-auto">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
            <label htmlFor="sort-select" className="sr-only">
              Trier par
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs text-black focus:outline-none focus:border-black transition-colors"
            >
              <option value="default">Ordre par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── GRILLE PRODUITS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div
            role="status"
            className="flex flex-col items-center justify-center gap-4 py-20 text-center"
          >
            <ShoppingBag className="h-10 w-10 text-neutral-300" aria-hidden="true" />
            <p className="text-sm font-medium text-neutral-600">
              Aucun article dans cette catégorie pour le moment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-black px-6 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const price = Money.fromCents(product.priceCents).format();
              const oldPrice = product.compareAtPriceCents
                ? Money.fromCents(product.compareAtPriceCents).format()
                : null;
              const discount = productDiscountPercentage(product);
              const subcatName =
                subcategories.find((s) => s.slug === product.subcategorySlug)?.name ??
                category.name;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col focus:outline-none"
                >
                  {/* Visuel du produit (aspect portrait tall 3/4) */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-xs">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Badges overlay en haut à gauche */}
                    <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
                      {product.isNew && (
                        <span className="rounded bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                          Nouveau
                        </span>
                      )}
                      {product.featured && !product.isNew && (
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                          Best-seller
                        </span>
                      )}
                      {discount && (
                        <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Bouton ajout rapide au panier */}
                    <div className="relative z-20">
                      <AddToCartButton product={product} />
                    </div>
                  </div>

                  {/* Informations produit en noir sous l'image */}
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                      {subcatName}
                    </p>
                    <h2 className="mt-1 font-serif text-sm sm:text-base font-semibold leading-snug text-black group-hover:underline">
                      <Link href={`/produit/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h2>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-black">{price}</span>
                      {oldPrice && (
                        <span className="text-xs text-neutral-400 line-through">{oldPrice}</span>
                      )}
                    </div>
                    {product.stock <= 0 && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        Rupture de stock
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
