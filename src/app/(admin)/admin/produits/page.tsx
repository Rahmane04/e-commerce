"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, ImageOff, Package } from "lucide-react";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { deleteProduct } from "@/application/admin/product-admin-use-cases";
import { Product } from "@/domain/product/product";
import { DataTable, ColumnDef } from "@/components/admin/ui/data-table";
import { ProductStatusBadge, getProductStatus } from "@/components/admin/ui/status-badge";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SkeletonTable } from "@/components/admin/ui/skeleton-table";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " F";
}

export default function ProduitsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  const loadData = useCallback(async () => {
    const [prods, cats] = await Promise.all([
      productRepository.findAll(),
      productRepository.findCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categorySlug.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.categorySlug === filterCategory;
    const status = getProductStatus(p.stock);
    const matchStatus = filterStatus === "all" || status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const columns: ColumnDef<Product>[] = [
    {
      key: "image",
      header: "",
      width: "w-14",
      render: (p) => (
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
          {p.images[0] ? (
            <Image
              src={p.images[0].url}
              alt={p.images[0].alt}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <ImageOff className="h-full w-full p-2 text-slate-300" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Produit",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-400">{p.categorySlug}</p>
        </div>
      ),
    },
    {
      key: "priceCents",
      header: "Prix",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-slate-900">{formatFCFA(p.priceCents)}</p>
          {p.compareAtPriceCents && (
            <p className="text-xs text-slate-400 line-through">
              {formatFCFA(p.compareAtPriceCents)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      render: (p) => (
        <span
          className={
            p.stock === 0
              ? "font-semibold text-red-600"
              : p.stock <= 5
                ? "font-semibold text-amber-600"
                : "text-slate-700"
          }
        >
          {p.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (p) => <ProductStatusBadge status={getProductStatus(p.stock)} />,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/produits/${p.id}/modifier`}
            className="rounded px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Modifier
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
            className="rounded px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(productRepository, deleteTarget.id);
    toast.success(`"${deleteTarget.name}" supprimé`);
    setDeleteTarget(null);
    loadData();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Produits</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {products.length} produit(s) au total
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            <option value="all">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            <option value="all">Tous statuts</option>
            <option value="publie">Publiés</option>
            <option value="rupture">Rupture</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <SkeletonTable rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun produit trouvé"
          description="Modifiez vos filtres ou ajoutez un nouveau produit."
          action={{ label: "Ajouter un produit", onClick: () => router.push("/admin/produits/nouveau") }}
        />
      ) : (
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
          getRowKey={(row) => row.id as string}
          pageSize={10}
        />
      )}

      {/* Dialog confirmation suppression */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Supprimer "${deleteTarget?.name}" ?`}
        description="Cette action est irréversible. Le produit sera définitivement retiré de la boutique."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isDestructive
      />
    </div>
  );
}
