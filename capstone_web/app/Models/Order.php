<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'payment_method',
        'total_amount',
        'status',
        'transaction_id',
        'order_code',
        'customer_name',
        'customer_email',
        'customer_address',
        'source_id',
        'items',
        'created_at'
    ];

    protected $casts = [
        'items' => 'array', // automatically cast JSONB items to array
        'created_at' => 'datetime',
    ];
}
