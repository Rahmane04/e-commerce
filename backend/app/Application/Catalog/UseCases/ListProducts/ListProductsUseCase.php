<?php
namespace App\Application\Catalog\UseCases\ListProducts;

use App\Application\Catalog\Ports\ProductRepositoryInterface;

class ListProductsUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(): array
    {
        return $this->repository->findAll();
    }
}