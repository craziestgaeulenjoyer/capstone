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
    $customer = auth('customer')->user();

    if (!$customer) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $data = $request->validate([
        'product_id'   => 'required|integer',
        'product_name' => 'required|string',
        'size'         => 'nullable|string',
        'quantity'     => 'required|integer|min:1',
        'instructions'=> 'nullable|string',
        'price'        => 'required|numeric',
    ]);

    $data['customer_id'] = $customer->id;

    $cartItem = CartItem::create($data);

    return response()->json([
        'message' => 'Item added to cart',
        'item' => $cartItem,
    ]);
}


    // ✅ Fetch cart items
 public function items()
{
    $customer = auth('customer')->user();

    $items = CartItem::where('customer_id', $customer->id)->get();

    return response()->json(['items' => $items]);
}


    // ✅ Cart count
public function count()
{
    $customer = auth('customer')->user();

    $count = CartItem::where('customer_id', $customer->id)
        ->sum('quantity');

    return response()->json(['count' => $count]);
}

    // ✅ Remove item
 public function destroy($id)
{
    $customer = auth('customer')->user();

    $item = CartItem::where('id', $id)
        ->where('customer_id', $customer->id)
        ->firstOrFail();

    $item->delete();

    return response()->json(['message' => 'Item removed']);
}
}
