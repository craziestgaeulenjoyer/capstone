<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\AdminsCreationController;
use App\Http\Controllers\Administrator_Controllers\AdminManagementController;
use App\Http\Controllers\Administrator_Controllers\MenuController;
use App\Http\Controllers\Administrator_Controllers\InventoryController;
use App\Http\Controllers\Administrator_Controllers\CustomerController;
use App\Http\Controllers\Administrator_Controllers\SalesOrderController;
use App\Http\Controllers\Administrator_Controllers\AnalyticsController;
use App\Http\Controllers\Administrator_Controllers\ReportsController;
use App\Http\Controllers\Home_Controllers\ContactController;
use App\Http\Controllers\Home_Controllers\EventInquiryController;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;
use App\Http\Controllers\Customer_Controllers\CustomerSocialController;
use App\Http\Controllers\Customer_Controllers\ForgotPasswordController;
use App\Http\Controllers\Administrator_Controllers\NotificationController;
use App\Http\Controllers\Administrator_Controllers\ProfileController;

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



/* ================= EMAIL CHANGE VERIFICATION ================= */

Route::middleware(['auth:sanctum'])->group(function () {
    // Step 1: Request verification email
    Route::post('/email-change/request', [ProfileController::class, 'requestEmailChange']);

    // Step 1: Request OTP for password change
    Route::post('/password-change/request-otp', [
        ProfileController::class,
        'requestPasswordChangeOtp'
    ]);

    // Step 2: Verify OTP
    Route::post('/password-change/verify-otp', [
        ProfileController::class,
        'verifyPasswordChangeOtp'
    ]);

    // Step 3: Change password (after OTP verified)
    Route::post('/password-change/confirm', [
        ProfileController::class,
        'changePassword'
    ]);
});

/* ================= SUPER ADMIN ROUTES ================= */
Route::prefix('superadmin')->group(function () {

    Route::post('/email/resend', [SuperAdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {

        Route::get('/', fn () => response()->json(['message' => 'Super Admin dashboard']));

        /* Admin Creation */
        Route::post('/create/request-otp', [AdminsCreationController::class, 'requestOtp']);
        Route::post('/create/verify-otp', [AdminsCreationController::class, 'verifyOtp']);
        Route::get('/admins', [AdminsCreationController::class, 'getAllAdmins']);

        Route::put('/admins/{id}', [AdminManagementController::class, 'update']);

        /* Profile */
        Route::get('/profile', [SuperAdminAuthController::class, 'profile']);

        /* Menu */
        Route::post('/menu-items', [MenuController::class, 'store'])->name('superadmin.menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('superadmin.menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('superadmin.menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('superadmin.menu.destroy');

        Route::get('/inventory/logs', [InventoryController::class, 'logs'])->name('superadmin.inventory.logs');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('superadmin.inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('superadmin.inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('superadmin.inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('superadmin.inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('superadmin.inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('superadmin.inventory.archive');

        /* Customers */
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
        Route::get('/customers/{id}', [CustomerController::class, 'getCustomer']);
        Route::get('/customers/{id}/loyalty', [CustomerController::class, 'getLoyalty']);

        /* ================= SALES ORDERS ================= */
        Route::get('/sales_orders', [SalesOrderController::class, 'index']);
        Route::get('/payment_history', [SalesOrderController::class, 'paymentHistory']);
        Route::get(
            '/sales_orders/archived',
            [SalesOrderController::class, 'archived']
        )->name('superadmin.sales_orders.archived');
        Route::put(
            '/sales_orders/{orderCode}/status',
            [SalesOrderController::class, 'updateStatus']
        )->name('superadmin.sales_orders.update_status');

        Route::patch(
            '/sales_orders/{orderCode}/archive',
            [SalesOrderController::class, 'archive']
        )->name('superadmin.sales_orders.archive');

        Route::delete(
            '/sales_orders/{orderCode}',
            [SalesOrderController::class, 'destroy']
        )->name('superadmin.sales_orders.destroy');

        /* Analytics */
        Route::get('/analytics', [AnalyticsController::class, 'index']);
        Route::get('/analytics/revenue-per-day', [AnalyticsController::class, 'revenuePerDay']);
        Route::get('/analytics/peak-hours', [AnalyticsController::class, 'peakHours']);

        /* Reports */
        Route::get('/reports/daily', [ReportsController::class, 'daily']);
    
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });
});

/* ================= ADMIN ROUTES ================= */
Route::prefix('admin')->group(function () {

    Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {

        Route::get('/', fn () => response()->json(['message' => 'Admin dashboard']));
        Route::get('/profile', [AdminAuthController::class, 'profile']);

        /* Menu */
        Route::post('/menu-items', [MenuController::class, 'store'])->name('admin.menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('admin.menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('admin.menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('admin.menu.destroy');

        Route::get('/inventory/logs', [InventoryController::class, 'logs'])->name('admin.inventory.logs');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('admin.inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('admin.inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('admin.inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('admin.inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('admin.inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('admin.inventory.archive');
        /* Customers */
        Route::get('/customers', [CustomerController::class, 'listCustomers']);
        Route::get('/customers/{id}', [CustomerController::class, 'getCustomer']);
        Route::get('/customers/{id}/loyalty', [CustomerController::class, 'getLoyalty']);

        /* ================= SALES ORDERS ================= */
        Route::get('/sales_orders', [SalesOrderController::class, 'index']);
        Route::get('/payment_history', [SalesOrderController::class, 'paymentHistory']);
        Route::get(
            '/sales_orders/archived',
            [SalesOrderController::class, 'archived']
        )->name('sales_orders.archived');
        Route::put(
            '/sales_orders/{orderCode}/status',
            [SalesOrderController::class, 'updateStatus']
        )->name('admin.sales_orders.update_status');

        Route::patch(
            '/sales_orders/{orderCode}/archive',
            [SalesOrderController::class, 'archive']
        )->name('admin.sales_orders.archive');

        Route::delete(
            '/sales_orders/{orderCode}',
            [SalesOrderController::class, 'destroy']
        )->name('admin.sales_orders.destroy');

        /* Analytics */
        Route::get('/analytics', [AnalyticsController::class, 'index']);
        Route::get('/analytics/revenue-per-day', [AnalyticsController::class, 'revenuePerDay']);
        Route::get('/analytics/peak-hours', [AnalyticsController::class, 'peakHours']);

        /* Reports */
        Route::get('/reports/daily', [ReportsController::class, 'daily']);
    
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });
});


/* ---------------- PUBLIC MENU ---------------- */

/* ================= PUBLIC ================= */
Route::get('/menu', [MenuController::class, 'publicMenu']);
// Public Menu

Route::get('/menu', [MenuController::class, 'publicMenu'])->name('menu.public');

/* Upload Profile Picture */
Route::post('/upload-profile-picture', function (Request $request) {
    $request->validate(['image' => 'required|image|max:2048']);

    $path = $request->file('image')->store('profile-pictures', 'public');

    return response()->json([
        'message' => 'Uploaded successfully',
        'image_path' => $path,
        'url' => asset("storage/" . $path),
    ]);
});

/* ================= FALLBACK ================= */
Route::fallback(fn () => response()->json(['message' => 'Route not found.'], 404));
