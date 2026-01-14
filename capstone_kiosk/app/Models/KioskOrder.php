<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KioskOrder extends Model
{
    protected $table = 'kiosk_orders';

    protected $fillable = [
        'order_number',
        'customer_name',
        'payment_method',
        'total_price',
        'cart_items',
        'status'
    ];

    protected $casts = [
        'cart_items' => 'array',
    ];
}
