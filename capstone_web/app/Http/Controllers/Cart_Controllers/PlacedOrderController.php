<?php

namespace App\Http\Controllers\Cart_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PlacedOrder;
use App\Models\OrderItem;
use App\Models\CartItem;

class PlacedOrderController extends Controller
{
    public function confirm(Request $request)
    {
        $customer = $request->user();

        $cartItems = CartItem::where('customer_id', $customer->id)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $subtotal = $cartItems->sum(fn ($i) => $i->price * $i->quantity);
        $taxes = $subtotal * 0.10;
        $loyalty = (float) $request->loyalty_discount;
        $total = $subtotal + $taxes - $loyalty;

        DB::beginTransaction();

        try {
            $order = PlacedOrder::create([
                'customer_id' => $customer->id,
                'full_name' => $customer->full_name,
                'email' => $customer->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'payment_type' => $request->payment_type,
                'payment_proof' => $request->payment_proof ?? null,
                'subtotal' => $subtotal,
                'taxes' => $taxes,
                'loyalty_discount' => $loyalty,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'placed_order_id' => $order->id,
                    'product_name' => $item->product_name,
                    'size' => $item->size,
                    'flavor' => $item->flavor,
                    'add_on' => $item->add_on,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }

            CartItem::where('customer_id', $customer->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
