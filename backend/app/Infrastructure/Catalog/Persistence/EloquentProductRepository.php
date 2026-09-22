<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Exceptions\OutOfStockException;
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
        $variants = $data['variants'] ?? [];
        unset($data['variants']);

        $model = ProductModel::create($data);

        if (!empty($variants)) {
            $model->variants()->createMany($variants);
        }

        return ProductMapper::toDomain($model->fresh('variants'));
    }

    public function update(int $id, array $data): Product
    {
        $model = ProductModel::findOrFail($id);
        $model->update($data);
        return ProductMapper::toDomain($model->fresh('variants'));
    }

    public function publish(int $id): Product
    {
        $model = ProductModel::findOrFail($id);
        $model->update(['is_published' => true]);
        return ProductMapper::toDomain($model->fresh('variants'));
    }

    public function unpublish(int $id): Product
    {
        $model = ProductModel::findOrFail($id);
        $model->update(['is_published' => false]);
        return ProductMapper::toDomain($model->fresh('variants'));
    }

    public function decrementStock(int $productId, ?int $variantId, int $quantity): void
    {
        $affected = $variantId !== null
            ? DB::table('product_variants')->where('id', $variantId)->where('stock', '>=', $quantity)->decrement('stock', $quantity)
            : DB::table('products')->where('id', $productId)->where('stock', '>=', $quantity)->decrement('stock', $quantity);

        if ($affected === 0) {
            throw new OutOfStockException("Stock insuffisant pour le produit #{$productId}.");
        }
    }

    public function incrementStock(int $productId, ?int $variantId, int $quantity): void
    {
        if ($variantId !== null) {
            DB::table('product_variants')->where('id', $variantId)->increment('stock', $quantity);
        } else {
            DB::table('products')->where('id', $productId)->increment('stock', $quantity);
        }
    }
}