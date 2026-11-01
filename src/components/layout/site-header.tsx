"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, Heart } from "lucide-react";

import { CartIndicator } from "@/components/layout/cart-indicator";
import { Category } from "@/domain/product/category";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const LOGO_URL =
  "https://id-preview--89fb583a-6b7f-4f84-82a4-5d90f9dc2778.lovable.app/__l5e/assets-v1/22829d72-7d03-43dd-aff0-1753c7284d82/logo-lingerie.png";

const DEFAULT_CATEGORIES: { name: string; slug: string }[] = [
  { name: "Vêtements", slug: "vetements" },
  { name: "Lingerie", slug: "lingerie" },
  { name: "Linge de maison", slug: "linge-de-maison" },
  { name: "Encens & parfums", slug: "encens-parfums" },
  { name: "Accessoires", slug: "accessoires" },
];

interface SiteHeaderProps {
  categories?: Category[];
}

export function SiteHeader({ categories: initialCategories }: SiteHeaderProps = {}) {
  const pathname = usePathname();
  const [categories, setCategories] = React.useState<Category[]>(initialCategories ?? []);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    } else {
      productRepository.findCategories().then(setCategories).catch(() => {});
    }
  }, [initialCategories]);

  const navCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const isHomeActive = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-[#f0ece4] bg-white">
      {/* ── DESKTOP & TABLET HEADER (>= md) ───────────────────────── */}
      <div className="hidden md:block">
        {/* Ligne 1 : Recherche | Logo centré | Icônes (Compte, Favoris, Panier) */}
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Gauche : Barre de recherche */}
          <div className="w-72">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-200 bg-neutral-50/80 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Centre : Logo */}
          <Link href="/" className="inline-block" aria-label="Accueil — Lingère Bi By Dié Dié">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="Lingère Bi By Dié Dié"
              className="h-12 w-auto object-contain rounded"
            />
          </Link>

          {/* Droite : Profil, Favoris, Panier */}
          <div className="flex items-center gap-2 w-72 justify-end">

            <CartIndicator />
          </div>
        </div>

        {/* Ligne 2 : Liens de navigation centrés avec passage stylé */}
        <nav
          aria-label="Navigation principale"
          className="border-t border-neutral-100 py-2.5"
        >
          <ul className="flex items-center justify-center gap-1.5 md:gap-2 text-sm">
            <li>
              <Link
                href="/"
                className={`px-4 py-2 rounded-full text-xs md:text-sm tracking-wide transition-all duration-200 inline-flex items-center justify-center ${
                  isHomeActive
                    ? "bg-black text-white font-medium shadow-xs"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100 font-normal"
                }`}
              >
                Accueil
              </Link>
            </li>
            {navCategories.map((cat) => {
              const isActive =
                pathname === `/categorie/${cat.slug}` ||
                pathname.startsWith(`/categorie/${cat.slug}/`);
              return (
                <li key={cat.slug}>
                  <Link
                    href={`/categorie/${cat.slug}`}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm tracking-wide transition-all duration-200 inline-flex items-center justify-center ${
                      isActive
                        ? "bg-black text-white font-medium shadow-xs"
                        : "text-neutral-600 hover:text-black hover:bg-neutral-100 font-normal"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ── MOBILE HEADER (< md) ─────────────────────────────────── */}
      <div className="flex md:hidden h-16 items-center justify-between px-4">
        {/* Bouton burger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg text-black"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col bg-white">
            <SheetHeader className="border-b border-neutral-100 px-5 py-4">
              <SheetTitle asChild>
                <Link href="/" onClick={() => setIsOpen(false)} aria-label="Accueil">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOGO_URL}
                    alt="Lingère Bi By Dié Dié"
                    className="h-10 w-auto rounded object-contain"
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>

            {/* Barre de recherche dans le menu mobile */}
            <div className="px-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className="w-full h-10 pl-9 pr-3 rounded-full border border-neutral-200 bg-neutral-50 text-xs text-black placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Navigation du drawer */}
            <nav aria-label="Menu principal" className="flex-1 overflow-y-auto px-4 py-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-3 text-sm border-b border-neutral-100 ${
                  isHomeActive ? "font-bold text-black" : "font-medium text-neutral-600"
                }`}
              >
                Accueil
              </Link>

              <Accordion type="single" collapsible className="w-full">
                {categories.map((category) => {
                  const isActive =
                    pathname === `/categorie/${category.slug}` ||
                    pathname.startsWith(`/categorie/${category.slug}/`);

                  return category.subcategories && category.subcategories.length > 0 ? (
                    <AccordionItem
                      value={category.slug}
                      key={category.slug}
                      className="border-b border-neutral-100"
                    >
                      <AccordionTrigger
                        className={`py-3 text-sm hover:no-underline ${
                          isActive ? "font-bold text-black" : "font-semibold text-neutral-700"
                        }`}
                      >
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="flex flex-col gap-1 pl-3">
                          {category.subcategories.map((sub) => {
                            const isSubActive =
                              pathname === `/categorie/${category.slug}/${sub.slug}`;
                            return (
                              <Link
                                key={sub.slug}
                                href={`/categorie/${category.slug}/${sub.slug}`}
                                onClick={() => setIsOpen(false)}
                                className={`py-2 text-xs transition-colors ${
                                  isSubActive ? "font-bold text-black" : "text-neutral-600 hover:text-black"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                          <Link
                            href={`/categorie/${category.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="py-2 text-xs font-semibold text-black"
                          >
                            Voir tout {category.name}
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <div key={category.slug} className="border-b border-neutral-100">
                      <Link
                        href={`/categorie/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center py-3 text-sm ${
                          isActive ? "font-bold text-black" : "font-semibold text-neutral-700"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </div>
                  );
                })}
              </Accordion>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo mobile centré */}
        <Link
          href="/"
          className="focus-visible:outline-none"
          aria-label="Accueil — Lingère Bi By Dié Dié"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Lingère Bi By Dié Dié"
            className="h-9 w-auto rounded object-contain"
          />
        </Link>

        {/* Droite mobile : Panier */}
        <div className="flex items-center">
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
