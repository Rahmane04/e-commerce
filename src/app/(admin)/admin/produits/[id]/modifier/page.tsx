"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { getProductById, updateProduct } from "@/application/admin/product-admin-use-cases";
import { Product } from "@/domain/product/product";
import { ProductForm } from "@/components/admin/products/product-form";
import { toast } from "sonner";
import Link from "next/link";

export default function ModifierProduitPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductById(productRepository, params.id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (data: Partial<Omit<Product, "id" | "createdAt">>) => {
    setSaving(true);
    try {
      await updateProduct(productRepository, params.id, data);
      toast.success("Produit mis à jour !");
      router.push("/admin/produits");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-slate-500">Produit introuvable.</p>
        <Link href="/admin/produits" className="mt-3 text-sm font-medium text-slate-900 underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/produits"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Retour aux produits"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Modifier : {product.name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">ID : {product.id}</p>
        </div>
      </div>

      <ProductForm
        defaultValues={product}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </span>
        }
      />
    </div>
  );
}
