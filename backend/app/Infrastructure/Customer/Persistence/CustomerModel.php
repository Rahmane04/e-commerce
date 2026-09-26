<?php
namespace App\Infrastructure\Customer\Persistence;

use Illuminate\Database\Eloquent\Model;

class CustomerModel extends Model
{
    protected $table = 'customers';
    protected $fillable = ['name', 'phone', 'email'];
}
