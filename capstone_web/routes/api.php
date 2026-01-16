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
use App\Http\Controllers\Administrator_Controllers\EventInquiriesController;
use App\Http\Controllers\Administrator_Controllers\FeedbackController;
use App\Http\Controllers\Home_Controllers\ContactController;
use App\Http\Controllers\Home_Controllers\EventInquiryController;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;
use App\Http\Controllers\Customer_Controllers\CustomerSocialController;
use App\Http\Controllers\Customer_Controllers\ForgotPasswordController;
use App\Http\Controllers\Administrator_Controllers\NotificationController;
use App\Http\Controllers\Administrator_Controllers\ProfileController;




Route::prefix('customer')->group(function () {
    Route::post('/verify-code', [CustomerAuthController::class, 'verifyOtp']);
    Route::post('/resend-code', [CustomerAuthController::class, 'resendOtp']);
        // Step 1: Send reset OTP to email
    Route::post('/forgot-password', [CustomerAuthController::class, 'forgotPassword']);

    // Step 2: Verify OTP (used by VerificationCode.tsx)
    Route::post('/verify-reset-otp', [CustomerAuthController::class, 'verifyResetOtp']);

    // Step 3: Reset password
    Route::post('/reset-password', [CustomerAuthController::class, 'resetPassword']);
});





/* ---------------- PUBLIC ROUTES ---------------- */
// Event Inquiry
Route::post('/eventinquiry', [EventInquiryController::class, 'store']);

// Contact form
Route::post('/contact', [ContactController::class, 'store']);

/* ---------------- CUSTOMER SOCIAL LOGIN ---------------- */
Route::get('/auth/google/redirect', [CustomerSocialController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [CustomerSocialController::class, 'googleCallback']);

Route::get('/auth/facebook/redirect', [CustomerSocialController::class, 'facebookRedirect']);
Route::get('/auth/facebook/callback', [CustomerSocialController::class, 'facebookCallback']);


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
        Route::post('/create/resend-otp', [AdminsCreationController::class, 'resendOtp']);
        
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
        Route::get(
            '/sales_orders/{orderCode}',
            [SalesOrderController::class, 'show']
        )->name('superadmin.sales_orders.show');
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
    
        /* Event Inquiries */
        Route::get('/events', [EventInquiriesController::class, 'index']);
        Route::get('/events/{id}', [EventInquiriesController::class, 'show']);
        Route::patch('/events/{id}/status', [EventInquiriesController::class, 'updateStatus']);

        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::patch('/feedback/{feedback}/status', [FeedbackController::class, 'updateStatus']);

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
        )->name('admin.sales_orders.archived');
        Route::get(
            '/sales_orders/{orderCode}',
            [SalesOrderController::class, 'show']
        )->name('admin.sales_orders.show');
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
    
        /*  Event Inquiries */ 
        Route::get('/events', [EventInquiriesController::class, 'index']);
        Route::get('/events/{id}', [EventInquiriesController::class, 'show']);
        Route::patch('/events/{id}/status', [EventInquiriesController::class, 'updateStatus']);

        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::patch('/feedback/{feedback}/status', [FeedbackController::class, 'updateStatus']);

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

/* --------------- REVIEWS ---------------- */
Route::get('/feedback/approved', [FeedbackController::class, 'approved']);

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
