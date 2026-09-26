<?php
namespace App\Http\Controllers\Catalog;

use App\Application\Catalog\Ports\CategoryRepositoryInterface;
use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Application\Catalog\UseCases\CreateProduct\{CreateProductCommand, CreateProductUseCase};
use App\Application\Catalog\UseCases\ListProducts\ListProductsUseCase;
use App\Application\Catalog\UseCases\PublishProduct\PublishProductUseCase;
use App\Application\Catalog\UseCases\UnpublishProduct\UnpublishProductUseCase;
use App\Application\Catalog\UseCases\UpdateProduct\{UpdateProductCommand, UpdateProductUseCase};
use App\Domain\Catalog\Exceptions\ProductNotFoundException;
use App\Domain\Catalog\Product;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CreateProductRequest;
use App\Http\Requests\Catalog\UpdateProductRequest;
use Illuminate\Http\Request;
use App\Application\Catalog\UseCases\DeleteProduct\DeleteProductUseCase;

class ProductController extends Controller
{
    public function __construct(private CategoryRepositoryInterface $categories) {}

    /** @return array<int, string> id de catégorie => slug */
    private function categorySlugMap(): array
    {
        $map = [];
        foreach ($this->categories->findAll() as $category) {
            $map[$category->id] = $category->slug;
        }
        return $map;
    }

    private function toJson(Product $p, array $categorySlugs): array
    {
        return [
            'id' => (string) $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'description' => $p->description,
            'categorySlug' => $categorySlugs[$p->categoryId] ?? null,
            'priceCents' => $p->price->toCents(),
            'compareAtPriceCents' => $p->compareAtPrice?->toCents(),
            'images' => array_map(fn ($url) => ['url' => $url, 'alt' => $p->name], $p->images),
            'variants' => array_map(fn ($v) => [
                'id' => (string) $v->id,
                'label' => $v->label,
                'value' => $v->value,
                'stock' => $v->stock,
            ], $p->variants),
            'stock' => $p->stock,
            'featured' => $p->featured,
            'isNew' => $p->isNew,
            'isPublished' => $p->isPublished,
            'createdAt' => $p->createdAt,
        ];
    }

    public function index(Request $request, ListProductsUseCase $useCase)
    {
        $products = $useCase->execute();
        $categorySlugs = $this->categorySlugMap();

        if ($request->filled('category')) {
            $target = $request->string('category')->toString();
            $products = array_values(array_filter(
                $products,
                fn ($p) => ($categorySlugs[$p->categoryId] ?? null) === $target
            ));
        }

        if ($request->boolean('featured')) {
            $products = array_values(array_filter($products, fn ($p) => $p->featured));
        }

        if ($request->filled('search')) {
            $q = mb_strtolower($request->string('search')->toString());
            $products = array_values(array_filter(
                $products,
                fn ($p) => str_contains(mb_strtolower($p->name), $q)
                    || str_contains(mb_strtolower($p->description), $q)
            ));
        }

        return response()->json(array_map(fn ($p) => $this->toJson($p, $categorySlugs), $products));
    }

    public function show(string $slug, ProductRepositoryInterface $repository)
    {
        $product = $repository->findBySlug($slug);
        if ($product === null) {
            throw new ProductNotFoundException();
        }
        return response()->json($this->toJson($product, $this->categorySlugMap()));
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
            variants: $request->input('variants', []),
        );

        $product = $useCase->execute($command);
        return response()->json(['id' => $product->id, 'slug' => $product->slug, 'name' => $product->name], 201);
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
    public function showById(int $id, ProductRepositoryInterface $repository)
    {
        $product = $repository->findById($id);
        if ($product === null) {
            throw new \App\Domain\Catalog\Exceptions\ProductNotFoundException();
        }
        return response()->json($this->toJson($product, $this->categorySlugMap()));
    }

    public function destroy(int $id, DeleteProductUseCase $useCase)
    {
        $useCase->execute($id);
        return response()->json(null, 204);
    }
}