<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    // Specify the database table
    protected $table = 'cart_items';

    protected $fillable = [
        'customer_id',
        'product_id',
        'product_name',
        'size',
        'quantity',
        'instructions',
        'price',
    ];
    
}
