export const IMG_VETEMENTS_HOMME_1 = "/images/vetements/hommes/tshirt-paris-blanc.jpeg";
export const IMG_VETEMENTS_HOMME_2 = "/images/vetements/hommes/polo-vert-cheval.jpeg";
export const IMG_VETEMENTS_HOMME_3 = "/images/vetements/hommes/polo-noir-licorne.jpeg";
export const IMG_VETEMENTS_FEMME_1 = "/images/vetements/femmes/femme%201.jpeg";
export const IMG_VETEMENTS_FEMME_2 = "/images/vetements/femmes/femme%202.jpeg";

export const IMG_LINGERIE_1 = "/images/lingeries/Ensemble/Ensemble%201.jpeg";
export const IMG_LINGERIE_2 = "/images/lingeries/Nuit/Nuit%201.jpeg";
export const IMG_LINGERIE_3 = "/images/lingeries/Homewear/Homewear%201.jpeg";

export const IMG_LINGE_MAISON_1 = "/images/linge%20de%20maison/Chambre/Chambre%201.jpeg";
export const IMG_LINGE_MAISON_2 = "/images/linge%20de%20maison/Decoration/Deco%201.jpeg";
export const IMG_LINGE_MAISON_3 = "/images/linge%20de%20maison/Bain/Bain%201.jpeg";

export const IMG_ENCENS_1 = "/images/parfums/Encens/Encens%201.jpeg";
export const IMG_ENCENS_2 = "/images/parfums/Parfum%20d'interieur/Parfum%201.jpeg";
export const IMG_ENCENS_3 = "/images/parfums/Bougies/Bougie%201.jpeg";

export const IMG_ACCESSOIRES_1 = "/images/accessoires/Sacs/Sacs%201.jpeg";
export const IMG_ACCESSOIRES_2 = "/images/accessoires/Bijoux/Bijoux%201.jpeg";
export const IMG_ACCESSOIRES_3 = "/images/accessoires/Ceintures/Ceinture%202.jpeg";

export const ALL_MOCK_PRODUCTS = [
  // Vêtements
  { id: 1, name: "Robe de soirée élégante", category: "vetements", subcategory: "femmes", price: 18500, oldPrice: 22000, image: IMG_VETEMENTS_FEMME_1, badge: "Nouveau" },
  { id: 2, name: "Ensemble tailleur femme", category: "vetements", subcategory: "femmes", price: 15500, image: IMG_VETEMENTS_FEMME_2, badge: null },
  { id: 3, name: "T-shirt Paris Blanc", category: "vetements", subcategory: "hommes", price: 12000, image: IMG_VETEMENTS_HOMME_1, badge: null },
  { id: 4, name: "Polo vert cheval", category: "vetements", subcategory: "hommes", price: 9800, oldPrice: 12000, image: IMG_VETEMENTS_HOMME_2, badge: "-18%" },
  { id: 5, name: "Polo noir licorne", category: "vetements", subcategory: "hommes", price: 7500, image: IMG_VETEMENTS_HOMME_3, badge: "Nouveau" },
  
  // Lingerie
  { id: 7, name: "Ensemble dentelle noire", category: "lingerie", subcategory: "ensembles", price: 12500, image: IMG_LINGERIE_1, badge: null },
  { id: 11, name: "Tenue homewear relax", category: "lingerie", subcategory: "homewear", price: 11000, image: IMG_LINGERIE_3, badge: "Nouveau" },

  // Linge de maison
  { id: 13, name: "Parure de draps coton", category: "linge-de-maison", subcategory: "chambre", price: 24000, oldPrice: 29000, image: IMG_LINGE_MAISON_1, badge: "-15%" },
  { id: 17, name: "Nappe lin brodée", category: "linge-de-maison", subcategory: "decoration", price: 9500, image: IMG_LINGE_MAISON_2, badge: null },
  { id: 18, name: "Set serviettes bio", category: "linge-de-maison", subcategory: "bain", price: 15000, image: IMG_LINGE_MAISON_3, badge: "Nouveau" },

  // Encens & parfums
  { id: 19, name: "Bâtons d'encens tradition", category: "encens-parfums", subcategory: "encens", price: 4500, image: IMG_ENCENS_1, badge: null },
  { id: 21, name: "Parfum d'intérieur premium", category: "encens-parfums", subcategory: "parfums-interieur", price: 8900, image: IMG_ENCENS_2, badge: "Best-seller" },
  { id: 22, name: "Bougie relaxante", category: "encens-parfums", subcategory: "bougies", price: 7200, image: IMG_ENCENS_3, badge: null },

  // Accessoires
  { id: 25, name: "Sac cabas cuir", category: "accessoires", subcategory: "sacs", price: 22500, image: IMG_ACCESSOIRES_1, badge: "Nouveau" },
  { id: 27, name: "Collier élégant", category: "accessoires", subcategory: "bijoux", price: 8500, image: IMG_ACCESSOIRES_2, badge: null },
  { id: 29, name: "Ceinture classique", category: "accessoires", subcategory: "ceintures", price: 9200, image: IMG_ACCESSOIRES_3, badge: null },
];

export const MOCK_HOME_PRODUCTS = [
  ALL_MOCK_PRODUCTS[0], // Robe femme
  ALL_MOCK_PRODUCTS[5], // Ensemble lingerie
  ALL_MOCK_PRODUCTS[7], // Parure draps (was 8)
  ALL_MOCK_PRODUCTS[9], // Parfum interieur (was 10)
  ALL_MOCK_PRODUCTS[2], // T-shirt homme
  ALL_MOCK_PRODUCTS[10], // Bougie (was 11)
  ALL_MOCK_PRODUCTS[12], // Sac cabas (was 13)
];

export const NOUVEAUTES_IDS = new Set([1, 5, 11, 25]);
