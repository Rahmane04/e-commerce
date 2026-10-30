"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

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

interface SiteHeaderProps {
  categories?: Category[];
}

export function SiteHeader({ categories: initialCategories }: SiteHeaderProps = {}) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories ?? []);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    } else {
      productRepository.findCategories().then(setCategories).catch(() => {});
    }
  }, [initialCategories]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4">

        {/* Gauche : bouton hamburger */}
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col">
              {/* En-tête du drawer avec logo */}
              <SheetHeader className="border-b border-border/50 px-5 py-4">
                <SheetTitle asChild>
                  <Link href="/" onClick={() => setIsOpen(false)} aria-label="Accueil">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={LOGO_URL}
                      alt="Lingère Bi By Dié Dié"
                      className="h-11 w-auto rounded object-contain"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Navigation du drawer */}
              <nav
                aria-label="Menu principal"
                className="flex-1 overflow-y-auto px-3 py-4"
              >
                {/* Lien "Toute la boutique" */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-3.5 px-3 text-base font-medium rounded-xl transition-colors hover:bg-accent/60 active:bg-accent"
                >
                  Accueil
                </Link>

                <div className="my-2 border-t border-border/50" />

                <Accordion type="single" collapsible className="w-full">
                  {categories.map((category) =>
                    category.subcategories && category.subcategories.length > 0 ? (
                      <AccordionItem
                        value={category.slug}
                        key={category.slug}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="py-3.5 px-3 text-base font-medium rounded-xl hover:bg-accent/60 hover:no-underline data-[state=open]:text-primary data-[state=open]:bg-accent/30 transition-colors">
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <div className="flex flex-col gap-0.5 pl-3 pr-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/categorie/${category.slug}/${sub.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block py-3 px-3 text-sm text-muted-foreground rounded-xl transition-colors hover:text-foreground hover:bg-accent/50 active:bg-accent"
                              >
                                {sub.name}
                              </Link>
                            ))}
                            <Link
                              href={`/categorie/${category.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="mt-1 block py-3 px-3 text-sm font-semibold text-primary rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors text-center"
                            >
                              Voir tout {category.name}
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <div key={category.slug}>
                        <Link
                          href={`/categorie/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center py-3.5 px-3 text-base font-medium rounded-xl transition-colors hover:bg-accent/60 active:bg-accent"
                        >
                          {category.name}
                        </Link>
                      </div>
                    )
                  )}
                </Accordion>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Centre : logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          aria-label="Accueil — Lingère Bi By Dié Dié"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Lingère Bi By Dié Dié"
            className="h-9 w-auto rounded-md object-contain"
          />
        </Link>

        {/* Droite : panier */}
        <CartIndicator />
      </div>
    </header>
  );
}
