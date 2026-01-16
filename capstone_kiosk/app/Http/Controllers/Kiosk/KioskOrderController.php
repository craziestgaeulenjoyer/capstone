<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\KioskOrder;

class KioskOrderController extends Controller
{
    public function store(Request $request)
{
    $order = KioskOrder::create([
        'order_number' => 'MI-' . str_pad(random_int(0, 999), 3, '0', STR_PAD_LEFT),

        'customer_name' => $request->customerName,
        'payment_method' => $request->paymentMethod,
        'total_price' => $request->totalPrice,
        'cart_items' => $request->cartItems,
    ]);

    return response()->json([
        'orderNumber' => $order->order_number
    ]);
}

}
