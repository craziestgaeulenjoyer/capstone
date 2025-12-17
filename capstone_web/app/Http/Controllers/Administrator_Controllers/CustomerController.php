<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CustomerController extends Controller
{
    // List all customers
    public function listCustomers()
    {
        $customers = DB::table('customers')
            ->select('id','full_name','email','phone_number','gender','birthday','profile_picture','created_at')
            ->get();

        $result = [];

        foreach ($customers as $cust) {
            $totalOrders = DB::table('orders')
                ->where('user_id', $cust->id)
                ->where('status', 'completed')
                ->count();

            $lastOrderDate = DB::table('orders')
                ->where('user_id', $cust->id)
                ->where('status', 'completed')
                ->orderBy('created_at', 'desc')
                ->value('created_at');

            $status = 'Inactive';
            if ($totalOrders > 0) $status = 'Active';
            if (Carbon::parse($cust->created_at)->greaterThanOrEqualTo(Carbon::now()->subDays(7))) {
                $status = 'New';
            }

            $result[] = [
                'id' => $cust->id,
                'full_name' => $cust->full_name ?? 'No Name',
                'email' => $cust->email ?? 'N/A',
                'phone_number' => $cust->phone_number ?? 'N/A',
                'gender' => $cust->gender ?? 'N/A',
                'birthday' => $cust->birthday ?? 'N/A',
                'profile_picture' => $cust->profile_picture ?? null,
                'orders' => $totalOrders,
                'lastOrder' => $lastOrderDate ? Carbon::parse($lastOrderDate)->format('M d, Y') : 'No Orders',
                'status' => $status,
                'created_at' => $cust->created_at,
            ];
        }

        return response()->json($result);
    }

    // Get single customer by ID (for profile modal)
    public function getCustomer($id)
    {
        $customer = DB::table('customers')->where('id', $id)->first();

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $totalOrders = DB::table('orders')
            ->where('user_id', $customer->id)
            ->where('status', 'completed')
            ->count();

        $lastOrderDate = DB::table('orders')
            ->where('user_id', $customer->id)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->value('created_at');

        $status = 'Inactive';
        if ($totalOrders > 0) $status = 'Active';
        if (Carbon::parse($customer->created_at)->greaterThanOrEqualTo(Carbon::now()->subDays(7))) {
            $status = 'New';
        }

        return response()->json([
            'id' => $customer->id,
            'full_name' => $customer->full_name,
            'gender' => $customer->gender,
            'birthday' => $customer->birthday,
            'phone_number' => $customer->phone_number,
            'email' => $customer->email,
            'profile_picture' => $customer->profile_picture,
            'orders' => $totalOrders,
            'lastOrder' => $lastOrderDate ? Carbon::parse($lastOrderDate)->format('M d, Y') : 'No Orders',
            'status' => $status,
            'created_at' => $customer->created_at,
        ]);
    }

    // Get loyalty progress (number of completed orders)
    public function getLoyalty($id)
    {
        // Get customer
        $customer = DB::table('customers')->where('id', $id)->first();

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        // Fetch all completed orders for this customer's email
        $orders = DB::table('orders')
            ->where('customer_email', $customer->email)
            ->where('status', 'completed')
            ->get();

        $totalDrinks = 0;

        foreach ($orders as $order) {

            // Decode JSONB items
            $items = json_decode($order->items, true);

            if (is_array($items)) {
                foreach ($items as $item) {
                    // Add quantity safely
                    if (isset($item['quantity'])) {
                        $totalDrinks += intval($item['quantity']);
                    }
                }
            }
        }

        // Free drink when drinks >= 10
        $freeAvailable = $totalDrinks >= 10;

        return response()->json([
            'customer_id' => $id,
            'stamps' => $totalDrinks,
            'free_drink_available' => $freeAvailable,
            'free_drink_redeemed' => false   
        ]);
    }
}
