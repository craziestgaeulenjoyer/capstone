<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    protected $fillable = [
        'inventory_id',
        'action',
        'changed_fields',
        'performed_by',
    ];

    protected $casts = [
        'changed_fields' => 'array',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}
