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

        DB::beginTransaction();

        try {

            /* =====================================================
            ✅ SOLD-OUT / RECIPE VALIDATION (PUT THIS HERE)
            ====================================================== */

            foreach ($cartItems as $cartItem) {

                $menuItem = DB::table('menu_items')
                    ->where('id', $cartItem->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$menuItem || !$menuItem->is_available) {
                    throw new \Exception("{$cartItem->product_name} is sold out.");
                }

                $recipes = DB::table('menu_item_recipes')
                    ->where('menu_item_id', $menuItem->id)
                    ->get();

                if ($recipes->isEmpty()) {
                    throw new \Exception("{$cartItem->product_name} has no recipe and is unavailable.");
                }

                foreach ($recipes as $recipe) {
                    $inventory = DB::table('inventories')
                        ->where('id', $recipe->inventory_id)
                        ->lockForUpdate()
                        ->first();

                    if (!$inventory) {
                        throw new \Exception("Missing inventory for {$cartItem->product_name}");
                    }

                    // REQUIRED amount = recipe amount × cart quantity
                    $requiredPerItem = $this->convertToBaseUnit(
                        $recipe->amount,
                        $recipe->unit,
                        $inventory->base_unit
                    );

                    $totalRequired = $requiredPerItem * $cartItem->quantity;

                    if ($inventory->quantity < $totalRequired) {
                        throw new \Exception(
                            "{$cartItem->product_name} is sold out (insufficient {$inventory->name})"
                        );
                    }
                }
            }

            /* =====================================================
            ✅ CREATE ORDER (SAFE TO CONTINUE)
            ====================================================== */

            $subtotal = $cartItems->sum(fn ($i) => $i->price * $i->quantity);
            $taxes = $subtotal * 0.10;
            $loyalty = (float) $request->loyalty_discount;
            $total = $subtotal + $taxes - $loyalty;

            $order = PlacedOrder::create([
                'customer_id' => $customer->id,
                'full_name' => $customer->full_name,
                'email' => $customer->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'payment_type' => $request->payment_type,
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

            DB::statement('SELECT refresh_menu_availability()');

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
