<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class Admin extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $guard = 'admin';

    protected $fillable = [
        'name',
        'username',  
        'email',
        'password',
        'role',       
        'branch', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Send custom email verification link for Admin
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new class extends VerifyEmail {
            /**
             * Generate a signed verification URL for the Admin
             */
            protected function verificationUrl($notifiable)
            {
                return URL::temporarySignedRoute(
                    'admin.verification.verify',
                    Carbon::now()->addMinutes(60),
                    [
                        'id' => $notifiable->getKey(),
                        'hash' => sha1($notifiable->getEmailForVerification()),
                    ]
                );
            }

            /**
             * Customize the email message
             */
            public function toMail($notifiable)
            {
                return (new MailMessage)
                    ->subject('Verify Your Admin Email Address')
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email Address', $this->verificationUrl($notifiable))
                    ->line('If you did not create an account, no further action is required.');
            }
        });
    }
}
