<?php
namespace App\Infrastructure\Catalog\Persistence;

use Illuminate\Database\Eloquent\Model;

class CategoryModel extends Model
{
    protected $table = 'categories';
    protected $fillable = ['slug', 'name', 'description', 'display_order'];
}