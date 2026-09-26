<?php
namespace App\Infrastructure\Order\Persistence;

use Illuminate\Database\Eloquent\Model;

class OrderItemModel extends Model
{
    protected $table = 'order_items';
    protected $fillable = ['order_id', 'product_id', 'variant_id', 'product_name', 'variant_label', 'variant_value', 'unit_price_cents', 'quantity'];
}