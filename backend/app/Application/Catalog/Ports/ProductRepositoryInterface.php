<?php
namespace App\Application\Catalog\Ports;

use App\Domain\Catalog\Product;

interface ProductRepositoryInterface
{
    /** @return Product[] */
    public function findAll(): array;
    public function findBySlug(string $slug): ?Product;
    public function findById(int $id): ?Product;
    public function create(array $data): Product;
    public function decrementStock(int $productId, ?int $variantId, int $quantity): void;
    public function update(int $id, array $data): Product;
    public function publish(int $id): Product;
    public function unpublish(int $id): Product;
    public function incrementStock(int $productId, ?int $variantId, int $quantity): void;
    public function delete(int $id): void;
}