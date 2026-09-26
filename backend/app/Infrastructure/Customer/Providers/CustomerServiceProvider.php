<?php
namespace App\Infrastructure\Customer\Providers;

use App\Application\Customer\Ports\CustomerRepositoryInterface;
use App\Infrastructure\Customer\Persistence\EloquentCustomerRepository;
use Illuminate\Support\ServiceProvider;

class CustomerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerRepositoryInterface::class, EloquentCustomerRepository::class);
    }
}