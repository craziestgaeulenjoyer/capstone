import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  LineChart,
  BarChart,
  Bar,
} from 'recharts';

/* ---------- Types (same as your base) ---------- */

interface OrderHour {
  hour: number;
  orders: number;
  customers: number;
  revenue: number; 
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
  averageGrowth: number;
  averageActiveUsers: number;
  registrations: Array<{
    date: string;
    count: number;
  }>;
}

interface CustomerInsightsApi {
  totalRegistered: number;
  activeThisPeriod: number;
  averageGrowth: number;
  averageActiveUsers: number;
  registrations: {
    date: string;
    count: number;
  }[];
}

interface CustomerInsightsWithRegistrations {
  totalRegistered: number;
  activeThisPeriod: number;
  averageGrowth: number;
  averageActiveUsers?: number;
  registrations?: { date: string; count: number }[];
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
  verifiedCustomers?: {
    date: string;    
    count: number;   
  }[];
  peak_hours?: { text: string; hours: number[]; max_count?: number };
  customer_time_intervals?: BackendCustomerIntervals;
  peak_hours_correct?: BackendPeakHoursCorrect;
  heatmap?: any;
  productBreakdown?: Record<number, any[]>; 
  totals?: { orders_count: number; revenue_total: number };
  daily_revenue?: { day: string; revenue: number; orders: number; };
  ordersPerHour: OrderHour[];
};

interface BackendCustomerIntervals {
  morning: number;
  afternoon: number;
  evening: number;
  average: number;
}

interface BackendPeakHoursCorrect {
  hour: number;
  count: number;
}

interface PeakHour {
  hour: number;
  count: number;
}

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

type RegistrationDay = { hour: number; count: number };
type RegistrationMonth = { day: number; count: number };
type RegistrationYear = { month: number; count: number };

const buildCustomerGrowthData = (
  registrations: Array<RegistrationDay | RegistrationMonth | RegistrationYear>,
  view: 'Per Day' | 'Per Month' | 'Per Year',
  currentDate: Date
) => {
  if (!registrations || registrations.length === 0) return [];

  /* ===============================
  * PER DAY — hourly (9–22 or 10–22)
  * =============================== */
  if (view === 'Per Day') {
    const isSunday = currentDate.getDay() === 0;
    const startHour = isSunday ? 9 : 10;
    const endHour = 22;

    // Build a map from hour → count
    const hourMap = new Map<number, number>();
    registrations
      .filter((r): r is RegistrationDay => 'hour' in r)
      .forEach(r => {
        if (r.hour >= startHour && r.hour <= endHour) {
          hourMap.set(r.hour, r.count ?? 0);
        }
      });

    // Fill in missing hours with 0
    const data = [];
    for (let h = startHour; h <= endHour; h++) {
      data.push({
        label: `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'AM' : 'PM'}`,
        value: hourMap.get(h) ?? 0,
      });
    }

    return data;
  }

  /* ===============================
  * PER MONTH — daily (1 → last day)
  * =============================== */
  if (view === 'Per Month') {
    return registrations
      .filter((r): r is RegistrationMonth => 'day' in r)
      .map(r => ({
        label: String(r.day),
        value: Number(r.count) || 0,
      }));
  }

  /* ===============================
  * PER YEAR — monthly (Jan → Dec)
  * =============================== */
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return registrations
    .filter((r): r is RegistrationYear => 'month' in r)
    .map(r => ({
      label: monthNames[r.month - 1],
      value: Number(r.count) || 0,
    }));
};

type ProductItem = {
  name: string;
  total_orders: number;
};

