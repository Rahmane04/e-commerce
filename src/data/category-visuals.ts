/**
 * Mapping catégorie → configuration visuelle (image hero, couleur d'accent, etc.)
 * Les URLs correspondent aux assets déjà utilisés dans page.tsx.
 */


export interface CategoryVisual {
  /** Image principale utilisée en hero de la page catégorie */
  heroImage: string;
  /** Couleur d'accentuation spécifique à la catégorie (Tailwind arbitrary) */
  accentColor: string;
  /** Texte d'accroche affiché dans le hero */
  tagline: string;
}

export const categoryVisuals: Record<string, CategoryVisual> = {
  vetements: {
    heroImage: "/images/vetements/femmes/femme%204.jpeg",
    accentColor: "#c5a059",
    tagline: "Des pièces élégantes pour chaque occasion.",
  },
  lingerie: {
    heroImage: "/images/lingeries/Nuit/Nuit%201.jpeg",
    accentColor: "#c5a059",
    tagline: "Délicatesse, douceur et féminité.",
  },
  "linge-de-maison": {
    heroImage: "/images/linge%20de%20maison/Chambre/Chambre%201.jpeg",
    accentColor: "#c5a059",
    tagline: "Sublimez chaque pièce de votre intérieur.",
  },
  "encens-parfums": {
    heroImage: "/images/parfums/Parfum%20d'interieur/Parfum%202.jpeg",
    accentColor: "#c5a059",
    tagline: "Des senteurs pour éveiller vos sens.",
  },
  accessoires: {
    heroImage: "/images/accessoires/Sacs/Sacs%202.jpeg",
    accentColor: "#c5a059",
    tagline: "Les détails qui font toute la différence.",
  },
  nouveautes: {
    heroImage: "/images/vetements/hommes/polo-noir-licorne.jpeg",
    accentColor: "#c5a059",
    tagline: "Nos dernières arrivées, à ne pas manquer.",
  },
};
