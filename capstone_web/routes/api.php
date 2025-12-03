<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\AdminsCreationController;
use App\Http\Controllers\Administrator_Controllers\MenuController;
use App\Http\Controllers\Administrator_Controllers\InventoryController;
use App\Http\Controllers\Administrator_Controllers\CustomerController;

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

        // Inventory management
        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');
    
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
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

        // Inventory Management
        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');
    
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
    });
});

Route::get('/api/menu', [MenuController::class, 'publicMenu'])->name('menu.public');

/* ---------------- FALLBACK ---------------- */
Route::fallback(fn() => response()->json(['message' => 'Route not found.'], 404));
