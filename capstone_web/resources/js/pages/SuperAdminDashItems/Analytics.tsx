import React, { useEffect, useMemo, useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import {
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/* ---------- Types (same as your base) ---------- */

interface OrderHour {
  hour: number;
  orders: number;
  customers: number;
  day: string;   
  month: number;
}

interface CustomerFeedbackApi {
  averageRating?: number;
  totalReviews?: number;
  ratingsBreakdown?: Record<string, number>; 
}

interface ProductApiItem {
  name: string;
  count: number;
}

interface SalesDataItem {
  value: number; 
  name: string;  
  color?: string;
  orders?: number; 
}

const normalizeMonthlySales = (
  data: SalesDataItem[],
  date: Date
): SalesDataItem[] => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const map = new Map(data.map(d => [d.name, d]));

  return months.map((month) => {
    const monthName = new Date(date.getFullYear(), month - 1, 1).toLocaleString('default', { month: 'short' });
    const existing = map.get(monthName);
    return {
      name: monthName,
      value: existing?.value ?? 0,
      orders: existing?.orders ?? 0,
      color: existing?.color ?? '#34D399',
    };
  });
};  


interface ProductDataItem {
  id: number;
  name: string;
  popularity: number; 
  sales: number;      
}

interface TotalCustomersSegment {
  height: number;
  color: string;
}

interface TotalCustomersDataItem {
  day: string;
  segments: TotalCustomersSegment[];
}

interface AddOnDataItem {
  name: string;
  percentage: number; 
}

interface CustomerInsightsData {
  totalRegistered: number;
  activeThisPeriod: number;
  averageGrowth: string; 
}

interface CustomerInsightsApi {
  totalRegistered?: number;
  activeThisWeek?: number;     
  activeThisPeriod?: number;   
  averageGrowth?: string;
}

type BackendPayload = {
  salesData?: { name: string; value: number; orders?: number; color?: string }[];
  productData?: ProductApiItem[];
  customerPercentage?: number;
  customerInsights?: CustomerInsightsApi;
  customerFeedback?: CustomerFeedbackApi;
  totalCustomersData?: TotalCustomersDataItem[];
  addOnsData?: AddOnDataItem[];
  loyaltyProgram?: number;
  orders_per_hour?: OrderHour[];
  peak_hours?: { text: string; hours: number[]; max_count?: number };
  heatmap?: any;
  totals?: { orders_count: number; revenue_total: number };
  daily_revenue?: { day: string; revenue: number; orders: number; };
};

/* ---------- Helpers ---------- */
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || null;
};

const createApiClient = (): AxiosInstance => {
  const baseURL = "http://127.0.0.1:8000/api";
  const token = getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.create({
    baseURL,
    headers,
    withCredentials: !!baseURL,
    timeout: 15000,
  });
};

function isTruthyString(s: any): s is string {
  return typeof s === 'string' && s.length > 0;
}

