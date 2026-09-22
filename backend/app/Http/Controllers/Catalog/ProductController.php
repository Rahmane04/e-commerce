<?php
namespace App\Http\Controllers\Catalog;

use App\Application\Catalog\UseCases\CreateProduct\{CreateProductCommand, CreateProductUseCase};
use App\Application\Catalog\UseCases\ListProducts\ListProductsUseCase;
use App\Application\Catalog\UseCases\PublishProduct\PublishProductUseCase;
use App\Application\Catalog\UseCases\UnpublishProduct\UnpublishProductUseCase;
use App\Application\Catalog\UseCases\UpdateProduct\{UpdateProductCommand, UpdateProductUseCase};
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CreateProductRequest;
use App\Http\Requests\Catalog\UpdateProductRequest;

class ProductController extends Controller
{
    public function index(ListProductsUseCase $useCase)
    {
        $products = $useCase->execute();

        return response()->json(array_map(fn ($p) => [
            'id' => $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'priceCents' => $p->price->toCents(),
            'inStock' => $p->isInStock(),
            'isPublished' => $p->isPublished,
        ], $products));
    }

    public function store(CreateProductRequest $request, CreateProductUseCase $useCase)
    {
        $command = new CreateProductCommand(
            name: $request->string('name')->toString(),
            description: $request->string('description')->toString(),
            categoryId: (int) $request->integer('category_id'),
            priceCents: (int) $request->integer('price_cents'),
            compareAtPriceCents: $request->filled('compare_at_price_cents')
                ? (int) $request->integer('compare_at_price_cents')
                : null,
            stock: (int) $request->integer('stock'),
            images: $request->input('images', []),
            featured: $request->boolean('featured'),
            isNew: $request->boolean('is_new'),
            isPublished: $request->boolean('is_published'),
            variants: $request->input('variants', []),
        );

        $product = $useCase->execute($command);

        return response()->json([
            'id' => $product->id,
            'slug' => $product->slug,
            'name' => $product->name,
        ], 201);
    }

    public function update(UpdateProductRequest $request, int $id, UpdateProductUseCase $useCase)
    {
        $command = new UpdateProductCommand(
            productId: $id,
            name: $request->input('name'),
            description: $request->input('description'),
            categoryId: $request->has('category_id') ? (int) $request->integer('category_id') : null,
            priceCents: $request->has('price_cents') ? (int) $request->integer('price_cents') : null,
            compareAtPriceCents: $request->has('compare_at_price_cents') ? (int) $request->integer('compare_at_price_cents') : null,
            stock: $request->has('stock') ? (int) $request->integer('stock') : null,
            images: $request->input('images'),
            featured: $request->has('featured') ? $request->boolean('featured') : null,
            isNew: $request->has('is_new') ? $request->boolean('is_new') : null,
        );

        $product = $useCase->execute($command);

        return response()->json(['id' => $product->id, 'slug' => $product->slug]);
    }

    public function publish(int $id, PublishProductUseCase $useCase)
    {
        $product = $useCase->execute($id);
        return response()->json(['id' => $product->id, 'isPublished' => $product->isPublished]);
    }

    public function unpublish(int $id, UnpublishProductUseCase $useCase)
    {
        $product = $useCase->execute($id);
        return response()->json(['id' => $product->id, 'isPublished' => $product->isPublished]);
    }
}