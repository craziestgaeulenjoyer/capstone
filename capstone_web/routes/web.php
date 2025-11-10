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




Route::get('/home', function () {
    return Inertia::render('website_pages/Home_MiAmore');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


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


/* Authentication (Get Started Section) */

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
})->name('FogotPasswordForm');

Route::get('/verificationcode', function () {
    return Inertia::render('getstarted_section/VerificationCode');
})->name('VerificationCode');

Route::get('/resetpasswordform', function () {
    return Inertia::render('getstarted_section/ResetPasswordForm');
})->name('ResetPassWordForm');


/* ---------------- DASHBOARD ROUTES ---------------- */

// Admin Dashboard

Route::get('/admin', function () {
    return Inertia::render('Admin_Dashboard/Admin_Navbar');
})->name('Admin_Navbar');

// Super Admin Dashboard

Route::get('/superadmin', function () {
    return Inertia::render('SuperAdmin_Navbar/SuperAdminNavbar');
})->name('SuperAdmin_Navbar');


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


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
