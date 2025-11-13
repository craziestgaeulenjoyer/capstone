<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthenticateSuperAdmin
{
    public function handle($request, Closure $next, $guard = 'super_admin')
    {
        Log::info('AuthenticateSuperAdmin middleware fired', [
            'url' => $request->fullUrl(),
            'session_all' => $request->session()->all(),
            'cookies' => $request->cookies->all(),
            'auth_check' => Auth::guard($guard)->check(),
            'current_user' => Auth::guard($guard)->user(),
        ]);

        if (!Auth::guard($guard)->check()) {
            Log::warning('Admin not authenticated, redirecting to dashboardgetstarted');
            return redirect('/dashboardgetstarted');
        }

        return $next($request);
    }
}
