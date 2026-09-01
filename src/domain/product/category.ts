/**
 * Category — concept du domaine Catalog.
 * Ne dépend d'aucun framework.
 */
export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  subcategories?: SubCategory[];
}
