<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Kiosk\KioskOrderController;

Route::post('/kioskorders', [KioskOrderController::class, 'store'])->name('kioskorders.store');


/* ---------- Kiosk Featured Pages ---------- */

Route::get('/bubble-welcome', function () {
    return Inertia::render('kiosk_pages/Welcome');
});

Route::get('/productfeature', function () {
    return Inertia::render('kiosk_pages/Featured');
});

Route::get('/pickorder', function () {
    return Inertia::render('kiosk_pages/PickDineOrTake');
});

/* ---------- Home & Menu Pages ---------- */

Route::get('/kioskhome', function () {
    return Inertia::render('kiosk_pages/Home');
});

Route::get('/kioskmenu', function () {
    return Inertia::render('kiosk_pages/Menu');
});
 

/* ---------- Payment Selection ---------- */

Route::get('/paymentselect', function () {
    return Inertia::render('kiosk_pages/PaymentSelect');
});

Route::get('/qrcode', function () {
    return Inertia::render('kiosk_pages/QR');
});

Route::get('/ordernumber', function () {
    return Inertia::render('kiosk_pages/OrderNum');
});



require __DIR__.'/auth.php';
