<?php
namespace App\Domain\Catalog;

final class ProductVariant
{
    public function __construct(
        public readonly int $id,
        public readonly string $label,
        public readonly string $value,
        public readonly int $stock,
    ) {}
}