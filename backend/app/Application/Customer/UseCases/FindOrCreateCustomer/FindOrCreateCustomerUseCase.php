<?php
namespace App\Application\Customer\UseCases\FindOrCreateCustomer;

use App\Application\Customer\Ports\CustomerRepositoryInterface;
use App\Domain\Customer\Customer;

class FindOrCreateCustomerUseCase
{
    public function __construct(private CustomerRepositoryInterface $repository) {}

    public function execute(string $name, string $phone, ?string $email): Customer
    {
        $existing = $this->repository->findByPhone($phone);
        if ($existing !== null) {
            return $existing;
        }

        return $this->repository->create([
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
        ]);
    }
}
