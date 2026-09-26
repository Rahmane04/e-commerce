<?php
namespace App\Domain\Catalog;

use App\Domain\Catalog\ValueObjects\Money;

final class Product
{
    /** @param ProductVariant[] $variants */
    public function __construct(
        public readonly int $id,
        public readonly string $slug,
        public readonly string $name,
        public readonly string $description,
        public readonly int $categoryId,
        public readonly Money $price,
        public readonly ?Money $compareAtPrice,
        public readonly array $images,
        public readonly array $variants,
        public readonly bool $isPublished,
        public readonly int $stock,
        public readonly bool $featured,
        public readonly bool $isNew,
        public readonly string $createdAt,

    ) {}

    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    public function isOnSale(): bool
    {
        return $this->compareAtPrice !== null
            && $this->compareAtPrice->isGreaterThan($this->price);
    }
    public function canBePublished(): bool
    {
        return count($this->images) > 0;
        }
}