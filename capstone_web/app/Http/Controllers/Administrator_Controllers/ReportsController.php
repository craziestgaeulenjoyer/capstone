<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Get daily / weekly / monthly reports
     */
    public function daily(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | INPUTS
        |--------------------------------------------------------------------------
        */
        $date  = Carbon::parse($request->query('date', now()));
        $range = $request->query('range', 'day'); // day | week | month

        /*
        |--------------------------------------------------------------------------
        | BASE QUERY (COMPLETED ORDERS ONLY)
        |--------------------------------------------------------------------------
        */
        $ordersQuery = DB::table('orders')
            ->where('status', 'completed');

        /*
        |--------------------------------------------------------------------------
        | DATE FILTER
        |--------------------------------------------------------------------------
        */
        if ($range === 'day') {
            $ordersQuery->whereDate('created_at', $date);
        }

        if ($range === 'week') {
            $ordersQuery->whereBetween('created_at', [
                $date->copy()->startOfWeek(),
                $date->copy()->endOfWeek(),
            ]);
        }

        if ($range === 'month') {
            $ordersQuery
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year);
        }

        /*
        |--------------------------------------------------------------------------
        | DAILY SALES (SUM)
        |--------------------------------------------------------------------------
        */
        $dailySales = (clone $ordersQuery)->sum('total_amount');

        /*
        |--------------------------------------------------------------------------
        | TOTAL ORDERS (COUNT)
        |--------------------------------------------------------------------------
        */
        $totalOrders = (clone $ordersQuery)->count();

        /*
        |--------------------------------------------------------------------------
        | NEW CUSTOMERS (BASED ON DATE)
        |--------------------------------------------------------------------------
        */
        $newCustomers = DB::table('customers')
            ->whereDate('created_at', $date)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | BEST-SELLING ITEM (JSONB items)
        |--------------------------------------------------------------------------
        */
        $bestSelling = DB::table('orders')
            ->crossJoin(DB::raw('jsonb_array_elements(orders.items) AS item'))
            ->where('orders.status', 'completed')
            ->whereDate('orders.created_at', $date)
            ->selectRaw("
                item->>'name' AS product_name,
                SUM((item->>'quantity')::int) AS total_qty
            ")
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->first();

        /*
        |--------------------------------------------------------------------------
        | SALES REPORT TABLE (FLATTENED ITEMS)
        |--------------------------------------------------------------------------
        */
        $salesItems = DB::table('orders')
            ->select('orders.total_amount', 'orders.items')
            ->where('orders.status', 'completed')
            ->when($range === 'day', function ($q) use ($date) {
                $q->whereDate('orders.created_at', $date);
            })
            ->when($range === 'week', function ($q) use ($date) {
                $q->whereBetween('orders.created_at', [
                    $date->copy()->startOfWeek(),
                    $date->copy()->endOfWeek(),
                ]);
            })
            ->when($range === 'month', function ($q) use ($date) {
                $q->whereMonth('orders.created_at', $date->month)
                ->whereYear('orders.created_at', $date->year);
            })
            ->get()
            ->flatMap(function ($order) {
                return collect(json_decode($order->items, true))->map(function ($item) use ($order) {
                    return [
                        'product_name'  => $item['name'],
                        'product_price' => $item['price'],
                        'quantity'      => $item['quantity'],
                        'total_amount'  => $order->total_amount,
                    ];
                });
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | BEST SELLING ITEMS WITH RANKING
        |--------------------------------------------------------------------------
        */
        $bestSellingItems = DB::table('orders')
            ->crossJoin(DB::raw('jsonb_array_elements(orders.items) AS item'))
            ->where('orders.status', 'completed')
            ->when($range === 'day', fn($q) => $q->whereDate('orders.created_at', $date))
            ->when($range === 'week', fn($q) => $q->whereBetween('orders.created_at', [$date->copy()->startOfWeek(), $date->copy()->endOfWeek()]))
            ->when($range === 'month', fn($q) => $q->whereMonth('orders.created_at', $date->month)->whereYear('orders.created_at', $date->year))
            ->selectRaw("
                item->>'name' AS product_name,
                SUM((item->>'quantity')::int) AS total_products_sold,
                SUM((item->>'quantity')::int * (item->>'price')::numeric) AS total_amount
            ")
            ->groupBy('product_name')
            ->orderByDesc('total_amount')
            ->get()
            ->map(function ($item, $index) {
                // Fetch categories from menu_items table
                $categories = DB::table('menu_items')
                    ->where('name', $item->product_name)
                    ->pluck('categories')
                    ->first();
                return [
                    'rank' => $index + 1,
                    'product_name' => $item->product_name,
                    'category' => $categories ? implode(', ', json_decode($categories, true)) : '',
                    'total_products_sold' => $item->total_products_sold,
                    'total_amount' => $item->total_amount,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */
        return response()->json([
            'dailySales'   => $dailySales,
            'totalOrders'  => $totalOrders,
            'newCustomers' => $newCustomers,
            'bestSelling'  => $bestSelling,
            'salesItems'   => $salesItems,
            'bestSellingItems' => $bestSellingItems,
        ]);
    }
}
