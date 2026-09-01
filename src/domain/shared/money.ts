/**
 * Money — value object.
 *
 * Tous les montants sont stockés en centimes de FCFA (entiers) pour éviter
 * les erreurs d'arrondi liées aux nombres flottants. C'est le SEUL endroit
 * du projet où l'on doit faire des additions/multiplications de prix.
 * Aucun composant UI ne doit recalculer un total lui-même.
 */
export class Money {
  private constructor(private readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isFinite(cents) || cents < 0) {
      throw new Error(`Montant invalide: ${cents}`);
    }
    return new Money(Math.round(cents));
  }

  /** Ex: Money.fromUnits(12500) -> 12 500 FCFA */
  static fromUnits(units: number): Money {
    return Money.fromCents(units * 100);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return Money.fromCents(this.cents + other.cents);
  }

  multiply(factor: number): Money {
    return Money.fromCents(this.cents * factor);
  }

  subtract(other: Money): Money {
    return Money.fromCents(Math.max(0, this.cents - other.cents));
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  toCents(): number {
    return this.cents;
  }

  toUnits(): number {
    return this.cents / 100;
  }

  /** Formatage FCFA pour l'affichage, ex: "12 500 FCFA" */
  format(): string {
    const units = this.toUnits();
    return `${new Intl.NumberFormat("fr-FR").format(units)} FCFA`;
  }
}
