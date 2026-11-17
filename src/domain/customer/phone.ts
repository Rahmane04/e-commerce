/**
 * Règle du téléphone sénégalais, miroir de PlaceOrderRequest côté Laravel
 * (le serveur reste l'autorité ; cette copie sert à afficher l'erreur tout de suite).
 * Préfixes acceptés : mobiles 70, 75, 76, 77, 78 et fixes 33.
 */
const SENEGAL_PHONE = /^(?:\+221|00221|221)?((?:7[05678]|33)\d{7})$/;

/** Retourne le numéro au format +221XXXXXXXXX, ou null s'il n'est pas reconnu. */
export function normalizeSenegalPhone(raw: string): string | null {
  // On ne garde que les chiffres et le "+" : élimine espaces, tirets, points
  // et espaces insécables (fréquents dans les numéros copiés depuis WhatsApp).
  const match = SENEGAL_PHONE.exec(raw.replace(/[^\d+]/g, ""));
  return match ? `+221${match[1]}` : null;
}

export function isValidSenegalPhone(raw: string): boolean {
  return normalizeSenegalPhone(raw) !== null;
}
