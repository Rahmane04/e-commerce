/**
 * Promotion — entité du domaine promotions.
 * Ne dépend d'aucun framework.
 */

export type PromotionType = "percentage" | "fixed";
export type PromotionScope = "products" | "category" | "all";

export interface Promotion {
  id: string;
  name: string;
  code?: string; // Code coupon optionnel
  type: PromotionType;
  /** Valeur : pourcentage (0-100) ou montant en centimes */
  value: number;
  scope: PromotionScope;
  /** IDs des produits concernés (si scope = "products") */
  productIds?: string[];
  /** Slug catégorie concernée (si scope = "category") */
  categorySlug?: string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  createdAt: string;
}

export type PromotionStatus = "active" | "upcoming" | "expired";

export function getPromotionStatus(promo: Promotion): PromotionStatus {
  const now = new Date();
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);

  if (now < start) return "upcoming";
  if (now > end) return "expired";
  return "active";
}

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  active: "Active",
  upcoming: "À venir",
  expired: "Expirée",
};

export function formatPromotionValue(promo: Promotion): string {
  if (promo.type === "percentage") {
    return `-${promo.value}%`;
  }
  // montant en centimes → FCFA
  return `-${(promo.value / 100).toLocaleString("fr-FR")} FCFA`;
}
