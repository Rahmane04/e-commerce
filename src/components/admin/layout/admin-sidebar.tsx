"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Warehouse,
  Percent,
  BarChart2,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Produits", href: "/admin/produits", icon: Package },
  { label: "Catégories", href: "/admin/categories", icon: Tag },
  { label: "Commandes", href: "/admin/commandes", icon: ShoppingCart },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Stock", href: "/admin/stock", icon: Warehouse },
  { label: "Promotions", href: "/admin/promotions", icon: Percent },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart2 },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

interface AdminSidebarProps {
  /** Drawer mode (mobile) */
  isDrawer?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isDrawer, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-slate-900 text-slate-100",
        isDrawer ? "w-72" : "w-60 min-w-[240px]",
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
        <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-700 text-xs font-bold text-slate-100">
            A
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Administration
          </span>
        </Link>
        {isDrawer && (
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation admin">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      active ? "text-white" : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — lien vers la boutique publique */}
      <div className="border-t border-slate-800 px-4 py-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <span>Voir la boutique</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
