"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, Home, ChevronRight } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { cn } from "@/lib/utils";

// Map slug → label pour le breadcrumb
const ROUTE_LABELS: Record<string, string> = {
  admin: "Tableau de bord",
  produits: "Produits",
  categories: "Catégories",
  commandes: "Commandes",
  clients: "Clients",
  stock: "Stock",
  promotions: "Promotions",
  statistiques: "Statistiques",
  parametres: "Paramètres",
  nouveau: "Nouveau",
  modifier: "Modifier",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export function AdminHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const crumbs = useBreadcrumb();

  const handleLogout = () => {
    // V1 : suppression du flag de session local, redirect login
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_authenticated");
    }
    router.push("/admin/login");
  };

  return (
    <>
      {/* Header bar */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="hidden sm:block">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <Link
                  href="/admin"
                  className="text-slate-400 transition-colors hover:text-slate-700"
                  aria-label="Accueil admin"
                >
                  <Home className="h-3.5 w-3.5" />
                </Link>
              </li>
              {crumbs.slice(1).map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  {crumb.isLast ? (
                    <span className="font-medium text-slate-700">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className={cn(
                        "text-slate-400 transition-colors hover:text-slate-700",
                      )}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-slate-400 sm:inline">
            Admin
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600"
            title="Se déconnecter"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex h-full">
            <AdminSidebar isDrawer onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
