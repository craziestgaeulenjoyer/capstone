<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacedOrder extends Model
{
    protected $table = 'placed_orders';

    protected $fillable = [
        'customer_id',
        'full_name',
        'email',
        'phone',
        'address',
        'payment_type',
        'payment_proof',
        'subtotal',
        'taxes',
        'loyalty_discount',
        'total',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'placed_order_id');
    }
}
