<?php

namespace App\Http\Controllers\Customer_Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class CustomerSocialController extends Controller
{
    // GOOGLE
    public function googleRedirect() {
        return Socialite::driver('google')->redirect();
    }

    public function googleCallback() {
        $googleUser = Socialite::driver('google')->user();

        $customer = Customer::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'full_name' => $googleUser->getName(),
                'email_verified' => true
            ]
        );

        Auth::guard('customer')->login($customer);

        return redirect()->route('customer.dashboard');
    }

    // FACEBOOK
    public function facebookRedirect() {
        return Socialite::driver('facebook')->redirect();
    }

    public function facebookCallback() {
        $fbUser = Socialite::driver('facebook')->user();

        $customer = Customer::firstOrCreate(
            ['email' => $fbUser->getEmail()],
            [
                'full_name' => $fbUser->getName(),
                'email_verified' => true
            ]
        );

        Auth::guard('customer')->login($customer);

        return redirect()->route('customer.dashboard');
    }
}
