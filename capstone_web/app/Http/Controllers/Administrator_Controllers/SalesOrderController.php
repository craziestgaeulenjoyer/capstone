<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class SalesOrderController extends Controller
{
    // Fetch all orders
    public function index()
    {
        try {
            $orders = Order::orderBy('created_at', 'desc')->get();

            $formattedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'customer_address' => $order->customer_address,
                    'payment_method' => $order->payment_method,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'transaction_id' => $order->transaction_id,
                    'items' => $order->items,
                    'fulfillment_method' => $order->fulfillment_method,  
                    'created_at' => $order->created_at->toDateTimeString(),
                ];
            });

            return response()->json($formattedOrders, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
