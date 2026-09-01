"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/infrastructure/store/cart-store";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Customer } from "@/domain/customer/customer";
import { placeOrder, formatOrderForWhatsApp, Order } from "@/domain/order/order";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, MessageCircle, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  if (cart.items.length === 0 && !order) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e] flex flex-col items-center justify-center p-4">
        <h1 className="font-serif text-3xl font-semibold mb-4">Votre panier est vide</h1>
        <p className="text-[#5a5a6e] mb-8 text-center max-w-md">
          Vous devez ajouter des articles à votre panier avant de pouvoir passer commande.
        </p>
        <Button asChild className="bg-[#1a1a2e] text-[#f5f0e6] hover:bg-[#1a1a2e]/90">
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  const handleOrderSubmit = (customer: Customer) => {
    try {
      const newOrder = placeOrder(cart, customer);
      setOrder(newOrder);
      // In a real app, we would clear the cart here or after backend confirmation.
      // useCartStore.getState().clearCart();
    } catch (error) {
      console.error("Erreur lors de la création de la commande", error);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!order) return;
    const message = formatOrderForWhatsApp(order);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1a1a2e] pb-16">
      {/* Header */}
      <div className="border-b border-[#e8e4d9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm text-[#5a5a6e] lg:px-6">
          <Link href="/" className="transition-colors hover:text-[#c5a059]">
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#1a1a2e] font-medium">Validation de commande</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-6">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            className="text-[#5a5a6e] hover:text-[#1a1a2e] p-0 mr-4 h-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="font-serif text-3xl font-semibold">Finaliser ma commande</h1>
        </div>

        {order ? (
          /* Écran de confirmation */
          <div className="mx-auto max-w-2xl rounded-xl border border-[#e8e4d9] bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="font-serif text-2xl font-semibold text-[#1a1a2e] mb-4">
              Commande enregistrée avec succès !
            </h2>
            <p className="text-[#5a5a6e] mb-8">
              Merci pour votre confiance. Votre commande porte la référence <strong>{order.id}</strong>.
              <br className="mb-2" />
              Pour un traitement plus rapide, vous pouvez confirmer votre commande directement avec nous sur WhatsApp.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button
                onClick={handleWhatsAppConfirm}
                className="bg-[#25D366] text-white hover:bg-[#20bd5a] min-w-[220px]"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Confirmer via WhatsApp
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-[#f5f0e6]"
              >
                <Link href="/">Retourner à la boutique</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Tunnel de commande */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <CheckoutForm onSubmit={handleOrderSubmit} />
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <CheckoutSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
