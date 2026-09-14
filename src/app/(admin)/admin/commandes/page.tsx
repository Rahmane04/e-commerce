"use client";

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { orderRepository } from "@/infrastructure/repositories/mock-order-repository";
import { Order, OrderStatus } from "@/domain/order/order";
import { OrderStatusBadge } from "@/components/admin/ui/status-badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SkeletonTable } from "@/components/admin/ui/skeleton-table";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " F";
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

const STATUS_OPTIONS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "livree", label: "Livrée" },
];

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    orderRepository.findAll().then((ords) => {
      setOrders(ords);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "en_attente").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Commandes</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {orders.length} commande(s) au total
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {pendingCount} en attente
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Numéro, nom client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | OrderStatus)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Aucune commande trouvée" description="Modifiez vos filtres pour voir d'autres commandes." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">N°</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 bg-white last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500">{order.id}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{order.customer.fullName}</p>
                    <p className="text-xs text-slate-400">{order.customer.city}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{formatFCFA(order.totalCents)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="rounded px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      Voir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
