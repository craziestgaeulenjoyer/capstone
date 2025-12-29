<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\AdminsCreationController;
use App\Http\Controllers\Administrator_Controllers\MenuController;
use App\Http\Controllers\Administrator_Controllers\InventoryController;
use App\Http\Controllers\Administrator_Controllers\CustomerController;
use App\Http\Controllers\Administrator_Controllers\SalesOrderController;
use App\Http\Controllers\Home_Controllers\ContactController;
use App\Http\Controllers\Home_Controllers\EventInquiryController;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;
use App\Http\Controllers\Customer_Controllers\CustomerProfileController;
use App\Http\Controllers\Customer_Controllers\CustomerSocialController;
use App\Http\Controllers\Customer_Controllers\ForgotPasswordController;
/* ---------------- CART ROUTES ---------------- */

use App\Http\Controllers\Cart_Controllers\PlacedOrderController;
use App\Http\Controllers\Cart_Controllers\CartController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cart/add', [CartController::class, 'store']);
    Route::get('/cart/items', [CartController::class, 'items']);
    Route::get('/cart/count', [CartController::class, 'count']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/order/store', [PlacedOrderController::class, 'store']);
    Route::post(
    '/order/confirm',
    [PlacedOrderController::class, 'confirm']);
});


/* ---------------- PUBLIC ROUTES ---------------- */
// Event Inquiry
Route::post('/eventinquiry', [EventInquiryController::class, 'store']);

// Contact form
Route::post('/contact', [ContactController::class, 'store'])->name('contact_message');

/* ---------------- CUSTOMER SOCIAL LOGIN ---------------- */
Route::get('/auth/google/redirect', [CustomerSocialController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [CustomerSocialController::class, 'googleCallback']);

Route::get('/auth/facebook/redirect', [CustomerSocialController::class, 'facebookRedirect']);
Route::get('/auth/facebook/callback', [CustomerSocialController::class, 'facebookCallback']);


/* ---------------- CUSTOMER PASSWORD RESET ---------------- */
Route::post('customer/forgot-password', [ForgotPasswordController::class, 'sendVerificationCode']);
Route::post('customer/resend-code', [ForgotPasswordController::class, 'resendCode']);
Route::post('customer/verify-code', [ForgotPasswordController::class, 'verifyCode']);
Route::post('customer/reset-password', [ForgotPasswordController::class, 'resetPassword']);

/* ---------------- CUSTOMER SIGNUP & LOGIN ---------------- */
Route::prefix('customer')->group(function () {
    // Signup
    Route::post('/signup', [CustomerAuthController::class, 'signup'])->name('customer.signup.store');
    Route::post('/signup/verify', [CustomerAuthController::class, 'verifyOtp'])->name('customer.signup.verify');
    Route::post('/signup/resend', [CustomerAuthController::class, 'resendOtp'])->name('customer.signup.resend');

    // Login
    Route::get('/login', [CustomerAuthController::class, 'showLoginForm'])->name('customer.login.form');
    Route::post('/login', [CustomerAuthController::class, 'login'])->name('login.authenticate');

    // Signup form after OTP verification
    Route::get('/signincard', [CustomerAuthController::class, 'showSignupForm'])->name('customer.signup.form');
});

// Verification screen
Route::get('/verification', [CustomerAuthController::class, 'showVerification'])->name('customer.verification.email');

/* ---------------- AUTHENTICATED CUSTOMER ROUTES ---------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customer/profile', function (Request $request) {
        return response()->json(['customer' => $request->user()]);
    });
});



/* ---------------- SUPER ADMIN ROUTES ---------------- */
Route::prefix('superadmin')->group(function () {
    Route::post('/email/resend', [SuperAdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', fn() => response()->json(['message' => 'Super Admin dashboard']));

        Route::post('/create/request-otp', [AdminsCreationController::class, 'requestOtp']);
        Route::post('/create/verify-otp', [AdminsCreationController::class, 'verifyOtp']);

        Route::get('/admins', [AdminsCreationController::class, 'getAllAdmins']);
        Route::get('/profile', [SuperAdminAuthController::class, 'profile']);
    
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');
    
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
        Route::get('/customers/{id}', [CustomerController::class, 'getCustomer']);
        Route::get('/customers/{id}/loyalty', [CustomerController::class, 'getLoyalty']);
    
        Route::get('/sales_orders', [SalesOrderController::class, 'index']);
    });
});

/* ---------------- ADMIN ROUTES ---------------- */
Route::prefix('admin')->group(function () {
    Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', fn() => response()->json(['message' => 'Admin dashboard']));
    
        Route::get('/profile', [AdminAuthController::class, 'profile']);
    
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');
    
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
        Route::get('/customers/{id}', [CustomerController::class, 'getCustomer']);
        Route::get('/customers/{id}/loyalty', [CustomerController::class, 'getLoyalty']);
    
        Route::get('/sales_orders', [SalesOrderController::class, 'index']);
    });
});


/* ---------------- PUBLIC MENU ---------------- */

// Public Menu

Route::get('/api/menu', [MenuController::class, 'publicMenu'])->name('menu.public');

// Upload Profile Picture
Route::post('/upload-profile-picture', function (Request $request) {
    $request->validate([
        'image' => 'required|image|max:2048'
    ]);

    // Store into storage/app/public/profile-pictures
    $path = $request->file('image')->store('profile-pictures', 'public');

    return response()->json([
        'message' => 'Uploaded successfully',
        'image_path' => $path,
        'url' => asset("storage/" . $path)
    ]);
});

/* ---------------- FALLBACK ---------------- */
Route::fallback(fn() => response()->json(['message' => 'Route not found.'], 404));
