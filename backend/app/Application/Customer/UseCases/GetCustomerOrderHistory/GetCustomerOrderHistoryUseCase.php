<?php
namespace App\Application\Customer\UseCases\GetCustomerOrderHistory;

use App\Application\Order\Ports\OrderRepositoryInterface;

class GetCustomerOrderHistoryUseCase
{
    public function __construct(private OrderRepositoryInterface $orders) {}

    public function execute(int $customerId): array
    {
        return $this->orders->findByCustomerId($customerId);
    }
}
