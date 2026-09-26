<?php
namespace App\Domain\Order;

enum OrderStatus: string
{
    case EnAttente = 'en_attente';
    case Confirmee = 'confirmee';
    case Expediee = 'expediee';
    case Livree = 'livree';
    case Annulee = 'annulee';

    /** @return OrderStatus[] */
    public function nextPossible(): array
    {
        return match ($this) {
            self::EnAttente => [self::Confirmee, self::Annulee],
            self::Confirmee => [self::Expediee, self::Annulee],
            self::Expediee => [self::Livree],
            self::Livree, self::Annulee => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->nextPossible(), true);
    }
}