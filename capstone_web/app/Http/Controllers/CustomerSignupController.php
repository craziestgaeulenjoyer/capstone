<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerSignup; 

class CustomerSignupController extends Controller
{
    public function store(Request $request)
    {
      
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:customers,email',
            'password'   => 'required|min:8|confirmed',
        ]);

        
        $fullName = "{$validated['first_name']} {$validated['last_name']}";

        
        $customer = CustomerSignup::create([
            'email'          => $validated['email'],
            'password_hash'  => $validated['password'],
            'full_name'      => $fullName,
            'email_verified' => false,
        ]);

        
        return redirect()->route('AccountVerification')->with('success', 'Account created successfully!');
    }
}
