"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Promotion, PromotionScope, PromotionType } from "@/domain/promotion/promotion";
import { Category } from "@/domain/product/category";
import { Product } from "@/domain/product/product";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  code: string;
  type: PromotionType;
  value: number;
  scope: PromotionScope;
  categorySlug: string;
  productIds: string; // Stocké sous forme de string CSV pour simplifier le form
  startDate: string;
  endDate: string;
};

interface PromotionFormProps {
  defaultValues?: Partial<Promotion>;
  categories: Category[];
  products: Product[]; // Pour la sélection V1 (en V2, on utiliserait une recherche asynchrone)
  onSubmit: (data: Omit<Promotion, "id" | "createdAt">) => Promise<void>;
  saving: boolean;
  submitLabel: ReactNode;
  onCancel: () => void;
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

// Convertit un format date ISO local ou distant pour le type "datetime-local" (YYYY-MM-DDThh:mm)
function toDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  // Attention timezone: pour cet UI on va ignorer la timezone complexe et forcer le slice
  // (dans un vrai projet global, il faut utiliser date-fns/tz)
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

export function PromotionForm({
  defaultValues,
  categories,
  products,
  onSubmit,
  saving,
  submitLabel,
  onCancel,
}: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      type: defaultValues?.type ?? "percentage",
      value: defaultValues?.type === "fixed" && defaultValues.value ? defaultValues.value / 100 : defaultValues?.value ?? 0,
      scope: defaultValues?.scope ?? "all",
      categorySlug: defaultValues?.categorySlug ?? "",
      productIds: defaultValues?.productIds?.join(", ") ?? "",
      startDate: toDateTimeLocal(defaultValues?.startDate),
      endDate: toDateTimeLocal(defaultValues?.endDate),
    },
  });

  const scope = watch("scope");
  const type = watch("type");

  const handleFormSubmit = (values: FormValues) => {
    // Reconversion du form vers le modèle
    const data: Omit<Promotion, "id" | "createdAt"> = {
      name: values.name.trim(),
      code: values.code.trim() || undefined,
      type: values.type,
      value: values.type === "fixed" ? Math.round(Number(values.value) * 100) : Number(values.value),
      scope: values.scope,
      categorySlug: values.scope === "category" ? values.categorySlug : undefined,
      productIds: values.scope === "products" 
        ? values.productIds.split(",").map(s => s.trim()).filter(Boolean)
        : undefined,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };
    return onSubmit(data);
  };

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>Nom de la promotion <span className="text-red-500">*</span></label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Le nom est obligatoire" })}
            className={cn(inputClass, errors.name && "border-red-300")}
            placeholder="Ex : Soldes d'été"
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="code" className={labelClass}>Code coupon (optionnel)</label>
          <input
            id="code"
            type="text"
            {...register("code")}
            className={inputClass}
            placeholder="Ex : ETE2026 (laisser vide pour promo auto)"
          />
          <p className="mt-1 text-xs text-slate-400">
            Si vide, la promo s&apos;applique automatiquement.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="type" className={labelClass}>Type</label>
            <select id="type" {...register("type")} className={inputClass}>
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (FCFA)</option>
            </select>
          </div>
          <div>
            <label htmlFor="value" className={labelClass}>
              Valeur <span className="text-red-500">*</span>
            </label>
            <input
              id="value"
              type="number"
              min={1}
              {...register("value", { 
                required: "Valeur requise",
                min: { value: 1, message: "Doit être positif" },
                max: type === "percentage" ? { value: 100, message: "Max 100%" } : undefined
              })}
              className={cn(inputClass, errors.value && "border-red-300")}
            />
            <FieldError message={errors.value?.message} />
          </div>
        </div>

        <div className="sm:col-span-2 border-t border-slate-100 pt-5">
          <label htmlFor="scope" className={labelClass}>S&apos;applique sur...</label>
          <select id="scope" {...register("scope")} className={inputClass}>
            <option value="all">Toute la boutique</option>
            <option value="category">Une catégorie spécifique</option>
            <option value="products">Des produits spécifiques</option>
          </select>
        </div>

        {scope === "category" && (
          <div className="sm:col-span-2 animate-in slide-in-from-top-2">
            <label htmlFor="categorySlug" className={labelClass}>Choisir la catégorie</label>
            <select 
              id="categorySlug" 
              {...register("categorySlug", { required: scope === "category" ? "Catégorie requise" : false })} 
              className={cn(inputClass, errors.categorySlug && "border-red-300")}
            >
              <option value="">Sélectionner une catégorie...</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <FieldError message={errors.categorySlug?.message} />
          </div>
        )}

        {scope === "products" && (
          <div className="sm:col-span-2 animate-in slide-in-from-top-2">
            <label htmlFor="productIds" className={labelClass}>IDs des produits (séparés par des virgules)</label>
            <input
              id="productIds"
              type="text"
              {...register("productIds", { required: scope === "products" ? "IDs requis" : false })}
              className={cn(inputClass, errors.productIds && "border-red-300")}
              placeholder="Ex: p-01, p-05"
            />
            <FieldError message={errors.productIds?.message} />
            <div className="mt-2 text-xs text-slate-500 max-h-32 overflow-y-auto rounded border border-slate-100 bg-slate-50 p-2">
              <p className="font-semibold mb-1">Aide - Produits disponibles :</p>
              {products.map(p => (
                <div key={p.id}>{p.id} : {p.name}</div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-5">
          <label htmlFor="startDate" className={labelClass}>Date de début <span className="text-red-500">*</span></label>
          <input
            id="startDate"
            type="datetime-local"
            {...register("startDate", { required: "Date requise" })}
            className={cn(inputClass, errors.startDate && "border-red-300")}
          />
          <FieldError message={errors.startDate?.message} />
        </div>

        <div className="border-t border-slate-100 pt-5 sm:border-t-0 sm:pt-0">
          <label htmlFor="endDate" className={labelClass}>Date de fin <span className="text-red-500">*</span></label>
          <input
            id="endDate"
            type="datetime-local"
            {...register("endDate", { required: "Date requise" })}
            className={cn(inputClass, errors.endDate && "border-red-300")}
          />
          <FieldError message={errors.endDate?.message} />
        </div>
      </div>

      <div className="mt-4 flex gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
