<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Admin;
use App\Models\SuperAdmin;

class ProfileController extends Controller
{
    /**
     * STEP 1: Request email change (authenticated)
     */
    public function requestEmailChange(Request $request)
    {
        $user = auth()->user();

        $token = Str::uuid()->toString();

        DB::table('email_change_tokens')->insert([
            'user_id' => $user->id,
            'email' => $user->email, 
            'user_type' => $user instanceof SuperAdmin ? 'super_admin' : 'admin',
            'token' => $token,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Mail::send('email.email-change-verification', [
            'email' => $user->email,
            'changeUrl' => url("/email-change/confirm/{$token}"),
            'denyUrl' => url("/email-change/deny?token={$token}"),
        ], function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Confirm Your Email Change');
        });

        return response()->json([
            'message' => 'Verification email sent'
        ]);
    }

    public function verifyEmailChangeToken(string $token)
    {
        $record = DB::table('email_change_tokens')
            ->where('token', $token)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            abort(403, 'Invalid or expired email change link.');
        }

        // Mark token as verified (email was clicked)
        DB::table('email_change_tokens')
            ->where('id', $record->id)
            ->update([
                'verified_at' => now(),
                'updated_at' => now(),
            ]);

        // Redirect to React page
        return redirect()->to(
            config('app.frontend_url') . "/email-change?token={$token}"
        );
    }

    /**
     * STEP 2: Deny email change (email link)
     */
    public function denyEmailChange(Request $request)
    {
        $token = $request->query('token');

        DB::table('email_change_tokens')
            ->where('token', $token)
            ->update([
                'used' => true,
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Email change request denied.',
        ]);
    }

    public function finalizeEmailChange(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|unique:admins,email|unique:super_admins,email',
        ]);

        $record = DB::table('email_change_tokens')
            ->where('token', $request->token)
            ->whereNotNull('verified_at')
            ->where('used', false)
            ->first();

        if (!$record) {
            abort(403, 'Invalid or expired token.');
        }

        if ($record->user_type === 'super_admin') {
            SuperAdmin::where('id', $record->user_id)->update([
                'email' => $request->email,
                'email_verified_at' => now(),
            ]);
        } else {
            Admin::where('id', $record->user_id)->update([
                'email' => $request->email,
                'email_verified_at' => now(),
            ]);
        }

        DB::table('email_change_tokens')
            ->where('id', $record->id)
            ->update([
                'used' => true,
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Successfully changed your email. You may close this window now.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.'
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        Mail::send('email.password-changed', [
            'user' => $user
        ], function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Password Changed Successfully');
        });

        return response()->json([
            'message' => 'Password updated successfully.'
        ]);
    }

    public function requestPasswordChangeOtp(Request $request)
    {
        $user = auth()->user();

        $otp = random_int(100000, 999999);

        $user->password_change_otp = $otp;
        $user->password_change_otp_expires_at = now()->addMinutes(10);
        $user->save();

        Mail::send('email.password-change-otp', [
            'user' => $user,
            'otp' => $otp
        ], function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Your Password Change OTP');
        });

        return response()->json([
            'message' => 'OTP sent to your email.'
        ]);
    }

    public function verifyPasswordChangeOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:6'
        ]);

        $user = auth()->user();

        if (
            (string) $user->password_change_otp !== (string) $request->otp ||
            now()->gt($user->password_change_otp_expires_at)
        ) {
            return response()->json([
                'message' => 'Invalid or expired OTP.'
            ], 422);
        }

        // Mark OTP as verified
        $user->password_change_otp = null;
        $user->password_change_otp_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'OTP verified successfully.'
        ]);
    }
}
