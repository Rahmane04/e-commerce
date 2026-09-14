"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { orderRepository } from "@/infrastructure/repositories/mock-order-repository";
import { Customer } from "@/domain/customer/customer";
import { Order } from "@/domain/order/order";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SkeletonTable } from "@/components/admin/ui/skeleton-table";
import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/admin/ui/data-table";

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " F";
}

// Pour la liste des clients, on agrège les commandes mockées
// Dans un vrai backend, il y aurait un CustomerRepository avec `findAllCustomers()`
interface CustomerSummary extends Customer {
  id: string; // phone is used as ID here for mock simplicity
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function ClientsPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    orderRepository.findAll().then((ords) => {
      // Agrégation par numéro de téléphone (utilisé comme ID unique en V1 mockée)
      const customerMap = new Map<string, CustomerSummary>();
      
      ords.forEach((order) => {
        const id = order.customer.phone.replace(/\s/g, ''); // phone sans espaces
        if (!customerMap.has(id)) {
          customerMap.set(id, {
            ...order.customer,
            id,
            orderCount: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
          });
        }
        
        const summary = customerMap.get(id)!;
        summary.orderCount += 1;
        
        if (order.status !== "annulee") {
          summary.totalSpent += order.totalCents;
        }
        
        if (new Date(order.createdAt) > new Date(summary.lastOrderDate)) {
          summary.lastOrderDate = order.createdAt;
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, search]);

  const columns: ColumnDef<CustomerSummary>[] = [
    {
      key: "fullName",
      header: "Client",
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-medium text-slate-900">{c.fullName}</p>
          <p className="text-xs text-slate-400">{c.city}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (c) => (
        <div>
          <p className="text-sm text-slate-900">{c.phone}</p>
          {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
        </div>
      ),
    },
    {
      key: "orderCount",
      header: "Commandes",
      sortable: true,
      render: (c) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
          {c.orderCount}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "Dépensé",
      sortable: true,
      render: (c) => <span className="font-medium text-slate-900">{formatFCFA(c.totalSpent)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="text-right">
          <Link
            href={`/admin/clients/${c.id}`}
            className="rounded px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Voir le profil →
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clients</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {customers.length} client(s) au total
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Nom, téléphone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={Users} 
          title="Aucun client trouvé" 
          description={search ? "Aucun résultat pour votre recherche." : "Les clients apparaîtront ici lorsqu'ils passeront commande."} 
        />
      ) : (
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
          getRowKey={(row) => row.id as string}
          pageSize={10}
        />
      )}
    </div>
  );
}
