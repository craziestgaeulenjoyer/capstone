<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperAdminOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Access denied. Super Admins only.'], 403);
        }

        return $next($request);
    }
}
