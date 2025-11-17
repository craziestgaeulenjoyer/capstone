<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\AdminsCreationController;
use App\Http\Controllers\Administrator_Controllers\MenuController;

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

        // Fetch Super Admin profile
        Route::get('/profile', [SuperAdminAuthController::class, 'profile']);
    
        // Menu item management
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');
    });
});

/* ---------------- ADMIN ROUTES ---------------- */
Route::prefix('admin')->group(function () {
    Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', fn() => response()->json(['message' => 'Admin dashboard']));
    
        // Fetch Admin Profile
        Route::get('/profile', [AdminAuthController::class, 'profile']);
    
        // Menu item management
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');
    });
});

Route::get('/api/menu', [MenuController::class, 'publicMenu'])->name('menu.public');

/* ---------------- FALLBACK ---------------- */
Route::fallback(fn() => response()->json(['message' => 'Route not found.'], 404));
