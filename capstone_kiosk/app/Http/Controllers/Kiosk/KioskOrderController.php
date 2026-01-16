<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\KioskOrder;
use App\Models\Customer; 

class KioskOrderController extends Controller
{
    public function store(Request $request)
    {
        $orderCode = strtoupper(substr(uniqid(), -6));

        $userId = null;

        $customer = Customer::where('full_name', $request->customerName)->first();
        if ($customer) {
            $userId = $customer->id;
        }

        $order = KioskOrder::create([
            'order_code'     => $orderCode,
            'user_id'        => $userId,                
            'customer_name'  => $request->customerName,
            'payment_method' => $request->paymentMethod,
            'fulfillment_method'  => $request->fulfillmentMethod,
            'total_amount'   => $request->totalPrice,
            'items'          => $request->cartItems,
            'status'         => 'pending',
        ]);

        return response()->json([
            'orderCode' => $order->order_code
        ]);
    }
}
