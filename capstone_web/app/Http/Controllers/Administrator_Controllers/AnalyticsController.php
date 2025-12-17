<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $view = $request->query('view', 'day');
            $date = $request->query('date');

            if (!$date) {
                return response()->json(['message' => 'Date is required'], 422);
            }

            $baseDate = Carbon::createFromFormat('Y-m-d', $date, 'Asia/Manila');

            // Determine date range based on view
            match ($view) {
                'day'   => [$start, $end] = [$baseDate->copy()->startOfDay(), $baseDate->copy()->endOfDay()],
                'month' => [$start, $end] = [$baseDate->copy()->startOfMonth(), $baseDate->copy()->endOfMonth()],
                'year'  => [$start, $end] = [$baseDate->copy()->startOfYear(), $baseDate->copy()->endOfYear()],
                default => response()->json(['message' => 'Invalid view'], 422)->throwResponse(),
            };

            /* ===============================
             * Orders per period
             * =============================== */
            $ordersPerPeriod = [];

            if ($view === 'day') {
                $raw = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')::int AS hour,
                        COUNT(*) AS orders,
                        COUNT(DISTINCT user_id) AS customers,
                        COALESCE(SUM(total_amount),0) AS revenue
                    ")
                    ->groupByRaw("EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')")
                    ->get()
                    ->keyBy('hour');

                $ordersPerPeriod = collect(range(0, 23))->map(fn ($h) => [
                    'hour'      => $h,
                    'orders'    => (int) ($raw[$h]->orders ?? 0),
                    'customers' => (int) ($raw[$h]->customers ?? 0),
                    'revenue'   => (float) ($raw[$h]->revenue ?? 0),
                ]);
            }

            if ($view === 'month') {
                $ordersPerPeriod = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        DATE(created_at AT TIME ZONE 'Asia/Manila') AS day,
                        COUNT(*) AS orders,
                        COUNT(DISTINCT user_id) AS customers,
                        COALESCE(SUM(total_amount),0) AS revenue
                    ")
                    ->groupByRaw("DATE(created_at AT TIME ZONE 'Asia/Manila')")
                    ->orderBy('day')
                    ->get();
            }

            if ($view === 'year') {
                $ordersPerPeriod = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Manila')::int AS month,
                        COUNT(*) AS orders,
                        COUNT(DISTINCT user_id) AS customers,
                        COALESCE(SUM(total_amount),0) AS revenue
                    ")
                    ->groupByRaw("EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Manila')")
                    ->orderBy('month')
                    ->get();
            }

            /* ===============================
             * Sales chart
             * =============================== */
            $salesData = [];
            if ($view === 'day') {
                $raw = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')::int AS hour,
                        COALESCE(SUM(total_amount),0) AS value,
                        COUNT(*) AS orders
                    ")
                    ->groupByRaw("EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')")
                    ->get()
                    ->keyBy('hour');

                $salesData = collect(range(0, 23))->map(fn ($h) => [
                    'name'   => $h,
                    'value'  => (float) ($raw[$h]->value ?? 0),
                    'orders' => (int) ($raw[$h]->orders ?? 0),
                ]);
            }

            if ($view === 'month') {
                $salesData = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        DATE(created_at AT TIME ZONE 'Asia/Manila') AS date,
                        COALESCE(SUM(total_amount),0) AS value,
                        COUNT(*) AS orders
                    ")
                    ->groupByRaw("DATE(created_at AT TIME ZONE 'Asia/Manila')")
                    ->orderBy('date')
                    ->get()
                    ->map(fn ($r) => [
                        'name'   => Carbon::parse($r->date)->format('M d'),
                        'value'  => (float) $r->value,
                        'orders' => (int) $r->orders,
                    ]);
            }

            if ($view === 'year') {
                $salesData = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Manila')::int AS month,
                        COALESCE(SUM(total_amount),0) AS value,
                        COUNT(*) AS orders
                    ")
                    ->groupByRaw("EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Manila')")
                    ->orderBy('month')
                    ->get()
                    ->map(fn ($r) => [
                        'name'   => Carbon::createFromDate(null, $r->month, 1)->format('M'),
                        'value'  => (float) $r->value,
                        'orders' => (int) $r->orders,
                    ]);
            }

            /* ===============================
             * Totals
             * =============================== */
            $totals = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw("
                    COUNT(*) AS orders_count,
                    COALESCE(SUM(total_amount),0) AS revenue_total
                ")
                ->first();

            /* ===============================
             * Peak hour
             * =============================== */
            $peak = $view === 'day'
                ? collect($ordersPerPeriod)->sortByDesc('orders')->first()
                : null;

            /* ===============================
             * Popular products
             * =============================== */
            $productData = DB::table(DB::raw('orders, jsonb_array_elements(orders.items) AS item'))
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$start, $end])
                ->selectRaw("
                    item->>'name' AS name,
                    SUM((item->>'quantity')::int) AS count
                ")
                ->groupByRaw("item->>'name'")
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            /* ===============================
            * Total Registered Customers (with email_verified and filter)
            * =============================== */
            $totalRegisteredUsersQuery = DB::table('customers')
                ->where('email_verified', true);

            if ($view === 'day') {
                $totalRegisteredUsersQuery->whereDate('created_at', $baseDate->toDateString());
            } elseif ($view === 'month') {
                $totalRegisteredUsersQuery->whereYear('created_at', $baseDate->year)
                                        ->whereMonth('created_at', $baseDate->month);
            } elseif ($view === 'year') {
                $totalRegisteredUsersQuery->whereYear('created_at', $baseDate->year);
            }

            $totalRegisteredUsers = $totalRegisteredUsersQuery->count();

            // Returning & new customers (based on completed orders)
            $customerInsights = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw("COUNT(DISTINCT user_id) AS total_customers")
                ->first();

            $returningCustomers = DB::query()
                ->fromSub(
                    DB::table('orders')
                        ->where('status', 'completed')
                        ->whereBetween('created_at', [$start, $end])
                        ->select('user_id')
                        ->groupBy('user_id')
                        ->havingRaw('COUNT(*) > 1'),
                    't'
                )
                ->count();

            $customerInsights->returning_customers = $returningCustomers;
            $customerInsights->new_customers = $customerInsights->total_customers - $returningCustomers;

            /* ===============================
            * Customer Feedback (average rating)
            * =============================== */
            $ratingsBreakdown = collect(['1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0]);
            $averageRating = 0;
            $totalReviews = 0;

            if (Schema::hasTable('feedback')) {
                $feedbackQuery = DB::table('feedback')
                    ->where(function($q) use ($view, $start, $end) {
                        if ($view === 'day') {
                            $q->whereDate('created_at', $start->toDateString());
                        } elseif ($view === 'month') {
                            $q->whereYear('created_at', $start->year)
                            ->whereMonth('created_at', $start->month);
                        } elseif ($view === 'year') {
                            $q->whereYear('created_at', $start->year);
                        }
                    });

                // Ratings breakdown
                $ratings = $feedbackQuery
                    ->selectRaw("CAST(rating AS TEXT) AS rating, COUNT(*) AS count")
                    ->groupBy('rating')
                    ->pluck('count','rating');

                $ratingsBreakdown = $ratingsBreakdown->merge($ratings);

                // Average rating
                $averageRating = $feedbackQuery->avg('rating') ?? 0;

                // Total reviews
                $totalReviews = $feedbackQuery->count();
            }

            return response()->json([
                'salesData'       => $salesData,
                'orders_per_hour' => $ordersPerPeriod,
                'productData'     => $productData,
                'peak_hours'      => $peak ? [
                    'text'      => sprintf('%02d:00',$peak['hour']),
                    'hours'     => [$peak['hour']],
                    'max_count' => $peak['orders'],
                ] : null,
                'totals' => $totals,
                'customerInsights' => [
                    'totalRegistered' => $totalRegisteredUsers,
                    /* 'activeThisPeriod' => $activeCustomers,
                    'averageGrowth' => $averageGrowth, */
                ],
                'customerFeedback' => [
                    'averageRating'    => round($averageRating,2),
                    'totalReviews'     => $totalReviews,
                    'ratingsBreakdown' => $ratingsBreakdown,
                ],
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message'=>'Analytics error',
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
