<?php
namespace App\Application\Catalog\UseCases\UpdateProduct;

final class UpdateProductCommand
{
    public function __construct(
        public readonly int $productId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?int $categoryId = null,
        public readonly ?int $priceCents = null,
        public readonly ?int $compareAtPriceCents = null,
        public readonly ?int $stock = null,
        public readonly ?array $images = null,
        public readonly ?bool $featured = null,
        public readonly ?bool $isNew = null,
    ) {}
}