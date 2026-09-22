<?php
namespace App\Application\Catalog\UseCases\CreateProduct;

final class CreateProductCommand
{
    /** @param array<int, array{label: string, value: string, stock: int}> $variants */
    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly int $categoryId,
        public readonly int $priceCents,
        public readonly ?int $compareAtPriceCents,
        public readonly int $stock,
        public readonly array $images,
        public readonly bool $featured,
        public readonly bool $isNew,
        public readonly array $variants = [],
    ) {}
}