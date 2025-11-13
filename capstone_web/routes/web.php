<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerSignupController;
use App\Http\Controllers\CustomerLoginController;

///SIGN UP CUSTOMER ROUTE////
Route::post('/signup', [CustomerSignupController::class, 'store'])->name('signup.store');
//
//SIGN IN CUSTOMER ROUTE///
Route::post('/login/authenticate', [CustomerLoginController::class, 'authenticate'])->name('login.authenticate');




/* ---------------- WEBSITE ROUTES ---------------- */

Route::get('/home', function () {
    return Inertia::render('website_pages/Home_MiAmore');
})->name('home');

Route::get('/menu', function () {
    return Inertia::render('website_pages/Menu');
})->name('menu');

Route::get('/about-us', function () {
    return Inertia::render('website_pages/AboutUs');
})->name('aboutus');

/* ---------------- AUTHENTICATION (GET STARTED SECTION) ---------------- */

Route::get('/signin', function () {
    return Inertia::render('getstarted_section/MiAmoreWelcome');
})->name('SignIn');

Route::get('/signincard', function () {
    return Inertia::render('getstarted_section/SignInCard');
})->name('SignInCard');

Route::get('/signupform', function () {
    return Inertia::render('getstarted_section/SignUpForm');
})->name('SignUpForm');

Route::get('/accountverification', function () {
    return Inertia::render('getstarted_section/AccountVerification');
})->name('AccountVerification');

Route::get('/forgotpasswordform', function () {
    return Inertia::render('getstarted_section/ForgotPasswordForm');
})->name('ForgotPasswordForm');

Route::get('/verificationcode', function () {
    return Inertia::render('getstarted_section/VerificationCode');
})->name('VerificationCode');

Route::get('/resetpasswordform', function () {
    return Inertia::render('getstarted_section/ResetPasswordForm');
})->name('ResetPassWordForm');

/* ---------------- DASHBOARD ROUTES ---------------- */

// Dashboard Auth Screens

Route::get('/dashboardgetstarted', function () {
    return Inertia::render('Dashboard_Section/DashboardGetStarted');
})->name('DashboardGetStarted');

Route::get('/dashboardloginform', function () {
    return Inertia::render('Dashboard_Section/DashboardLoginForm');
})->name('DashboardLoginForm');

Route::get('/dashboardemailverification', function () {
    return Inertia::render('Dashboard_Section/DashboardEmailVerification');
})->name('DashboardEmailVerification');

Route::get('/dashboardemailverificationresend', function () {
    return Inertia::render('Dashboard_Section/DashboardEmailVerificationResend');
})->name('DashboardEmailVerificationResend');

Route::get('/dashboardverificationsuccess', function () {
    return Inertia::render('Redirect_Pages/DashboardVerificationSuccess');
})->name('DashboardVerificationSuccess');

// CSRF Cookie Route

Route::get('/sanctum/csrf-cookie', fn() => response()->json(['message' => 'CSRF cookie set']));

// Unauthenticated Redirect Route

Route::middleware(['web'])->get('/login', function () {
    return redirect('/dashboardgetstarted');
});

/* ---------------- FALLBACK ROUTE ---------------- */

Route::fallback(fn() => response()->json(['message' => 'Route not found.'], 404));

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
