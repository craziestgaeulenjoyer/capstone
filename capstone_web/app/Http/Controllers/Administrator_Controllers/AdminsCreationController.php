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
     * Send OTP to LOGGED-IN SUPER ADMIN email
     */
    public function requestOtp(Request $request)
    {
        $superAdmin = auth()->user();

        if (!$superAdmin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->merge(['name' => $request->fullName]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:admins,username|unique:super_admins,username',
            'email' => 'required|email|unique:admins,email|unique:super_admins,email',
            'role' => 'required|in:admin,super_admin',
            'branch' => 'required_if:role,admin|string|nullable',
        ]);

        $otp = random_int(100000, 999999);

        Cache::put(
            'create_user_data_' . $superAdmin->id,
            [
                'otp' => (string) $otp,
                'data' => $validated,
            ],
            now()->addMinutes(5)
        );

        Mail::raw(
            "Your Mi Amore Admin verification code is: {$otp}",
            fn ($message) =>
                $message->to($superAdmin->email)
                        ->subject('User Creation OTP - Mi Amore')
        );

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully',
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $superAdmin = auth()->user();

        if (!$superAdmin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $cached = Cache::get('create_user_data_' . $superAdmin->id);

        if (!$cached) {
            return response()->json([
                'success' => false,
                'message' => 'User creation data expired. Please restart the process.'
            ], 400);
        }

        if ($cached['otp'] !== $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);
        }

        $data = $cached['data'];

        Cache::forget('create_user_data_' . $superAdmin->id);

        if ($data['role'] === 'admin') {
            $user = Admin::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make(Str::random(16)),
                'role' => 'admin',
                'branch' => $data['branch'],
            ]);
        } else {
            $user = SuperAdmin::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make(Str::random(16)),
                'role' => 'super_admin',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => ucfirst($data['role']) . ' created successfully.',
            'data' => $user
        ]);
    }

    /**
     * Resend OTP to LOGGED-IN SUPER ADMIN email
     */
    public function resendOtp()
    {
        $superAdmin = auth()->user();

        if (!$superAdmin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $otp = random_int(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        Cache::put(
            'create_user_otp_' . $superAdmin->id,
            $otp,
            $expiresAt
        );

        Mail::raw(
            "Your Mi Amore Admin verification code is: {$otp}",
            function ($message) use ($superAdmin) {
                $message->to($superAdmin->email)
                    ->subject('Resent User Creation OTP - Mi Amore');
            }
        );

        Log::info("OTP resent to super admin", ['email' => $superAdmin->email]);

        return response()->json([
            'success' => true,
            'message' => 'OTP resent successfully.',
            'expires_in_seconds' => $expiresAt->diffInSeconds(now()),
        ]);
    }

    public function getAllAdmins(Request $request)
    {
        try {
            // Fetch admins
            $admins = Admin::select(
                    'id',
                    'name',
                    'username',
                    'email',
                    'branch',
                    'role',
                    'status',
                    'created_at'
                )
                ->get()
                ->map(function ($admin) {
                    return [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'email' => $admin->email,
                        'role' => $admin->role,
                        'branch' => $admin->branch,
                        'status' => $admin->status ?? 'active',
                        'last_active' => optional($admin->updated_at)->toDateTimeString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $admins
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch admins', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admins'
            ], 500);
        }
    }
}
