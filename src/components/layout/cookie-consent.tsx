"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

type ConsentStatus = "accepted" | "refused" | null;

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus;
    if (!stored) {
      setVisible(true);
      // Focus the dialog when it appears
      requestAnimationFrame(() => firstFocusRef.current?.focus());
    } else {
      setStatus(stored);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setStatus("accepted");
    setVisible(false);
  }, []);

  const handleRefuse = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "refused");
    setStatus("refused");
    setVisible(false);
  }, []);

  // Handle keyboard trap within dialog
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRefuse();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    },
    [handleRefuse]
  );

  if (!visible || status) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Gestion des cookies"
      aria-modal="false"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e8e4d9] bg-white p-4 shadow-lg sm:p-6"
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p
            id="cookie-consent-description"
            className="text-sm text-[#4a4a5e]"
          >
            Nous utilisons des cookies pour améliorer votre expérience de
            navigation. Aucun cookie non essentiel n'est déposé sans votre
            consentement.{" "}
            <a
              href="#"
              className="font-medium text-[#1a1a2e] underline hover:text-[#8a6d3b]"
            >
              En savoir plus
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            ref={firstFocusRef}
            onClick={handleRefuse}
            variant="outline"
            className="border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#f5f0e6]"
          >
            Refuser
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-[#1a1a2e] text-[#f5f0e6] hover:bg-[#1a1a2e]/90"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
