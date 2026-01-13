<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventInquiry extends Model
{
    use HasFactory;
    protected $table = 'event_inquiries';

    protected $fillable = [
        'name',
        'phone',
        'event_type',
        'event_date',
        'estimated_pax',
        'event_location',
        'status',
    ];
}
