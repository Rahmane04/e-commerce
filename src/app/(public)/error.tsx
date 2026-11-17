"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Page d'erreur du site public (convention Next.js : composant client obligatoire).
 * Affichée quand une page lève une erreur, par exemple si l'API ne répond pas.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-2xl font-semibold text-[#1a1a2e]">
        La boutique ne répond pas pour le moment
      </h1>
      <p className="text-sm text-[#5a5a6e]">
        Le serveur se réveille peut-être. Réessayez dans quelques secondes.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white"
        >
          Réessayer
        </button>
        <Link href="/" className="rounded-md border border-[#e8e4d9] px-4 py-2 text-sm font-medium text-[#1a1a2e]">
          Accueil
        </Link>
      </div>
    </div>
  );
}
