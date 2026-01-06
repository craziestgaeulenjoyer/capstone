<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthenticateCustomer
{
    public function handle($request, Closure $next, $guard = 'customer')
    {
        Log::info('AuthenticateCustomer middleware fired', [
            'url' => $request->fullUrl(),
            'session_all' => $request->session()->all(),
            'cookies' => $request->cookies->all(),
            'auth_check' => Auth::guard($guard)->check(),
            'current_user' => Auth::guard($guard)->user(),
        ]);

        if (!Auth::guard($guard)->check()) {
            Log::warning('Customer not authenticated, redirecting to customer login page');

            return redirect('/get-started'); // 🔹 You can change this route
        }

        return $next($request);
    }
}
