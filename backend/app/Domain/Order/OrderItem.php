<?php
namespace App\Domain\Order;

use App\Domain\Catalog\ValueObjects\Money;

final class OrderItem
{
    public function __construct(
        public readonly int $productId,
        public readonly ?int $variantId,
        public readonly string $productName,
        public readonly ?string $variantLabel,
        public readonly ?string $variantValue,
        public readonly Money $unitPrice,
        public readonly int $quantity,
    ) {}

    public function lineTotal(): Money
    {
        return $this->unitPrice->multiply($this->quantity);
    }
}