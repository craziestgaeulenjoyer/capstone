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
        'is_available',
        'max_quantity',
    ];

    protected $casts = [
        'price' => 'array',
        'categories' => 'array',
        'subcategories' => 'array',
        'recipe' => 'array',
    ];

    protected $appends = ['availability_status'];

    public function getAvailabilityStatusAttribute(): string
    {
        return $this->is_available ? 'Available' : 'Not Available';
    }
}
