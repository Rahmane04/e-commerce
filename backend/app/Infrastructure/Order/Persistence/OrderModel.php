<?php
namespace App\Infrastructure\Order\Persistence;

use Illuminate\Database\Eloquent\Model;

class OrderModel extends Model
{
    protected $table = 'orders';
    protected $fillable = ['customer_id','customer_name', 'customer_phone', 'customer_email', 'delivery_address', 'delivery_notes', 'status'];

    public function items()
    {
        return $this->hasMany(OrderItemModel::class, 'order_id');
    }
}