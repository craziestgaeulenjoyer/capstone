<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/bubble-welcome', function () {
    return Inertia::render('kiosk_pages/Welcome');
});


require __DIR__.'/auth.php';
