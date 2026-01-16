<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KioskOrder extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'order_code',
        'user_id', 
        'customer_name',
        'payment_method',
        'fulfillment_method',
        'total_amount',
        'items',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
