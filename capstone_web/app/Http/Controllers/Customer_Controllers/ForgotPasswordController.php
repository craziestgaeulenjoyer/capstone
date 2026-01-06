<?php

namespace App\Http\Controllers\Customer_Controllers;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    // 1️⃣ Send verification code
    public function sendVerificationCode(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:customers,email']);
        $customer = Customer::where('email', $request->email)->first();

        $customer->password_otp_code = rand(1000, 9999);
        $customer->password_otp_expiry = Carbon::now()->addMinutes(10);
        $customer->password_otp_token = Str::random(40);
        $customer->save();

        Mail::raw("Your password reset code is: {$customer->password_otp_code}", function ($message) use ($customer) {
            $message->to($customer->email)->subject('Password Reset Verification Code');
        });

        return response()->json(['message' => 'Verification code sent successfully']);
    }

    // 2️⃣ Resend code
    public function resendCode(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:customers,email']);
        $customer = Customer::where('email', $request->email)->first();

        $customer->password_otp_code = rand(1000, 9999);
        $customer->password_otp_expiry = Carbon::now()->addMinutes(10);
        $customer->password_otp_token = Str::random(40);
        $customer->save();

        Mail::raw("Your new verification code is: {$customer->password_otp_code}", function ($message) use ($customer) {
            $message->to($customer->email)->subject('New Password Reset Code');
        });

        return response()->json(['message' => 'New verification code sent successfully']);
    }

    // 3️⃣ Verify code
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:customers,email',
            'otp_code' => 'required|digits:4'
        ]);

        $customer = Customer::where('email', $request->email)->first();

        if ($customer->password_otp_code != $request->otp_code) {
            return response()->json(['message' => 'Incorrect verification code'], 422);
        }

        if (!$customer->password_otp_expiry || $customer->password_otp_expiry->isPast()) {
            return response()->json(['message' => 'Verification code has expired'], 422);
        }

        $customer->password_otp_token = 'VERIFIED';
        $customer->save();

        return response()->json(['message' => 'Code verified successfully']);
    }

    // 4️⃣ Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:customers,email',
            'password' => 'required|string|confirmed|min:6'
        ]);

        $customer = Customer::where('email', $request->email)->first();

        if ($customer->password_otp_token !== 'VERIFIED') {
            return response()->json(['message' => 'OTP has not been verified'], 422);
        }

        $customer->password_hash = Hash::make($request->password);
        $customer->password_otp_code = null;
        $customer->password_otp_expiry = null;
        $customer->password_otp_token = null;
        $customer->save();

        return response()->json(['message' => 'Password reset successfully']);
    }
}
