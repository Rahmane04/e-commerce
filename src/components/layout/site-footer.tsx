import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-5">
        <p className="text-xs text-neutral-500 font-medium">
          © {new Date().getFullYear()} Lingère Bi By Dié Dié
        </p>
        <a
          href="https://wa.me/221771234567"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nous contacter sur WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white active:scale-95 transition-transform"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