/* ---------- Component ---------- */
const Analytics: React.FC = () => {
  const api = useMemo(() => createApiClient(), []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // backend data
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [productData, setProductData] = useState<ProductDataItem[]>([]);
  const [customerPercentage, setCustomerPercentage] = useState<number>(0);

  const [customerInsightsData, setCustomerInsightsData] =
  useState<CustomerInsightsData>({
    totalRegistered: 0,
    activeThisPeriod: 0,
    averageGrowth: '',
  });
  const [customerFeedback, setCustomerFeedback] = useState<CustomerFeedbackApi>({
    averageRating: 0,
    totalReviews: 0,
    ratingsBreakdown: {}
  });

  const [totalCustomersData, setTotalCustomersData] = useState<TotalCustomersDataItem[]>([]);
  const [addOnsData, setAddOnsData] = useState<AddOnDataItem[]>([]);
  const [loyaltyProgramData, setLoyaltyProgramData] = useState<number>(0);

  // new backend-provided
  const [ordersPerHour, setOrdersPerHour] = useState<OrderHour[]>([]);
  const [peakHours, setPeakHours] = useState<{ text: string; hours: number[]; max_count?: number }>({ text: '', hours: [] });
  const [heatmap, setHeatmap] = useState<any>(null);
  const [totals, setTotals] = useState<{ orders_count: number; revenue_total: number }>({ orders_count: 0, revenue_total: 0 });

  // UI controls
  const [activeTab, setActiveTab] = useState<'Sales Hub' | 'Customer Analytics'>('Sales Hub');
  const [view, setView] = useState<'Per Day' | 'Per Month' | 'Per Year'>('Per Day');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // selected anchor date (for day/week/month)
  const [chartTimeframe, setChartTimeframe] = useState<'Daily' | 'Weekly'>('Daily'); // kept for your existing toggle, still used elsewhere

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const toISODate = (d: Date) =>
  d.toISOString().split('T')[0];

  /* ---------- Calendar helpers ---------- */
  const averageCustomers = useMemo(() => {
    if (!ordersPerHour || ordersPerHour.length === 0) return 0;

    switch(view) {
      case 'Per Day': {
        const dailyCounts: Record<string, number> = {};
        ordersPerHour.forEach(h => {
          const day = h.day || 'unknown';
          dailyCounts[day] = (dailyCounts[day] || 0) + (h.customers || 0);
        });
        const totalDays = Object.keys(dailyCounts).length || 1;
        return Math.round(Object.values(dailyCounts).reduce((a,b) => a+b, 0) / totalDays);
      }
      case 'Per Month': {
        const dayCounts: Record<string, number> = {};
        ordersPerHour.forEach(h => {
          if (!h.day) return;
          dayCounts[h.day] = (dayCounts[h.day] || 0) + (h.customers ?? 0);
        });
        const totalDays = Object.keys(dayCounts).length || 1;
        return Math.round(
          Object.values(dayCounts).reduce((a, b) => a + b, 0) / totalDays
        );
      }
      case 'Per Year': {
        const monthCounts: Record<number, number> = {};
        ordersPerHour.forEach(h => {
          const month = h.month ?? 0;
          monthCounts[month] = (monthCounts[month] || 0) + (h.customers ?? 0);
        });
        const totalMonths = Object.keys(monthCounts).length || 1;
        return Math.round(Object.values(monthCounts).reduce((a,b) => a+b, 0) / totalMonths);
      }
      default:
        return 0;
    }
  }, [ordersPerHour, view]);

  const heatmapData = useMemo(() => {
    if (!ordersPerHour || ordersPerHour.length === 0) return [];

    switch(view) {
      case 'Per Day': {
        // create an array of 24 hours
        const hourCounts = Array.from({ length: 24 }, (_, h) => {
          // sum orders for the current date and hour
          return ordersPerHour
            .filter(o => o.day === toISODate(currentDate) && o.hour === h)
            .reduce((sum, o) => sum + (o.orders ?? 0), 0);
        });

        return [
          {
            day: toISODate(currentDate),
            hourCounts,
          },
        ];
      }

      case 'Per Month': {
        const daysInMonth = getDaysInMonth(currentDate);
        const dayCounts = Array.from({ length: daysInMonth }, (_, i) => {
          const dayStr = toISODate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
          return ordersPerHour
            .filter(o => o.day === dayStr)
            .reduce((sum, o) => sum + (o.orders ?? 0), 0);
        });

        return [
          {
            day: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
            hourCounts: dayCounts,
          },
        ];
      }

      case 'Per Year': {
        return [
          {
            day: `${currentDate.getFullYear()}`,
            hourCounts: salesData.map(s => s.orders ?? 0), 
          },
        ];
      }

      default:
        return [];
    }
  }, [ordersPerHour, view, currentDate]);

  const pieData = useMemo(() => {
    return ordersPerHour.map(h => ({ name: `${h.hour}h`, value: h.customers }));
  }, [ordersPerHour]);

  const COLORS = ['#22C55E', '#10B981', '#34D399', '#6EE7B7', '#D1FAE5'];

  const renderArrowLabel = (props: any) => {
    const RADIAN = Math.PI / 180;

    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      percent,
      value,     // ← this is h.customers
    } = props;

    const percentage = `${(percent * 100).toFixed(1)}%`;
    const customers = `${value} customers`;

    // Slice edge
    const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    // Arrow bend
    const mx = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
    const my = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);

    // Horizontal extension
    const ex = mx + (Math.cos(-midAngle * RADIAN) >= 0 ? 26 : -26);
    const ey = my;

    const textAnchor = ex > cx ? 'start' : 'end';

    return (
      <g>
        {/* arrow */}
        <path
          d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`}
          stroke="#9CA3AF"
          fill="none"
          strokeWidth={1}
        />

        <circle cx={sx} cy={sy} r={2} fill="#9CA3AF" />

        {/* percentage */}
        <text
          x={ex + (ex > cx ? 4 : -4)}
          y={ey - 6}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={15}
          fontWeight={600}
          fill="#374151"
        >
          {percentage}
        </text>

        {/* customer count */}
        <text
          x={ex + (ex > cx ? 4 : -4)}
          y={ey + 10}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={14}
          fill="#6B7280"
        >
          {customers}
        </text>
      </g>
    );
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null as null);
  const combinedDays = [...emptyDays, ...daysArray];
  const formattedMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  // calendar navigation
  const handleNextMonth = () =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  const handlePrevMonth = () =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });

  // control: when view changes, we close calendar and fetch new data
  useEffect(() => {
    setShowCalendar(false);
    // ensure fetch occurs via useEffect below (view and currentDate dependency)
  }, [view]);

  // helper to format date param (YYYY-MM-DD)
  const formatDateParam = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // adjust selected date depending on view when user selects a day in calendar:
  const handleSelectCalendarDay = (dayNum: number) => {
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum, 0, 0, 0);

    if (view === 'Per Day') {
      setCurrentDate(clicked);
      setShowCalendar(false);
    } else if (view === 'Per Month') {
      // set currentDate to same day but month chosen - the backend uses month start/end
      setCurrentDate(clicked);
      setShowCalendar(false);
    }
  };

  const maxRevenue = Math.max(
  ...salesData.map(s => s.value),
  10 
  );

  const normalizeDailySales = (data: SalesDataItem[], date: Date): SalesDataItem[] => {
    const daysInMonth = getDaysInMonth(date);

    // Map day number (1..31) to value
    const map = new Map<number, SalesDataItem>();

    data.forEach(d => {
      let dayNum = 0;

      // Try to extract day number from backend format like "Nov 07"
      const match = d.name.match(/\d+/); // matches the first number in name
      if (match) dayNum = parseInt(match[0], 10);

      if (dayNum >= 1 && dayNum <= daysInMonth) {
        map.set(dayNum, d);
      }
    });

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const existing = map.get(day);
      return {
        name: day.toString(),
        value: existing?.value ?? 0,
        orders: existing?.orders ?? 0,
        color: existing?.color ?? '#34D399',
      };
    });
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const viewParam =
        view === 'Per Day' ? 'day' :
        view === 'Per Month' ? 'month' :
        'year';
      const dateParam = formatDateParam(currentDate);
      // try endpoints
      const endpoints = ['/superadmin/analytics', '/admin/analytics'];
      let res = null;
      let lastErr: any = null;
      for (const ep of endpoints) {
        try {
          // calculate params dynamically based on view
          let params;
          params = { view: viewParam, date: dateParam };

          res = await api.get<BackendPayload>(ep, { params });
          break;
        } catch (err: any) {
          lastErr = err;
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            throw new Error('Unauthorized. Please sign in again (api returned 401/403).');
          }
        }
      }
      if (!res) throw lastErr ?? new Error('Failed to fetch analytics');

      const data = res.data || {};
      
      if (Array.isArray(data.salesData)) {
      let sales: SalesDataItem[] = (data.salesData ?? []).map(s => ({
        name: isTruthyString(s.name) ? s.name : '',
        value: typeof s.value === 'number' ? s.value : 0,
        orders: typeof s.orders === 'number' ? s.orders : 0,
        color: s.color || '#34D399',
      }));

      if (view === 'Per Month') {
        sales = normalizeDailySales(sales, currentDate); 
      } else if (view === 'Per Year') {
        sales = normalizeMonthlySales(sales, currentDate);
      }

      setSalesData(sales); 
    } else {
      setSalesData([]);
    }
      
      const apiProducts = Array.isArray(data.productData)
        ? data.productData
        : [];

      const totalCount = apiProducts.reduce(
        (sum, p) => sum + (p.count || 0),
        0
      );

      setProductData(
        apiProducts.map((p, i) => ({
          id: i + 1,
          name: p.name,
          popularity: totalCount
            ? Math.round((p.count / totalCount) * 100)
            : 0,
          sales: totalCount
            ? Math.round((p.count / totalCount) * 100)
            : 0,
        }))
      );

      setCustomerPercentage(typeof data.customerPercentage === 'number' ? Math.round(data.customerPercentage) : 0);

      if (data.customerInsights) {
        setCustomerInsightsData({
          totalRegistered: data.customerInsights.totalRegistered ?? 0,
          activeThisPeriod:
            data.customerInsights.activeThisPeriod ??
            data.customerInsights.activeThisWeek ?? 0,
          averageGrowth: data.customerInsights.averageGrowth ?? '',
        });
      }

      if (data.customerFeedback) {
        setCustomerFeedback({
          averageRating: data.customerFeedback.averageRating ?? 0,
          totalReviews: data.customerFeedback.totalReviews ?? 0,
          ratingsBreakdown: data.customerFeedback.ratingsBreakdown ?? {}
        });
      } else {
        setCustomerFeedback({ 
          averageRating: 0, 
          totalReviews: 0, 
          ratingsBreakdown: {} 
        });
      }

      if (Array.isArray(data.totalCustomersData)) {
        setTotalCustomersData(
          data.totalCustomersData.map((d) => ({
            day: d.day,
            segments: Array.isArray(d.segments)
              ? d.segments.map((s) => ({ height: Math.max(0, Math.min(100, s.height)), color: s.color || '#A6C561' }))
              : [],
          }))
        );
      }

      if (Array.isArray(data.addOnsData)) {
        setAddOnsData(data.addOnsData.map((a) => ({ name: a.name, percentage: Math.max(0, Math.min(100, a.percentage)) })));
      } else {
        setAddOnsData([]);
      }

      setLoyaltyProgramData(typeof data.loyaltyProgram === 'number' ? data.loyaltyProgram : 0);

      const safeArray = Array.isArray(data.orders_per_hour)
        ? data.orders_per_hour.map(o => ({
            hour: Number(o.hour),
            orders: Number(o.orders ?? 0),
            customers: Number(o.customers ?? 0),
            day: typeof o.day === 'string'
              ? o.day
              : o.day
              ? new Date(o.day).toISOString().split('T')[0]
              : toISODate(currentDate),
            month: Number(o.month ?? currentDate.getMonth() + 1),
          }))
        : [];

      setOrdersPerHour(safeArray);

      setPeakHours(data.peak_hours ?? { text: '', hours: [] });
      setHeatmap(data.heatmap ?? null);
      setTotals(data.totals ?? { orders_count: 0, revenue_total: 0 });

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to fetch analytics.');
    }
  };

  // initial load & whenever view/currentDate changes
  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentDate]);

  // UI helpers for hours (we'll show 9am..8pm for the weekly heatmap like your original)
  const hoursOfDay = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">Loading analytics…</div>
          <div className="animate-pulse text-sm text-gray-500">Fetching data from API</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center max-w-lg">
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Analytics — Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setError(null);
                fetchAnalytics();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const salesHeatmapTitle =
  view === 'Per Day'
    ? 'Sales per hour'
    : view === 'Per Month'
    ? 'Sales per day'
    : 'Sales per month';

  /* ---------- Render ---------- */

  const isDailyView = view === 'Per Day';
  const hasPeakData =
    peakHours &&
    Array.isArray(peakHours.hours) &&
    peakHours.hours.length > 0 &&
    peakHours.max_count && peakHours.max_count > 0;

  const yAxisMax = Math.ceil(maxRevenue / 50) * 50; // rounds up to nearest ₱50
  const yTickCount = 5;

  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round((yAxisMax / yTickCount) * i)
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex bg-gray-200 p-1 rounded-full space-x-2">
          <button
            onClick={() => setActiveTab('Sales Hub')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'Sales Hub' ? 'bg-[#8cb662] shadow text-white' : 'text-gray-600 hover:bg-[#8cb662] hover:text-white'
            }`}
          >
            Sales Hub
          </button>
          <button
            onClick={() => setActiveTab('Customer Analytics')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'Customer Analytics' ? 'bg-[#8cb662] shadow text-white' : 'text-gray-600 hover:bg-[#8cb662] hover:text-white'
            }`}
          >
            Customer Analytics
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-center">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 shadow-sm hover:bg-[#8cb662] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium hidden sm:block">Export</span>
          </button>

          {/* Top-right timeframe selector (Per Day/Per Week/Per Month) */}
          <div className="relative">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as 'Per Day' | 'Per Month' | 'Per Year')}
              className="appearance-none bg-white text-gray-900 border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm"
            >
              <option>Per Day</option>
              <option>Per Month</option>
              <option>Per Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M5.5 8.5L10 13l4.5-4.5z" />
              </svg>
            </div>
          </div>

          {/* Calendar dropdown adapted to view */}
          <div className="relative">
            <div
              onClick={() => setShowCalendar((s) => !s)}
              className="flex items-center justify-between bg-white text-gray-900 border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm cursor-pointer"
            >
              <span>
                {view === 'Per Day' && currentDate.toLocaleDateString()}
                {view === 'Per Month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                {view === 'Per Year' && (
                  <span>{currentDate.getFullYear()}</span>
                )}
              </span>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-900">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M5.5 8.5L10 13l4.5-4.5z" />
                </svg>
              </div>
            </div>

            {showCalendar && (
              <div
                className={`absolute z-50 mt-2 p-4 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 min-w-64 ${
                  view === 'Per Year' ? 'right-0' : 'left-0'
                }`}
              >
                {view === 'Per Year' && (
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from(
                      { length: new Date().getFullYear() - 2019 + 1 },
                      (_, i) => 2019 + i
                    ).map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          const d = new Date(currentDate);
                          d.setFullYear(year);
                          d.setMonth(0);
                          d.setDate(1);

                          setCurrentDate(d);
                          setShowCalendar(false);
                        }}
                        className={`py-2 rounded text-sm font-medium ${
                          year === currentDate.getFullYear()
                            ? 'bg-[#8cb662] text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}

                {view !== 'Per Year' && (
                  <div className="flex justify-between items-center mb-2">
                    <button onClick={handlePrevMonth} className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">
                      ‹
                    </button>
                    <span className="font-medium text-gray-800">{formattedMonth}</span>
                    <button onClick={handleNextMonth} className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">
                      ›
                    </button>
                  </div>
                )}

                {view !== 'Per Year' && (
                  <div className="grid grid-cols-7 gap-2 text-xs text-center">
                    {['Su','M','Tu','W','Th','F','Sa'].map((d,i) => (
                      <div key={i} className="font-semibold text-gray-400">{d}</div>
                    ))}

                    {combinedDays.map((date, i) => (
                      <div
                        key={i}
                        onClick={() => date && handleSelectCalendarDay(date)}
                        className={`p-1 rounded-full transition-colors ${
                          date
                            ? `cursor-pointer hover:bg-[#8cb662] hover:text-white ${
                                date === today.getDate() &&
                                currentDate.getMonth() === today.getMonth() &&
                                currentDate.getFullYear() === today.getFullYear()
                                  ? 'bg-blue-500 text-white'
                                  : ''
                              }`
                            : ''
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-500">Pick a date to set {view === 'Per Day' ? 'the day' : 'the month'} for analytics</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'Sales Hub' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Overview */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h2>
              <span className="text-sm text-gray-500">
                {view} • {currentDate.toLocaleDateString()}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Loading revenue data...
              </div>
            ) : salesData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No revenue data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />

                  <YAxis
                    domain={[0, yAxisMax]}
                    ticks={yTicks}
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  />

                  <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                      const orders = props.payload.orders ?? 0;
                      return [`₱${value.toLocaleString()}`, `${orders} orders`];
                    }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }}
                    labelStyle={{ color: '#111827', fontWeight: 500 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8cb662"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>  

          {/* Average Customers — donut with peak info to the right */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Average Customers</h2>
              <button
                onClick={() => setChartTimeframe((t) => (t === 'Daily' ? 'Weekly' : 'Daily'))}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-[#8cb662] hover:text-white transition-colors rounded-full"
              >
                {chartTimeframe}
              </button>
            </div>

            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-6">
                <div className="relative w-72 h-64 flex items-center justify-center">
                  <PieChart width={420} height={320}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={renderArrowLabel}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} customers`, '']} />
                  </PieChart>
                </div>

                {/* Peak info to the right side of the donut */}
                <div className="flex flex-col items-start">
                  <div className="text-sm text-gray-500">Peak hours</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {peakHours?.text || '—'}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Top orders in hour: {peakHours?.max_count ?? '-'}
                  </div>

                  {/* Average percentage */}
                  <div className="mt-4 text-sm text-gray-500">Average customers</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {averageCustomers}
                  </div>

                  {/* Breakdown list */}
                  {isDailyView && hasPeakData && (
                    <div className="mt-3 space-y-1 w-full">
                      {ordersPerHour
                        .filter(o => peakHours.hours.includes(o.hour))
                        .map((b, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-500"
                          >
                            <span>
                              {b.hour % 12 === 0 ? 12 : b.hour % 12}
                              {b.hour < 12 ? 'AM' : 'PM'}
                            </span>
                            <span>{b.customers}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {!hasPeakData && (
                    <div className="mt-3 text-xs text-gray-400">
                      No customer activity for this period
                    </div>
                  )}

                  <button className="px-3 py-1 mt-4 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-[#8cb662] hover:text-white transition-colors">
                    {view === 'Per Day' ? 'Daily' : 'Monthly'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sales per week (heatmap) */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {salesHeatmapTitle}
              </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {view === 'Per Day' ? (
                        hoursOfDay.map((hour, i) => (
                          <th key={i} className="p-2 text-gray-500 text-sm font-normal">{hour}</th>
                        ))
                      ) : view === 'Per Month' ? (
                        Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map((day, i) => (
                          <th key={i} className="p-2 text-gray-500 text-sm font-normal">{day}</th>
                        ))
                      ) : (
                        ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                          .map((month, i) => (
                            <th key={i} className="p-2 text-gray-500 text-sm font-normal">{month}</th>
                          ))
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {heatmapData.length === 0 ? (
                      <tr>
                        <td colSpan={view === 'Per Day' ? 24 : view === 'Per Month' ? getDaysInMonth(currentDate) : 12} className="p-6 text-sm text-gray-400 text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      heatmapData.map((row, i) => (
                        <tr key={i}>
                          <td className="pr-4 py-2 text-right text-gray-500 text-sm font-normal">{row.day}</td>
                          {row.hourCounts.map((count, idx) => {
                            const maxCount = Math.max(1, ...row.hourCounts);

                            return (
                              <td key={idx} className="px-1 py-1">
                                <div
                                  title={`${count} orders`}
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs font-medium text-gray-800 transition-all"
                                  style={{
                                    background:
                                      count > 0
                                        ? `rgba(34,197,94,${Math.max(0.15, count / maxCount)})`
                                        : '#EEF2FF',
                                    cursor: count > 0 ? 'pointer' : 'default',
                                  }}
                                >
                                  {count > 0 ? count : ''}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2 font-normal text-gray-500 text-sm">#</th>
                    <th className="p-2 font-normal text-gray-500 text-sm">Name</th>
                    <th className="p-2 font-normal text-gray-500 text-sm">Popularity</th>
                    <th className="p-2 font-normal text-gray-500 text-sm">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-gray-400">
                        No product data
                      </td>
                    </tr>
                  ) : (
                    productData.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100">
                        <td className="p-2 text-sm font-medium text-gray-600">{p.id}</td>
                        <td className="p-2 text-sm font-medium text-gray-800">{p.name}</td>
                        <td className="p-2">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p.popularity}%`, background: 'linear-gradient(to right, #FFC107, #FF9800)' }} />
                          </div>
                        </td>
                        <td className="p-2 text-sm font-medium text-gray-600 text-right">
                          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-green-400" style={{ width: `${p.sales}%` }} />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-1 text-gray-600">{p.sales}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Customer analytics (unchanged layout but reads updated data) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Insights */}
          <div className="bg-white p-6 rounded-3xl shadow-lg col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Customer Insights</h2>
              <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">...</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <h3 className="text-base font-medium text-gray-500">Total Registered Customers</h3>
                <p className="text-4xl font-bold text-gray-800">{customerInsightsData.totalRegistered}</p>

                <h3 className="text-base font-medium text-gray-500 mt-4">Active customers this week</h3>
                <p className="text-4xl font-bold text-gray-800">{customerInsightsData.activeThisPeriod}</p>
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-base font-medium text-gray-500">Average Growth</h3>
                <div className="w-full h-40">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path d={customerInsightsData.averageGrowth || 'M0,30 Q25,15 50,20 T100,10'} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Customer Feedback</h2>
              <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">...</button>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-500">Average rating</h3>
              <p className="text-4xl font-bold text-gray-800">
                {customerInsightsData.totalRegistered}
              </p>

              <h3 className="text-base font-medium text-gray-500 mt-4">Total reviews this month</h3>          
              <p className="text-4xl font-bold text-gray-800">
                {customerFeedback.totalReviews}
              </p>
            </div>
          </div>

          {/* Total Customers Stacked Bars */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Customer Ratings</h2>
              <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">...</button>
            </div>

            <div className="flex text-gray-500 h-52 items-end justify-between space-x-4">
              {['1', '2', '3', '4', '5'].map((rating) => {
                const count = customerFeedback.ratingsBreakdown?.[rating] || 0;
                const label = rating === '1' ? 'Low' :
                              rating === '2' ? 'Good' :
                              rating === '3' ? 'Average' :
                              rating === '4' ? 'High' : 'Excellent';
                return (
                  <div key={rating} className="flex-1 text-center">
                    <div className="h-40 bg-gray-200 rounded-lg relative">
                      <div
                        className="bg-green-500 rounded-lg absolute bottom-0 w-full"
                        style={{ height: `${Math.min(100, count * 10)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-sm font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <h3 className="text-xs text-gray-500 font-semibold mb-2">Legend (Ratings)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-900 flex items-center space-x-2">
                  <span className="w-3 h-3 text-gray-900 rounded-full bg-[#EA4335]" />
                  <span>Low</span>
                </div>
                <div className="text-gray-900 flex items-center space-x-2">
                  <span className="w-3 h-3 text-gray-900 rounded-full bg-[#FFC107]" />
                  <span>Good</span>
                </div>
                <div className="text-gray-900 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#4285F4]" />
                  <span className='text-gray-900'>Average</span>
                </div>
                <div className="text-gray-900 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#A6C561]" />
                  <span>High</span>
                </div>
                <div className="text-gray-900 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#4CAF50]" />
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Common Add-Ons */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Common Add-Ons</h2>
              <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">...</button>
            </div>

            <div className="space-y-4">
              {addOnsData.length === 0 ? (
                <div className="text-sm text-gray-400">No add-on stats</div>
              ) : (
                addOnsData.map((a, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-medium text-gray-800">{a.name}</p>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: 'linear-gradient(to right, #6EE7B7, #10B981)' }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Loyalty Program</h2>
              <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full">...</button>
            </div>

            <div className="flex flex-col items-center justify-center h-48">
              <h3 className="text-base text-gray-500">Rewards redeemed this month</h3>
              <p className="text-6xl font-bold text-gray-800 mt-2">{loyaltyProgramData}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
