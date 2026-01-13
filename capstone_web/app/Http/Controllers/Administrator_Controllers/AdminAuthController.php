<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Admin;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $remember = $request->remember ?? true;

        $admin = Admin::where('email', $credentials['email'])->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            Log::warning('Admin login failed', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'time' => now()->toDateTimeString(),
            ]);

            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Session login for web dashboard
        Auth::guard('admin')->login($admin, $remember);

        Log::info('After Admin login:', [
            'session_id'   => $request->session()->getId(),
            'guard_check'  => Auth::guard('admin')->check(),
            'current_user' => Auth::guard('admin')->user(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->header('User-Agent'),
            'timestamp'    => now()->toDateTimeString(),
        ]);

        // Send email verification if not verified
        if (!$admin->hasVerifiedEmail()) {
            $admin->sendEmailVerificationNotification();
            Log::info('Verification email sent to Admin', ['email' => $admin->email]);
        }

        // Create Sanctum token for API calls
        $token = $admin->createToken('admin-api-token')->plainTextToken;

        // Build JSON response
        $responseJson = [
            'verified' => $admin->hasVerifiedEmail(),
            'role' => 'admin',
            'user' => $admin,
            'token' => $token, // ← added
            'redirect' => $admin->hasVerifiedEmail()
                ? url('/admin/dashboard')
                : url('/dashboardemailverification'),
        ];

        Log::info('Admin login response:', $responseJson);

        return response()->json($responseJson);
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = Auth::guard('admin')->user();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->sendEmailVerificationNotification();
        Log::info('Verification email resent to Admin', ['email' => $user->email]);

        return response()->json(['message' => 'Verification email resent successfully.']);
    }
    
    public function verify(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect('/admin/dashboard');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect('/admin/dashboard');
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username ?? $user->name,
                'email' => $user->email,
                'role' => $user instanceof SuperAdmin ? 'Super Admin' : 'Admin',
            ]
        ]);
    }

    public function logout(Request $request)
    {
        Log::info('Admin logging out:', [
            'session_id' => $request->session()->getId(),
            'user' => Auth::guard('admin')->user(),
        ]);

        // Delete tokens for security
        $user = Auth::guard('admin')->user();
        if ($user) {
            $user->tokens()->delete();
        }

        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
