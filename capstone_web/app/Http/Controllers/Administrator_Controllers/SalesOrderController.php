<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Notification;
use App\Models\Inventory;
use App\Models\InventoryLog;
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

    private function convertToBaseUnit(
        float $amount,
        string $fromUnit,
        string $baseUnit
    ): float {
        $map = [
            'tbsp' => ['ml' => 15, 'g' => 12],
            'tsp'  => ['ml' => 5,  'g' => 4],
            'cup'  => ['ml' => 240, 'g' => 120],
            'oz'   => ['ml' => 29.5735, 'g' => 28.3495],
            'ml'   => ['ml' => 1],
            'g'    => ['g' => 1],
            'pcs'  => ['pcs' => 1],
        ];

        $fromUnit = strtolower(trim($fromUnit));
        $baseUnit = strtolower(trim($baseUnit));

        if (!isset($map[$fromUnit][$baseUnit])) {
            throw new \Exception("Unsupported unit: $fromUnit → $baseUnit");
        }

        return $amount * $map[$fromUnit][$baseUnit];
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
                    'items' => $order->items ?? [],
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

    public function show(string $orderCode)
    {
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        return response()->json([
            'orderId' => $order->order_code,
            'customerName' => $order->customer_name,
            'orderDate' => $order->created_at,
            'orderType' => $order->fulfillment_method,
            'itemsRaw' => collect($order->items)->map(fn ($item) => [
                'id' => $item['id'] ?? null,
                'name' => $item['name'] ?? '',
                'type' => $item['type'] ?? '',
                'size' => $item['size'] ?? '',
                'quantity' => $item['quantity'] ?? 1,
                'price' => (float) ($item['price'] ?? 0),
                'is_free' => (bool) ($item['is_free'] ?? false),
                'instructions' => $item['instructions'] ?? '',
                'image' => $item['image'] ?? null,
            ])->values(),
            'totalAmount' => $order->total_amount,
            'paymentMethod' => $order->payment_method,
            'status' => $order->status,
        ]);
    }


    public function paymentHistory()
    {
        $payments = Order::whereNotNull('payment_method')
            ->orderBy('created_at', 'desc')
            ->get([
                'order_code',
                'customer_name',
                'created_at',
                'total_amount as amount',
                'payment_method as method',
                'status',
                'transaction_id'
            ]);

        return response()->json($payments);
    }

    public function updateStatus(Request $request, $orderCode)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,completed,canceled'
        ]);

        $order = Order::where('order_code', $orderCode)->firstOrFail();

        $oldStatus = $order->status;

        // Update status
        $order->status = $request->status;
        $order->save();

        /**
         * DEDUCT INVENTORY
         * Only when order transitions to COMPLETED
         */
        if ($oldStatus !== 'completed' && $request->status === 'completed') {

            DB::beginTransaction();

            try {
                foreach ($order->items as $item) {

                    // Skip free items
                    if (!empty($item['is_free'])) {
                        continue;
                    }

                    // Get menu item recipes
                    $recipes = DB::table('menu_item_recipes')
                        ->where('menu_item_id', $item['id'])
                        ->get();

                    foreach ($recipes as $recipe) {

                        // Lock inventory row
                        $inventory = Inventory::lockForUpdate()
                            ->findOrFail($recipe->inventory_id);

                        $requiredAmount = $recipe->amount * $item['quantity'];
                        $requiredUnit   = strtolower($recipe->unit);
                        $inventoryUnit  = strtolower($inventory->unit);
                        $baseUnit       = strtolower($inventory->base_unit);

                        // Same unit → direct compare
                        if ($requiredUnit === $inventoryUnit) {
                            if ($inventory->quantity < $requiredAmount) {
                                throw new \Exception(
                                    "Insufficient stock for {$inventory->name}"
                                );
                            }

                            $inventory->decrement('quantity', $requiredAmount);
                        } else {
                            // Convert to base unit
                            $requiredBase = $this->convertToBaseUnit(
                                $requiredAmount,
                                $requiredUnit,
                                $baseUnit
                            );

                            if ($inventory->quantity < $requiredBase) {
                                throw new \Exception(
                                    "Insufficient stock for {$inventory->name}"
                                );
                            }

                            $inventory->decrement('quantity', $requiredBase);
                        }

                        InventoryLog::create([
                            'inventory_id' => $inventory->id,
                            'action' => 'deducted',
                            'changed_fields' => [
                                'used' => $requiredAmount,
                                'remaining' => $inventory->quantity,
                            ],
                            'performed_by' => $this->actorName(),
                        ]);
                    }
                }

                DB::commit();

            } catch (\Throwable $e) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Inventory deduction failed',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        // Notification (unchanged)
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
        return response()->json(
            Order::whereNotNull('archived_at')
                ->orderBy('archived_at', 'desc')
                ->get()
        );
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
