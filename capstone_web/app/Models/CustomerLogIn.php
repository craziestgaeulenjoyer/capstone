<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class CustomerLogin extends Authenticatable
{
    use Notifiable;

  
    protected $table = 'customers';


    protected $fillable = [
        'email',
        'password_hash',
        'remember_token',
        'login_token',
        'otp_code',
        'otp_token',
        'email_verified',
        'full_name',
        'gender',
        'birthday',
        'phone_number',
        'password_otp_code',
        'password_otp_token',
        'otp_expiry',
        'password_otp_expiry',
    ];

    
    protected $hidden = [
        'password_hash',
        'remember_token',
        'otp_code',
        'otp_token',
        'password_otp_code',
        'password_otp_token',
    ];


    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
