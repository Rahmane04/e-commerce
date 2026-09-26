<?php
namespace App\Infrastructure\Customer\Persistence;

use App\Application\Customer\Ports\CustomerRepositoryInterface;
use App\Domain\Customer\Customer;
use Illuminate\Support\Facades\DB;

class EloquentCustomerRepository implements CustomerRepositoryInterface
{
    public function findByPhone(string $phone): ?Customer
    {
        $model = CustomerModel::where('phone', $phone)->first();
        return $model ? CustomerMapper::toDomain($model) : null;
    }

    public function findById(int $id): ?Customer
    {
        $model = CustomerModel::find($id);
        return $model ? CustomerMapper::toDomain($model) : null;
    }

    public function findAll(): array
    {
        return CustomerModel::orderBy('name')->get()
            ->map(fn ($m) => CustomerMapper::toDomain($m))->all();
    }

    public function create(array $data): Customer
    {
        return CustomerMapper::toDomain(CustomerModel::create($data));
    }

    public function getOrderStats(int $customerId): array
    {
        $result = DB::table('orders')
            ->where('customer_id', $customerId)
            ->selectRaw('COUNT(*) as order_count, COALESCE(SUM(order_items.unit_price_cents * order_items.quantity), 0) as total_spent_cents')
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->first();

        return [
            'orderCount' => (int) ($result->order_count ?? 0),
            'totalSpentCents' => (int) ($result->total_spent_cents ?? 0),
        ];
    }
}