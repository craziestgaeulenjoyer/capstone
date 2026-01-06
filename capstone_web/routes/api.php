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
use App\Http\Controllers\Administrator_Controllers\AnalyticsController;
use App\Http\Controllers\Administrator_Controllers\ReportsController;
use App\Http\Controllers\Administrator_Controllers\NotificationController;
use App\Http\Controllers\Administrator_Controllers\ProfileController;

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

        /* Profile */
        Route::get('/profile', [SuperAdminAuthController::class, 'profile']);

        /* Menu */
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');

        Route::get('/inventory/logs', [InventoryController::class, 'logs'])->name('inventory.logs');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');

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

        /* Reports */
        Route::get('/reports/daily', [ReportsController::class, 'daily']);
    
        /* Dashboard Revenue */
        Route::get('/analytics/revenue-per-day', [AnalyticsController::class, 'revenuePerDay']);
    });

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});

/* ================= ADMIN ROUTES ================= */
Route::prefix('admin')->group(function () {

    Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

    Route::middleware(['auth:sanctum'])->group(function () {

        Route::get('/', fn () => response()->json(['message' => 'Admin dashboard']));
        Route::get('/profile', [AdminAuthController::class, 'profile']);

        /* Menu */
        Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
        Route::get('/menu-items', [MenuController::class, 'list'])->name('menu.index');
        Route::put('/menu-items/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');

        Route::get('/inventory/logs', [InventoryController::class, 'logs'])->name('inventory.logs');

        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        Route::patch('/inventory/archive/{id}', [InventoryController::class, 'archive'])->name('inventory.archive');
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

        /* Reports */
        Route::get('/reports/daily', [ReportsController::class, 'daily']);
    
        /* Dashboard Revenue */
        Route::get('/analytics/revenue-per-day', [AnalyticsController::class, 'revenuePerDay']);
    
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    });
});

/* ================= PUBLIC ================= */
Route::get('/api/menu', [MenuController::class, 'publicMenu']);

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
