<?php
namespace App\Application\Catalog\UseCases\DeleteProduct;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Exceptions\ProductNotFoundException;

class DeleteProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(int $productId): void
    {
        if ($this->repository->findById($productId) === null) {
            throw new ProductNotFoundException();
        }
        $this->repository->delete($productId);
    }
}