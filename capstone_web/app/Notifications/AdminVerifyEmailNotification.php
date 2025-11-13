<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class AdminVerifyEmailNotification extends VerifyEmailBase
{
    protected function verificationUrl($notifiable)
    {
        $routeName = $notifiable->role === 'super_admin'
            ? 'superadmin.verification.verify'
            : 'admin.verification.verify';

        return URL::temporarySignedRoute(
            $routeName,
            Carbon::now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    public function toMail($notifiable)
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify your Login')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Please verify your admin login by clicking the button below:')
            ->action('Verify your Login', $url)
            ->line('If you did not attempt to login, please ignore this email.');
    }
}
