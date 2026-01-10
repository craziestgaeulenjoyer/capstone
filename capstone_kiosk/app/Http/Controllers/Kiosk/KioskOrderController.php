<?php

namespace App\Http\Controllers\Kiosk; // ✅ Updated namespace

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KioskOrder;

class KioskOrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'orderNumber' => 'required|integer|unique:kiosk_orders,order_number',
            'customerName' => 'required|string',
            'paymentMethod' => 'required|string',
            'totalPrice' => 'required|numeric',
            'cartItems' => 'required|array',
        ]);

        $order = KioskOrder::create([
            'order_number' => $request->orderNumber,
            'customer_name' => $request->customerName,
            'payment_method' => $request->paymentMethod,
            'total_price' => $request->totalPrice,
            'cart_items' => $request->cartItems,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kiosk order created successfully',
            'data' => $order
        ]);
    }
}
