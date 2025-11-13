<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminVerified
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('admin')->user()?->hasVerifiedEmail()) {
            return response()->json(['message' => 'Admin email not verified'], 403);
        }
        return $next($request);
    }
}
