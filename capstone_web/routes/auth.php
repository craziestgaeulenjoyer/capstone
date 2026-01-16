<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Administrator_Controllers\AdminAuthController;
use App\Http\Controllers\Administrator_Controllers\SuperAdminAuthController;
use App\Http\Controllers\Administrator_Controllers\ForgotPasswordController;
use App\Models\Admin;
use App\Models\SuperAdmin;
use App\Http\Controllers\Customer_Controllers\CustomerAuthController;

Route::middleware(['web'])->group(function () {




    /*
    |----------------------------------------------------------
    | FORGOT PASSWORD (ADMIN + SUPER ADMIN)
    |----------------------------------------------------------
    | Public routes with CSRF protection.
    | Handles OTP email, verification, and password reset.
    */

    Route::prefix('forgot-password')->group(function () {

        // Step 1: Send 6-digit OTP to email
        Route::post('/send-otp', [ForgotPasswordController::class, 'sendOtp'])
            ->name('forgot.password.send');

        // Step 2: Verify OTP
        Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp'])
            ->name('forgot.password.verify');

        // Step 3: Reset password
        Route::post('/reset', [ForgotPasswordController::class, 'resetPassword'])
            ->name('forgot.password.reset');
    });

    /* ---------------- ADMIN AUTH ---------------- */
    Route::prefix('admin')->group(function () {

        // Login route
        Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login');

        // Email verification link
        Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {

            if (! $request->hasValidSignature()) {
                return response()->make(
                    '<h1>Verification link expired or invalid.</h1>',
                    403
                );
            }

            $admin = Admin::findOrFail($id);

            if (! $admin->hasVerifiedEmail()) {
                $admin->markEmailAsVerified();
            }

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
                            window.location.href='/admin/dashboard';
                        }
                    </script>
                </body>
                </html>
            HTML);

        })
        ->middleware('signed')
        ->name('admin.verification.verify');

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

            if (! $request->hasValidSignature()) {
                return response()->make(
                    '<h1>Verification link expired or invalid.</h1>',
                    403
                );
            }

            $superAdmin = SuperAdmin::findOrFail($id);

            if (! $superAdmin->hasVerifiedEmail()) {
                $superAdmin->markEmailAsVerified();
            }

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
                            window.location.href='/superadmin/dashboard';
                        }
                    </script>
                </body>
                </html>
            HTML);

        })
        ->middleware('signed')
        ->name('superadmin.verification.verify');

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
