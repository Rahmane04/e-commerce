<?php
namespace App\Application\Catalog\Ports;

use App\Domain\Catalog\Category;

interface CategoryRepositoryInterface
{
    /** @return Category[] */
    public function findAll(): array;
    public function findBySlug(string $slug): ?Category;
    public function create(array $data): Category;
}    