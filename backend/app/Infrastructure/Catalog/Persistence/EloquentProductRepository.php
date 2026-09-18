<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Product;
use Illuminate\Support\Facades\DB;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function findAll(): array
    {
        return ProductModel::with('variants')->get()
            ->map(fn ($m) => ProductMapper::toDomain($m))->all();
    }

    public function findBySlug(string $slug): ?Product
    {
        $model = ProductModel::with('variants')->where('slug', $slug)->first();
        return $model ? ProductMapper::toDomain($model) : null;
    }

    public function findById(int $id): ?Product
    {
        $model = ProductModel::with('variants')->find($id);
        return $model ? ProductMapper::toDomain($model) : null;
    }

    public function create(array $data): Product
    {
        $model = ProductModel::create($data);
        return ProductMapper::toDomain($model->fresh('variants'));
    }

    public function decrementStock(int $productId, ?int $variantId, int $quantity): void
    {
        if ($variantId !== null) {
            $affected = DB::table('product_variants')
                ->where('id', $variantId)
                ->where('stock', '>=', $quantity)
                ->decrement('stock', $quantity);
        } else {
            $affected = DB::table('products')
                ->where('id', $productId)
                ->where('stock', '>=', $quantity)
                ->decrement('stock', $quantity);
        }

        if ($affected === 0) {
            throw new \RuntimeException("Stock insuffisant pour le produit #{$productId}");
        }
    }
}