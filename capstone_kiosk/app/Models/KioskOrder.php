<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KioskOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'payment_method',
        'total_price',
        'cart_items',
    ];

    protected $casts = [
        'cart_items' => 'array',
    ];
}

