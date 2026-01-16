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

    // Get loyalty progress (based on drink quantities)
    public function getLoyalty($id)
    {
        $customer = DB::table('customers')->where('id', $id)->first();
        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        // Get completed orders only
        $orders = DB::table('orders')
            ->where('user_id', $id)
            ->where('status', 'completed')
            ->select('items')
            ->get();

        $totalDrinks = 0;

        foreach ($orders as $order) {
            $items = json_decode($order->items, true);

            if (!is_array($items)) continue;

            foreach ($items as $item) {
                if (
                    isset($item['type'], $item['quantity']) &&
                    $item['type'] === 'drink'
                ) {
                    $totalDrinks += (int) $item['quantity'];
                }
            }
        }

        // Loyalty math
        $freeDrinksEarned = intdiv($totalDrinks, 10); // every 10 drinks
        $remainingStamps = $totalDrinks % 10;         // 0–9 only

        return response()->json([
            'customer_id' => $id,
            'total_drinks' => $totalDrinks,
            'stamps' => $remainingStamps,
            'free_drinks_earned' => $freeDrinksEarned,
            'free_drinks_available' => $freeDrinksEarned, // adjust later if you track redemption
        ]);
    }
}
