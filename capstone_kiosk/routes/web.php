<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/* ---------- Kiosk Featured Pages ---------- */

Route::get('/bubble-welcome', function () {
    return Inertia::render('kiosk_pages/Welcome');
});

Route::get('/productfeature', function () {
    return Inertia::render('kiosk_pages/Featured');
});

/* ---------- Home Pages ---------- */

Route::get('/kioskhome', function () {
    return Inertia::render('kiosk_pages/Home');
});

require __DIR__.'/auth.php';
