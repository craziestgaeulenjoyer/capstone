<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\SuperAdmin;
use Illuminate\Support\Str;

class AdminsCreationController extends Controller
{
    /**
     * Send OTP to email for admin/super admin creation.
     */
    public function requestOtp(Request $request)
    {
        $request->merge(['name' => $request->fullName]);

        Log::info('OTP request received:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:admins,username|unique:super_admins,username',
            'email' => 'required|email|unique:admins,email|unique:super_admins,email',
            'role' => 'required|in:admin,super_admin',
            'branch' => 'required_if:role,admin|string|nullable',
        ]);

        Log::info("OTP request for creating user", [
            'role' => $request->role,
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'branch' => $request->branch ?? null,
            'requested_by' => auth()->id() ?? null,
        ]);

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        Cache::put('create_user_otp_' . $request->email, $otp, $expiresAt);

        Mail::raw("Your Mi Amore Admin verification code is: {$otp}", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('User Creation OTP - Mi Amore');
        });

        Log::info("OTP sent to {$request->email}");

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.',
            'expires_in_seconds' => $expiresAt->diffInSeconds(now()),
        ]);
    }

    /**
     * Verify OTP and create user without a default password.
     */
    public function verifyOtp(Request $request)
    {
        Log::info('OTP verification request received:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:admins,username|unique:super_admins,username',
            'email' => 'required|email',
            'role' => 'required|in:admin,super_admin',
            'branch' => 'required_if:role,admin|string|nullable',
            'otp' => 'required|string|max:6',
        ]);

        $cachedOtp = Cache::get('create_user_otp_' . $request->email);

        if (!$cachedOtp) {
            return response()->json(['success' => false, 'message' => 'OTP has expired'], 400);
        }

        if (trim((string)$cachedOtp) !== trim((string)$request->otp)) {
            return response()->json(['success' => false, 'message' => 'OTP is invalid'], 400);
        }

        // OTP is valid — remove it from cache
        Cache::forget('create_user_otp_' . $request->email);

        $user = null;

        Log::info("Creating user", [
            'role' => $request->role,
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'branch' => $request->branch ?? null,
        ]);

        if ($request->role === 'admin') {
            $user = Admin::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make(Str::random(16)),
                'role' => 'admin',
                'branch' => $request->branch,
            ]);
        } elseif ($request->role === 'super_admin') {
            $user = SuperAdmin::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make(Str::random(16)),
                'role' => 'super_admin',
            ]);
        }

        Log::info("User successfully created", [
            'id' => $user->id,
            'role' => $user->role,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
        ]);

        return response()->json([
            'success' => true,
            'message' => ucfirst($request->role) . ' successfully created. The user can set their password via the forgot password link.',
            'data' => $user
        ]);
    }

    /**
     * Resend OTP for admin/super admin creation.
     */
    public function resendOtp(Request $request)
    {
        Log::info('OTP resend request received:', $request->all());

        $request->validate([
            'email' => 'required|email',
        ]);

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        Cache::put('create_user_otp_' . $request->email, $otp, $expiresAt);

        Mail::raw("Your Mi Amore Admin verification code is: {$otp}", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Resent User Creation OTP - Mi Amore');
        });

        Log::info("Resent OTP to {$request->email}");

        return response()->json([
            'success' => true,
            'message' => 'OTP resent successfully.',
            'expires_in_seconds' => $expiresAt->diffInSeconds(now()),
        ]);
    }

    public function getAllAdmins()
    {
        try {
            $admins = Admin::select('id', 'name', 'username', 'email', 'branch', 'role', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $admins
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch admins: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Server error while fetching admins.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
