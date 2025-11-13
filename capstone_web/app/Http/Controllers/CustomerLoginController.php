<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\CustomerLogin;

class CustomerLoginController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Find the customer
        $customer = CustomerLogin::where('email', $credentials['email'])->first();

        if (!$customer) {
            return back()->withErrors([
                'email' => 'No account found for this email.',
            ]);
        }

        // Verify the password against password_hash
        if (!Hash::check($credentials['password'], $customer->password_hash)) {
            return back()->withErrors([
                'password' => 'Incorrect password.',
            ]);
        }

        // Log in the user
        Auth::login($customer);
        $request->session()->regenerate();

        return redirect()->intended('/menu');
    }
}
