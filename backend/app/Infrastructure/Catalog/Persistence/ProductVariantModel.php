<?php
namespace App\Infrastructure\Catalog\Persistence;

use Illuminate\Database\Eloquent\Model;

class ProductVariantModel extends Model
{
    protected $table = 'product_variants';
    protected $fillable = ['product_id', 'label', 'value', 'stock'];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }
}