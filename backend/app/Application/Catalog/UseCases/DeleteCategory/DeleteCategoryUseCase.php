<?php
namespace App\Application\Catalog\UseCases\DeleteCategory;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Domain\Catalog\Exceptions\CategoryNotEmptyException;

class DeleteCategoryUseCase
{
    public function __construct(private CategoryRepositoryInterface $repository) {}

    public function execute(int $categoryId): void
    {
        // La base ne bloque pas ce cas (parent_id en nullOnDelete) : on le vérifie ici.
        foreach ($this->repository->findAll() as $category) {
            if ($category->parentId === $categoryId) {
                throw new CategoryNotEmptyException(
                    "Impossible de supprimer cette catégorie : elle contient des sous-catégories. Supprimez-les d'abord."
                );
            }
        }

        $this->repository->delete($categoryId);
    }
}