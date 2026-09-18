<?php
namespace App\Infrastructure\Catalog\Providers;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Infrastructure\Catalog\Persistence\EloquentProductRepository;
use Illuminate\Support\ServiceProvider;

class CatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
    }
}