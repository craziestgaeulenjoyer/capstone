<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\SuperAdmin;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class SuperAdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $remember = $request->remember ?? true;

        $superAdmin = SuperAdmin::where('email', $credentials['email'])->first();

        if (!$superAdmin || !Hash::check($request->password, $superAdmin->password)) {
            Log::warning('SuperAdmin login failed', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'time' => now()->toDateTimeString(),
            ]);

            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Session login for web dashboard
        Auth::guard('super_admin')->login($superAdmin, $remember);

        Log::info('After SuperAdmin login:', [
            'session_id'   => $request->session()->getId(),
            'guard_check'  => Auth::guard('super_admin')->check(),
            'current_user' => Auth::guard('super_admin')->user(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->header('User-Agent'),
            'timestamp'    => now()->toDateTimeString(),
        ]);

        // Send email verification if not verified
        if (!$superAdmin->hasVerifiedEmail()) {
            $superAdmin->sendEmailVerificationNotification();
            Log::info('Verification email sent to SuperAdmin', ['email' => $superAdmin->email]);
        }

        // Create Sanctum token for API calls
        $token = $superAdmin->createToken('superadmin-api-token')->plainTextToken;

        // Build JSON response
        $responseJson = [
            'verified' => $superAdmin->hasVerifiedEmail(),
            'role' => 'super_admin',
            'user' => $superAdmin,
            'token' => $token,  
            'redirect' => $superAdmin->hasVerifiedEmail()
                ? url('/superadmin/dashboard')
                : url('/dashboardemailverification'),
        ];

        Log::info('SuperAdmin login response:', $responseJson);

        return response()->json($responseJson);
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = Auth::guard('super_admin')->user();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->sendEmailVerificationNotification();
        Log::info('Verification email resent to SuperAdmin', ['email' => $user->email]);

        return response()->json(['message' => 'Verification email resent successfully.']);
    }

    public function verify(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect('/superadmin/dashboard');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect('/superadmin/dashboard');
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
        Log::info('SuperAdmin logging out:', [
            'session_id' => $request->session()->getId(),
            'user' => Auth::guard('super_admin')->user(),
        ]);

        // Delete all tokens for this user (optional)
        $user = Auth::guard('super_admin')->user();
        if ($user) {
            $user->tokens()->delete();
        }

        Auth::guard('super_admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
