<?php
namespace App\Infrastructure\Customer\Persistence;

use App\Domain\Customer\Customer;

class CustomerMapper
{
    public static function toDomain(CustomerModel $model): Customer
    {
        return new Customer(
            id: $model->id,
            name: $model->name,
            phone: $model->phone,
            email: $model->email,
        );
    }
}
