"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { Category } from "@/domain/product/category";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [parentForNew, setParentForNew] = useState<Category | null>(null);
  const [deleteSubTarget, setDeleteSubTarget] = useState<{ slug: string; name: string } | null>(null);

  const load = async () => {
    const cats = await productRepository.findCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    try {
      await productRepository.createCategory({
        slug,
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        parentId: parentForNew?.id,
      });
      toast.success(parentForNew ? "Sous-catégorie créée !" : "Catégorie créée !");
      setNewCatName(""); setNewCatSlug(""); setNewCatDesc("");
      setParentForNew(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Création impossible.");
    }
  };
    
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productRepository.deleteCategory(deleteTarget.slug);
      toast.success(`Catégorie "${deleteTarget.name}" supprimée`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setDeleteTarget(null);
    }
  };

    const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setEditName(cat.name);
    setEditDesc(cat.description ?? "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    try {
      await productRepository.updateCategory(editTarget.slug, {
        name: editName.trim(),
        description: editDesc.trim(),
      });
      toast.success("Catégorie modifiée");
      setEditTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Modification impossible.");
    }
  };

  const handleDeleteSub = async () => {
    if (!deleteSubTarget) return;
    try {
      await productRepository.deleteCategory(deleteSubTarget.slug);
      toast.success(`Sous-catégorie "${deleteSubTarget.name}" supprimée`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setDeleteSubTarget(null);
    }
  };

  const moveCategory = async (index: number, direction: "up" | "down") => {
    const newCats = [...categories];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newCats.length) return;
    [newCats[index], newCats[swapIndex]] = [newCats[swapIndex], newCats[index]];
    setCategories(newCats);
    toast.success("Ordre mis à jour");
  };

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Catégories</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {categories.length} catégorie(s) — cohérentes avec le menu de la boutique
          </p>
        </div>
        <button
        onClick={() => { setParentForNew(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            {parentForNew ? `Nouvelle sous-catégorie de « ${parentForNew.name} »` : "Nouvelle catégorie"}
          </h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Nom *</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className={inputClass}
                placeholder="Ex : Bijoux"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Slug</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className={inputClass}
                placeholder="généré si vide"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className={inputClass}
                placeholder="Optionnel"
              />
            </div>
            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Créer
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
          {editTarget && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Modifier « {editTarget.name} »
          </h2>
          <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Nom *</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
              <input
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Enregistrer
              </button>
              <button type="button" onClick={() => setEditTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des catégories */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="Aucune catégorie" description="Commencez par créer une catégorie." />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {categories.map((cat, index) => (
            <div key={cat.slug} className="flex items-start gap-4 px-5 py-4">
              {/* Ordre */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveCategory(index, "up")}
                  disabled={index === 0}
                  className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                  aria-label="Monter"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveCategory(index, "down")}
                  disabled={index === categories.length - 1}
                  className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                  aria-label="Descendre"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Infos */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                <p className="text-xs text-slate-400">/{cat.slug}</p>
                {cat.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{cat.description}</p>
                )}
                {/* Sous-catégories */}
                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {cat.subcategories?.map((sub) => (
                    <span
                      key={sub.slug}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                    >
                      {sub.name}
                      <button
                        type="button"
                        onClick={() => setDeleteSubTarget({ slug: sub.slug, name: sub.name })}
                        className="rounded-full text-slate-400 hover:text-red-600"
                        aria-label={`Supprimer la sous-catégorie ${sub.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setParentForNew(cat); setShowForm(true); }}
                    className="rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-xs text-slate-500 hover:bg-slate-50"
                  >
                    + sous-catégorie
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditTarget(cat)}
                  className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label={`Modifier ${cat.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={`Supprimer ${cat.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Supprimer "${deleteTarget?.name}" ?`}
        description="La suppression est refusée tant que la catégorie contient des produits ou des sous-catégories."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isDestructive
      />
      <ConfirmDialog
        open={!!deleteSubTarget}
        onOpenChange={(open) => !open && setDeleteSubTarget(null)}
        title={`Supprimer la sous-catégorie "${deleteSubTarget?.name}" ?`}
        description="La suppression est refusée tant que la sous-catégorie contient des produits."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteSub}
        isDestructive
      />
    </div>
  );
}
