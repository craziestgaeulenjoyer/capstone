<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    private function resolveDateRange(string $filter, string $date): array
    {
        $base = Carbon::parse($date);

        return match ($filter) {
            'day' => [
                $base->copy()->startOfDay(),
                $base->copy()->endOfDay(),
            ],

            // IMPORTANT: day is IGNORED
            'month' => [
                $base->copy()->startOfMonth(),
                $base->copy()->endOfMonth(),
            ],

            // IMPORTANT: month & day are IGNORED
            'year' => [
                $base->copy()->startOfYear(),
                $base->copy()->endOfYear(),
            ],
        };
    }

    public function index(Request $request)
    {
        try {
            $view = $request->query('view', $request->query('filter', 'day'));
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

            // -----------------------------------------------------
            // CUSTOMERS PER TIME INTERVAL + PEAK HOURS (NEW CORRECT LOGIC)
            // -----------------------------------------------------

            $start = Carbon::parse($date)->startOfDay();
            $end = Carbon::parse($date)->endOfDay();

            $isSunday = $baseDate->dayOfWeek === Carbon::SUNDAY;
            $openHour = $isSunday ? 9 : 10;
            $closeHour = 22;

            if ($view === 'month') {
                $start = Carbon::parse($date)->startOfMonth();
                $end = Carbon::parse($date)->endOfMonth();
            } elseif ($view === 'year') {
                $start = Carbon::parse($date)->startOfYear();
                $end = Carbon::parse($date)->endOfYear();
            }

            $orders = Order::where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->whereRaw("
                    EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                    BETWEEN {$openHour} AND {$closeHour}
                ")
                ->get();

            $morning = collect();
            $afternoon = collect();
            $evening = collect();
            $hourly = [];

            foreach ($orders as $order) {
                $created = Carbon::parse($order->created_at);
                $hour = (int) $created->format('H');
                $day = $created->dayOfWeek; // 0 = Sun

                $morningStart = ($day === 0) ? 9 : 10; // Sun 9AM, others 10AM
                $morningEnd = 11; 
                $afternoonStart = 13; $afternoonEnd = 17;
                $eveningStart = 18; $eveningEnd = 21;

                if ($hour >= $morningStart && $hour <= $morningEnd) {
                    $morning->push($order->user_id);
                } elseif ($hour >= $afternoonStart && $hour <= $afternoonEnd) {
                    $afternoon->push($order->user_id);
                } elseif ($hour >= $eveningStart && $hour <= $eveningEnd) {
                    $evening->push($order->user_id);
                }

                $hourly[$hour] = ($hourly[$hour] ?? 0) + 1;
            }

            $morningCount = $morning->unique()->count();
            $afternoonCount = $afternoon->unique()->count();
            $eveningCount = $evening->unique()->count();

            $intervals = [
                $morningCount,
                $afternoonCount,
                $eveningCount
            ];

            $activeIntervals = collect($intervals)->filter(fn($c) => $c > 0)->count();
            $activeIntervals = max($activeIntervals, 1); // avoid division by 0

            $averageCustomers = round(array_sum($intervals) / $activeIntervals, 2);

            $peakHour = null;
            $peakCount = 0;
            if (!empty($hourly)) {
                $peakHour = array_keys($hourly, max($hourly))[0];
                $peakCount = max($hourly);
            }

            // pass new computed data into response array
            $response['customer_time_intervals'] = [
                'morning' => $morningCount,
                'afternoon' => $afternoonCount,
                'evening' => $eveningCount,
                'average' => $averageCustomers
            ];

            $response['peak_hours_correct'] = [
                'hour' => $peakHour,
                'count' => $peakCount
            ];

            /* ===============================
             * Orders per period
             * =============================== */
            $ordersPerPeriod = [];

            if ($view === 'day') {
                $raw = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->whereRaw("
                        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                        BETWEEN {$openHour} AND {$closeHour}
                    ")
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
                $dailyRevenue = DB::table('orders')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end])
                    ->whereRaw("
                        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                        BETWEEN {$openHour} AND {$closeHour}
                    ")
                    ->selectRaw("
                        DATE(created_at AT TIME ZONE 'Asia/Manila') AS date,
                        COALESCE(SUM(total_amount),0) AS value
                    ")
                    ->groupByRaw("DATE(created_at AT TIME ZONE 'Asia/Manila')")
                    ->orderBy('date')
                    ->get();

                // Aggregate by week of month
                $weeks = collect(range(1,5))->mapWithKeys(fn($w) => [$w => 0]);

                foreach ($dailyRevenue as $day) {
                    $week = ceil(Carbon::parse($day->date)->day / 7);
                    $weeks[$week] += (float) $day->value;
                }

                $salesData = $weeks->map(fn($value, $week) => [
                    'name' => "Week {$week}",
                    'value' => $value
                ])->values();
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
            * Total Menu Items
            * =============================== */
            $totalMenu = DB::table('menu_items')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            /* ===============================
            * Order Summary (Status Breakdown)
            * =============================== */
            $statusCounts = DB::table('orders')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw("
                    status,
                    COUNT(*) AS count
                ")
                ->groupBy('status')
                ->pluck('count', 'status');

            $totalOrdersAllStatuses = $statusCounts->sum() ?: 1;

            $orderSummary = collect([
                'pending'   => $statusCounts['pending']   ?? 0,
                'completed' => $statusCounts['completed'] ?? 0,
                'canceled'  => $statusCounts['canceled']  ?? 0,
                'paid'      => $statusCounts['paid']      ?? 0,
            ])->map(fn ($count) =>
                round(($count / $totalOrdersAllStatuses) * 100, 1)
            );

            /* ===============================
            * Order Overview (Completed by Time of Day)
            * =============================== */
            $overviewRaw = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->whereRaw("
                    EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                    BETWEEN {$openHour} AND {$closeHour}
                ")
                ->selectRaw("
                    CASE
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN {$openHour} AND 12 THEN 'morning'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 13 AND 17 THEN 'afternoon'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 18 AND {$closeHour} THEN 'evening'
                    END AS period,
                    COUNT(*) AS count
                ")
                ->whereNotNull(DB::raw("
                    CASE
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN {$openHour} AND 12 THEN 'morning'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 13 AND 17 THEN 'afternoon'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 18 AND {$closeHour} THEN 'evening'
                    END
                "))
                ->groupBy('period')
                ->pluck('count', 'period');

            $totalCompletedForOverview = $overviewRaw->sum() ?: 1;

            $orderOverview = collect([
                'morning'   => $overviewRaw['morning']   ?? 0,
                'afternoon' => $overviewRaw['afternoon'] ?? 0,
                'evening'   => $overviewRaw['evening']   ?? 0,
            ])->map(fn ($count) =>
                round(($count / $totalCompletedForOverview) * 100, 1)
            );

            /* ===============================
            * Customer Distribution by Time of Day (unique users)
            * =============================== */
            $isSunday = $baseDate->dayOfWeek === Carbon::SUNDAY;
            $morningStart = $isSunday ? 9 : 10;

            $customerTimeRaw = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->whereRaw("
                    EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                    BETWEEN {$openHour} AND {$closeHour}
                ")
                ->selectRaw("
                    CASE
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN {$openHour} AND 12 THEN 'morning'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 13 AND 17 THEN 'afternoon'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 18 AND {$closeHour} THEN 'evening'
                    END AS period,
                    user_id
                ")
                ->whereNotNull(DB::raw("
                    CASE
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN {$openHour} AND 12 THEN 'morning'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 13 AND 17 THEN 'afternoon'
                        WHEN EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila') BETWEEN 18 AND {$closeHour} THEN 'evening'
                    END
                "))
                ->get();

            // Group by period and get unique users per period
            $uniqueCustomersByPeriod = [
                'morning'   => $customerTimeRaw->where('period','morning')->pluck('user_id')->unique()->count(),
                'afternoon' => $customerTimeRaw->where('period','afternoon')->pluck('user_id')->unique()->count(),
                'evening'   => $customerTimeRaw->where('period','evening')->pluck('user_id')->unique()->count(),
            ];

            $totalCustomerPresence = array_sum($uniqueCustomersByPeriod) ?: 1;

            // Prepare pie chart
            $customerPie = collect($uniqueCustomersByPeriod)->map(fn ($count, $key) => [
                'name'    => ucfirst($key),
                'value'   => $count,
                'percent' => round(($count / $totalCustomerPresence) * 100, 2),
            ])->values();

            // Average customers across the three periods
            $averageCustomers = round($totalCustomerPresence / 3, 2);

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
            * Total Registered Customers (email verified, filtered)
            * =============================== */
            $totalRegisteredUsersQuery = DB::table('customers')
                ->where('email_verified', true);

            if ($view === 'day') {
                $totalRegisteredUsersQuery->whereDate('created_at', $baseDate->toDateString());
            } elseif ($view === 'month') {
                $totalRegisteredUsersQuery
                    ->whereYear('created_at', $baseDate->year)
                    ->whereMonth('created_at', $baseDate->month);
            } elseif ($view === 'year') {
                $totalRegisteredUsersQuery
                    ->whereYear('created_at', $baseDate->year);
            }

            $totalRegisteredUsers = $totalRegisteredUsersQuery->count();

            // ===============================
            // Customer Registrations for Graph (Fixed)
            // ===============================
            $registrationsQuery = DB::table('customers')
                ->where('email_verified', true);

            // Use whereBetween instead of whereDate / whereMonth / whereYear
            if ($view === 'day') {
                $registrationsQuery->whereBetween('created_at', [
                    $baseDate->copy()->startOfDay(),
                    $baseDate->copy()->endOfDay(),
                ]);
            } elseif ($view === 'month') {
                $registrationsQuery->whereBetween('created_at', [
                    $baseDate->copy()->startOfMonth(),
                    $baseDate->copy()->endOfMonth(),
                ]);
            } elseif ($view === 'year') {
                $registrationsQuery->whereBetween('created_at', [
                    $baseDate->copy()->startOfYear(),
                    $baseDate->copy()->endOfYear(),
                ]);
            }

            /* ---------- PER DAY (hourly: 9–22 or 10–22) ---------- */
            if ($view === 'day') {
                $raw = $registrationsQuery
                    ->selectRaw("
                        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')::int AS hour,
                        COUNT(*) AS count
                    ")
                    ->groupBy('hour')
                    ->pluck('count', 'hour');

                $isSunday  = $baseDate->dayOfWeek === Carbon::SUNDAY;
                $startHour = $isSunday ? 9 : 10;
                $endHour   = 22;

                $registrations = collect(range($startHour, $endHour))->map(fn ($h) => [
                    'date'  => $baseDate->copy()->hour($h)->toDateTimeString(),
                    'count' => (int) ($raw[$h] ?? 0),
                ]);
            }

            /* ---------- PER MONTH (daily: 1 → last day) ---------- */
            elseif ($view === 'month') {
                $raw = $registrationsQuery
                    ->selectRaw("
                        EXTRACT(DAY FROM created_at AT TIME ZONE 'Asia/Manila')::int AS day,
                        COUNT(*) AS count
                    ")
                    ->groupBy('day')
                    ->pluck('count', 'day');

                $daysInMonth = $baseDate->daysInMonth;

                $registrations = collect(range(1, $daysInMonth))->map(fn ($d) => [
                    'date'  => $baseDate->copy()->day($d)->toDateString(), // YYYY-MM-DD
                    'count' => (int) ($raw[$d] ?? 0),
                ]);
            }

            /* ---------- PER YEAR (monthly: Jan → Dec) ---------- */
            elseif ($view === 'year') {
                $raw = $registrationsQuery
                    ->selectRaw("
                        EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Manila')::int AS month,
                        COUNT(*) AS count
                    ")
                    ->groupBy('month')
                    ->pluck('count', 'month');

                $registrations = collect(range(1, 12))->map(fn ($m) => [
                    'date'  => $baseDate->copy()->month($m)->startOfMonth()->toDateString(), // YYYY-MM-01
                    'count' => (int) ($raw[$m] ?? 0),
                ]);
            }

            // Returning & new customers (based on completed orders)
            $customerInsights = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->whereRaw("
                    EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                    BETWEEN {$openHour} AND {$closeHour}
                ")
                ->selectRaw("COUNT(DISTINCT user_id) AS total_customers")
                ->first();

            $returningCustomers = DB::query()
                ->fromSub(
                    DB::table('orders')
                        ->where('status', 'completed')
                        ->whereBetween('created_at', [$start, $end])
                        ->whereRaw("
                            EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Manila')
                            BETWEEN {$openHour} AND {$closeHour}
                        ")
                        ->select('user_id')
                        ->groupBy('user_id')
                        ->havingRaw('COUNT(*) > 1'),
                    't'
                )
                ->count();

            $customerInsights->returning_customers = $returningCustomers;
            $customerInsights->new_customers = $customerInsights->total_customers - $returningCustomers;

            /* ===============================
            * Customer Map (Weekly Registered Customers)
            * =============================== */
            $lastMonthStart = $start->copy()->subMonth()->startOfMonth();
            $lastMonthEnd   = $start->copy()->subMonth()->endOfMonth();

            /**
             * Helper to get weekly counts (week of month)
             */
            $getWeeklyCustomers = function ($rangeStart, $rangeEnd) {
                return DB::table('customers')
                    ->where('email_verified', true)
                    ->whereBetween('created_at', [$rangeStart, $rangeEnd])
                    ->selectRaw("
                        CEIL(EXTRACT(DAY FROM created_at)::numeric / 7) AS week,
                        COUNT(*) AS count
                    ")
                    ->groupBy('week')
                    ->orderBy('week')
                    ->pluck('count', 'week');
            };

            $thisMonthRaw = $getWeeklyCustomers($start, $end);
            $lastMonthRaw = $getWeeklyCustomers($lastMonthStart, $lastMonthEnd);

            // Normalize weeks (1–5)
            $weeks = collect(range(1, 5));

            $thisMonthData = $weeks->map(fn ($w) => (int) ($thisMonthRaw[$w] ?? 0));
            $lastMonthData = $weeks->map(fn ($w) => (int) ($lastMonthRaw[$w] ?? 0));

            $customerMap = [
                'labels' => $weeks->map(fn ($w) => "Week {$w}"),
                'datasets' => [
                    [
                        'label' => 'This Month',
                        'data' => $thisMonthData,
                    ],
                    [
                        'label' => 'Last Month',
                        'data' => $lastMonthData,
                    ],
                ],
            ];

            $activeCustomers = DB::table('orders')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$start, $end])
                ->distinct()
                ->count('user_id');

            $averageGrowth = 0;

            if (!empty($registrations) && count($registrations) > 0) {
                $counts = collect($registrations)->pluck('count');

                // Only consider periods with actual activity
                $activePeriods = $counts->filter(fn ($v) => $v > 0);

                if ($activePeriods->count() > 0) {
                    $averageGrowth = match ($view) {
                        'day'   => round($counts->sum(), 2),       
                        'month' => round($activePeriods->avg(), 2),
                        'year'  => round($activePeriods->avg(), 2),
                    };
                }
            }

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

            // Group product breakdown by day+hour
            $productBreakdown = [];

            if ($view === 'day') {
                $productRaw = DB::table(DB::raw('orders, jsonb_array_elements(orders.items) AS item'))
                    ->where('orders.status', 'completed')
                    ->whereBetween('orders.created_at', [$start, $end])
                    ->whereRaw("
                        EXTRACT(HOUR FROM orders.created_at AT TIME ZONE 'Asia/Manila')
                        BETWEEN {$openHour} AND {$closeHour}
                    ")
                    ->selectRaw("
                        EXTRACT(HOUR FROM orders.created_at AT TIME ZONE 'Asia/Manila')::int AS hour,
                        item->>'name' AS name,
                        SUM((item->>'quantity')::int) AS total_orders
                    ")
                    ->groupByRaw("hour, name")
                    ->orderBy('hour')
                    ->get();

                foreach ($productRaw as $row) {
                    if (!isset($productBreakdown[$row->hour])) {
                        $productBreakdown[$row->hour] = [];
                    }

                    $productBreakdown[$row->hour][] = [
                        'name' => $row->name,
                        'total_orders' => (int) $row->total_orders,
                    ];
                }
            } elseif ($view === 'month') {
                // Pre-fill ALL days of the month
                $daysInMonth = Carbon::parse($date)->daysInMonth;
                $productBreakdown = array_fill(1, $daysInMonth, []);

                $productRaw = DB::table(DB::raw('orders, jsonb_array_elements(orders.items) AS item'))
                    ->where('orders.status', 'completed')
                    ->whereBetween('orders.created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(DAY FROM orders.created_at AT TIME ZONE 'Asia/Manila')::int AS day,
                        item->>'name' AS name,
                        SUM((item->>'quantity')::int) AS total_orders
                    ")
                    ->groupByRaw("day, name")
                    ->orderBy('day')
                    ->get();

                foreach ($productRaw as $row) {
                    $productBreakdown[$row->day][] = [
                        'name' => $row->name,
                        'total_orders' => (int) $row->total_orders,
                    ];
                }
            } elseif ($view === 'year') {

                // Pre-fill ALL 12 months
                $productBreakdown = array_fill(1, 12, []);

                $productRaw = DB::table(DB::raw('orders, jsonb_array_elements(orders.items) AS item'))
                    ->where('orders.status', 'completed')
                    ->whereBetween('orders.created_at', [$start, $end])
                    ->selectRaw("
                        EXTRACT(MONTH FROM orders.created_at AT TIME ZONE 'Asia/Manila')::int AS month,
                        item->>'name' AS name,
                        SUM((item->>'quantity')::int) AS total_orders
                    ")
                    ->groupByRaw("month, name")
                    ->orderBy('month')
                    ->get();

                foreach ($productRaw as $row) {
                    $productBreakdown[$row->month][] = [
                        'name' => $row->name,
                        'total_orders' => (int) $row->total_orders,
                    ];
                }
            }

            return response()->json([
                'salesData'       => $salesData,
                'ordersPerHour' => $ordersPerPeriod,
                'productData'     => $productData,
                'peak_hours'      => $peak ? [
                    'text'      => sprintf('%02d:00',$peak['hour']),
                    'hours'     => [$peak['hour']],
                    'max_count' => $peak['orders'],
                ] : null,
                'totals' => $totals,
                'totalMenu' => $totalMenu,
                'orderSummary' => $orderSummary,
                'orderOverview' => $orderOverview,
                'customerMap' => $customerMap,
                'customerInsights' => [
                    'totalRegistered' => $totalRegisteredUsers,
                    'registrations'   => $registrations, 
                    'activeThisPeriod' => $activeCustomers,
                    'averageGrowth'    => $averageGrowth,
                    'averageActiveUsers'=> $activeCustomers, 
                ],
                'customerTimeDistribution' => $customerPie,
                'averageCustomers' => $averageCustomers,
                'customer_time_intervals' => $response['customer_time_intervals'],
                'peak_hours_correct' => $response['peak_hours_correct'],
                'productBreakdown' => $productBreakdown,
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

    public function perDayForecast(Request $request)
    {
        $date = Carbon::parse($request->date ?? now());

        $dayOfWeek = $date->dayOfWeek; 
        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Business hours
        if ($dayOfWeek === Carbon::SUNDAY) {
            $startHour = 9;
        } else {
            $startHour = 10;
        }

        $endHour = 22; // 10 PM

        $sales = DB::table('orders')
            ->selectRaw('
                EXTRACT(HOUR FROM created_at) as hour,
                COUNT(*) as total_orders,
                SUM(total_amount) as total_revenue
            ')
            ->whereDate('created_at', $date)
            ->whereRaw('EXTRACT(HOUR FROM created_at) BETWEEN ? AND ?', [
                $startHour,
                $endHour
            ])
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        return response()->json([
            'start_hour' => $startHour,
            'end_hour' => $endHour,
            'data' => $sales
        ]);
    }

    public function revenuePerDay(Request $request)
    {
        $date = Carbon::parse($request->input('date'));
        $year = $date->year;
        $month = $date->month;

        $revenuePerDay = Order::whereYear('orders.created_at', $year)
            ->whereMonth('orders.created_at', $month)
            ->where('orders.status', 'completed')
            ->selectRaw('EXTRACT(DAY FROM orders.created_at) AS day, SUM(orders.total_amount) AS revenue')
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return response()->json([
            'revenue' => $revenuePerDay
        ]);
    }

    public function peakHours(Request $request)
    {
        $filter = $request->query('filter', 'day');
        $date   = $request->query('date', now()->toDateString());

        Log::info('PEAK HOURS REQUEST', [
            'filter' => $filter,
            'date'   => $date,
        ]);

        // Base query: completed orders only (recommended)
        $query = DB::table('orders')
            ->whereNotNull('user_id')
            ->where('status', 'completed'); // OPTIONAL but correct

        $carbonDate = Carbon::parse($date);

        $startHour = $carbonDate->dayOfWeek === Carbon::SUNDAY ? 9 : 10;
        $endHour   = 22;

        // Apply date filter
        if ($filter === 'day') {
            $query->whereDate('created_at', $date)
                ->whereRaw(
                    'EXTRACT(HOUR FROM created_at) BETWEEN ? AND ?',
                    [$startHour, $endHour]
                );
        } elseif ($filter === 'month') {
            $parsed = Carbon::parse($date);
            $query->whereMonth('created_at', $parsed->month)
                ->whereYear('created_at', $parsed->year);
        } elseif ($filter === 'year') {
            $query->whereYear('created_at', Carbon::parse($date)->year);
        }

        // Aggregate UNIQUE customers per hour
        $results = $query
            ->selectRaw('EXTRACT(HOUR FROM created_at) as hour, COUNT(DISTINCT user_id) as count')
            ->groupBy('hour')
            ->get()
            ->keyBy(fn ($row) => (int) $row->hour);

        /**
         * BUSINESS HOURS LOGIC (FIXED)
         */
        if ($filter === 'day') {
            $dayOfWeek = Carbon::parse($date)->dayOfWeek; 
            $startHour = $dayOfWeek === 0 ? 9 : 10;
        } else {
            $startHour = 9;
        }

        $endHour = 22;

        // Normalize ALL hours (this is CRITICAL)
        $filled = [];
        for ($h = $startHour; $h <= $endHour; $h++) {
            $filled[] = [
                'hour'  => $h,
                'count' => isset($results[$h]) ? (int) $results[$h]->count : 0,
            ];
        }

        return response()->json($filled);
    }
}
