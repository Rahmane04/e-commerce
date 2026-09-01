import { Product } from "@/domain/product/product";


export const products: Product[] = [
  // ──────────────────────────────────────────────
  // VÊTEMENTS — Femmes
  // ──────────────────────────────────────────────
  {
    id: "p-01",
    slug: "robe-wax-manches-longues",
    name: "Robe wax manches longues",
    description:
      "Robe mi-longue en wax authentique, coupe cintrée et manches longues. Doublure intérieure pour un confort optimal toute la journée.",
    categorySlug: "vetements",
    subcategorySlug: "femmes",
    priceCents: 2500000,
    compareAtPriceCents: 3200000,
    images: [
      { url: "/images/vetements/femmes/femme%201.jpeg", alt: "Robe wax manches longues, vue de face" },
      { url: "/images/vetements/femmes/femme%202.jpeg", alt: "Robe wax manches longues, vue de dos" },
    ],
    variants: [
      { id: "s", label: "Taille", value: "S", stock: 3 },
      { id: "m", label: "Taille", value: "M", stock: 5 },
      { id: "l", label: "Taille", value: "L", stock: 2 },
    ],
    stock: 10,
    featured: true,
    isNew: true,
    createdAt: "2025-11-02T10:00:00.000Z",
  },


  // ──────────────────────────────────────────────
  // VÊTEMENTS — Hommes
  // ──────────────────────────────────────────────

  {
    id: "p-15",
    slug: "tshirt-paris-blanc",
    name: "T-shirt Paris Blanc",
    description:
      "T-shirt en coton premium, imprimé Paris. Coupe régulière et confortable pour un style décontracté.",
    categorySlug: "vetements",
    subcategorySlug: "hommes",
    priceCents: 1200000,
    images: [
      { url: "/images/vetements/hommes/tshirt-paris-blanc.jpeg", alt: "T-shirt Paris Blanc" },
    ],
    variants: [
      { id: "s", label: "Taille", value: "S", stock: 4 },
      { id: "m", label: "Taille", value: "M", stock: 6 },
      { id: "l", label: "Taille", value: "L", stock: 3 },
      { id: "xl", label: "Taille", value: "XL", stock: 2 },
    ],
    stock: 15,
    featured: false,
    isNew: false,
    createdAt: "2025-10-10T10:00:00.000Z",
  },
  {
    id: "p-16",
    slug: "polo-vert-cheval",
    name: "Polo vert cheval",
    description:
      "Polo classique en coton piqué, coloris vert avec broderie cheval. Coupe ajustée.",
    categorySlug: "vetements",
    subcategorySlug: "hommes",
    priceCents: 980000,
    compareAtPriceCents: 1200000,
    images: [
      { url: "/images/vetements/hommes/polo-vert-cheval.jpeg", alt: "Polo vert cheval" },
    ],
    variants: [
      { id: "m", label: "Taille", value: "M", stock: 3 },
      { id: "l", label: "Taille", value: "L", stock: 5 },
    ],
    stock: 8,
    featured: false,
    isNew: false,
    createdAt: "2025-09-20T10:00:00.000Z",
  },
  {
    id: "p-17",
    slug: "polo-noir-licorne",
    name: "Polo noir licorne",
    description:
      "Polo noir en coton stretch, broderie licorne sur la poitrine. Style urbain et élégant.",
    categorySlug: "vetements",
    subcategorySlug: "hommes",
    priceCents: 750000,
    images: [
      { url: "/images/vetements/hommes/polo-noir-licorne.jpeg", alt: "Polo noir licorne" },
    ],
    variants: [
      { id: "s", label: "Taille", value: "S", stock: 3 },
      { id: "m", label: "Taille", value: "M", stock: 4 },
      { id: "l", label: "Taille", value: "L", stock: 2 },
    ],
    stock: 9,
    featured: false,
    isNew: true,
    createdAt: "2026-07-01T10:00:00.000Z",
  },


  // ──────────────────────────────────────────────
  // LINGERIE
  // ──────────────────────────────────────────────
  {
    id: "p-02",
    slug: "ensemble-lingerie-dentelle-bordeaux",
    name: "Ensemble lingerie dentelle bordeaux",
    description:
      "Ensemble deux pièces en dentelle fine, coloris bordeaux. Bonnets doublés et bretelles ajustables.",
    categorySlug: "lingerie",
    subcategorySlug: "ensembles",
    priceCents: 1800000,
    images: [
      { url: "/images/lingeries/Ensemble/Ensemble%201.jpeg", alt: "Ensemble lingerie dentelle bordeaux" },
    ],
    variants: [
      { id: "85b", label: "Taille", value: "85B", stock: 4 },
      { id: "90b", label: "Taille", value: "90B", stock: 4 },
      { id: "90c", label: "Taille", value: "90C", stock: 2 },
    ],
    stock: 10,
    featured: true,
    isNew: true,
    createdAt: "2026-06-10T10:00:00.000Z",
  },

  {
    id: "p-19",
    slug: "tenue-homewear-relax",
    name: "Tenue homewear relax",
    description:
      "Ensemble homewear confortable en coton doux, coupe décontractée. Idéal pour se détendre à la maison.",
    categorySlug: "lingerie",
    subcategorySlug: "homewear",
    priceCents: 1100000,
    images: [
      { url: "/images/lingeries/Homewear/Homewear%201.jpeg", alt: "Tenue homewear relax" },
    ],
    variants: [
      { id: "s", label: "Taille", value: "S", stock: 3 },
      { id: "m", label: "Taille", value: "M", stock: 5 },
      { id: "l", label: "Taille", value: "L", stock: 2 },
    ],
    stock: 10,
    featured: false,
    isNew: true,
    createdAt: "2026-07-20T10:00:00.000Z",
  },

  // ──────────────────────────────────────────────
  // LINGE DE MAISON
  // ──────────────────────────────────────────────
  {
    id: "p-04",
    slug: "parure-drap-percale-terracotta",
    name: "Parure de drap percale terracotta",
    description:
      "Parure complète (drap housse, drap plat, 2 taies) en percale de coton 100%, coloris terracotta. Doux, résistant, respirant.",
    categorySlug: "linge-de-maison",
    subcategorySlug: "chambre",
    priceCents: 2400000,
    compareAtPriceCents: 2900000,
    images: [
      { url: "/images/linge%20de%20maison/Chambre/Chambre%201.jpeg", alt: "Parure de drap percale terracotta" },
      { url: "/images/linge%20de%20maison/Chambre/Chambre%202.jpeg", alt: "Détail du tissage percale" },
    ],
    variants: [
      { id: "140", label: "Dimension", value: "140x190 cm", stock: 6 },
      { id: "160", label: "Dimension", value: "160x200 cm", stock: 4 },
    ],
    stock: 10,
    featured: false,
    isNew: false,
    createdAt: "2025-10-05T10:00:00.000Z",
  },
  {
    id: "p-05",
    slug: "parure-drap-lin-lave-sable",
    name: "Parure de drap lin lavé sable",
    description:
      "Lin lavé teint dans la masse, coloris sable. Un tombé souple et un aspect naturellement froissé, chic et décontracté.",
    categorySlug: "linge-de-maison",
    subcategorySlug: "chambre",
    priceCents: 2500000,
    images: [{ url: "/images/linge%20de%20maison/Chambre/Chambre%203.jpeg", alt: "Parure de drap lin lavé sable" }],
    stock: 7,
    featured: true,
    isNew: true,
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "p-13",
    slug: "set-serviettes-bain-coton-bio",
    name: "Set de serviettes de bain en coton bio",
    description: "Set complet de serviettes de bain ultra-douces en coton biologique. Grande capacité d'absorption et séchage rapide.",
    categorySlug: "linge-de-maison",
    subcategorySlug: "bain",
    priceCents: 2200000,
    images: [
      { url: "/images/linge%20de%20maison/Bain/Bain%201.jpeg", alt: "Set de serviettes de bain" },
      { url: "/images/linge%20de%20maison/Bain/Bain%202.jpeg", alt: "Détails des serviettes" },
    ],
    stock: 15,
    featured: true,
    isNew: true,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "p-14",
    slug: "vase-decoratif-ceramique",
    name: "Vase décoratif en céramique",
    description: "Vase artisanal en céramique au design minimaliste. Idéal pour mettre en valeur vos bouquets séchés ou frais.",
    categorySlug: "linge-de-maison",
    subcategorySlug: "decoration",
    priceCents: 1900000,
    images: [
      { url: "/images/linge%20de%20maison/Decoration/Deco%201.jpeg", alt: "Vase décoratif en céramique" },
    ],
    stock: 5,
    featured: false,
    isNew: true,
    createdAt: "2026-08-10T10:00:00.000Z",
  },


  // ──────────────────────────────────────────────
  // ENCENS & PARFUMS
  // ──────────────────────────────────────────────
  {
    id: "p-06",
    slug: "coffret-encens-bois-de-santal",
    name: "Coffret encens bois de santal",
    description:
      "Coffret de 20 bâtonnets d'encens au bois de santal, senteur boisée et enveloppante, avec porte-encens en céramique.",
    categorySlug: "encens-parfums",
    subcategorySlug: "encens",
    priceCents: 750000,
    images: [
      { url: "/images/parfums/Encens/Encens%201.jpeg", alt: "Coffret encens bois de santal" },
    ],
    stock: 15,
    featured: false,
    isNew: false,
    createdAt: "2025-08-20T10:00:00.000Z",
  },

  {
    id: "p-21",
    slug: "parfum-interieur-premium",
    name: "Parfum d'intérieur premium",
    description:
      "Spray parfum d'intérieur aux huiles essentielles naturelles. Fragrance longue durée pour votre maison.",
    categorySlug: "encens-parfums",
    subcategorySlug: "parfums-interieur",
    priceCents: 890000,
    images: [
      { url: "/images/parfums/Parfum%20d'interieur/Parfum%201.jpeg", alt: "Parfum d'intérieur premium" },
    ],
    stock: 10,
    featured: true,
    isNew: false,
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "p-22",
    slug: "bougie-relaxante",
    name: "Bougie relaxante",
    description:
      "Bougie parfumée artisanale en cire de soja. Mèche en coton, brûlage propre et longue durée.",
    categorySlug: "encens-parfums",
    subcategorySlug: "bougies",
    priceCents: 720000,
    images: [
      { url: "/images/parfums/Bougies/Bougie%201.jpeg", alt: "Bougie relaxante" },
    ],
    stock: 8,
    featured: false,
    isNew: false,
    createdAt: "2025-11-05T10:00:00.000Z",
  },

  // ──────────────────────────────────────────────
  // ACCESSOIRES
  // ──────────────────────────────────────────────
  {
    id: "p-08",
    slug: "sac-cabas-raphia-naturel",
    name: "Sac cabas raphia naturel",
    description:
      "Sac cabas tressé main en raphia naturel, anses en cuir. Pièce unique faite par des artisans locaux.",
    categorySlug: "accessoires",
    subcategorySlug: "sacs",
    priceCents: 1500000,
    images: [
      { url: "/images/accessoires/Sacs/Sacs%201.jpeg", alt: "Sac cabas raphia naturel" },
      { url: "/images/accessoires/Sacs/Sacs%202.jpeg", alt: "Détail du tressage en raphia" },
    ],
    stock: 8,
    featured: true,
    isNew: true,
    createdAt: "2025-12-01T10:00:00.000Z",
  },

  {
    id: "p-23",
    slug: "collier-elegant",
    name: "Collier élégant",
    description:
      "Collier fin en métal doré, pendentif géométrique. Finition soignée, idéal pour les occasions spéciales.",
    categorySlug: "accessoires",
    subcategorySlug: "bijoux",
    priceCents: 850000,
    images: [
      { url: "/images/accessoires/Bijoux/Bijoux%201.jpeg", alt: "Collier élégant" },
    ],
    stock: 6,
    featured: false,
    isNew: false,
    createdAt: "2025-10-15T10:00:00.000Z",
  },
  {
    id: "p-24",
    slug: "ceinture-classique",
    name: "Ceinture classique",
    description:
      "Ceinture en cuir véritable, boucle métal brossé. Polyvalente et élégante, elle s'adapte à toutes les tenues.",
    categorySlug: "accessoires",
    subcategorySlug: "ceintures",
    priceCents: 920000,
    images: [
      { url: "/images/accessoires/Ceintures/Ceinture%202.jpeg", alt: "Ceinture classique" },
    ],
    stock: 10,
    featured: false,
    isNew: false,
    createdAt: "2025-09-01T10:00:00.000Z",
  },
];