type BreakdownPopoverProps = {
  position: { top: number; left: number };
  items: ProductItem[];
  onClose: () => void;
};

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
  useState<CustomerInsightsWithRegistrations>({
    totalRegistered: 0,
    activeThisPeriod: 0,
    averageGrowth: 0,
    averageActiveUsers: 0,
    registrations: [],
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
  const [activeTab, setActiveTab] = useState<'Sales Hub' | 'Customer Analytics' | 'Forecasting Hub'>('Sales Hub');
  const [view, setView] = useState<'Per Day' | 'Per Month' | 'Per Year'>('Per Day');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); 
  const [chartTimeframe, setChartTimeframe] = useState<'Daily' | 'Weekly'>('Daily'); 
  const [verifiedCustomers, setVerifiedCustomers] = useState<{ date: string; count: number }[]>([]);
  
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [backendProductBreakdown, setBackendProductBreakdown] = useState<Record<number, any[]>>({});
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedBreakdown, setSelectedBreakdown] = useState<{
    hour: number;
    items: any[];
  } | null>(null);

  const [peakData, setPeakData] = useState<PeakHour[]>([]);
  const [filter, setFilter] = useState<'day' | 'month' | 'year'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const fetchPeakHours = async () => {
    try {
      console.log("FETCH PEAK HOURS STATE", {
        filter,
        selectedDate,
      });

      const role = sessionStorage.getItem("dashboard_role");
      const apiRole = role === "super_admin" ? "superadmin" : "admin";
      const token = localStorage.getItem("token");

      const url = `/api/${apiRole}/analytics/peak-hours`;

      const res = await axios.get(url, {
        params: { filter, date: selectedDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Peak Hours API Response:", res.data);

      const normalized: PeakHour[] = Array.isArray(res.data)
        ? res.data.map((d: any) => ({
            hour: Number(d.hour),
            count: Number(d.count),
          }))
        : [];

      setPeakData(
        normalized.sort((a, b) => a.hour - b.hour)
      );
    } catch (err) {
      console.error("Failed to fetch peak hours", err);

      setPeakData([]);
    }
  };

  const getOpeningHours = () => {
    if (filter === 'day') {
      const isSunday = new Date(selectedDate).getDay() === 0;
      return {
        start: isSunday ? 9 : 10,
        end: 22,
      };
    }

    return {
      start: 9,
      end: 22,
    };
  };

  const { start: startHour, end: endHour } = getOpeningHours();

  const filteredPeakData = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => {
      const hour = startHour + i;
      const found = peakData.find((d) => d.hour === hour);

      return {
        hour,
        count: found ? found.count : 0,
      };
    }
  );

  const peakMax = Math.max(
    ...filteredPeakData.map((d) => d.count),
    1
  );

  const hasPeakData = filteredPeakData.some((d) => d.count > 0);

  const peakChartKey = `${filter}-${selectedDate}`;

  useEffect(() => {
    if (!filter || !selectedDate) return;

    setPeakData([]);
    fetchPeakHours();
  }, [filter, selectedDate]);

  useEffect(() => {
    if (filter === 'month') {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      setSelectedDate(formatLocalDate(firstDayOfMonth));
    }

    if (filter === 'year') {
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      setSelectedDate(formatLocalDate(firstDayOfYear));
    }
  }, [filter, currentDate]);

  const [customerRegistrations, setCustomerRegistrations] = useState<
    { date: string; count: number }[]
  >([]);
  const [adjustedTimeOfDayCounts, setAdjustedTimeOfDayCounts] = useState({
    morning: 0,
    afternoon: 0,
    evening: 0,
    morningStart: 10,
  });
  const [averageCustomers, setAverageCustomers] = useState<number>(0);
  const [computedPeakHours, setComputedPeakHours] = useState<{
    text: string;
    max_count: number | null;
  }>({ text: '', max_count: null });

  const heatmapAnchorRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  /* ---------- Calendar helpers ---------- */

  const heatmapData = useMemo(() => {
    if (!salesData) return [];

    const isSunday = currentDate.getDay() === 0;
    const openHour = isSunday ? 9 : 10;
    const closeHour = 22;

    // PER DAY — Hourly
    if (view === "Per Day") {
      const hourCounts = Array.from(
        { length: closeHour - openHour + 1 },
        (_, idx) => {
          const hour = openHour + idx;
          const record = ordersPerHour?.find(o => Number(o.hour) === hour);
          return record?.orders ?? 0;
        }
      );

      return [
        {
          label: currentDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }),
          hourCounts,
          hourLabels: Array.from({ length: closeHour - openHour + 1 }, (_, i) => {
            const h = openHour + i;
            const period = h >= 12 ? "PM" : "AM";
            const display = h % 12 === 0 ? 12 : h % 12;
            return `${display} ${period}`;
          }),
          day: currentDate.toLocaleDateString("en-US", {
            weekday: "short"
          })
        },
      ];
    }

    if (view === "Per Month") {
      return [
        {
          day: currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          }),
          hourCounts: salesData.map(s => s.orders ?? 0),
          hourLabels: salesData.map(s => s.name)
        }
      ];
    }

    if (view === "Per Year") {
      const monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      return [
        {
          day: currentDate.getFullYear().toString(),
          hourCounts: monthList.map(m => {
            const item = salesData.find(s => s.name === m);
            return item?.orders ?? 0;
          }),
          hourLabels: monthList
        }
      ];
    }

    return [];
  }, [salesData, ordersPerHour, view, currentDate]);

  const filteredPieData = [
    { name: "Morning", value: adjustedTimeOfDayCounts.morning },
    { name: "Afternoon", value: adjustedTimeOfDayCounts.afternoon },
    { name: "Evening", value: adjustedTimeOfDayCounts.evening }
  ].filter(v => v.value > 0);

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

  useEffect(() => {
    setShowCalendar(false);

  }, [view]);

  // helper to format date param (YYYY-MM-DD)
  const formatDateParam = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleSelectCalendarDay = (dayNum: number) => {
    const clicked = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNum,
      0, 0, 0
    );

    setCurrentDate(clicked);
    setSelectedDate(formatLocalDate(clicked));
    setShowCalendar(false);
  };

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getBreakdownKey = (
    view: 'Per Day' | 'Per Month' | 'Per Year',
    index: number,
    currentDate: Date
  ): number => {
    if (view === 'Per Day') {
      // hour key (already correct)
      const isSunday = currentDate.getDay() === 0;
      return (isSunday ? 9 : 10) + index;
    }

    if (view === 'Per Month') {
      // day of month (1–31)
      return index + 1;
    }

    // Per Year → month number (1–12)
    return index + 1;
  };

  const maxRevenue = Math.max(
  ...salesData.map(s => s.value),
  10 
  );

  // Only filter revenue chart hours in PER DAY mode
  const filteredSalesData = useMemo(() => {
    if (!salesData || salesData.length === 0) return [];

    if (view !== 'Per Day') {
      return salesData; 
    }

    const isSunday = currentDate.getDay() === 0;
    const openHour = isSunday ? 9 : 10;
    const closeHour = 22;

    return salesData.filter(item => {
      const hour = Number(item.name); 
      return !isNaN(hour) && hour >= openHour && hour <= closeHour;
    });
  }, [salesData, view, currentDate]);

  const normalizeDailySales = (data: SalesDataItem[], date: Date): SalesDataItem[] => {
    const daysInMonth = getDaysInMonth(date);

    const map = new Map<number, SalesDataItem>();

    data.forEach(d => {
      let dayNum = 0;

      const match = d.name.match(/\d+/); 
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

  const actualGrowthData = useMemo(() => {
    if (!customerRegistrations || customerRegistrations.length === 0) return [];

    switch(view) {
      case 'Per Day':
        // map { date, count } → { hour, count } if needed
        return buildCustomerGrowthData(
          customerRegistrations.map(r => ({
            hour: new Date(r.date).getHours(),
            count: r.count,
          })),
          view,
          currentDate
        );
      case 'Per Month':
        return buildCustomerGrowthData(
          customerRegistrations.map(r => ({
            day: new Date(r.date).getDate(),
            count: r.count,
          })),
          view,
          currentDate
        );
      case 'Per Year':
        return buildCustomerGrowthData(
          customerRegistrations.map(r => ({
            month: new Date(r.date).getMonth() + 1,
            count: r.count,
          })),
          view,
          currentDate
        );
      default:
        return [];
    }
  }, [customerRegistrations, view, currentDate]);

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

      const customerInsights = data.customerInsights as CustomerInsightsWithRegistrations;

      const safeRegistrations = Array.isArray(customerInsights.registrations)
        ? customerInsights.registrations.map(r => ({
            date: r.date,
            count: Number(r.count ?? 0),
          }))
        : [];

      setCustomerRegistrations(safeRegistrations);
      
      if (Array.isArray(data.salesData)) {
      let sales: SalesDataItem[] = (data.salesData ?? []).map(s => ({
        name: s.name !== undefined && s.name !== null ? String(s.name) : '',
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
          activeThisPeriod: data.customerInsights.activeThisPeriod ?? 0,
          averageGrowth: Number(data.customerInsights.averageGrowth ?? 0),
          averageActiveUsers: Number(data.customerInsights.averageActiveUsers ?? 0),
          registrations: data.customerInsights.registrations ?? [],
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

      const safeVerifiedCustomers = Array.isArray(data.verifiedCustomers)
        ? data.verifiedCustomers.map(v => ({
            date: v.date,
            count: Number(v.count ?? 0),
          }))
        : [];

      const isSunday = currentDate.getDay() === 0;
      const openHour = isSunday ? 9 : 10;
      const closeHour = 22;

      setOrdersPerHour([]);

      const safeOrdersPerHour = Array.isArray(data.ordersPerHour)
        ? data.ordersPerHour
            .filter(o => o.hour >= openHour && o.hour <= closeHour)
            .map(o => ({ ...o, orders: o.orders ?? 0, customers: o.customers ?? 0 }))
        : [];

      setOrdersPerHour(safeOrdersPerHour);

      setVerifiedCustomers(safeVerifiedCustomers); 

      setPeakHours(data.peak_hours ?? { text: '', hours: [] });
      setHeatmap(data.heatmap ?? null);
      setTotals(data.totals ?? { orders_count: 0, revenue_total: 0 });

      // New correct customers interval + peak hours logic
      if (data.customer_time_intervals) {
        const { morning = 0, afternoon = 0, evening = 0, average = 0 } =
          data.customer_time_intervals;

        setAdjustedTimeOfDayCounts(prev => ({
          ...prev,
          morning,
          afternoon,
          evening,
        }));

        setAverageCustomers(average);
      }

      if (data.peak_hours_correct) {
        const hour = data.peak_hours_correct.hour;
        const hourText =
          `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`;

        setComputedPeakHours({
          text: hourText,
          max_count: data.peak_hours_correct.count
        });
      }

      setBackendProductBreakdown(data.productBreakdown || {});

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to fetch analytics.');
    }
  };

  const performLinearRegression = (data: number[], futureCount: number) => {
    if (data.length < 2) return [];

    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    return Array.from({ length: futureCount }, (_, i) => {
      const nextX = n + i;
      return Math.max(0, parseFloat((slope * nextX + intercept).toFixed(2)));
    });
  };

  function generateBusinessHours(date: Date): number[] {
    const day = date.getDay(); // 0 = Sunday
    const startHour = day === 0 ? 9 : 10;
    const endHour = 22;

    const hours: number[] = [];
    for (let h = startHour; h <= endHour; h++) {
      hours.push(h);
    }

    return hours;
  }

  const businessHours =
    filter === 'day'
      ? generateBusinessHours(new Date(selectedDate))
      : [];

  const chartData: OrderHour[] =
    filter === 'day'
      ? businessHours.map(hour => {
          const record = ordersPerHour.find(d => d.hour === hour);

          return {
            hour,
            orders: record?.orders ?? 0,
            customers: record?.customers ?? 0,
            revenue: record?.revenue ?? 0, 
            day: record?.day ?? '',
            month: record?.month ?? 0,
          };
        })
      : ordersPerHour;

  const revenueDaySource = chartData; // { hour, revenue, customers }
  const revenueAggregateSource = salesData; // { name, value }

  const forecastStepsMap = {
    "Per Day": 7,
    "Per Month": 7,
    "Per Year": 3
  };

  const forecastSteps = forecastStepsMap[view] ?? 7;

  const revenueChartSource =
  filter === 'day'
    ? chartData
    : salesData;

  const forecastRevenueData = useMemo(() => {
    // Get actual values
    const actual =
      filter === 'day'
        ? revenueDaySource.map(d => d.revenue)
        : revenueAggregateSource.map(d => d.value);

    const forecast = performLinearRegression(actual, forecastSteps);

    // Build chart points
    const actualSeries =
      filter === 'day'
        ? revenueDaySource.map(d => ({
            label: `${d.hour % 12 === 0 ? 12 : d.hour % 12}${d.hour < 12 ? 'AM' : 'PM'}`,
            actual: d.revenue,
          }))
        : revenueAggregateSource.map(d => ({
            label: d.name,
            actual: d.value,
          }));

    return [
      ...actualSeries,
      ...forecast.map((v, i) => ({
        label: `+${i + 1}`,
        forecast: v,
      })),
    ];
  }, [filter, revenueDaySource, revenueAggregateSource, forecastSteps]);

  // Customers Forecast Data
  const forecastCustomerData = useMemo(() => {
    const actual =
      filter === 'day'
        ? chartData.map(d => d.customers)
        : customerInsightsData.registrations?.map(r => r.count) ?? [];
    const forecast = performLinearRegression(actual, forecastSteps);

    return [
      ...(filter === 'day'
        ? chartData.map(d => ({
            label: `${d.hour % 12 === 0 ? 12 : d.hour % 12}${d.hour < 12 ? 'AM' : 'PM'}`,
            actual: d.customers,
          }))
        : customerInsightsData.registrations?.map(r => ({
            label: r.date,
            actual: r.count,
          })) ?? []),

      ...forecast.map((v, i) => ({
        label: `+${i + 1}`,
        forecast: v,
      })),
    ];
  }, [customerInsightsData, view]);

  // Convert data array into downloadable CSV
  const exportToCSV = (filename: string, rows: any[]) => {
    const separator = ",";
    const keys = Object.keys(rows[0] || {});

    const csvContent =
      keys.join(separator) +
      "\n" +
      rows
        .map((row) =>
          keys
            .map((k) => `"${row[k] ?? ""}"`)
            .join(separator)
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  {/* Inside your component */}
  useEffect(() => {
    console.log('Actual growth data:', actualGrowthData);
  }, [actualGrowthData]);

  useEffect(() => {
    fetchAnalytics();
  }, [view, currentDate]);

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

  const yAxisMax = Math.ceil(maxRevenue / 50) * 50; // rounds up to nearest ₱50
  const yTickCount = 5;

  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round((yAxisMax / yTickCount) * i)
  );
  
  const ratingColors: Record<string, string> = {
    '1': '#EA4335', 
    '2': '#FFC107', 
    '3': '#4285F4',
    '4': '#A6C561', 
    '5': '#4CAF50', 
  };

  const CUSTOMER_COLORS = ['#4ade80', '#60a5fa', '#f97316']; 

  const BreakdownPopover: React.FC<BreakdownPopoverProps> = ({ position, items, onClose }) => {
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".breakdown-popover")) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    return (
      <div
        className="breakdown-popover absolute z-[9999] bg-white border shadow-lg rounded-lg p-3"
        style={{
          top: position.top,
          left: position.left,
          transform: "translateX(-50%)",
        }}
      >
        <p className="font-semibold text-gray-700 mb-2">Products Sold</p>

        {items.length === 0 ? (
          <p className="text-xs text-gray-500">No product data</p>
        ) : (
          <ul className="text-xs space-y-1">
            {items.map((product: ProductItem, i: number) => (
              <li key={i} className="text-gray-700 font-medium">
                {product.name} — <span className="font-semibold">{product.total_orders}</span> orders
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleExport = () => {
    const dateString = currentDate.toISOString().split("T")[0];

    if (activeTab === "Sales Hub") {
      if (!salesData?.length) return;

      exportToCSV(
        `analytics_saleshub_${view}_${dateString}.csv`,
        salesData.map((d) => ({
          period: d.name,
          revenue: d.value,
          orders: d.orders,
        }))
      );
    }

    else if (activeTab === "Customer Analytics") {
      if (!customerInsightsData?.registrations?.length) return;

      exportToCSV(
        `analytics_customers_${view}_${dateString}.csv`,
        customerInsightsData.registrations.map((r: any) => ({
          date: r.date,
          count: r.count,
        }))
      );
    }

    else if (activeTab === "Forecasting Hub") {
      if (!forecastRevenueData?.length) return;

      exportToCSV(
        `analytics_forecast_${view}_${dateString}.csv`,
        forecastRevenueData.map((d: any) => ({
          label: d.label,
          actual: "actual" in d ? d.actual : "",
          forecast: "forecast" in d ? d.forecast : "",
        }))
      );
    }
  };

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

          <button
            onClick={() => setActiveTab('Forecasting Hub')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'Forecasting Hub' ? 'bg-[#8cb662] shadow text-white' : 'text-gray-600 hover:bg-[#8cb662] hover:text-white'
            }`}
          >
            Forecasting Hub
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-center">
          <button
            onClick={handleExport}
            className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 shadow-sm hover:bg-[#8cb662] hover:text-white transition-colors"
          >
            {/* Export Icon (Heroicon Solid Style) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
            
            <span className="text-sm font-medium hidden sm:block">Export</span>
          </button>

          {/* Top-right timeframe selector (Per Day/Per Week/Per Month) */}
          <div className="relative">
            <select
              value={view}
              onChange={(e) => {
                const newView = e.target.value as 'Per Day' | 'Per Month' | 'Per Year';
                setView(newView);

                if (newView === 'Per Day') setFilter('day');
                if (newView === 'Per Month') setFilter('month');
                if (newView === 'Per Year') setFilter('year');
              }}
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
                          setSelectedDate(`${year}-01-01`);
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

      {activeTab === 'Sales Hub' && (
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
                  data={filteredSalesData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                    tickFormatter={(value: any) => {
                      if (view !== 'Per Day') return String(value);

                      const hour = Number(value);
                      if (isNaN(hour)) return String(value);

                      const period = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 === 0 ? 12 : hour % 12;

                      return `${displayHour} ${period}`;
                    }}
                  />

                  <YAxis
                    domain={[0, yAxisMax]}
                    ticks={yTicks}
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  />

                  <Tooltip
                    formatter={(value, name, props: any) => {
                      const v = typeof value === "number" ? value : 0;
                      const orders = props?.payload?.orders ?? 0;

                      return [`₱${v.toLocaleString()}`, `${orders} orders`];
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
                  {filteredPieData.length === 0 ? (
                    <div className="text-gray-400 text-sm">
                      No customer activity for this period
                    </div>
                  ) : (
                    <PieChart width={420} height={320}>
                      <Pie
                        data={filteredPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ percent, value }) =>
                          `${(typeof percent === 'number' ? percent * 100 : 0).toFixed(1)}% ${value} customers`
                        }
                      >
                        {filteredPieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number | undefined) => {
                          return [`${value ?? 0} customers`, ''];
                        }}
                      />
                    </PieChart>
                  )}
                </div>

                {/* Peak info to the right side of the donut */}
                <div className="flex flex-col items-start">
                  <div className="text-sm text-gray-500">Peak hours</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {computedPeakHours.text || '—'}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Top orders in hour: {computedPeakHours.max_count ?? '-'}
                  </div>

                  {/* Average percentage */}
                  <div className="mt-4 text-sm text-gray-500">Average customers</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {averageCustomers}
                  </div>

                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div>
                      Morning ({adjustedTimeOfDayCounts.morningStart}AM–12PM): {adjustedTimeOfDayCounts.morning}
                    </div>
                    <div>Afternoon (1PM–5PM): {adjustedTimeOfDayCounts.afternoon}</div>
                    <div>Evening (6PM–10PM): {adjustedTimeOfDayCounts.evening}</div>
                  </div>
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
                    {view === "Per Day"
                    ? heatmapData[0]?.hourLabels?.map((label, i) => (
                        <th key={i} className="p-2 text-gray-500 text-sm font-normal">{label}</th>
                      ))
                    : view === "Per Month"
                    ? heatmapData[0]?.hourLabels?.map((label, i) => (
                        <th key={i} className="p-2 text-gray-500 text-sm font-normal">{label}</th>
                      ))
                    : heatmapData[0]?.hourLabels?.map((label, i) => (
                        <th key={i} className="p-2 text-gray-500 text-sm font-normal">{label}</th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {heatmapData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          view === "Per Day"
                            ? (heatmapData[0]?.hourLabels?.length || 1) + 1
                            : view === "Per Month"
                            ? (heatmapData[0]?.hourLabels?.length || getDaysInMonth(currentDate)) + 1
                            : (heatmapData[0]?.hourLabels?.length || 12) + 1
                        }
                        className="p-6 text-sm text-gray-400 text-center"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    heatmapData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 text-xs font-medium text-gray-700 whitespace-nowrap">
                          {row.day}
                        </td>

                        {row.hourCounts.map((count, idx) => {
                          const isSunday = row.day === "Sun"; 
                          const startHour = isSunday ? 9 : 10;
                          const hour = startHour + idx;

                          return (
                            <td key={idx} className="p-1">
                              <div
                                ref={(el) => {
                                  heatmapAnchorRefs.current[hour] = el;
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-transform hover:scale-110"
                                style={{
                                  background:
                                    count > 0
                                      ? `rgba(34,197,94,${Math.max(0.15, count / Math.max(...row.hourCounts, 1))})`
                                      : "#EEF2FF",
                                  color: count > 5 ? "#fff" : "#000",
                                }}
                                onClick={(e) => {
                                  if (count > 0) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const breakdownKey = getBreakdownKey(view, idx, currentDate);
                                    const breakdownItems = backendProductBreakdown?.[breakdownKey] ?? [];

                                    console.log("Heatmap Clicked:", {
                                      view,
                                      breakdownKey,
                                      backendProductBreakdown,
                                      breakdownItems,
                                    });

                                    // Update dropdown popover position ALWAYS based on clicked square
                                    setPopoverPosition({
                                      top: rect.bottom + window.scrollY + 6,
                                      left: rect.left + window.scrollX + rect.width / 2,
                                    });

                                    // Must include dayIndex (your type enforces it)
                                    setSelectedBreakdown({ hour, items: breakdownItems });
                                    setShowBreakdownModal(true);
                                  }
                                }}
                              >
                                {count > 0 ? count : ""}
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
      )} 
      
      {activeTab === 'Customer Analytics' && (
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
                <div className="text-sm text-gray-600 font-medium mb-2">
                  Average Customer Growth
                </div>

                <div className="w-full h-40">
                  {actualGrowthData.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      No growth data for this period
                    </span>
                  ) : (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart
                        data={actualGrowthData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#D1D5DB' }}
                        />
                        <YAxis
                          domain={[0, 'dataMax + 1']}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#D1D5DB' }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => {
                            return [`${value ?? 0} customers`, ''];
                          }}
                          labelStyle={{ color: '#111827', fontWeight: 500 }}
                          contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            border: '1px solid #E5E7EB',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
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

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={['1','2','3','4','5'].map(rating => ({
                    rating,
                    count: customerFeedback.ratingsBreakdown?.[rating] || 0,
                  }))}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="rating" 
                    tickFormatter={(r) => {
                      switch(r) {
                        case '1': return 'Low';
                        case '2': return 'Good';
                        case '3': return 'Average';
                        case '4': return 'High';
                        case '5': return 'Excellent';
                        default: return r;
                      }
                    }} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number | undefined) => {
                      return [`${value ?? 0} reviews`, ''];
                    }}
                  />
                  <Bar dataKey="count" fill="#8884d8">
                    {['1','2','3','4','5'].map((rating) => (
                      <Cell key={rating} fill={ratingColors[rating]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h3 className="text-xs text-gray-500 font-semibold mb-2">Legend (Ratings)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['1','2','3','4','5'].map((r) => {
                  const label = r === '1' ? 'Low' :
                                r === '2' ? 'Good' :
                                r === '3' ? 'Average' :
                                r === '4' ? 'High' : 'Excellent';
                  return (
                    <div key={r} className="text-gray-900 flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ratingColors[r] }} />
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-gray-900 text-lg font-semibold mb-2">Peak Customer Hours</h4>
            <p className="text-sm text-gray-500 mb-3">
              Unique customers placing orders per hour based on the selected time range
            </p>

            {hasPeakData ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  key={peakChartKey}
                  data={filteredPeakData}
                  margin={{ top: 30, right: 20, left: -30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  <XAxis
                    dataKey="hour"
                    type="number"
                    domain={[startHour, endHour]}
                    ticks={Array.from(
                      { length: endHour - startHour + 1 },
                      (_, i) => startHour + i
                    )}
                    tickFormatter={(h) => {
                      const period = h >= 12 ? "PM" : "AM";
                      const hour = h % 12 === 0 ? 12 : h % 12;
                      return `${hour}${period}`;
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    domain={[0, peakMax + 1]}   
                    tickCount={peakMax + 2}
                  />

                  <Tooltip labelFormatter={(h) => `${h}:00`} />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-gray-400 text-center py-16">
                No peak hour data available for this period.
              </div>
            )}
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

      {activeTab === 'Forecasting Hub' && (
        <>
          {/* Forecast Info Card */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Forecast Range
            </h3>
            <p className="text-sm text-gray-600">
              Forecasting next{" "}
              {view === "Per Day" && "7 Hours"}
              {view === "Per Month" && "7 Days"}
              {view === "Per Year" && "3 Months"}
              {" "}based on recent performance trends.
            </p>
          </div>

          {/* Sales & Revenue Forecast */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Sales & Revenue Forecast
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={filter === 'day' ? forecastRevenueData : forecastRevenueData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={3} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#22C55E"
                  strokeDasharray="5 5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customers Forecast */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Customers Forecasting
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastCustomerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#9333EA" strokeWidth={3} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {showBreakdownModal && selectedBreakdown && (
        <BreakdownPopover
          position={popoverPosition}
          items={selectedBreakdown.items}
          onClose={() => setShowBreakdownModal(false)}
        />
      )}
    </div>
  );
};

export default Analytics;


