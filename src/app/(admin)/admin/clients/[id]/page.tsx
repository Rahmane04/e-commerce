"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, FileText, ShoppingCart, Calendar } from "lucide-react";
import { orderRepository } from "@/infrastructure/repositories/api-order-repository";
import { Customer } from "@/domain/customer/customer";
import { Order } from "@/domain/order/order";
import { OrderStatusBadge } from "@/components/admin/ui/status-badge";
import Link from "next/link";

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " F";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

interface CustomerProfile extends Customer {
  id: string;
  orders: Order[];
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderRepository.findAll().then((allOrders) => {
      // Retrouver le client par son "id" (téléphone sans espaces ou ID commande)
      const customerOrders = allOrders.filter(
        (o) => (o.customer?.phone || '').replace(/\s/g, '') === id || String(o.id) === id
      );

      if (customerOrders.length > 0) {
        // Trier chronologiquement (plus ancien au plus récent) pour trouver première/dernière date
        const sortedOrders = [...customerOrders].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // Orders affichées du plus récent au plus ancien
        const displayOrders = [...sortedOrders].reverse();
        
        const totalSpent = customerOrders
          .filter(o => o.status !== "annulee")
          .reduce((sum, o) => sum + o.totalCents, 0);

        setProfile({
          fullName: customerOrders[0].customer?.fullName || "Client inconnu",
          phone: customerOrders[0].customer?.phone || "",
          email: customerOrders[0].customer?.email,
          city: customerOrders[0].customer?.city || "",
          address: customerOrders[0].customer?.address || "",
          landmark: customerOrders[0].customer?.landmark,
          notes: customerOrders[0].customer?.notes,
          id,
          orders: displayOrders,
          totalSpent,
          firstOrderDate: sortedOrders[0].createdAt,
          lastOrderDate: sortedOrders[sortedOrders.length - 1].createdAt,
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 h-64 animate-pulse" />
          <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-slate-500">Client introuvable.</p>
        <Link href="/admin/clients" className="mt-3 text-sm font-medium text-slate-900 underline">
          Retour aux clients
        </Link>
      </div>
    );
  }

  const wpMessage = encodeURIComponent(`Bonjour ${profile.fullName}, La Boutique...`);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/clients"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Retour aux clients"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Fiche Client</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Client depuis le {formatDate(profile.firstOrderDate)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne latérale: Profil & Coordonnées */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 border border-slate-200">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{profile.fullName}</h2>
                <a 
                  href={`https://wa.me/${(profile.phone || '').replace(/\D/g, '')}?text=${wpMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                >
                  Contacter via WhatsApp
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="flex items-center gap-2 text-slate-600 mt-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {profile.phone}
                </p>
                {profile.email && (
                  <p className="flex items-center gap-2 text-slate-600 mt-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                  <span>
                    {profile.address}<br />
                    <span className="font-medium text-slate-900">{profile.city}</span>
                  </span>
                </p>
                {profile.landmark && (
                  <p className="text-slate-500 mt-1 text-xs italic pl-5">
                    Repère : {profile.landmark}
                  </p>
                )}
              </div>

              {profile.notes && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="flex items-start gap-2 text-slate-600">
                    <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                    <span className="italic">{profile.notes}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Résumé</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Commandes</span>
                <span className="font-medium text-slate-900">{profile.orders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total dépensé</span>
                <span className="font-medium text-slate-900">{formatFCFA(profile.totalSpent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Dernière commande</span>
                <span className="font-medium text-slate-900">{formatDate(profile.lastOrderDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Principale: Historique des commandes */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-slate-400" />
              Historique des commandes
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {profile.orders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/admin/commandes/${order.id}`} className="font-mono text-sm font-medium text-indigo-600 hover:underline">
                      {order.id}
                    </Link>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    {order.items.length} article(s)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-slate-900 text-base">{formatFCFA(order.totalCents)}</p>
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="mt-2 inline-flex text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Voir la commande →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
