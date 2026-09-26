import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import "../globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Administration — La Boutique",
    template: "%s — Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full font-sans">
        <div className="flex h-full">
          {/* Sidebar — desktop uniquement (mobile = drawer dans AdminHeader) */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <AdminSidebar />
          </div>

          {/* Zone principale */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main
              id="admin-main"
              tabIndex={-1}
              className="flex-1 overflow-y-auto bg-slate-50 p-6"
            >
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
