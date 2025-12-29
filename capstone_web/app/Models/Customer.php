<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ✅ Add this

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ✅ Add HasApiTokens

    protected $fillable = [
        'full_name',
        'email',
        'password_hash',
        'phone_number',
        'gender',
        'birthday',
        'email_verified',
        'otp_code',
        'otp_token',
        'otp_expiry',
        'password_otp_code',
        'password_otp_token',
        'password_otp_expiry',
        'remember_token',
        'login_token',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
        'login_token',
        'otp_token',
        'password_otp_token',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'otp_expiry' => 'datetime',
        'password_otp_expiry' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
