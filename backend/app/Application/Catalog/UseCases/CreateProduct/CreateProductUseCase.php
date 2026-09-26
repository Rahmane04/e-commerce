<?php
namespace App\Application\Catalog\UseCases\CreateProduct;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Domain\Catalog\Product;
use Illuminate\Support\Str;

class CreateProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(CreateProductCommand $command): Product
    {
        return $this->repository->create([
            'slug' => $this->generateUniqueSlug($command->name),
            'name' => $command->name,
            'description' => $command->description,
            'category_id' => $command->categoryId,
            'price_cents' => $command->priceCents,
            'compare_at_price_cents' => $command->compareAtPriceCents,
            'stock' => $command->stock,
            'images' => $command->images,
            'featured' => $command->featured,
            'is_new' => $command->isNew,
            'variants' => $command->variants,
        ]);
    }

    private function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        // Si "robe-wax" existe déjà, on essaie "robe-wax-2", "robe-wax-3"...
        while ($this->repository->findBySlug($slug) !== null) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}