<?php
namespace App\Application\Order\UseCases\CancelOrder;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Domain\Order\Exceptions\OrderNotFoundException;
use App\Domain\Order\{Order, OrderStatus};

class CancelOrderUseCase
{
    public function __construct(
        private OrderRepositoryInterface $orders,
        private ProductRepositoryInterface $products,
    ) {}

    public function execute(int $orderId): Order
    {
        $order = $this->orders->findById($orderId);
        if ($order === null) throw new OrderNotFoundException();

        $order->transitionTo(OrderStatus::Annulee);

        foreach ($order->items as $item) {
            $this->products->incrementStock($item->productId, $item->variantId, $item->quantity);
        }

        return $this->orders->updateStatus($orderId, OrderStatus::Annulee);
    }
}