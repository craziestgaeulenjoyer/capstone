import React from "react";
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

const Dashboard: React.FC = () => {
  // Dynamic Greeting
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  else if (hour >= 18) greeting = "Good Evening";

  // Dummy Data
  const orderSummaryData = [
    { label: "On Delivery", value: 30, color: "#6CB74A" },
    { label: "Delivered", value: 75, color: "#6CB74A" },
    { label: "Cancelled", value: 20, color: "#6CB74A" },
  ];

  const overviewData = {
    labels: ["Morning", "Afternoon", "Evening"],
    datasets: [
      {
        data: [24, 35, 52],
        backgroundColor: ["#A3D9A5", "#6CB74A", "#4A9F3B"],
      },
    ],
  };

  const customerMapData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "This Week",
        data: [90, 100, 80, 85, 70, 75, 95],
        backgroundColor: "#6CB74A",
      },
      {
        label: "Last Week",
        data: [60, 70, 65, 60, 55, 65, 80],
        backgroundColor: "#A3D9A5",
      },
    ],
  };

  const revenueData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [120, 200, 300, 500, 800, 600, 950, 1000, 850, 900, 780, 850],
        borderColor: "#6CB74A",
        backgroundColor: "rgba(108, 183, 74, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4 space-y-6 bg-[#f5f6f8] font-sans text-gray-700">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[#6CB74A] to-[#4A9F3B] text-white rounded-lg p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{greeting}, John Doe!</h2>
          <p className="text-md mt-1">
            Manage your team, track insights, and keep everything running smoothly.
          </p>
          <button className="mt-4 bg-[#d96b2b] hover:bg-[#d95c2b] px-5 py-3 rounded-full text-white font-medium transition transform hover:-translate-y-1 shadow">
            Go to Inventory
          </button>
        </div>
        <div>
          <img
            src="\images\Hello-rafiki.png"
            alt="Hello"
            className="w-80 h-60"
          />
        </div>
      </div>

    {/* Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">450</p>
            <p className="text-gray-500 text-sm">Total Orders</p>
          </div>
          <ShoppingBag className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">955</p>
            <p className="text-gray-500 text-sm">Total Customers</p>
          </div>
          <Users className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">50K</p>
            <p className="text-gray-500 text-sm">Total Revenue</p>
          </div>
          <DollarSign className="text-[#6CB74A]" size={36} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between hover:shadow-md transform hover:-translate-y-1 transition">
          <div>
            <p className="text-3xl font-bold">20</p>
            <p className="text-gray-500 text-sm">Total Menu</p>
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
      <select className="border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CB74A] transition">
        <option>Today</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
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
      <h3 className="font-bold text-lg">Overview</h3>
      <a href="#" className="text-[#6CB74A] text-sm font-medium hover:underline">
        View all
      </a>
    </div>

    <div className="flex items-center justify-center flex-1">
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
                style={{ backgroundColor: overviewData.datasets[0].backgroundColor[i] }}
              />
              <span>{label}</span>
            </div>
            <span className="font-semibold">
              {overviewData.datasets[0].data[i]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Map */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg">Customer Map</h3>
            <select className="border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CB74A] transition">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <Bar data={customerMapData} options={{ plugins: { legend: { position: "bottom" } } }} />
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-5">Total Revenue</h3>
          <Line data={revenueData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;







