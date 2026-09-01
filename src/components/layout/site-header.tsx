"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { CartIndicator } from "@/components/layout/cart-indicator";
import { categories } from "@/data/categories";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

export function SiteHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={LOGO_URL} alt="Lingère Bi By Dié Dié" className="h-10 w-auto rounded-md object-contain" />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Menu principal mobile" className="mt-6 flex flex-col gap-4">
                <Accordion type="single" collapsible className="w-full">
                  {categories.map((category) => (
                    category.subcategories && category.subcategories.length > 0 ? (
                      <AccordionItem value={category.slug} key={category.slug}>
                        <AccordionTrigger className="text-base font-medium">
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-3 pb-2 pt-1 pl-4">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/categorie/${category.slug}/${sub.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                              >
                                {sub.name}
                              </Link>
                            ))}
                            <Link
                              href={`/categorie/${category.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="text-foreground font-medium pt-2 border-t mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                            >
                              Voir tout {category.name}
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <div key={category.slug} className="py-4 border-b">
                        <Link
                          href={`/categorie/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        >
                          {category.name}
                        </Link>
                      </div>
                    )
                  ))}
                </Accordion>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label="Accueil — Lingère Bi By Dié Dié"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="Lingère Bi By Dié Dié"
              className="h-10 w-auto rounded-md object-contain"
            />
          </Link>
        </div>

        <nav aria-label="Menu principal" className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.slug}>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground hover:bg-accent/50 focus:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring">
                        {category.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub.slug}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/categorie/${category.slug}/${sub.slug}`}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <div className="text-sm font-medium leading-none">{sub.name}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                    Découvrir la sélection {sub.name.toLowerCase()}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          <li className="col-span-full mt-2 border-t border-border pt-2">
                             <NavigationMenuLink asChild>
                                <Link
                                  href={`/categorie/${category.slug}`}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring text-center font-medium text-sm"
                                >
                                  Voir tout {category.name}
                                </Link>
                             </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={`/categorie/${category.slug}`} legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent text-foreground/80 hover:text-foreground hover:bg-accent/50 focus:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring`}>
                        {category.name}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <CartIndicator />
      </div>
    </header>
  );
}
