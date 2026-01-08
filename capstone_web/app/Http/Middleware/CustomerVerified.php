<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CustomerVerified
{
    public function handle($request, Closure $next)
    {
        $customer = Auth::guard('customer')->user();

        if (!$customer || !$customer->email_verified) {
            return redirect()->route('customer.verification')
                ->with('error', 'Please verify your email first.');
        }

        return $next($request);
    }
}