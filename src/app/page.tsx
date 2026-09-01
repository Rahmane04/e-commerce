"use client";

import Link from "next/link";
import { Star, Truck, ShieldCheck, Sparkles } from "lucide-react";

import { categoryVisuals } from "@/data/category-visuals";
import { products } from "@/data/products";
import { Money } from "@/domain/shared/money";
import { productDiscountPercentage } from "@/domain/product/product";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

const FEATURED_PRODUCTS = products.filter((p) => p.featured).slice(0, 8);

// ---------------------------------------------------------------------------
// ASSETS
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// MOCK DATA — remplace par l'appel API Laravel quand le back sera branché
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { name: "Vêtements", slug: "vetements", image: categoryVisuals["vetements"].heroImage },
  { name: "Lingerie", slug: "lingerie", image: categoryVisuals["lingerie"].heroImage },
  { name: "Linge de maison", slug: "linge-de-maison", image: categoryVisuals["linge-de-maison"].heroImage },
  { name: "Encens & Parfums", slug: "encens-parfums", image: categoryVisuals["encens-parfums"].heroImage },
  { name: "Accessoires", slug: "accessoires", image: categoryVisuals["accessoires"].heroImage },
];

const TESTIMONIALS = [
  {
    text: "La qualité des draps est exceptionnelle. Livraison rapide et soignée, je recommande !",
    author: "Aïcha N.",
  },
  {
    text: "J'adore la lingerie, très élégante et confortable. Le packaging est un vrai plus.",
    author: "Marième D.",
  },
  {
    text: "Les encens sentent divinement bon. Parfait pour créer une ambiance relaxante à la maison.",
    author: "Fatou K.",
  },
];

function formatPrice(cfa: number) {
  return new Intl.NumberFormat("fr-FR").format(cfa) + " FCFA";
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1a1a2e] text-[#f5f0e6]">
        <div className="absolute inset-0 opacity-30">
          <img
            src={categoryVisuals["vetements"].heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/90 to-[#1a1a2e]/60" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center px-4 py-24 lg:min-h-[70vh] lg:py-32 lg:px-6">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-1.5 text-sm font-medium text-[#e8d5a3]">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Nouvelle collection disponible
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight lg:text-6xl">
              Élégance & confort au quotidien
            </h1>
            <p className="mt-6 max-w-lg text-lg text-[#f5f0e6]/90">
              Découvrez notre sélection de vêtements, lingerie fine, linge de maison et senteurs.
              Une boutique pensée pour sublimer votre quotidien.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/categorie/nouveautes"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#c5a059] px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e]"
                >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Voir les nouveautés
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-md border border-[#f5f0e6]/30 px-6 py-3 text-sm font-semibold text-[#f5f0e6] transition-colors hover:bg-[#f5f0e6]/10"
              >
                Nos univers →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section aria-label="Nos engagements" className="border-b border-[#e8e4d9] bg-[#fcfbf8]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#8a6d3b]">
              <Truck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold">Livraison partout</h3>
              <p className="text-sm text-[#4a4a5e]">Expédition rapide et soignée</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#8a6d3b]">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold">Paiement sécurisé</h3>
              <p className="text-sm text-[#4a4a5e]">Transactions 100% sécurisées</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#8a6d3b]">
              <Star className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold">Produits qualité</h3>
              <p className="text-sm text-[#4a4a5e]">Sélection rigoureuse &amp; chic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-semibold lg:text-4xl">Nos univers</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#4a4a5e]">
          Cinq univers pour habiller et embellir votre quotidien avec douceur et raffinement.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-xl font-semibold text-[#f5f0e6]">{cat.name}</h3>
                <span className="mt-2 inline-block text-sm font-medium text-[#e8d5a3] opacity-0 transition-opacity group-hover:opacity-100">
                  Voir la collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="produits" className="bg-[#f3efe6]/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold lg:text-4xl">Sélection du moment</h2>
              <p className="mt-3 text-[#4a4a5e]">Les favoris de nos clientes, à prix doux.</p>
            </div>
            <Link href="/categorie/nouveautes" className="text-sm font-semibold text-[#8a6d3b] hover:underline">
              Voir les nouveautés →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => {
              const price = Money.fromCents(product.priceCents).format();
              const oldPrice = product.compareAtPriceCents
                ? Money.fromCents(product.compareAtPriceCents).format()
                : null;
              const discount = productDiscountPercentage(product);

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
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#4a4a5e]">{product.categorySlug}</p>
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
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Brand story */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={categoryVisuals["linge-de-maison"].heroImage}
                alt="Ambiance Lingère Bi By Dié Dié"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-[#c5a059] p-6 text-[#1a1a2e] shadow-xl lg:block">
              <p className="font-serif text-3xl font-bold">+500</p>
              <p className="text-sm font-medium">clientes satisfaites</p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold lg:text-4xl">L'histoire de Lingère Bi By Dié Dié</h2>
            <p className="mt-6 leading-relaxed text-[#4a4a5e]">
              Née d'une passion pour l'élégance accessible, notre boutique vous propose une sélection resserrée de
              vêtements, lingerie fine, linge de maison et senteurs. Chaque produit est choisi avec soin pour allier
              qualité, confort et esthétique.
            </p>
            <p className="mt-4 leading-relaxed text-[#4a4a5e]">
              Basée au Sénégal, nous livrons partout pour vous permettre de sublimer votre quotidien, où que vous soyez.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-[#f5f0e6] transition-colors hover:bg-[#1a1a2e]/90"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section role="region" aria-label="Avis clients" className="border-t border-[#e8e4d9] bg-[#f3efe6]/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <h2 className="mb-12 text-center font-serif text-3xl font-semibold lg:text-4xl">Ce qu'elles en disent</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm">
                <div className="flex gap-1 text-[#c5a059]" aria-hidden="true">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="sr-only">5 étoiles sur 5</span>
                <p className="mt-4 leading-relaxed text-[#4a4a5e]">{t.text}</p>
                <p className="mt-4 text-sm font-semibold text-[#1a1a2e]">— {t.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#1a1a2e] py-20 text-[#f5f0e6]">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h2 className="font-serif text-3xl font-semibold lg:text-4xl">Rejoignez l'univers Lingère Bi By Dié Dié</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#f5f0e6]/90">
            Inscrivez-vous pour recevoir nos nouveautés, offres exclusives et inspirations directement dans votre boîte mail.
          </p>
          <form aria-label="Inscription à la newsletter" className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Votre adresse email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 rounded-md border border-[#f5f0e6]/20 bg-[#f5f0e6]/10 px-4 py-3 text-sm text-[#f5f0e6] placeholder:text-[#f5f0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
              required
              aria-required="true"
            />
            <button
              type="submit"
              className="rounded-md bg-[#c5a059] px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-[#b08d4b]"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>

      {/* Footer is now rendered globally via layout.tsx → <SiteFooter /> */}
    </div>
  );
}