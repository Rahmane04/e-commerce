<?php
namespace App\Infrastructure\Catalog\Persistence;

use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $casts = ['images' => 'array'];
    protected $fillable = [
        'slug', 'name', 'description', 'category_id',
        'price_cents', 'compare_at_price_cents', 'stock',
        'images', 'featured', 'is_new',
    ];

    public function category()
    {
        return $this->belongsTo(CategoryModel::class, 'category_id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariantModel::class, 'product_id');
    }
}