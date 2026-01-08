<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesOrderController extends Controller
{
    private function actorName(): string
    {
        if (auth('super_admin')->check()) {
            return auth('super_admin')->user()->name;
        }

        if (auth('admin')->check()) {
            return auth('admin')->user()->name;
        }

        return 'System';
    }
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

    public function paymentHistory()
    {
        $payments = DB::table('orders')
            ->whereNotNull('payment_method')
            ->select(
                'order_code as transaction_id',
                'customer_name',
                'created_at',
                'total_amount as amount',
                'payment_method as method',
                'status'
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }

    public function updateStatus(Request $request, $orderCode)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,completed,canceled'
        ]);

        $order = Order::where('order_code', $orderCode)->firstOrFail();

        $oldStatus = $order->status;

        // Update
        $order->status = $request->status;
        $order->save();

        // Create notification ONLY if it actually changed
        if ($oldStatus !== $order->status) {
            Notification::create([
                'type' => 'sales_order',
                'action' => 'Updated',
                'subject' => "Order #{$order->order_code}",
                'changed_fields' => [
                    'status' => [
                        'old' => $oldStatus,
                        'new' => $order->status,
                    ],
                ],
                'performed_by' => $this->actorName(),
            ]);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'status' => $order->status
        ], 200);
    }

    public function archive($orderCode)
    {
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        $order->archived_at = Carbon::now();
        $order->save();

        Notification::create([
            'type' => 'sales_order',
            'action' => 'Archived',
            'subject' => "Order #{$order->order_code}",
            'changed_fields' => null,
            'performed_by' => $this->actorName(),
        ]);

        return response()->json([
            'message' => 'Order archived successfully'
        ], 200);
    }

    public function archived()
    {
        try {
            $orders = Order::whereNotNull('archived_at')
                ->orderBy('archived_at', 'desc')
                ->get();

            return response()->json($orders, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch archived orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($orderCode)
    {
        $order = Order::where('order_code', $orderCode)->firstOrFail();
        $order->delete();

        Notification::create([
            'type' => 'sales_order',
            'action' => 'Deleted',
            'subject' => "Order #{$order->order_code}",
            'changed_fields' => null,
            'performed_by' => $this->actorName(),
        ]);

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
