<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'customer_name',
        'rating',
        'description',
        'status',
    ];

    public $timestamps = false; // you only have created_at
}
