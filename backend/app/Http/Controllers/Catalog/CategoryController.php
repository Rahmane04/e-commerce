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
        $categories = $repository->findAll();
        return response()->json(array_map(fn ($c) => [
            'id' => $c->id,
            'slug' => $c->slug,
            'name' => $c->name,
            'description' => $c->description,
        ], $categories));
    }

    public function store(CreateCategoryRequest $request, CreateCategoryUseCase $useCase)
    {
        $command = new CreateCategoryCommand(
            name: $request->string('name')->toString(),
            description: $request->input('description'),
            displayOrder: (int) $request->integer('display_order'),
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