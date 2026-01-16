<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerSignupController;
use App\Http\Controllers\CustomerLoginController;
use App\Http\Controllers\Administrator_Controllers\ProfileController;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;

use Illuminate\Support\Facades\Auth;
Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])
    ->name('customer.logout');


use App\Http\Controllers\Cart_Controllers\PlacedOrderController;
use App\Http\Controllers\Cart_Controllers\CartController;

Route::middleware('auth:customer')->group(function () {
    Route::post('/cart/add', [CartController::class, 'store']);
    Route::get('/cart/items', [CartController::class, 'items']);
    Route::get('/cart/count', [CartController::class, 'count']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/order/confirm',[PlacedOrderController::class, 'confirm']);
});
Route::middleware('auth:customer')->get('/customer/profile', function () {
    return response()->json([
        'customer' => auth('customer')->user()
    ]);
});
/* ---------------- CUSTOMER AUTH ---------------- */

Route::prefix('customer')->group(function () {

    // Pages
    Route::get('/signup', [CustomerAuthController::class, 'showSignup'])
        ->name('customer.signup.form');

    Route::get('/signincard', [CustomerAuthController::class, 'showSignupForm'])
        ->name('customer.login.form');

    Route::get('/emailverification', [CustomerAuthController::class, 'showVerification'])
        ->name('customer.verification.email');

    // Actions
    Route::post('/signup', [CustomerAuthController::class, 'signup'])
        ->name('customer.signup.store');

    Route::post('/signup/verify', [CustomerAuthController::class, 'verifyOtp'])
        ->name('customer.signup.verify');

    Route::post('/signup/resend', [CustomerAuthController::class, 'resendOtp'])
        ->name('customer.signup.resend');

    Route::post('/login', [CustomerAuthController::class, 'login'])
        ->name('login.authenticate');
    
Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])
    ->name('customer.logout');
});

/* ---------------- CUSTOMER AUTHENTICATION LOGIC ---------------- */

// Signup Process
Route::post('/signup', [CustomerSignupController::class, 'store'])
    ->name('signup.store');

// Verification Logic 
Route::post('/verify-otp', [CustomerSignupController::class, 'verify'])
    ->name('customer.signup.verify');

Route::post('/resend-otp', [CustomerSignupController::class, 'resend'])
    ->name('customer.signup.resend');

// Login Logic
Route::post('/login/authenticate', [CustomerLoginController::class, 'authenticate'])
    ->name('login.authenticate');


/* ---------------- REDIRECTS ---------------- */

Route::get('/', fn() => redirect('/home'));


/* ------- ADMINS & SUPER ADMINS EMAIL VERIFICATION ROUTES ------- */

Route::post('/email-change/deny', [ProfileController::class, 'denyEmailChange']);

Route::get('/email-change/confirm/{token}', [ProfileController::class, 'verifyEmailChangeToken'])
    ->name('email-change.confirm');

Route::post('/email-change/confirm', [ProfileController::class, 'finalizeEmailChange']);

Route::get('/email-change', function () {
    return Inertia::render('EmailChange');
});


/* ---------------- CART SECTION ROUTES ---------------- */

Route::get('/cart', fn() => Inertia::render('Cart_section/CustomerCartPage'))
    ->name('shopping.cart');

Route::get('/payment', fn() => Inertia::render('Cart_section/PaymentDetailsPage'))
    ->name('payment.cart');

Route::get('/loyalty', fn() => Inertia::render('Cart_section/LoyaltyPage'))
    ->name('loyalty.cart');

Route::get('/checkout', fn() => Inertia::render('Cart_section/ConfirmOrderPage'))
    ->name('checkout.details');


/* ---------------- WEBSITE PAGES ---------------- */

Route::get('/home', fn() => Inertia::render('website_pages/Home_MiAmore'))
    ->name('home');

Route::get('/menu', fn() => Inertia::render('website_pages/Menu'))
    ->name('menu');

Route::get('/about-us', fn() => Inertia::render('website_pages/AboutUs'))   
    ->name('aboutus');

Route::get('/event', fn() => Inertia::render('website_pages/Event'))
    ->name('event');

Route::get('/contact-us', fn() => Inertia::render('website_pages/Contact'))
    ->name('contact');

Route::get('/privacypolicy', fn() => Inertia::render('PrivacyandTerms_section/PrivacyPolicy'))
    ->name('privacypolicy');

Route::get('/termsandcondition', fn() => Inertia::render('PrivacyandTerms_section/TermsAndCondition'))
    ->name('termsandcondition');    


/* ---------------- GET STARTED / AUTH SCREENS ---------------- */

Route::get('/welcome', fn() => Inertia::render('getstarted_section/MiAmoreWelcome'))
    ->name('SignIn');

Route::get('/signincard', fn() => Inertia::render('getstarted_section/SignInCard'))
    ->name('SignInCard');

Route::get('/signupform', fn() => Inertia::render('getstarted_section/SignUpForm'))
    ->name('SignUpForm');

Route::get('/emailverification', fn() => Inertia::render('getstarted_section/VerificationEmail'))
    ->name('VerificationEmail');

Route::get('/forgotpasswordform', fn() => Inertia::render('getstarted_section/ForgotPasswordForm'))
    ->name('ForgotPasswordForm');

Route::get('/verificationcode', fn() => Inertia::render('getstarted_section/VerificationCode'))
    ->name('VerificationCode');

Route::get('/resetpasswordform', fn() => Inertia::render('getstarted_section/ResetPasswordForm'))
    ->name('ResetPassWordForm');


/* ---------------- DASHBOARD ROUTES ---------------- */

Route::get('/dashboardgetstarted', fn() => Inertia::render('Dashboard_Section/DashboardGetStarted'))
    ->name('DashboardGetStarted');

Route::get('/dashboardloginform', fn() => Inertia::render('Dashboard_Section/DashboardLoginForm'))
    ->name('DashboardLoginForm');

Route::get('/dashboardforgotpassword', fn() => Inertia::render('Dashboard_Section/DashboardForgotPassword'))
    ->name('DashboardForgotPassword');

Route::get('/dashboardemailverification', fn() => Inertia::render('Dashboard_Section/DashboardEmailVerification'))
    ->name('DashboardEmailVerification');

Route::get('/dashboardemailverificationresend', fn() => Inertia::render('Dashboard_Section/DashboardEmailVerificationResend'))
    ->name('DashboardEmailVerificationResend');

Route::get('/dashboardverificationsuccess', fn() => Inertia::render('Redirect_Pages/DashboardVerificationSuccess'))
    ->name('DashboardVerificationSuccess');


/* ---------------- SYSTEM ROUTES ---------------- */

Route::get('/sanctum/csrf-cookie', fn() => response()->json(['message' => 'CSRF cookie set']));

Route::middleware(['web'])->get('/login', fn() => redirect('/dashboardgetstarted'));

Route::fallback(fn() => Inertia::render('Errors/NotFound', [
    'status' => 404,
    'message' => 'Page not found'
])->toResponse(request())->setStatusCode(404));


/* ---------------- ADDITIONAL FILES ---------------- */

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';