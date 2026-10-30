<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Domain\Catalog\Category;
use App\Domain\Catalog\Exceptions\CategoryNotEmptyException;
use Illuminate\Database\QueryException;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function findAll(): array
    {
        return CategoryModel::orderBy('display_order')->get()
            ->map(fn ($m) => CategoryMapper::toDomain($m))->all();
    }

    public function findBySlug(string $slug): ?Category
    {
        $model = CategoryModel::where('slug', $slug)->first();
        return $model ? CategoryMapper::toDomain($model) : null;
    }

    public function create(array $data): Category
    {
            $model = CategoryModel::create($data);
            return CategoryMapper::toDomain($model);
            }
    public function update(int $id, array $data): Category
    {
        $model = CategoryModel::findOrFail($id);
        $model->update($data);
        return CategoryMapper::toDomain($model);
    }
        public function delete(int $id): void
    {
        try {
            CategoryModel::findOrFail($id)->delete();
        } catch (QueryException $e) {
            if ($e->getCode() === '23503') {
                throw new CategoryNotEmptyException(
                    "Impossible de supprimer cette catégorie : elle contient des produits. Déplacez-les ou supprimez-les d'abord."
                );
            }
            throw $e;
        }
    }
}