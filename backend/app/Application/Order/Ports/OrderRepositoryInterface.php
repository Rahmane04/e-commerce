<?php
namespace App\Application\Order\Ports;

use App\Domain\Order\{Order, OrderStatus};

interface OrderRepositoryInterface
{
    public function create(array $data): Order;
    public function findById(int $id): ?Order;
    /** @return Order[] */
    public function findAll(): array;
    public function updateStatus(int $id, OrderStatus $status): Order;
    /** @return Order[] */
    public function findByCustomerId(int $customerId): array;
}