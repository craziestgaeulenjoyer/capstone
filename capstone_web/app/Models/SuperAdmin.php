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

class SuperAdmin extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $guard = 'super_admin';

    protected $fillable = [
        'name',
        'username',   
        'email',
        'password',
        'role',       
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Send custom email verification link for Super Admin
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new class extends VerifyEmail {
            /**
             * Generate a signed verification URL for the Super Admin
             */
            protected function verificationUrl($notifiable)
            {
                return URL::temporarySignedRoute(
                    'superadmin.verification.verify',
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
                    ->subject('Verify Your Super Admin Email Address')
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email Address', $this->verificationUrl($notifiable))
                    ->line('If you did not create an account, no further action is required.');
            }
        });
    }
}
