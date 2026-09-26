"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { createProduct } from "@/application/admin/product-admin-use-cases";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/products/product-form";
import Link from "next/link";

export default function NouveauProduitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: Parameters<typeof createProduct>[1]) => {
    setSaving(true);
    try {
      await createProduct(productRepository, data);
      toast.success("Produit créé avec succès !");
      router.push("/admin/produits");
    } catch (err) {
      toast.error("Erreur lors de la création du produit.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-xl font-semibold text-slate-900">Nouveau produit</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Remplissez les informations ci-dessous, puis enregistrez.
          </p>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Enregistrer le produit
          </span>
        }
      />
    </div>
  );
}
