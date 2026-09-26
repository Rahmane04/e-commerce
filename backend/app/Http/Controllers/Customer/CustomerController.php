<?php
namespace App\Http\Controllers\Customer;

use App\Application\Customer\Ports\CustomerRepositoryInterface;
use App\Application\Customer\UseCases\GetCustomerOrderHistory\GetCustomerOrderHistoryUseCase;
use App\Domain\Customer\Customer;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    public function __construct(private CustomerRepositoryInterface $customers) {}

    private function toJson(Customer $customer): array
    {
        $stats = $this->customers->getOrderStats($customer->id);
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'email' => $customer->email,
            'orderCount' => $stats['orderCount'],
            'totalSpentCents' => $stats['totalSpentCents'],
        ];
    }

    public function index()
    {
        return response()->json(array_map(fn ($c) => $this->toJson($c), $this->customers->findAll()));
    }

    public function show(int $id, GetCustomerOrderHistoryUseCase $historyUseCase)
    {
        $customer = $this->customers->findById($id);
        if ($customer === null) {
            return response()->json(['message' => 'Client introuvable.'], 404);
        }

        $orders = $historyUseCase->execute($id);

        return response()->json([
            ...$this->toJson($customer),
            'orders' => array_map(fn ($o) => [
                'id' => $o->id,
                'status' => $o->status->value,
                'totalCents' => $o->total()->toCents(),
            ], $orders),
        ]);
    }
}