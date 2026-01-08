<?php

namespace App\Http\Controllers\Customer_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer; 
class CustomerProfileController extends Controller
{
  public function profile(Request $request)
{
    $customer = $request->user(); // authenticated via token
    if (!$customer) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    return response()->json([
        'customer' => [
            'id' => $customer->id,
            'full_name' => $customer->full_name,
            'email' => $customer->email,
            'avatar' => $customer->avatar,
        ],
    ]);
}
}
