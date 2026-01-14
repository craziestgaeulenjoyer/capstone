<?php

namespace App\Http\Controllers\Kiosk;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class KioskCartController extends Controller
{
    public function add(Request $request)
    {
        session(['kiosk_cart' => $request->cartItems]);
        return response()->json(['ok' => true]);
    }

    public function get()
    {
        return response()->json(session('kiosk_cart', []));
    }

    public function clear()
    {
        session()->forget('kiosk_cart');
        return response()->json(['cleared' => true]);
    }
}
