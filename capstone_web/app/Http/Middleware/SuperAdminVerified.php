<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class SuperAdminVerified
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('super_admin')->user()?->hasVerifiedEmail()) {
            return response()->json(['message' => 'Super Admin email not verified'], 403);
        }
        return $next($request);
    }
}
