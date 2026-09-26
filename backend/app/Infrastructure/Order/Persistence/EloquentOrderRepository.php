<?php
namespace App\Infrastructure\Order\Persistence;

use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Domain\Order\{Order, OrderStatus};

class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function create(array $data): Order
    {
        $items = $data['items'];
        unset($data['items']);

        $order = OrderModel::create($data);
        $order->items()->createMany($items);

        return OrderMapper::toDomain($order->fresh('items'));
    }

    public function findById(int $id): ?Order
    {
        $model = OrderModel::with('items')->find($id);
        return $model ? OrderMapper::toDomain($model) : null;
    }

    public function findAll(): array
    {
        return OrderModel::with('items')->latest()->get()
            ->map(fn ($m) => OrderMapper::toDomain($m))->all();
    }

    public function updateStatus(int $id, OrderStatus $status): Order
    {
        $model = OrderModel::findOrFail($id);
        $model->update(['status' => $status->value]);
        return OrderMapper::toDomain($model->fresh('items'));
    }
    public function findByCustomerId(int $customerId): array
    {
        return OrderModel::with('items')->where('customer_id', $customerId)->latest()->get()->map(fn ($m) => OrderMapper::toDomain($m))->all();
        }
}