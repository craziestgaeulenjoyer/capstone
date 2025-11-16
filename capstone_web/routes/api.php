<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\AdminsCreationController;

/* ---------------- SUPER ADMIN ROUTES ---------------- */
Route::prefix('superadmin')->group(function () {
    // Resend verification email
    Route::post('/email/resend', [SuperAdminAuthController::class, 'resendVerificationEmail']);

    // Protected routes using Sanctum
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', fn() => response()->json(['message' => 'Super Admin dashboard']));

        // Create Admins or Super Admins (only Super Admins allowed)
        Route::post('/create/request-otp', [AdminsCreationController::class, 'requestOtp']);
        Route::post('/create/verify-otp', [AdminsCreationController::class, 'verifyOtp']);

        // Fetch all Admins & Super Admins
        Route::get('/admins', [AdminsCreationController::class, 'getAllAdmins']);

       Route::get('/profile', [SuperAdminAuthController::class, 'profile']);
    });
});

/* ---------------- ADMIN ROUTES ---------------- */
Route::prefix('admin')->group(function () {
    Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', fn() => response()->json(['message' => 'Admin dashboard']));
    
        Route::get('/profile', [AdminAuthController::class, 'profile']);
    });
});

/* ---------------- FALLBACK ---------------- */
Route::fallback(fn() => response()->json(['message' => 'Route not found.'], 404));
