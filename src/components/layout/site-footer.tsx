import Link from "next/link";

const LOGO_URL =
  "https://id-preview--89fb583a-6b7f-4f84-82a4-5d90f9dc2778.lovable.app/__l5e/assets-v1/22829d72-7d03-43dd-aff0-1753c7284d82/logo-lingerie.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8e4d9] bg-[#fcfbf8] py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="Lingère Bi By Dié Dié"
              className="h-12 w-auto rounded-md object-contain"
              width={120}
              height={48}
              loading="lazy"
            />
            <p className="mt-4 text-sm text-[#4a4a5e]">
              Vêtements, lingerie, linge de maison et senteurs — une sélection
              chic pour sublimer votre quotidien.
            </p>
          </div>
          <nav aria-label="Liens boutique">
            <h2 className="font-semibold text-[#1a1a2e]">Boutique</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#4a4a5e]">
              <li>
                <Link
                  href="/categorie/nouveautes"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link
                  href="/categorie/vetements"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Vêtements
                </Link>
              </li>
              <li>
                <Link
                  href="/categorie/lingerie"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Lingerie
                </Link>
              </li>
              <li>
                <Link
                  href="/categorie/linge-de-maison"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Linge de maison
                </Link>
              </li>
              <li>
                <Link
                  href="/categorie/encens-parfums"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Encens &amp; Parfums
                </Link>
              </li>
              <li>
                <Link
                  href="/categorie/accessoires"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  Accessoires
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Liens d'aide">
            <h2 className="font-semibold text-[#1a1a2e]">Aide</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#4a4a5e]">
              <li>
                <a href="#" className="hover:text-[#8a6d3b] transition-colors">
                  Livraison &amp; retours
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8a6d3b] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8a6d3b] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8a6d3b] transition-colors">
                  Conditions générales
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#4a4a5e]">
              <li>
                <a
                  href="mailto:contact@lingere-biby-diedie.sn"
                  aria-label="Envoyer un email à contact@lingere-biby-diedie.sn"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  contact@lingere-biby-diedie.sn
                </a>
              </li>
              <li>
                <a
                  href="tel:+221771234567"
                  aria-label="Appeler le +221 77 123 45 67"
                  className="hover:text-[#8a6d3b] transition-colors"
                >
                  +221 77 123 45 67
                </a>
              </li>
              <li>Dakar, Sénégal</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#e8e4d9] pt-8 text-center text-sm text-[#4a4a5e]">
          © {new Date().getFullYear()} Lingère Bi By Dié Dié. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}
