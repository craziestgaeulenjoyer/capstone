<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Models\Admin;
use App\Models\SuperAdmin;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;
/*
|--------------------------------------------------------------------------
| AUTH ROUTES (ADMIN + SUPER ADMIN)
|--------------------------------------------------------------------------
| Wrapped in 'web' middleware to ensure sessions, CSRF, and cookies work.
| These routes handle login, email verification, and dashboards.
*/

Route::middleware(['web'])->group(function () {

     /* =========================
       CUSTOMER AUTH ROUTES
    ==========================*/
    Route::prefix('customer')->group(function () {

        /* ---- SIGNUP PROCESS ---- */
        Route::post('/signup', [CustomerAuthController::class, 'signup'])
            ->name('customer.signup.store');

        Route::post('/signup/verify', [CustomerAuthController::class, 'verifyOtp'])
            ->name('customer.signup.verify');

        Route::post('/signup/resend', [CustomerAuthController::class, 'resendOtp'])
            ->name('customer.signup.resend');

        // After OTP verification → show form to complete profile
        Route::get('/signup/form', [CustomerAuthController::class, 'showSignupForm'])
            ->name('customer.signup.form');

        // Show Verification screen
        Route::get('/verification', [CustomerAuthController::class, 'showVerification'])
            ->name('customer.verification');

        /* ---- LOGIN ---- */
        Route::post('/login', [CustomerAuthController::class, 'login'])
            ->name('customer.login');

        /* ---- PROTECTED CUSTOMER DASHBOARD ---- */
        Route::middleware(['auth:customer', 'customer.verified'])->group(function () {

            Route::get('/dashboard', function () {
                return Inertia::render('CustomerDashboard/Home');
            })->name('customer.dashboard');

            Route::post('/logout', [CustomerAuthController::class, 'logout'])
                ->name('customer.logout');
        });

    });


    /* ---------------- ADMIN AUTH ---------------- */
    Route::prefix('admin')->group(function () {

        // Login route
        Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login');

        // Email verification link
        Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {
            $admin = Admin::find($id);
            if (!$admin) return response()->json(['message' => 'Invalid verification link or user not found'], 404);

            if (!hash_equals(sha1($admin->getEmailForVerification()), $hash)) {
                return response()->json(['message' => 'Invalid or expired verification link'], 400);
            }

            if (!$admin->hasVerifiedEmail()) $admin->markEmailAsVerified();

            return response()->make(<<<HTML
                <html>
                <head><title>Email Verified</title></head>
                <body style="font-family:Arial;text-align:center;padding:40px;">
                    <h1 style="color:#16a34a;">✅ Email Verified!</h1>
                    <p>You can close this tab. Redirecting...</p>
                    <script>
                        if(window.opener){
                            window.opener.postMessage({type:'EMAIL_VERIFIED', role:'admin'}, '*');
                            setTimeout(()=>window.close(),1500);
                        } else {
                            window.location.href='/admin/';
                        }
                    </script>
                </body>
                </html>
            HTML);
        })->name('admin.verification.verify');

        // Resend verification email
        Route::post('/email/resend', [AdminAuthController::class, 'resendVerificationEmail']);

        // Protected admin dashboard
        Route::middleware(['auth:admin', 'admin.verified'])->group(function () {
            Route::get('/dashboard/{subpage?}', fn($subpage = null) => Inertia::render('Admin_Dashboard/DashboardLayout', [
                'subpage' => $subpage
            ]))->where('subpage', '.*')->name('admin.dashboard');

            Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
        });
    });


    /* ---------------- SUPER ADMIN AUTH ---------------- */
    Route::prefix('superadmin')->group(function () {

        // Login route
        Route::post('/login', [SuperAdminAuthController::class, 'login'])->name('superadmin.login');

        // Email verification link
        Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {
            $superAdmin = SuperAdmin::find($id);
            if (!$superAdmin) return response()->json(['message' => 'Invalid verification link or user not found'], 404);

            if (!hash_equals(sha1($superAdmin->getEmailForVerification()), $hash)) {
                return response()->json(['message' => 'Invalid or expired verification link'], 400);
            }

            if (!$superAdmin->hasVerifiedEmail()) $superAdmin->markEmailAsVerified();

            return response()->make(<<<HTML
                <html>
                <head><title>Email Verified</title></head>
                <body style="font-family:Arial;text-align:center;padding:40px;">
                    <h1 style="color:#16a34a;">✅ Email Verified!</h1>
                    <p>You can close this tab. Redirecting...</p>
                    <script>
                        if(window.opener){
                            window.opener.postMessage({type:'EMAIL_VERIFIED', role:'super_admin'}, '*');
                            setTimeout(()=>window.close(),1500);
                        } else {
                            window.location.href='/superadmin/';
                        }
                    </script>
                </body>
                </html>
            HTML);
        })->name('superadmin.verification.verify');

        // Resend verification email
        Route::post('/email/resend', [SuperAdminAuthController::class, 'resendVerificationEmail']);

        // Protected super admin dashboard
        Route::middleware(['auth:super_admin', 'superadmin.verified'])->group(function () {
            Route::get('/dashboard/{subpage?}', fn($subpage = null) => Inertia::render('SuperAdmin_Dashboard/DashboardLayout', [
                'subpage' => $subpage
            ]))->where('subpage', '.*')->name('superadmin.dashboard');

            Route::post('/logout', [SuperAdminAuthController::class, 'logout'])->name('superadmin.logout');
        });
    });
});
