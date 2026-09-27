<?php
namespace App\Infrastructure\Catalog\Persistence;

use App\Domain\Catalog\Category;

class CategoryMapper
{
    public static function toDomain(CategoryModel $model): Category
    {
        return new Category(
            id: $model->id,
            slug: $model->slug,
            name: $model->name,
            description: $model->description,
            displayOrder: $model->display_order,
            parentId: $model->parent_id,
        ); 
    }
}