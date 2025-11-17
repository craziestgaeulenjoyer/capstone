<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'price',
        'categories',
        'subcategories',
        'description',
        'image_path',
    ];

    protected $casts = [
        'price' => 'array',
        'categories' => 'array',
        'subcategories' => 'array',
    ];
}
