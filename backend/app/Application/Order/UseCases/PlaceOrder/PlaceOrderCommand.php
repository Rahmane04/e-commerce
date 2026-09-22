<?php
namespace App\Application\Order\UseCases\PlaceOrder;

final class PlaceOrderCommand
{
    /** @param array<int, array{productId:int, variantId:?int, quantity:int}> $items */
    public function __construct(
        public readonly string $customerName,
        public readonly string $customerPhone,
        public readonly ?string $customerEmail,
        public readonly string $deliveryAddress,
        public readonly ?string $deliveryNotes,
        public readonly array $items,
    ) {}
}