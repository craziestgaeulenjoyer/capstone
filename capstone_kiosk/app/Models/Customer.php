<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';

    protected $primaryKey = 'id';

    public $timestamps = false; 
    protected $fillable = [
        'email',
        'password_hash',
        'remember_token',
        'login_token',
        'otp_code',
        'otp_token',
        'email_verified',
        'password_otp_code',
        'password_otp_token',
        'otp_expiry',
        'password_otp_expiry',
        'full_name',
        'gender',
        'birthday',
        'phone_number',
        'profile_picture',
        'logged_in_at',
        'api_token',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'birthday'       => 'date',
        'otp_expiry'     => 'datetime',
        'password_otp_expiry' => 'datetime',
        'logged_in_at'   => 'datetime',
    ];

    /**
     * Relationship: Customer has many orders
     */
    public function orders()
    {
        return $this->hasMany(KioskOrder::class, 'user_id', 'id');
    }
}
