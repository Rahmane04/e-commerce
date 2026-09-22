<?php
namespace App\Domain\Order;

use App\Domain\Catalog\ValueObjects\Money;
use App\Domain\Order\Exceptions\InvalidOrderTransitionException;

final class Order
{
    /** @param OrderItem[] $items */
    public function __construct(
        public readonly int $id,
        public readonly string $customerName,
        public readonly string $customerPhone,
        public readonly ?string $customerEmail,
        public readonly string $deliveryAddress,
        public readonly ?string $deliveryNotes,
        public readonly OrderStatus $status,
        public readonly array $items,
    ) {}

    public function total(): Money
    {
        return array_reduce(
            $this->items,
            fn (Money $carry, OrderItem $item) => $carry->add($item->lineTotal()),
            Money::fromCents(0)
        );
    }

    public function transitionTo(OrderStatus $next): void
    {
        if (!$this->status->canTransitionTo($next)) {
            throw new InvalidOrderTransitionException($this->status, $next);
        }
    }
}