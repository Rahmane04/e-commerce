<?php
namespace App\Domain\Customer;

final class Customer
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $phone,
        public readonly ?string $email,
    ) {}
}