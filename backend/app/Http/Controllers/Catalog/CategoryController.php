<?php
namespace App\Http\Controllers\Catalog;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Application\Catalog\UseCases\CreateCategory\{CreateCategoryCommand, CreateCategoryUseCase};
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CreateCategoryRequest;

class CategoryController extends Controller
{
    public function index(CategoryRepositoryInterface $repository)
    {
        $all = $repository->findAll();

        $roots = array_values(array_filter($all, fn ($c) => $c->parentId === null));
        $childrenOf = fn (int $parentId) => array_values(array_filter($all, fn ($c) => $c->parentId === $parentId));

        return response()->json(array_map(fn ($root) => [
            'id' => $root->id,
            'slug' => $root->slug,
            'name' => $root->name,
            'description' => $root->description,
            'subcategories' => array_map(fn ($child) => [
                'id' => $child->id,
                'slug' => $child->slug,
                'name' => $child->name,
                'description' => $child->description,
            ], $childrenOf($root->id)),
        ], $roots));
    }

    public function store(CreateCategoryRequest $request, CreateCategoryUseCase $useCase)
    {
        $command = new CreateCategoryCommand(
            name: $request->string('name')->toString(),
            description: $request->input('description'),
            displayOrder: (int) $request->integer('display_order'),
            parentId: $request->has('parent_id') ? (int) $request->integer('parent_id') : null,
        );

        $category = $useCase->execute($command);

        return response()->json([
            'id' => $category->id,
            'slug' => $category->slug,
            'name' => $category->name,
        ], 201);
    }
    public function update(string $slug, Request $request, CategoryRepositoryInterface $repository)
    {
    $category = $repository->findBySlug($slug);
    if ($category === null) {
        return response()->json(['message' => 'Catégorie introuvable.'], 404);
    }

    $validated = $request->validate([
        'name' => ['sometimes', 'string', 'max:255'],
        'description' => ['sometimes', 'nullable', 'string'],
        'display_order' => ['sometimes', 'integer', 'min:0'],
    ]);

    $updated = $repository->update($category->id, $validated);
    return response()->json(['slug' => $updated->slug, 'name' => $updated->name]);
    }

    public function destroy(string $slug, CategoryRepositoryInterface $repository)
    {
        $category = $repository->findBySlug($slug);
        if ($category === null) {
            return response()->json(['message' => 'Catégorie introuvable.'], 404);
        }

        $repository->delete($category->id);
        return response()->json(null, 204);
    }
}