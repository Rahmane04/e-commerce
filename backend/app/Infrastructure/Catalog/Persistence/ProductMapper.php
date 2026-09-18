<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Domain\Catalog\Product;
use App\Domain\Catalog\ProductVariant;
use App\Domain\Catalog\ValueObjects\Money;

class ProductMapper
{
    public static function toDomain(ProductModel $model): Product
    {
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
            variants: $model->variants->map(
                fn (ProductVariantModel $v) => new ProductVariant($v->id, $v->label, $v->value, $v->stock)
            )->all(),
            stock: $model->stock,
            featured: $model->featured,
            isNew: $model->is_new,
        );
    }
}