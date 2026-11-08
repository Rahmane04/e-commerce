<?php
namespace Tests\Unit;

use App\Domain\Catalog\Product;
use App\Domain\Catalog\ValueObjects\Money;
use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    private function makeProduct(array $images = [], int $stock = 3): Product
    {
        return new Product(
            id: 1,
            slug: 'robe',
            name: 'Robe',
            description: 'Une robe',
            categoryId: 1,
            price: Money::fromCents(1000000),
            compareAtPrice: null,
            images: $images,
            variants: [],
            isPublished: false,
            stock: $stock,
            featured: false,
            isNew: false,
            createdAt: '2026-10-01T00:00:00+00:00',
        );
    }

    public function test_un_produit_sans_image_ne_peut_pas_etre_publie(): void
    {
        $this->assertFalse($this->makeProduct([])->canBePublished());
    }

    public function test_un_produit_avec_image_peut_etre_publie(): void
    {
        $this->assertTrue($this->makeProduct(['https://exemple.test/a.jpg'])->canBePublished());
    }

    public function test_en_stock_selon_la_quantite(): void
    {
        $this->assertTrue($this->makeProduct([], 1)->isInStock());
        $this->assertFalse($this->makeProduct([], 0)->isInStock());
    }
}