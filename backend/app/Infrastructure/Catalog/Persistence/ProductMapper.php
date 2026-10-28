<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Domain\Catalog\Product;
use App\Domain\Catalog\ProductVariant;
use App\Domain\Catalog\ValueObjects\Money;

class ProductMapper
{
    public static function toDomain(ProductModel $model): Product
    {
        $variants = $model->variants->map(
            fn (ProductVariantModel $v) => new ProductVariant($v->id, $v->label, $v->value, $v->stock)
        )->all();

        // Règle : avec des variantes, le stock du produit est la somme de leurs stocks
        // (calculée, donc jamais en désaccord). Sans variante, on garde la colonne products.stock.
        $stock = count($variants) > 0
            ? array_sum(array_map(fn (ProductVariant $v) => $v->stock, $variants))
            : $model->stock;

        return new Product(
            id: $model->id,
            slug: $model->slug,
            name: $model->name,
            description: $model->description,
            categoryId: $model->category_id,
            price: Money::fromCents($model->price_cents),
            compareAtPrice: $model->compare_at_price_cents !== null
                ? Money::fromCents($model->compare_at_price_cents)
                : null,
            images: $model->images ?? [],
            variants: $variants,
            stock: $stock,
            featured: $model->featured,
            isNew: $model->is_new,
            isPublished: $model->is_published,
            createdAt: $model->created_at->toIso8601String(),
        );
    }
}
