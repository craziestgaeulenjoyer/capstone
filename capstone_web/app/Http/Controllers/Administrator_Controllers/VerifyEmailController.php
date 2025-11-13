<?php

namespace App\Http\Controllers\Administrator_Controllers;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Inertia\Inertia;

class VerifyEmailController
{
    public function __invoke(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return Inertia::render('DashboardVerificationSuccess');
        }

        $request->fulfill();

        return Inertia::render('DashboardVerificationSuccess');
    }
}
