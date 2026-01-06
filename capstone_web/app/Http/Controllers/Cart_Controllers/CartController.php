<?php

namespace App\Http\Controllers\Cart_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    // ✅ Add to cart
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id'   => 'required|integer',
            'product_name' => 'required|string',
            'size'         => 'nullable|string',
            'quantity'     => 'required|integer|min:1',
            'instructions' => 'nullable|string',
            'price'        => 'required|numeric',
        ]);

        $customer = $request->user(); // Sanctum

        if (!$customer) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data['customer_id'] = $customer->id;

        $cartItem = CartItem::create($data);

        return response()->json([
            'message' => 'Item added to cart',
            'item' => $cartItem,
        ]);
    }

    // ✅ Fetch cart items
    public function items(Request $request)
    {
        $customer = $request->user();

        if (!$customer) {
            return response()->json(['items' => []]);
        }

        $items = CartItem::where('customer_id', $customer->id)->get();

        return response()->json(['items' => $items]);
    }

    // ✅ Cart count
    public function count(Request $request)
    {
        $customer = $request->user();

        if (!$customer) {
            return response()->json(['count' => 0]);
        }

        $count = CartItem::where('customer_id', $customer->id)
            ->sum('quantity');

        return response()->json(['count' => $count]);
    }

    // ✅ Remove item
    public function destroy($id, Request $request)
    {
        $customer = $request->user();

        $item = CartItem::where('id', $id)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Item removed']);
    }
}
