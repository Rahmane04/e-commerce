<?php
namespace App\Domain\Catalog;

final class Category
{
    public function __construct(
        public readonly int $id,
        public readonly string $slug,
        public readonly string $name,
        public readonly ?string $description,
        public readonly int $displayOrder,
    ) {}
}