import { cn } from "@/lib/utils";
import { OrderStatus } from "@/domain/order/order";
import { PromotionStatus } from "@/domain/promotion/promotion";

// ── Statuts commande ──────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<OrderStatus,{ label: string; className: string }> = {
  en_attente: {
    label: "En attente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  confirmee: {
    label: "Confirmée",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  expediee: {
    label: "Expédiée",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  livree: {
    label: "Livrée",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  annulee: {
    label: "Annulée",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

// ── Statuts promotion ─────────────────────────────────────────────────────────

const PROMO_STATUS_CONFIG: Record<
  PromotionStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  upcoming: {
    label: "À venir",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  expired: {
    label: "Expirée",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

// ── Statuts produit ───────────────────────────────────────────────────────────

export type ProductStatus = "publie" | "brouillon" | "rupture";

const PRODUCT_STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  publie: {
    label: "Publié",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  brouillon: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  rupture: {
    label: "Rupture",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

// ── Composants ────────────────────────────────────────────────────────────────

interface BadgeProps {
  className?: string;
}

export function OrderStatusBadge({
  status,
  className,
}: { status: OrderStatus } & BadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

export function PromotionStatusBadge({
  status,
  className,
}: { status: PromotionStatus } & BadgeProps) {
  const config = PROMO_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

export function ProductStatusBadge({
  status,
  className,
}: { status: ProductStatus } & BadgeProps) {
  const config = PRODUCT_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

/** Détermine le statut produit à afficher depuis les données métier */
export function getProductStatus(stock: number): ProductStatus {
  if (stock === 0) return "rupture";
  return "publie";
}
