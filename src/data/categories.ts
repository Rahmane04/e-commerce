import { Category } from "@/domain/product/category";

export const categories: Category[] = [
  {
    slug: "vetements",
    name: "Vêtements",
    description: "Pièces du quotidien et tenues élégantes.",
    subcategories: [
      { name: "Hommes", slug: "hommes" },
      { name: "Femmes", slug: "femmes" },
      { name: "Enfants", slug: "enfants" }
    ]
  },
  {
    slug: "lingerie",
    name: "Lingerie",
    description: "Ensembles et pièces délicates, matières douces.",
    subcategories: [
      { name: "Ensembles", slug: "ensembles" },
      { name: "Nuit", slug: "nuit" },
      { name: "Homewear", slug: "homewear" }
    ]
  },
  {
    slug: "linge-de-maison",
    name: "Linge de maison",
    description: "Draps, taies et parures pour une chambre soignée.",
    subcategories: [
      { name: "Chambre", slug: "chambre" },
      { name: "Bain", slug: "bain" },
      { name: "Décoration", slug: "decoration" }
    ]
  },
  {
    slug: "encens-parfums",
    name: "Encens & parfums",
    description: "Encens et senteurs pour la maison.",
    subcategories: [
      { name: "Encens", slug: "encens" },
      { name: "Bougies", slug: "bougies" },
      { name: "Parfums d'intérieur", slug: "parfums-interieur" }
    ]
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    description: "Les détails qui complètent une tenue ou un intérieur.",
    subcategories: [
      { name: "Sacs", slug: "sacs" },
      { name: "Bijoux", slug: "bijoux" },
      { name: "Ceintures", slug: "ceintures" }
    ]
  },
];
