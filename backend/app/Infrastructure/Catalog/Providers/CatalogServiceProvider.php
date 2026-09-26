<?php
namespace App\Infrastructure\Catalog\Providers;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Infrastructure\Catalog\Persistence\EloquentProductRepository;
use Illuminate\Support\ServiceProvider;
use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Infrastructure\Catalog\Persistence\EloquentCategoryRepository;

class CatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, EloquentCategoryRepository::class);
        }
}