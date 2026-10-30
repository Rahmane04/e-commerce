import { ProductRepository } from "@/application/ports/product-repository";
import { Product } from "@/domain/product/product";
import { Category } from "@/domain/product/category";
import { authedFetch, fetchJson } from "@/infrastructure/http/authed-fetch";

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string | null;
  subcategorySlug: string | null;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: { url: string; alt: string }[];
  variants: { id: string; label: string; value: string; stock: number }[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  isPublished: boolean;
  createdAt: string;
}

interface ApiSubCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  subcategories: ApiSubCategory[];
}


function toDomainProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    categorySlug: api.categorySlug ?? "",
    subcategorySlug: api.subcategorySlug ?? undefined,
    priceCents: api.priceCents,
    compareAtPriceCents: api.compareAtPriceCents ?? undefined,
    images: api.images,
    variants: api.variants,
    stock: api.stock,
    featured: api.featured,
    isNew: api.isNew,
    isPublished: api.isPublished,
    createdAt: api.createdAt,
  };
}

function toDomainCategory(api: ApiCategory): Category {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description ?? undefined,
    subcategories: api.subcategories.map((sub) => ({
      id: sub.id,
      slug: sub.slug,
      name: sub.name,
    })),
  };
}

export class ApiProductRepository implements ProductRepository {
  // ── Lecture ────────────────────────────────────────────────────────────

  async findAll(): Promise<Product[]> {
    const data = await fetchJson<ApiProduct[]>("/products");
    return data.filter((p) => p.isPublished).map(toDomainProduct);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const data = await fetchJson<ApiProduct>(`/products/${slug}`);
      return toDomainProduct(data);
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const data = await fetchJson<ApiProduct>(`/products/id/${id}`);
      return toDomainProduct(data);
    } catch {
      return null;
    }
  }

  async findByCategory(categorySlug: string): Promise<Product[]> {
    const data = await fetchJson<ApiProduct[]>(`/products?category=${encodeURIComponent(categorySlug)}`);
    return data.filter((p) => p.isPublished).map(toDomainProduct);
  }

  async search(query: string): Promise<Product[]> {
    const data = await fetchJson<ApiProduct[]>(`/products?search=${encodeURIComponent(query)}`);
    return data.filter((p) => p.isPublished).map(toDomainProduct);
  }

  async findFeatured(): Promise<Product[]> {
    const data = await fetchJson<ApiProduct[]>("/products?featured=1");
    return data.filter((p) => p.isPublished).map(toDomainProduct);
  }

  async findCategories(): Promise<Category[]> {
    const data = await fetchJson<ApiCategory[]>("/categories");
    return data.map(toDomainCategory);
  }
    /** Admin : tous les produits, brouillons compris (route protégée). */
  async findAllForAdmin(): Promise<Product[]> {
    const data = await fetchJson<ApiProduct[]>("/admin/products");
    return data.map(toDomainProduct);
  }

  async publish(id: string): Promise<void> {
    await authedFetch(`/products/${id}/publish`, { method: "POST" });
  }

  async unpublish(id: string): Promise<void> {
    await authedFetch(`/products/${id}/unpublish`, { method: "POST" });
  }

  /** Résout un slug de catégorie vers son id numérique côté Laravel. */
  private async resolveCategoryId(categorySlug: string, subcategorySlug?: string): Promise<number> {
    const categories = await fetchJson<ApiCategory[]>("/categories");
    const root = categories.find((c) => c.slug === categorySlug);
    if (!root) throw new Error(`Catégorie inconnue: ${categorySlug}`);
    const sub = subcategorySlug
      ? root.subcategories.find((s) => s.slug === subcategorySlug)
      : undefined;
    return (sub ?? root).id;
  }

  // ── Écriture produit (admin) ──────────────────────────────────────────

  async create(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const categoryId = await this.resolveCategoryId(product.categorySlug, product.subcategorySlug);
    
    const res = await authedFetch("/products", {
      method: "POST",
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        category_id: categoryId,
        price_cents: product.priceCents,
        compare_at_price_cents: product.compareAtPriceCents ?? null,
        stock: product.stock,
        images: product.images.map((i) => i.url),
        featured: product.featured,
        is_new: product.isNew,
        variants: (product.variants ?? []).map((v) => ({ label: v.label, value: v.value, stock: v.stock })),
      }),
    });

    const created = await res.json();
    // Laravel ne renvoie qu'un résumé à la création ; on recharge l'objet complet.
    return (await this.findById(String(created.id)))!;
  }

  async update(id: string, patch: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> {
    const body: Record<string, unknown> = {};

    if (patch.name !== undefined) body.name = patch.name;
    if (patch.description !== undefined) body.description = patch.description;
    if (patch.categorySlug !== undefined) body.category_id = await this.resolveCategoryId(patch.categorySlug, patch.subcategorySlug);
    if (patch.priceCents !== undefined) body.price_cents = patch.priceCents;
    if (patch.compareAtPriceCents !== undefined) body.compare_at_price_cents = patch.compareAtPriceCents;
    if (patch.stock !== undefined) body.stock = patch.stock;
    if (patch.images !== undefined) body.images = patch.images.map((i) => i.url);
    if (patch.featured !== undefined) body.featured = patch.featured;
    if (patch.isNew !== undefined) body.is_new = patch.isNew;
    // Note : la modification des variantes n'est pas encore câblée côté API —
    // le endpoint PATCH /products/{id} actuel ne touche que les champs scalaires.
    // À traiter dans un endpoint dédié si le besoin se confirme côté admin.

    await authedFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body) });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await authedFetch(`/products/${id}`, { method: "DELETE" });
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    await authedFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify({ stock: newStock }) });
    return (await this.findById(id))!;
  }

  // ── Écriture catégorie (admin) ────────────────────────────────────────

    async createCategory(category: Category): Promise<Category> {
    const res = await authedFetch("/categories", {
      method: "POST",
      body: JSON.stringify({
        name: category.name,
        description: category.description ?? null,
        ...(category.parentId !== undefined ? { parent_id: category.parentId } : {}),
      }),
    });
    const created = await res.json();
    return { id: created.id, slug: created.slug, name: created.name, description: category.description };
  }

  async updateCategory(slug: string, patch: Partial<Category>): Promise<Category> {
    const res = await authedFetch(`/categories/${slug}`, {
      method: "PATCH",
      body: JSON.stringify({ name: patch.name, description: patch.description }),
    });
    const updated = await res.json();
    return { slug: updated.slug, name: updated.name, description: patch.description };
  }

  async deleteCategory(slug: string): Promise<void> {
    await authedFetch(`/categories/${slug}`, { method: "DELETE" });
  }
}

export const productRepository = new ApiProductRepository();