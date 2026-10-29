<?php
namespace App\Infrastructure\Catalog\Providers;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Application\Catalog\Ports\ImageStorageInterface;
use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Infrastructure\Catalog\Persistence\EloquentCategoryRepository;
use App\Infrastructure\Catalog\Persistence\EloquentProductRepository;
use App\Infrastructure\Catalog\Storage\CloudinaryImageStorage;
use App\Infrastructure\Catalog\Storage\LocalImageStorage;
use Illuminate\Support\ServiceProvider;

class CatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, EloquentCategoryRepository::class);

        // Choix de l'adapter de stockage d'images selon IMAGE_STORAGE_DRIVER (config/images.php).
        $this->app->bind(ImageStorageInterface::class, fn () => match (config('images.driver')) {
            'cloudinary' => new CloudinaryImageStorage(),
            default => new LocalImageStorage(),
        });
    }
}