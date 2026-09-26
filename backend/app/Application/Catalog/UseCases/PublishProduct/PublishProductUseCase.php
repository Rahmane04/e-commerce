<?php
namespace App\Application\Catalog\UseCases\PublishProduct;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Exceptions\{CannotPublishProductException, ProductNotFoundException};
use App\Domain\Catalog\Product;

class PublishProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(int $productId): Product
    {
        $product = $this->repository->findById($productId);
        if ($product === null) {
            throw new ProductNotFoundException();
        }

        if (!$product->canBePublished()) {
            throw new CannotPublishProductException();
        }

        return $this->repository->publish($productId);
    }
}   