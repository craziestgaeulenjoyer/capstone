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
    return Inertia::render('website_pages/Home_MiAmore');
})->name('home');

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
