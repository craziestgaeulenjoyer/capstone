<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Authenticate extends Middleware
{
    /**
     * Determine where to redirect unauthenticated users.
     */
    protected function redirectTo($request)
    {
        // Log request details for debugging
        Log::info('Authenticate Middleware triggered', [
            'path' => $request->path(),
            'method' => $request->method(),
            'ip' => $request->ip(),
            'guard_admin' => Auth::guard('admin')->check(),
            'guard_super_admin' => Auth::guard('super_admin')->check(),
            'default_guard' => Auth::check(),
            'session_id' => $request->session()->getId(),
        ]);

        // If Super Admin is authenticated
        if (Auth::guard('super_admin')->check()) {
            Log::info('✅ Authenticated as Super Admin, redirecting to /superadmin');
            return url('/superadmin');
        }

        // If Admin is authenticated
        if (Auth::guard('admin')->check()) {
            Log::info('✅ Authenticated as Admin, redirecting to /admin');
            return url('/admin');
        }

        // If authenticated under default guard (normal user)
        if (Auth::check()) {
            Log::info('✅ Authenticated with default guard, redirecting to /home');
            return url('/home');
        }

        // If unauthenticated
        if (!$request->expectsJson()) {
            Log::warning('🚫 Unauthenticated user detected, redirecting to /dashboardgetstarted');
            return url('/dashboardgetstarted');
        }
    }
}
