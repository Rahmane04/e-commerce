<?php
namespace App\Infrastructure\Order\Providers;

use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Infrastructure\Order\Persistence\EloquentOrderRepository;
use Illuminate\Support\ServiceProvider;

class OrderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);
    }
}