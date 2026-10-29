<?php
namespace App\Application\Catalog\UseCases\ListProducts;

use App\Application\Catalog\Ports\ProductRepositoryInterface;

class ListProductsUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    /** Le public ne voit que le publié ; l'admin peut tout voir (brouillons inclus). */
    public function execute(bool $includeDrafts = false): array
    {
        $products = $this->repository->findAll();

        if ($includeDrafts) {
            return $products;
        }

        return array_values(array_filter($products, fn ($p) => $p->isPublished));
    }
}