<?php
namespace App\Application\Catalog\UseCases\UpdateProduct;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Exceptions\ProductNotFoundException;
use App\Domain\Catalog\Product;

class UpdateProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(UpdateProductCommand $command): Product
    {
        if ($this->repository->findById($command->productId) === null) {
            throw new ProductNotFoundException();
        }

        $data = array_filter([
            'name' => $command->name,
            'description' => $command->description,
            'category_id' => $command->categoryId,
            'price_cents' => $command->priceCents,
            'compare_at_price_cents' => $command->compareAtPriceCents,
            'stock' => $command->stock,
            'images' => $command->images,
            'featured' => $command->featured,
            'is_new' => $command->isNew,
        ], fn ($v) => $v !== null);

        return $this->repository->update($command->productId, $data);
    }
}