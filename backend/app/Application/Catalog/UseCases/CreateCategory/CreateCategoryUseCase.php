<?php
namespace App\Application\Catalog\UseCases\CreateCategory;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Domain\Catalog\Category;
use Illuminate\Support\Str;

class CreateCategoryUseCase
{
    public function __construct(private CategoryRepositoryInterface $repository) {}

    public function execute(CreateCategoryCommand $command): Category
    {
        return $this->repository->create([
            'slug' => $this->generateUniqueSlug($command->name),
            'name' => $command->name,
            'description' => $command->description,
            'display_order' => $command->displayOrder,
            'parent_id' => $command->parentId,
        ]);
    }

    private function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while ($this->repository->findBySlug($slug) !== null) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}