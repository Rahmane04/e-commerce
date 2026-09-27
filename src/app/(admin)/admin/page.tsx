"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { StatCard } from "@/components/admin/ui/stat-card";
import { SkeletonCard } from "@/components/admin/ui/skeleton-table";
import { OrderStatusBadge } from "@/components/admin/ui/status-badge";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { orderRepository } from "@/infrastructure/repositories/api-order-repository";
import { Product } from "@/domain/product/product";
import { Order } from "@/domain/order/order";
import Link from "next/link";

// Données graphique ventes (mockées)
const salesData = [
  { jour: "Lun", ventes: 4200000, commandes: 3 },
  { jour: "Mar", ventes: 2800000, commandes: 2 },
  { jour: "Mer", ventes: 5600000, commandes: 4 },
  { jour: "Jeu", ventes: 3100000, commandes: 3 },
  { jour: "Ven", ventes: 7200000, commandes: 5 },
  { jour: "Sam", ventes: 8900000, commandes: 7 },
  { jour: "Dim", ventes: 6500000, commandes: 5 },
];

const categoryData = [
  { catégorie: "Vêtements", ventes: 12500000 },
  { catégorie: "Lingerie", ventes: 8200000 },
  { catégorie: "Linge maison", ventes: 9800000 },
  { catégorie: "Encens", ventes: 4100000 },
  { catégorie: "Accessoires", ventes: 6300000 },
];

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " FCFA";
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productRepository.findAll(), orderRepository.findAll()]).then(
      ([prods, ords]) => {
        setProducts(prods);
        setOrders(ords);
        setLoading(false);
      },
    );
  }, []);

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const pendingOrders = orders.filter((o) => o.status === "en_attente");
  const totalRevenue = orders
    .filter((o) => o.status !== "annulee")
    .reduce((sum, o) => sum + o.totalCents, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Tableau de bord
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Bienvenue ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Chiffre d'affaires total"
              value={formatFCFA(totalRevenue)}
              icon={TrendingUp}
              accent="success"
              trend={{ value: 12, label: "vs semaine dernière" }}
            />
            <StatCard
              title="Commandes en attente"
              value={pendingOrders.length}
              subtitle={`${orders.length} commandes au total`}
              icon={Clock}
              accent={pendingOrders.length > 0 ? "warning" : "default"}
            />
            <StatCard
              title="Produits en stock faible"
              value={lowStockProducts.length}
              subtitle={`${outOfStockProducts.length} en rupture`}
              icon={AlertTriangle}
              accent={outOfStockProducts.length > 0 ? "danger" : lowStockProducts.length > 0 ? "warning" : "default"}
            />
            <StatCard
              title="Total produits"
              value={products.length}
              icon={Package}
              accent="default"
            />
          </>
        )}
      </div>

      {/* Alertes */}
      {!loading && (outOfStockProducts.length > 0 || pendingOrders.length > 0) && (
        <div className="flex flex-col gap-2">
          {outOfStockProducts.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-800">
                <span className="font-semibold">{outOfStockProducts.length} produit(s) en rupture de stock</span> —{" "}
                <Link href="/admin/stock" className="underline underline-offset-2 hover:no-underline">
                  Gérer le stock
                </Link>
              </p>
            </div>
          )}
          {pendingOrders.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <Clock className="h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{pendingOrders.length} commande(s) en attente de traitement</span> —{" "}
                <Link href="/admin/commandes" className="underline underline-offset-2 hover:no-underline">
                  Voir les commandes
                </Link>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Courbe ventes */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Ventes — 7 derniers jours
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#475569" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="jour" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(v: any) => [formatFCFA(v), "Ventes"]}
                contentStyle={{ fontSize: 12, borderColor: "#e2e8f0" }}
              />
              <Area
                type="monotone"
                dataKey="ventes"
                stroke="#475569"
                strokeWidth={2}
                fill="url(#colorVentes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Barres par catégorie */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Ventes par catégorie
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              />
              <YAxis
                dataKey="catégorie"
                type="category"
                width={80}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: any) => [formatFCFA(v), "Ventes"]}
                contentStyle={{ fontSize: 12, borderColor: "#e2e8f0" }}
              />
              <Bar dataKey="ventes" fill="#475569" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Dernières commandes
          </h2>
          <Link
            href="/admin/commandes"
            className="text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))
          ) : recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              Aucune commande pour le moment
            </p>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-slate-50"
              >
                <span className="min-w-[5rem] font-mono text-xs text-slate-500">
                  {order.id}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-slate-900">
                  {order.customer.fullName}
                </span>
                <span className="text-sm text-slate-500">
                  {formatFCFA(order.totalCents)}
                </span>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
