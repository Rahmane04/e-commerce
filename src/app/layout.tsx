import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Toaster } from "sonner";

// Display face: Playfair Display for elegant headings
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Body face: Inter for clean readability
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const siteName = "La Boutique"; // TODO: remplacer par le nom de la marque

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Mode, maison & lingerie`,
    template: `%s — ${siteName}`,
  },
  description:
    "Boutique en ligne de vêtements, lingerie, linge de maison, encens et accessoires. Une sélection pensée pour votre quotidien.",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName,
    title: `${siteName} — Mode, maison & lingerie`,
    description:
      "Boutique en ligne de vêtements, lingerie, linge de maison, encens et accessoires.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf7f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Toaster position="top-right" richColors />
        <CookieConsent />
      </body>
    </html>
  );
}

