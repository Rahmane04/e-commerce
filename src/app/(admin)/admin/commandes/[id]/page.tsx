"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { orderRepository } from "@/infrastructure/repositories/api-order-repository";
import { getOrderById, updateOrderStatus } from "@/application/admin/order-admin-use-cases";
import { Order, OrderStatus, getNextStatuses, getStatusLabel } from "@/domain/order/order";
import { OrderStatusBadge } from "@/components/admin/ui/status-badge";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString("fr-FR") + " F";
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdateTarget, setStatusUpdateTarget] = useState<OrderStatus | null>(null);
  const [statusNote, setStatusNote] = useState("");

  const loadData = async () => {
    const o = await getOrderById(orderRepository, id);
    setOrder(o);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !statusUpdateTarget) return;
    try {
      await updateOrderStatus(orderRepository, order.id, statusUpdateTarget, statusNote);
      toast.success(`Statut mis à jour : ${getStatusLabel(statusUpdateTarget)}`);
      setStatusUpdateTarget(null);
      setStatusNote("");
      loadData();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 h-64 animate-pulse" />
          <div className="rounded-lg border border-slate-200 bg-white p-6 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-slate-500">Commande introuvable.</p>
        <Link href="/admin/commandes" className="mt-3 text-sm font-medium text-slate-900 underline">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const nextStatuses = getNextStatuses(order.status);
  const wpMessage = encodeURIComponent(`Bonjour ${order.customer.fullName}, concernant votre commande ${order.id}...`);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/commandes"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Retour aux commandes"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900">
                Commande {order.id}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              Passée le {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Actions de statut rapides */}
        {nextStatuses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {nextStatuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusUpdateTarget(status)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === "annulee" 
                    ? "border border-red-200 text-red-600 hover:bg-red-50" 
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                Passer en {getStatusLabel(status).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne Principale: Produits & Historique */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Produits */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-700">Produits commandés</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-slate-500">{item.variantLabel}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-slate-900">
                      {item.quantity} × {formatFCFA(item.priceCents)}
                    </p>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {formatFCFA(item.quantity * item.priceCents)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-900">{formatFCFA(order.totalCents)}</span>
            </div>
          </div>

          {/* Historique des statuts */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Historique de la commande</h2>
            <div className="relative pl-4 border-l-2 border-slate-100 flex flex-col gap-6">
              {order.statusHistory.slice().reverse().map((history, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-200">
                    <CheckCircle2 className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{getStatusLabel(history.status)}</span>
                      <span className="text-xs text-slate-400">{formatDateTime(history.changedAt)}</span>
                    </div>
                    {history.note && (
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-md p-2 border border-slate-100">
                        {history.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Latérale: Client */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-700 flex items-center justify-between">
              Client
              <a 
                href={`https://wa.me/${(order.customer.phone || '').replace(/\D/g, '')}?text=${wpMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded"
              >
                WhatsApp
              </a>
            </h2>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-900">{order.customer.fullName}</p>
                {order.customer.email && (
                  <p className="flex items-center gap-2 text-slate-600 mt-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {order.customer.email}
                  </p>
                )}
                <p className="flex items-center gap-2 text-slate-600 mt-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {order.customer.phone}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                  <span>
                    {order.customer.address}<br />
                    <span className="font-medium text-slate-900">{order.customer.city}</span>
                  </span>
                </p>
                {order.customer.landmark && (
                  <p className="text-slate-500 mt-1 text-xs italic pl-5">
                    Repère : {order.customer.landmark}
                  </p>
                )}
              </div>

              {order.customer.notes && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="flex items-start gap-2 text-slate-600">
                    <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                    <span className="italic">{order.customer.notes}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!statusUpdateTarget}
        onOpenChange={(open) => !open && setStatusUpdateTarget(null)}
        title={`Changer le statut : ${statusUpdateTarget ? getStatusLabel(statusUpdateTarget) : ''}`}
        description="Confirmez-vous ce changement de statut pour la commande ?"
        confirmLabel="Confirmer"
        onConfirm={handleStatusUpdate}
        isDestructive={statusUpdateTarget === "annulee"}
      />
    </div>
  );
}
