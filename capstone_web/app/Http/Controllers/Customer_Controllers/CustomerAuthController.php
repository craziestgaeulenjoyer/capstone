<?php

namespace App\Http\Controllers\Customer_Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Auth;
use App\Mail\CustomerOtpMail;


class CustomerAuthController extends Controller
{
    /**
     * Show signup page
     */
    public function showSignup()
    {
        return Inertia::render('getstarted_section/SignUpForm');
    }

    public function signup(Request $request)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'email' => 'required|email|unique:customers',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $customer = Customer::create([
        'full_name' => $request->full_name,
        'email' => $request->email,
        'password_hash' => Hash::make($request->password),
        'email_verified' => false,
    ]);

    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    $customer->update([
        'otp_code' => $otp,
        'otp_expiry' => Carbon::now()->addMinutes(10),
    ]);

    Mail::to($customer->email)->send(
        new CustomerOtpMail($otp, $customer->full_name)
    );

    return redirect()->route('customer.verification.email', [
        'email' => $customer->email
    ]);
}


   public function showVerification(Request $request)
{
    return Inertia::render('getstarted_section/VerificationEmail', [
        'email' => $request->email
    ]);
}

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'otp_code' => 'required|string|size:6',
    ]);

    // Find customer with matching OTP and still valid
    $customer = Customer::where('email', $request->email)
        ->where('otp_code', $request->otp_code)
        ->where('otp_expiry', '>', Carbon::now())
        ->first();

    if ($customer) {
        // OTP is correct and valid → mark email as verified
        $customer->update([
            'email_verified' => true,
            'otp_code' => null,
            'otp_token' => null,
            'otp_expiry' => null,
        ]);

        // Redirect to signup form with success message
        return redirect()->route('customer.login.form')
                         ->with('success', 'Email verified successfully! You can now complete your signup.');
    } else {
        // OTP invalid or expired → go back with error
        return redirect()->back()->with('error', 'Invalid or expired OTP code.');
    }
}
/**
 * Show signup form after verification
 */
public function showSignupForm()
{
    return Inertia::render('getstarted_section/SignInCard', [
        'success' => session('success'),
    ]);
}
    /**
     * Resend OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $customer = Customer::where('email', $request->email)->first();
        if (!$customer) {
            return redirect()->back()->with('error', 'Customer not found.');
        }

        $otp = $this->generateOtp();
        $otpToken = Str::random(60);
        $customer->update([
            'otp_code' => $otp,
            'otp_token' => $otpToken,
            'otp_expiry' => Carbon::now()->addMinutes(10),
        ]);

        $this->sendOtpEmail($customer->email, $otp, $customer->full_name);

        return redirect()->back()->with('success', 'OTP resent successfully.');
    }

    private function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    private function sendOtpEmail(string $email, string $otp, string $name): void
    {
        try {
            $data = ['otp' => $otp, 'name' => $name, 'email' => $email];
            Mail::send('emails.customer-otp', $data, function ($message) use ($email, $name) {
                $message->to($email, $name)->subject('Your Mi Amore Verification Code');
            });
        } catch (\Exception $e) {
            Log::error('Failed to send OTP email: ' . $e->getMessage());
            throw new \Exception('Failed to send verification email.');
        }
    }

    /**
 * Handle customer login
 */
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
        'remember_me' => 'boolean',
    ]);

    $customer = Customer::where('email', $request->email)->first();

    if (!$customer) {
        return response()->json(['errors' => ['email' => 'Email not found.']], 422);
    }

    if (!$customer->email_verified) {
        return response()->json(['errors' => ['email' => 'Please verify your email before logging in.']], 422);
    }

    if (!Hash::check($request->password, $customer->password_hash)) {
        return response()->json(['errors' => ['password' => 'Incorrect password.']], 422);
    }
    
    Auth::guard('customer')->login(
        $customer,
        $request->boolean('remember_me')
    );

    // ✅ ADD THIS
    $request->session()->regenerate();

    // ✅ CHANGE RESPONSE (NO JSON)
    return redirect()->route('home');
}

public function logout(Request $request)
{
    Auth::guard('customer')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/home');
}

}
