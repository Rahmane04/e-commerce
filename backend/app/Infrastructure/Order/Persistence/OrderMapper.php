<?php
namespace App\Infrastructure\Order\Persistence;

use App\Domain\Catalog\ValueObjects\Money;
use App\Domain\Order\{Order, OrderItem, OrderStatus};

class OrderMapper
{
    public static function toDomain(OrderModel $model): Order
    {
        return new Order(
            id: $model->id,
            customerName: $model->customer_name,
            customerPhone: $model->customer_phone,
            customerEmail: $model->customer_email,
            deliveryAddress: $model->delivery_address,
            deliveryNotes: $model->delivery_notes,
            status: OrderStatus::from($model->status),
            items: $model->items->map(fn (OrderItemModel $i) => new OrderItem(
                productId: $i->product_id,
                variantId: $i->variant_id,
                productName: $i->product_name,
                variantLabel: $i->variant_label,
                variantValue: $i->variant_value,
                unitPrice: Money::fromCents($i->unit_price_cents),
                quantity: $i->quantity,
            ))->all(),
        );
    }
}