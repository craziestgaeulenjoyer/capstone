<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class CustomerSignup extends Model
{
    
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $table = 'customers';

    protected $fillable = [
        'email',
        'password_hash',
        'full_name',
        'gender',
        'birthday',
        'phone_number',
        'otp_code',
        'otp_token',
        'email_verified',
        'remember_token',
        'login_token',
    ];

  
    public function setPasswordHashAttribute($value)
    {
        $this->attributes['password_hash'] = Hash::make($value);
    }
}
