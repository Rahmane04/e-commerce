"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Percent, Pencil, Trash2 } from "lucide-react";
import { promotionRepository } from "@/infrastructure/repositories/mock-promotion-repository";
import { productRepository } from "@/infrastructure/repositories/mock-product-repository";
import { Promotion, getPromotionStatus, formatPromotionValue } from "@/domain/promotion/promotion";
import { Category } from "@/domain/product/category";
import { Product } from "@/domain/product/product";
import { DataTable, ColumnDef } from "@/components/admin/ui/data-table";
import { PromotionStatusBadge } from "@/components/admin/ui/status-badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SkeletonTable } from "@/components/admin/ui/skeleton-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { PromotionForm } from "@/components/admin/promotions/promotion-form";
import { toast } from "sonner";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const [promos, cats, prods] = await Promise.all([
      promotionRepository.findAll(),
      productRepository.findCategories(),
      productRepository.findAll(),
    ]);
    // Sort promos by most recent creation
    setPromotions(promos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (data: Omit<Promotion, "id" | "createdAt">) => {
    setSaving(true);
    try {
      if (editTarget) {
        await promotionRepository.update(editTarget.id, data);
        toast.success("Promotion mise à jour");
      } else {
        await promotionRepository.create(data);
        toast.success("Promotion créée");
      }
      setShowForm(false);
      setEditTarget(null);
      loadData();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await promotionRepository.delete(deleteTarget.id);
    toast.success("Promotion supprimée");
    setDeleteTarget(null);
    loadData();
  };

  const openNewForm = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const columns: ColumnDef<Promotion>[] = [
    {
      key: "name",
      header: "Nom & Code",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-slate-900">{p.name}</p>
          {p.code ? (
            <span className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              {p.code}
            </span>
          ) : (
            <p className="text-xs text-slate-400">Automatique</p>
          )}
        </div>
      ),
    },
    {
      key: "value",
      header: "Réduction",
      render: (p) => <span className="font-semibold text-emerald-600">{formatPromotionValue(p)}</span>,
    },
    {
      key: "scope",
      header: "S'applique sur",
      render: (p) => {
        if (p.scope === "all") return <span className="text-sm text-slate-600">Toute la boutique</span>;
        if (p.scope === "category") return <span className="text-sm text-slate-600">Catégorie: {p.categorySlug}</span>;
        return <span className="text-sm text-slate-600">{p.productIds?.length} produit(s)</span>;
      },
    },
    {
      key: "status",
      header: "Statut",
      render: (p) => <PromotionStatusBadge status={getPromotionStatus(p)} />,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => { setEditTarget(p); setShowForm(true); }}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label={`Modifier ${p.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(p)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Supprimer ${p.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {editTarget ? "Modifier la promotion" : "Nouvelle promotion"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Configurez les détails et conditions de la réduction.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 lg:w-2/3">
          <PromotionForm
            defaultValues={editTarget ?? undefined}
            categories={categories}
            products={products}
            onSubmit={handleSave}
            saving={saving}
            submitLabel={editTarget ? "Enregistrer" : "Créer"}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Promotions</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Gérez vos codes promo et réductions automatiques.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle promo
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : promotions.length === 0 ? (
        <EmptyState 
          icon={Percent} 
          title="Aucune promotion" 
          description="Vous n'avez pas encore créé de code promo ou de réduction."
          action={{ label: "Créer une promotion", onClick: openNewForm }}
        />
      ) : (
        <DataTable
          data={promotions as unknown as Record<string, unknown>[]}
          columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
          getRowKey={(row) => row.id as string}
          pageSize={10}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer la promotion ?"
        description="Cette action est définitive. La réduction ne s'appliquera plus aux prochains paniers."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isDestructive
      />
    </div>
  );
}
