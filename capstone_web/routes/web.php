<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


/* Website Web Routes */

Route::get('/home', function () {
    return Inertia::render('website_pages/Home');
})->name('home');

Route::get('/menu', function () {
    return Inertia::render('website_pages/Menu');
})->name('menu');

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

/* DASHBOARD ADMIN*/
Route::get('/dashboardnavbar', function () {
    return Inertia::render('AdminNavbar/SuperAdminNavbar');
})->name('adminNavbar');

Route::get('/adminNav', function () {
    return Inertia::render('AdminNavbar/adminNav');
})->name('adminNav');

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

Route::get('/superadmindashboard', function () {
    return Inertia::render('SuperAdminDashItems/Dashboard');
})->name('Dashboard');

Route::get('/superadmininventory', function () {
    return Inertia::render('SuperAdminDashItems/Inventory');
})->name('Inventory');

Route::get('/superadminsalesorder', function () {
    return Inertia::render('SuperAdminDashItems/SalesOrder');
})->name('SalesOrder');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
