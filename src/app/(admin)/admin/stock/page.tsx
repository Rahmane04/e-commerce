"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Warehouse, Check, X, AlertTriangle } from "lucide-react";
import { productRepository } from "@/infrastructure/repositories/mock-product-repository";
import { adjustStock } from "@/application/admin/product-admin-use-cases";
import { Product } from "@/domain/product/product";
import { DataTable, ColumnDef } from "@/components/admin/ui/data-table";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SkeletonTable } from "@/components/admin/ui/skeleton-table";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Composant pour l'édition rapide du stock
function InlineStockEdit({ 
  product, 
  onSave 
}: { 
  product: Product, 
  onSave: (id: string, newStock: number) => Promise<void> 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.stock.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) {
      toast.error("Le stock doit être un nombre positif");
      return;
    }
    
    if (numValue === product.stock) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await onSave(product.id, numValue);
      setIsEditing(false);
    } catch (err) {
      // Revert if error
      setValue(product.stock.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(product.stock.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="group flex cursor-pointer items-center gap-2"
      onClick={() => setIsEditing(true)}
    >
      <span
        className={cn(
          "font-medium tabular-nums",
          product.stock === 0
            ? "text-red-600"
            : product.stock <= 5
              ? "text-amber-600"
              : "text-slate-900"
        )}
      >
        {product.stock}
      </span>
      <span className="text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 border-b border-dashed border-slate-400">
        Modifier
      </span>
    </div>
  );
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all");

  const loadData = useCallback(async () => {
    const prods = await productRepository.findAll();
    setProducts(prods);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStock = async (id: string, newStock: number) => {
    await adjustStock(productRepository, id, newStock);
    toast.success("Stock mis à jour");
    loadData(); // Recharger pour avoir la source de vérité
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
      
    let matchStock = true;
    if (filterStock === "out") matchStock = p.stock === 0;
    if (filterStock === "low") matchStock = p.stock > 0 && p.stock <= 5;
    
    return matchSearch && matchStock;
  });

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const columns: ColumnDef<Product>[] = [
    {
      key: "product",
      header: "Produit",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
            {p.images[0] && (
              <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="40px" />
            )}
          </div>
          <div>
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-xs text-slate-400">{p.id} • {p.categorySlug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut Stock",
      render: (p) => {
        if (p.stock === 0) {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
              Rupture
            </span>
          );
        }
        if (p.stock <= 5) {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              Faible
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            En stock
          </span>
        );
      }
    },
    {
      key: "stock",
      header: "Quantité (cliquer pour modifier)",
      sortable: true,
      render: (p) => <InlineStockEdit product={p} onSave={handleUpdateStock} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Stock</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Gérez rapidement les quantités disponibles
          </p>
        </div>
        
        {/* Résumé rapide des alertes */}
        <div className="flex items-center gap-2">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800">
              <AlertTriangle className="h-4 w-4" />
              {outOfStockCount} en rupture
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              {lowStockCount} stock faible
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as "all" | "low" | "out")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            <option value="all">Tout le stock</option>
            <option value="low">Stock faible (≤ 5)</option>
            <option value="out">En rupture (0)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={3} />
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={Warehouse} 
          title="Aucun produit trouvé" 
          description={search || filterStock !== 'all' ? "Modifiez vos filtres de recherche." : "Aucun produit dans le catalogue."} 
        />
      ) : (
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
          getRowKey={(row) => row.id as string}
          pageSize={15}
        />
      )}
    </div>
  );
}
