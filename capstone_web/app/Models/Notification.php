<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'action',
        'subject',
        'changed_fields',
        'performed_by',
        'is_read',
    ];

    protected $casts = [
        'changed_fields' => 'array',
        'is_read' => 'boolean',
    ];
}
