import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Users,
  DollarSign,
  BookOpen,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement
);

interface OrderSummaryItem {
  label: string;
  value: number;
  color: string;
}

interface OrderOverviewData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

const BASE_URL = "http://127.0.0.1:8000/api";

const Dashboard: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  const [cards, setCards] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalMenu: 0,
  });

  const [orderSummary, setOrderSummary] = useState<OrderSummaryItem[]>([]);
  const [orderOverview, setOrderOverview] = useState<OrderOverviewData | null>(null);
  const [customerMapData, setCustomerMapData] = useState<any>(null);

  const [revenueChart, setRevenueChart] = useState<any>(null);
  const [adminName, setAdminName] = useState<string>(""); 

  // Dynamic Greeting
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  else if (hour >= 18) greeting = "Good Evening";

  const orderSummaryData: OrderSummaryItem[] = orderSummary;
  const overviewData: OrderOverviewData | null = orderOverview;

  const revenueData = revenueChart ?? {
    labels: Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`), // max 6 weeks possible
    datasets: [
      {
        label: "Revenue",
        data: Array(6).fill(0),
        borderColor: "#6CB74A",
        backgroundColor: "rgba(108, 183, 74, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const role = sessionStorage.getItem("dashboard_role");
      const endpoint =
        role === "super_admin"
          ? "/superadmin/analytics"
          : "/admin/analytics";

      const date = `${year}-${String(month).padStart(2, "0")}-01`;
      const token = localStorage.getItem("token");

      // MAIN DASHBOARD ANALYTICS (monthly)
      const { data } = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          view: "month",
          date,
        },
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      // Populate cards
      setCards({
        totalOrders: data.totals.orders_count,
        totalCustomers: data.customerInsights.totalRegistered,
        totalRevenue: data.totals.revenue_total,
        totalMenu: data.totalMenu ?? 0,
      });

      // Order Summary
      setOrderSummary([
        { label: "Pending", value: data.orderSummary.pending, color: "#FACC15" },
        { label: "Completed", value: data.orderSummary.completed, color: "#6CB74A" },
        { label: "Canceled", value: data.orderSummary.canceled, color: "#EF4444" },
        { label: "Paid", value: data.orderSummary.paid, color: "#3B82F6" },
      ]);

      // Order Overview
      setOrderOverview({
        labels: ["Morning", "Afternoon", "Evening"],
        datasets: [
          {
            data: [
              data.orderOverview.morning,
              data.orderOverview.afternoon,
              data.orderOverview.evening,
            ],
            backgroundColor: ["#A3D9A5", "#6CB74A", "#4A9F3B"],
          },
        ],
      });

      // Active Customers Map (Weekly)
      setCustomerMapData({
        labels: data.customerMap.labels,
        datasets: [
          {
            label: "This Month",
            data: data.customerMap.datasets[0].data,
            backgroundColor: "#6CB74A",
            borderRadius: 6,
          },
          {
            label: "Last Month",
            data: data.customerMap.datasets[1].data,
            backgroundColor: "#A3D9A5",
            borderRadius: 6,
          },
        ],
      });

      // DAILY REVENUE FOR FULL MONTH CHART
      const revenueRes = await axios.get(`${BASE_URL}${endpoint}/revenue-per-day`, {
        params: { date },
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const dailyRevenue = revenueRes.data.revenue || [];
      const daysInMonth = new Date(year, month, 0).getDate();
      const fullDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      const revenueMap = new Map<number, number>();
      dailyRevenue.forEach((d: any) =>
        revenueMap.set(Number(d.day), Number(d.revenue))
      );

      const alignedValues = fullDays.map((day) => revenueMap.get(day) ?? 0);

      setRevenueChart({
        labels: fullDays.map((day) => `Day ${day}`),
        datasets: [
          {
            label: "Revenue",
            data: alignedValues,
            borderColor: "#8cb662",
            backgroundColor: "rgba(140,182,98,0.15)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: "#8cb662",
          },
        ],
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [month, year]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const role = sessionStorage.getItem("dashboard_role");
        const token = localStorage.getItem("token");

        const endpoint =
          role === "super_admin"
            ? "/api/superadmin/profile"
            : "/api/admin/profile";

        const res = await axios.get(`http://127.0.0.1:8000${endpoint}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        setAdminName(res.data.user.name || res.data.user.username);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-[#f5f6f8] font-sans text-gray-700">
      <div className="flex justify-end gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {Array.from(
            { length: new Date().getFullYear() - 2019 + 1 },
            (_, i) => 2019 + i
          ).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[#6CB74A] to-[#4A9F3B] text-white rounded-lg p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting},{adminName ? ` ${adminName}` : ""}!
          </h2>
          <p className="text-md mt-1">
            Manage your team, track insights, and keep everything running smoothly.
          </p>
          <button
            onClick={() => {
              const role = sessionStorage.getItem("dashboard_role");
              window.location.href =
                role === "super_admin"
                  ? "/superadmin/dashboard/inventory"
                  : "/admin/dashboard/inventory";
            }}
            className="mt-4 cursor-pointer bg-[#d96b2b] hover:bg-[#d95c2b] px-5 py-3 rounded-full text-white font-medium transition transform hover:-translate-y-1 shadow"
          >
            Go to Inventory
          </button>
        </div>
        <div>
          <img
            src="\images\Hello-rafiki.png"
            alt="Hello"
            className="w-70 h-60"
          />
        </div>
      </div>

    {/* Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">{cards.totalOrders}</p>
            <p className="text-gray-500 text-sm">Total Orders</p>
          </div>
          <ShoppingBag className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">{cards.totalCustomers}</p>
            <p className="text-gray-500 text-sm">Total New Customers</p>
          </div>
          <Users className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">
              ₱{cards.totalRevenue.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">Total Revenue</p>
          </div>
          <DollarSign className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">{cards.totalMenu}</p>
            <p className="text-gray-500 text-sm">Total Newly-Created Menu</p>
          </div>
          <BookOpen className="text-[#6CB74A]" size={36} />
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white p-5 rounded-lg shadow h-full flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg">Order Summary</h3>
          </div>

          {/* Fix container height */}
          <div className="flex justify-around items-center flex-1">
            {orderSummaryData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-24 h-24">
                <Doughnut
                  data={{
                    labels: [item.label, "Other"],
                    datasets: [
                      {
                        data: [item.value, 100 - item.value],
                        backgroundColor: [item.color, "#e5e7eb"],
                      },
                    ],
                  }}
                  options={{
                    cutout: "70%", 
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
                </div>
                <p className="mt-2 font-bold text-lg">{item.value}%</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white p-5 rounded-lg shadow h-full flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg">Order Overview</h3>
            <a href="#" className="text-[#6CB74A] text-sm font-medium hover:underline">
              View all
            </a>
          </div>

          <div className="flex items-center justify-center flex-1">
            {overviewData ? (
              <>
                {/* Doughnut chart */}
                <div className="w-36 h-36">
                  <Doughnut
                    data={overviewData}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>

                {/* Legend */}
                <div className="ml-8 space-y-3">
                  {overviewData.labels.map((label, i) => (
                    <div key={i} className="flex items-center justify-between w-40 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              overviewData.datasets[0].backgroundColor[i],
                          }}
                        />
                        <span>{label}</span>
                      </div>
                      <span className="font-semibold">
                        {overviewData.datasets[0].data[i]}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">Loading overview...</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Map */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg">Active Customers Map</h3>
          </div>
          {customerMapData ? (
            <Bar
              data={customerMapData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    backgroundColor: "#ffffff",
                    borderColor: "#E5E7EB",
                    borderWidth: 1,
                    cornerRadius: 8, // valid
                    titleColor: "#111827",
                    bodyColor: "#111827",
                    padding: 10,
                    displayColors: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 12 },
                      color: "#6B7280",
                    },
                    grid: {
                      display: true,
                      borderDash: [3, 3],
                      color: "#E5E7EB",
                    },
                  },
                  y: {
                    ticks: {
                      font: { size: 12 },
                      color: "#6B7280",
                      precision: 0,
                    },
                    beginAtZero: true,
                    grid: {
                      display: true,
                      borderDash: [3, 3],
                      color: "#E5E7EB",
                    },
                  }
                }
              }}
            />
          ) : (
            <p className="text-sm text-gray-400">Loading customer data...</p>
          )}
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-5">Total Revenue</h3>
          <div className="h-64"> 
            <Line
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#ffffff",
                    borderColor: "#E5E7EB",
                    borderWidth: 1,
                    titleColor: "#111827",
                    bodyColor: "#111827",
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                      label: (context) => `₱${context.raw?.toLocaleString() ?? 0}`,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 12 },
                      color: "#6B7280",
                    },
                    grid: {
                      display: true,
                      borderDash: [3, 3],
                      color: "#E5E7EB",
                    },
                  },
                  y: {
                    ticks: {
                      font: { size: 12 },
                      color: "#6B7280",
                      callback: (value) => `₱${Number(value).toLocaleString()}`,
                    },
                    beginAtZero: true,
                    grid: {
                      display: true,
                      borderDash: [3, 3],
                      color: "#E5E7EB",
                    },
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
