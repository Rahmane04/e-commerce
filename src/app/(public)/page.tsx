import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { categoryVisuals } from "@/lib/category-visuals";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";

/* ── Taglines par catégorie ── */
const categoryTaglines: Record<string, string> = {
  vetements: "L'élégance au quotidien",
  lingerie: "La douceur, au plus près de vous",
  "linge-de-maison": "L'art de se sentir bien chez soi",
  "encens-parfums": "Des senteurs pour éveiller vos sens",
  accessoires: "Les détails qui font toute la différence",
};

/* ── Badges par catégorie ── */
const categoryBadges: Record<string, string> = {
  vetements: "VOTRE STYLE",
  lingerie: "TOUT EN DÉLICATESSE",
  "linge-de-maison": "VOTRE COCON",
  "encens-parfums": "VOTRE RITUEL",
  accessoires: "VOS ESSENTIELS",
};

export default async function HomePage() {
  const categories = await productRepository.findCategories().catch(() => []);

  const displayCategories =
    categories.length > 0
      ? categories.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          image: categoryVisuals[cat.slug]?.heroImage ?? categoryVisuals["vetements"].heroImage,
          tagline: categoryTaglines[cat.slug] ?? "",
          badge: categoryBadges[cat.slug] ?? "",
        }))
      : [
          {
            name: "Vêtements",
            slug: "vetements",
            image: categoryVisuals["vetements"].heroImage,
            tagline: categoryTaglines["vetements"],
            badge: categoryBadges["vetements"],
          },
          {
            name: "Lingerie",
            slug: "lingerie",
            image: categoryVisuals["lingerie"].heroImage,
            tagline: categoryTaglines["lingerie"],
            badge: categoryBadges["lingerie"],
          },
          {
            name: "Linge de maison",
            slug: "linge-de-maison",
            image: categoryVisuals["linge-de-maison"].heroImage,
            tagline: categoryTaglines["linge-de-maison"],
            badge: categoryBadges["linge-de-maison"],
          },
          {
            name: "Encens & Parfums",
            slug: "encens-parfums",
            image: categoryVisuals["encens-parfums"].heroImage,
            tagline: categoryTaglines["encens-parfums"],
            badge: categoryBadges["encens-parfums"],
          },
          {
            name: "Accessoires",
            slug: "accessoires",
            image: categoryVisuals["accessoires"].heroImage,
            tagline: categoryTaglines["accessoires"],
            badge: categoryBadges["accessoires"],
          },
        ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ══ HERO SECTION (ÉPURÉ, CENTRÉ, NOIR & BLANC) ═════════════ */}
      <section className="py-14 sm:py-20 px-4 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          {/* Surtitre en noir discret */}
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-black">
            Bienvenue dans votre univers
          </p>

          {/* Nom de la marque */}
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight">
            Lingère Bi By Dié Dié
          </h1>

          {/* Sous-titre / accroche */}
          <p className="mt-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            Pour vous habiller, vous sentir belle et embellir votre quotidien.
          </p>

          {/* Séparateur doré fin */}
          <div className="mt-6 flex items-center justify-center">
            <div className="h-[2px] w-12 bg-[#c5a059]" />
          </div>
        </div>
      </section>

      {/* ══ CATÉGORIES (5 UNIVERS CENTRÉS) ════════════════════════ */}
      <section id="categories" className="pb-20 pt-2 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* En-tête de section */}
          <div className="mb-8 flex items-baseline justify-between border-b border-neutral-100 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black">
              À chaque envie, son univers
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {displayCategories.length} univers à découvrir
            </span>
          </div>

          {/* Grille des 5 catégories centrée */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-center">
            {displayCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className="group flex flex-col focus:outline-none"
              >
                {/* Conteneur image ratio portrait tall */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Badge en haut à gauche */}
                  {cat.badge && (
                    <span className="absolute left-2.5 top-2.5 z-10 rounded bg-white/95 px-2 py-1 text-[9px] font-bold tracking-wider text-black uppercase shadow-xs">
                      {cat.badge}
                    </span>
                  )}

                  {/* Flèche ronde en bas à droite */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Titre et sous-titre en noir sous l'image */}
                <div className="mt-3">
                  <h3 className="font-serif text-base font-semibold text-black leading-snug group-hover:underline">
                    {cat.name}
                  </h3>
                  {cat.tagline && (
                    <p className="mt-1 text-xs text-neutral-600 leading-snug font-normal">
                      {cat.tagline}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}