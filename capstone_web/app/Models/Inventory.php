<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'supplier',
        'quantity',
        'unit',
        'expiry',
        'status',
        'archived',
    ];

    protected $casts = [
        'archived' => 'boolean',
        'quantity' => 'integer',
    ];
}
