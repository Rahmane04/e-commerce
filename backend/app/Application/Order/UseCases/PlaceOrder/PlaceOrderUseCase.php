<?php
namespace App\Application\Order\UseCases\PlaceOrder;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Domain\Catalog\Exceptions\ProductNotFoundException;
use App\Domain\Order\{Order, OrderStatus};
use Illuminate\Support\Facades\DB;

class PlaceOrderUseCase
{
    public function __construct(
        private ProductRepositoryInterface $products,
        private OrderRepositoryInterface $orders,
    ) {}
    public function execute(PlaceOrderCommand $command): Order
{
    return DB::transaction(function () use ($command) {
        $orderItems = [];

        foreach ($command->items as $line) {
            $product = $this->products->findById($line['product_id']);
            if ($product === null) {
                throw new ProductNotFoundException();
            }

            $orderItems[] = [
                'product_id' => $product->id,
                'variant_id' => $line['variant_id'] ?? null,
                'product_name' => $product->name,
                'variant_label' => null,
                'variant_value' => null,
                'unit_price_cents' => $product->price->toCents(),
                'quantity' => $line['quantity'],
            ];
        }

        foreach ($orderItems as $item) {
            $this->products->decrementStock($item['product_id'], $item['variant_id'], $item['quantity']);
        }

        return $this->orders->create([
            'customer_name' => $command->customerName,
            'customer_phone' => $command->customerPhone,
            'customer_email' => $command->customerEmail,
            'delivery_address' => $command->deliveryAddress,
            'delivery_notes' => $command->deliveryNotes,
            'status' => OrderStatus::EnAttente->value,
            'items' => $orderItems,
        ]);
    });
}
}