<?php
namespace App\Application\Customer\Ports;

use App\Domain\Customer\Customer;

interface CustomerRepositoryInterface
{
    public function findByPhone(string $phone): ?Customer;
    public function findById(int $id): ?Customer;
    /** @return Customer[] */
    public function findAll(): array;
    public function create(array $data): Customer;
    /** @return array{orderCount: int, totalSpentCents: int} */
    public function getOrderStats(int $customerId): array;
}
