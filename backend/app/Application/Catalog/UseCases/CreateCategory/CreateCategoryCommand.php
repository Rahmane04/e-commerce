<?php
namespace App\Application\Catalog\UseCases\CreateCategory;

final class CreateCategoryCommand
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly int $displayOrder = 0,
        public readonly ?int $parentId = null,
    ) {}
}