/**
 * Category — concept du domaine Catalog.
 * Ne dépend d'aucun framework.
 */
export interface SubCategory {
  id?: number;
  slug: string;
  name: string;
}

export interface Category {
  id?: number;
  slug: string;
  name: string;
  description?: string;
  subcategories?: SubCategory[];
  /** Id de la catégorie racine, pour créer une sous-catégorie. */
  parentId?: number;
}