"use client";

import { ReactNode, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Product, ProductVariant, ProductImage } from "@/domain/product/product";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { Category } from "@/domain/product/category";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  subcategorySlug: string;
  priceCents: number;
  compareAtPriceCents: number | "";
  stock: number;
  featured: boolean;
  isNew: boolean;
  images: { url: string; alt: string }[];
  variants: { id: string; label: string; value: string; stock: number }[];
};

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => Promise<void>;
  saving: boolean;
  submitLabel: ReactNode;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-600" role="alert">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}

export function ProductForm({
  defaultValues,
  onSubmit,
  saving,
  submitLabel,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productRepository.findCategories().then(setCategories);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      categorySlug: defaultValues?.categorySlug ?? "",
      subcategorySlug: defaultValues?.subcategorySlug ?? "",
      priceCents: defaultValues?.priceCents ? defaultValues.priceCents / 100 : 0,
      compareAtPriceCents: defaultValues?.compareAtPriceCents
        ? defaultValues.compareAtPriceCents / 100
        : "",
      stock: defaultValues?.stock ?? 0,
      featured: defaultValues?.featured ?? false,
      isNew: defaultValues?.isNew ?? false,
      images: defaultValues?.images ?? [{ url: "", alt: "" }],
      variants: defaultValues?.variants?.map((v) => ({
        id: v.id,
        label: v.label,
        value: v.value,
        stock: v.stock ?? 0,
      })) ?? [],
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });
  const { fields: variantFields, append: addVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const selectedCategory = watch("categorySlug");
  const selectedCat = categories.find((c) => c.slug === selectedCategory);

  const handleFormSubmit = (values: FormValues) => {
    const data: Omit<Product, "id" | "createdAt"> = {
      name: values.name,
      slug: values.slug || values.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: values.description,
      categorySlug: values.categorySlug,
      subcategorySlug: values.subcategorySlug || undefined,
      priceCents: Math.round(Number(values.priceCents) * 100),
      compareAtPriceCents: values.compareAtPriceCents
        ? Math.round(Number(values.compareAtPriceCents) * 100)
        : undefined,
      stock: Number(values.stock),
      featured: values.featured,
      isNew: values.isNew,
      images: values.images.filter((img) => img.url.trim()) as ProductImage[],
      variants: values.variants.map((v): ProductVariant => ({
        id: v.id || v.value.toLowerCase(),
        label: v.label,
        value: v.value,
        stock: Number(v.stock),
      })),
    };
    return onSubmit(data);
  };

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Infos de base */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">
              Informations de base
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="pf-name" className={labelClass}>
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="pf-name"
                  type="text"
                  {...register("name", { required: "Le nom est obligatoire" })}
                  className={cn(inputClass, "mt-1", errors.name && "border-red-300")}
                  placeholder="Ex : Robe wax manches longues"
                  aria-invalid={!!errors.name}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <label htmlFor="pf-slug" className={labelClass}>
                  Slug (URL)
                </label>
                <input
                  id="pf-slug"
                  type="text"
                  {...register("slug")}
                  className={cn(inputClass, "mt-1")}
                  placeholder="généré automatiquement si vide"
                />
              </div>

              <div>
                <label htmlFor="pf-description" className={labelClass}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="pf-description"
                  rows={4}
                  {...register("description", { required: "La description est obligatoire" })}
                  className={cn(inputClass, "mt-1 resize-none", errors.description && "border-red-300")}
                  placeholder="Décrivez le produit…"
                  aria-invalid={!!errors.description}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Images</h2>
              <button
                type="button"
                onClick={() => addImage({ url: "", alt: "" })}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {imageFields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                    <input
                      type="url"
                      {...register(`images.${i}.url`)}
                      className={cn(inputClass, "flex-1")}
                      placeholder="https://… ou /images/…"
                    />
                    <input
                      type="text"
                      {...register(`images.${i}.alt`)}
                      className={cn(inputClass, "sm:w-40")}
                      placeholder="Texte alternatif"
                    />
                  </div>
                  {imageFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Supprimer cette image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Variantes */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                Variantes (taille, couleur…)
              </h2>
              <button
                type="button"
                onClick={() => addVariant({ id: "", label: "Taille", value: "", stock: 0 })}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter une variante
              </button>
            </div>
            {variantFields.length === 0 ? (
              <p className="text-xs text-slate-400">Aucune variante — stock global uniquement.</p>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-slate-500">
                  <span>Type</span>
                  <span>Valeur</span>
                  <span>Stock</span>
                  <span />
                </div>
                {variantFields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      {...register(`variants.${i}.label`)}
                      className={cn(inputClass)}
                      placeholder="Taille"
                    />
                    <input
                      type="text"
                      {...register(`variants.${i}.value`)}
                      className={cn(inputClass)}
                      placeholder="M"
                    />
                    <input
                      type="number"
                      min={0}
                      {...register(`variants.${i}.stock`, { valueAsNumber: true })}
                      className={cn(inputClass)}
                      placeholder="0"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Supprimer cette variante"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Colonne latérale */}
        <div className="flex flex-col gap-5">
          {/* Organisation */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Organisation</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="pf-category" className={labelClass}>
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="pf-category"
                  {...register("categorySlug", { required: "La catégorie est obligatoire" })}
                  className={cn(inputClass, "mt-1", errors.categorySlug && "border-red-300")}
                  aria-invalid={!!errors.categorySlug}
                >
                  <option value="">Choisir…</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <FieldError message={errors.categorySlug?.message} />
              </div>

              {selectedCat?.subcategories && selectedCat.subcategories.length > 0 && (
                <div>
                  <label htmlFor="pf-subcategory" className={labelClass}>
                    Sous-catégorie
                  </label>
                  <select
                    id="pf-subcategory"
                    {...register("subcategorySlug")}
                    className={cn(inputClass, "mt-1")}
                  >
                    <option value="">Aucune</option>
                    {selectedCat.subcategories.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Prix */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Prix</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="pf-price" className={labelClass}>
                  Prix (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  id="pf-price"
                  type="number"
                  min={0}
                  step={100}
                  {...register("priceCents", {
                    required: "Le prix est obligatoire",
                    min: { value: 1, message: "Le prix doit être positif" },
                    valueAsNumber: true,
                  })}
                  className={cn(inputClass, "mt-1", errors.priceCents && "border-red-300")}
                  placeholder="25000"
                  aria-invalid={!!errors.priceCents}
                />
                <FieldError message={errors.priceCents?.message} />
              </div>
              <div>
                <label htmlFor="pf-compare-price" className={labelClass}>
                  Prix barré / avant promo (FCFA)
                </label>
                <input
                  id="pf-compare-price"
                  type="number"
                  min={0}
                  step={100}
                  {...register("compareAtPriceCents", { valueAsNumber: true })}
                  className={cn(inputClass, "mt-1")}
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </section>

          {/* Stock */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Stock global</h2>
            <div>
              <label htmlFor="pf-stock" className={labelClass}>
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                id="pf-stock"
                type="number"
                min={0}
                {...register("stock", {
                  required: "Le stock est obligatoire",
                  min: { value: 0, message: "Le stock ne peut pas être négatif" },
                  valueAsNumber: true,
                })}
                className={cn(inputClass, "mt-1", errors.stock && "border-red-300")}
                placeholder="0"
                aria-invalid={!!errors.stock}
              />
              <FieldError message={errors.stock?.message} />
            </div>
          </section>

          {/* Options */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Options</h2>
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                <span className="text-sm text-slate-700">Produit mis en avant</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isNew")}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                <span className="text-sm text-slate-700">Marquer comme &quot;Nouveau&quot;</span>
              </label>
            </div>
          </section>

          {/* Bouton */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
