<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Models\Admin;
use App\Models\SuperAdmin;

class ForgotPasswordController extends Controller
{
    /**
     * STEP 1
     * Send 6-digit OTP to email
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = $this->findUserByEmail($request->email);

        if (!$user) {
            return response()->json([
                'message' => 'No account found with this email.'
            ], 404);
        }

        $otp = random_int(100000, 999999);

        Cache::put(
            $this->otpCacheKey($request->email),
            [
                'otp' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
            ],
            now()->addMinutes(10)
        );

        Mail::raw(
            "Your Mi Amore Café password reset code is: {$otp}\n\nThis code expires in 10 minutes.",
            function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Mi Amore Café Password Reset Code');
            }
        );

        return response()->json([
            'message' => 'Verification code sent.'
        ]);
    }

    /**
     * STEP 2
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|digits:6',
        ]);

        $cached = Cache::get($this->otpCacheKey($request->email));

        if (!$cached) {
            return response()->json([
                'message' => 'Verification code expired. Please request a new one.'
            ], 400);
        }

        if (Carbon::now()->greaterThan($cached['expires_at'])) {
            Cache::forget($this->otpCacheKey($request->email));
            return response()->json([
                'message' => 'Verification code expired.'
            ], 400);
        }

        if (!Hash::check($request->otp, $cached['otp'])) {
            return response()->json([
                'message' => 'Invalid verification code.'
            ], 400);
        }

        return response()->json([
            'message' => 'Verification successful.'
        ]);
    }

    /**
     * STEP 3
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'otp'                   => 'required|digits:6',
            'password'              => 'required|min:8|confirmed',
        ]);

        $cached = Cache::get($this->otpCacheKey($request->email));

        if (!$cached || !Hash::check($request->otp, $cached['otp'])) {
            return response()->json([
                'message' => 'Invalid or expired verification code.'
            ], 400);
        }

        $user = $this->findUserByEmail($request->email);

        if (!$user) {
            return response()->json([
                'message' => 'User no longer exists.'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->setRememberToken(Str::random(60));
        $user->save();

        Cache::forget($this->otpCacheKey($request->email));

        return response()->json([
            'message' => 'Password reset successful.'
        ]);
    }

    /**
     * Find Admin or Super Admin by email
     */
    private function findUserByEmail(string $email)
    {
        return Admin::where('email', $email)->first()
            ?? SuperAdmin::where('email', $email)->first();
    }

    /**
     * Cache key helper
     */
    private function otpCacheKey(string $email): string
    {
        return 'password_reset_otp_' . sha1($email);
    }
}
