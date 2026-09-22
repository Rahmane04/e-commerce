<?php
namespace App\Application\Catalog\UseCases\UnpublishProduct;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Exceptions\ProductNotFoundException;
use App\Domain\Catalog\Product;

class UnpublishProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(int $productId): Product
    {
        if ($this->repository->findById($productId) === null) {
            throw new ProductNotFoundException();
        }
        return $this->repository->unpublish($productId);
    }
}