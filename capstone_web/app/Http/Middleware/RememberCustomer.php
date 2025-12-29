<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
class RememberCustomer
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is already logged in (optional)
        if (!$request->user() && $token = Cookie::get('remember_customer')) {
            $customer = Customer::where('remember_token', $token)->first();

            if ($customer) {
                // Log in the customer manually for this request
                Auth::guard('web')->login($customer);
            }
        }

        return $next($request);
    }
}
