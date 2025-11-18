<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Import Carbon for date manipulation

class CustomerController extends Controller
{
    public function listCustomers()
    {
        // Fetch all customers along with their created_at for 'New' status check
        $customers = DB::table('customers')->select(
            'id',
            'full_name',
            'email',
            'phone_number',
            'created_at'
        )->get();

        $result = [];

        foreach ($customers as $cust) {
            // Count completed orders
            $totalOrders = DB::table('orders')
                ->where('user_id', $cust->id)
                ->where('status', 'completed')
                ->count();

            // Last completed order date
            $lastOrderDate = DB::table('orders')
                ->where('user_id', $cust->id)
                ->where('status', 'completed')
                ->orderBy('created_at', 'desc')
                ->value('created_at'); // This will return the created_at timestamp

            // Determine status
            $status = 'Inactive';
            if ($totalOrders > 0) {
                $status = 'Active';
            }
            // Check if customer joined within the last 7 days for 'New' status
            // Using Carbon to compare dates
            if (Carbon::parse($cust->created_at)->greaterThanOrEqualTo(Carbon::now()->subDays(7))) {
                $status = 'New';
            }


            $result[] = [
                'id' => $cust->id,
                'name' => $cust->full_name ?? 'No Name',
                'contact' => $cust->email ?? $cust->phone_number ?? 'N/A', // Prioritize email, then phone, then N/A
                'orders' => $totalOrders,
                'lastOrder' => $lastOrderDate ? Carbon::parse($lastOrderDate)->format('M d, Y') : 'No Orders', // Format date for frontend
                'status' => $status,
            ];
        }

        return response()->json($result);
    }
}