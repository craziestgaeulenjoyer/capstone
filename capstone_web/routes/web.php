<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerSignupController;
use App\Http\Controllers\CustomerLoginController;
use App\Http\Controllers\Administrator_Controllers\ProfileController;

///SIGN UP CUSTOMER ROUTE////
Route::post('/signup', [CustomerSignupController::class, 'store'])->name('signup.store');
//
//SIGN IN CUSTOMER ROUTE///
Route::post('/login/authenticate', [CustomerLoginController::class, 'authenticate'])->name('login.authenticate');

Route::get('/', fn() => redirect('/home'));

/* ------- ADMINS & SUPER ADMINS EMAIL VERIFICATION ROUTES ------- */

// Step 2: Deny request (email button)
Route::post('/email-change/deny', [ProfileController::class, 'denyEmailChange']);

// Step 3: Show change email form (SIGNED / TOKEN-BASED)
Route::get('/email-change/confirm/{token}', [ProfileController::class, 'verifyEmailChangeToken'])
    ->name('email-change.confirm');

// Step 4: Finalize email change
Route::post('/email-change/confirm', [ProfileController::class, 'finalizeEmailChange']);

Route::get('/email-change', function () {
    return Inertia::render('EmailChange');
});

// --- CART SECTION ROUTES ---

// 1. ShoppingCartPage.tsx
Route::get('/customer-cart', fn() => Inertia::render('Cart_section/CustomerCartPage'))
    ->name('shopping.cart');

Route::get('/payment', fn() => Inertia::render('Cart_section/PaymentDetailsPage'))
    ->name('payment.cart');

// 2. LoyaltyPointsPage.tsx
Route::get('/loyalty', fn() => Inertia::render('Cart_section/LoyaltyPage'))
    ->name('loyalty.cart');

// 3. CheckoutDetailsPage.tsx (Shipping/Billing details)
Route::get('/checkout', fn() => Inertia::render('Cart_section/ConfirmOrderPage'))
    ->name('checkout.details');

/* ---------------- WEBSITE ROUTES ---------------- */

Route::get('/home', fn() => Inertia::render('website_pages/Home_MiAmore'))
    ->name('home');

Route::get('/menu', fn() => Inertia::render('website_pages/Menu'))
    ->name('menu');

Route::get('/about-us', fn() => Inertia::render('website_pages/AboutUs'))   
    ->name('aboutus');

Route::get('/event', fn() => Inertia::render('website_pages/Event'))
    ->name('event');

Route::get('/contact-us', fn() => Inertia::render('home_sections/ContactSection'))
    ->name('contact-us');

Route::get('/privacypolicy', fn() => Inertia::render('PrivacyandTerms_section/PrivacyPolicy'))
    ->name('privacypolicy');

Route::get('/termsandcondition', fn() => Inertia::render('PrivacyandTerms_section/TermsAndCondition'))
    ->name('termsandcondition');    


/* ---------------- GET STARTED / AUTH SCREENS ---------------- */

Route::get('/signin', fn() => Inertia::render('getstarted_section/MiAmoreWelcome'))
    ->name('SignIn');

Route::get('/signincard', fn() => Inertia::render('getstarted_section/SignInCard'))
    ->name('SignInCard');

Route::get('/signupform', fn() => Inertia::render('getstarted_section/SignUpForm'))
    ->name('SignUpForm');

Route::get('/accountverification', fn() => Inertia::render('getstarted_section/AccountVerification'))
    ->name('AccountVerification');

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


/* ---------------- SANCTUM COOKIE ---------------- */

Route::get('/sanctum/csrf-cookie', fn() => response()->json(['message' => 'CSRF cookie set']));

/* ---------------- LOGIN REDIRECT ---------------- */

Route::middleware(['web'])->get('/login', fn() => redirect('/dashboardgetstarted'));

/* ---------------- FALLBACK (FIXES INERTIA ERROR) ---------------- */

Route::fallback(fn() => Inertia::render('Errors/NotFound', [
    'status' => 404,
    'message' => 'Page not found'
])->toResponse(request())->setStatusCode(404));


/* ---------------- ADDITIONAL ROUTES ---------------- */

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';