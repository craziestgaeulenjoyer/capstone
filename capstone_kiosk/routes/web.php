<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Kiosk\KioskCartController;
use App\Http\Controllers\Kiosk\KioskOrderController;

Route::post('/kiosk/cart/add', [KioskCartController::class, 'add']);
Route::get('/kiosk/cart', [KioskCartController::class, 'get']);
Route::delete('/kiosk/cart/clear', [KioskCartController::class, 'clear']);

Route::post('/kioskorder', [KioskOrderController::class, 'store']);

Route::delete('/kiosk/customer', function (\Illuminate\Http\Request $request) {
    session([
        'kiosk_customer_name' => $request->customerName,
        'kiosk_payment_method' => $request->paymentMethod,
    ]);

    return response()->json(['ok' => true]);
});

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
