<?php
namespace App\Application\Order\UseCases\ShipOrder;

use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Domain\Order\Exceptions\OrderNotFoundException;
use App\Domain\Order\{Order, OrderStatus};

class ShipOrderUseCase
{
    public function __construct(private OrderRepositoryInterface $orders) {}

    public function execute(int $orderId): Order
    {
        $order = $this->orders->findById($orderId);
        if ($order === null) throw new OrderNotFoundException();

        $order->transitionTo(OrderStatus::Expediee);
        return $this->orders->updateStatus($orderId, OrderStatus::Expediee);
    }
}