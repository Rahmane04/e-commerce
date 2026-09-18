<?php
namespace App\Http\Controllers\Catalog;

use App\Application\Catalog\UseCases\ListProducts\ListProductsUseCase;
use App\Http\Controllers\Controller;

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
        ], $products));
    }
}