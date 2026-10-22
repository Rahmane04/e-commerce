/**
 * Numéro WhatsApp de la boutique, au format international sans "+" ni espaces
 * (ex : 221771234567). Lu à la compilation par Next (préfixe NEXT_PUBLIC_).
 */
const SHOP_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Construit le lien wa.me vers la boutique avec un message prérempli.
 * Sans numéro configuré, WhatsApp ouvre un sélecteur de contact.
 */
export function buildShopWhatsAppUrl(message: string): string {
  const phone = SHOP_WHATSAPP_NUMBER.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}
