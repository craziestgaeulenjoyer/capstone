<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'placed_order_id',
        'product_name',
        'size',
        'flavor',
        'add_on',
        'quantity',
        'price',
    ];
}
