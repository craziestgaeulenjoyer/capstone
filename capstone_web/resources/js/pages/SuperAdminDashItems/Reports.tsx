import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';

// A simple utility function to get the number of days in a month.
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

interface SalesItem {
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
}

interface BestSellingItem {
  rank: number;
  product_name: string;
  category: string;
  total_products_sold: number;
  total_amount: number;
}

interface Metrics {
  dailySales: number;
  totalOrders: number;
  newCustomers: number;
  bestSelling: { product_name: string; total_qty: number } | null;
  salesItems: SalesItem[];
  bestSellingItems?: BestSellingItem[];
}

interface PieDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export default function Report() {
  // State for managing the active tab
  const [activeTab, setActiveTab] = useState('salesReport');
  // State for the calendar functionality
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const role = sessionStorage.getItem('dashboard_role');
  const apiPrefix = role === 'super_admin' ? '/api/superadmin' : '/api/admin';

  const generatePieSlices = (
    data: { label: string; value: number }[]
  ) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    if (total <= 0) return []; 

    let cumulative = 0;

    return data.map((d, i) => {
      const startAngle = (cumulative / total) * 2 * Math.PI;
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      cumulative += d.value;

      const x1 = 100 + 100 * Math.cos(startAngle);
      const y1 = 100 + 100 * Math.sin(startAngle);
      const x2 = 100 + 100 * Math.cos(startAngle + sliceAngle);
      const y2 = 100 + 100 * Math.sin(startAngle + sliceAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      return {
        path: `M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`,
        percent: ((d.value / total) * 100).toFixed(1),
        label: d.label,
        color: `hsl(${i * 60}, 70%, 55%)`,
      };
    });
  };

  const filteredSalesItems = metrics.salesItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(salesSearch.toLowerCase());

    if (categoryFilter === 'All') {
      return matchesSearch;
    }

    const menuItem = metrics.bestSellingItems?.find(
      mi => mi.product_name === item.product_name
    );

    const matchesCategory = menuItem?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All', 
    'Popular',
    'Coffees',
    'Milktea',
    'Lemonade and Fruitti Juice',
    'Premium Matcha',
    'Foods',
  ];

  const dailyProductTotals = metrics.salesItems.reduce<Record<string, number>>(
    (acc, item) => {
      const amount = Number(item.total_amount) || 0;

      acc[item.product_name] =
        (acc[item.product_name] || 0) + amount;

      return acc;
    },
    {}
  );

  const ordersBreakdownData: PieDataItem[] = Object.values(
    metrics.salesItems.reduce<Record<string, PieDataItem>>((acc, item) => {
      const amount =
        Number(item.product_price) * Number(item.quantity);

      if (!acc[item.product_name]) {
        acc[item.product_name] = {
          name: item.product_name,
          value: 0,
        };
      }

      acc[item.product_name].value += amount;
      return acc;
    }, {})
  ).filter(d => d.value > 0);

  const PIE_COLORS = [
    '#8cb662',
    '#4f8df7',
    '#f59e0b',
    '#ef4444',
    '#6366f1',
    '#10b981',
  ];

  const bestSellingPieData: PieDataItem[] =
  (metrics.bestSellingItems || [])
    .map(item => ({
      name: item.product_name,
      value: Number(item.total_amount) || 0,
    }))
    .filter(d => d.value > 0);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Handle day selection
  const handleDayClick = (day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setShowCalendar(false);
  };

  // Generate the days for the calendar grid
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    // Fill with empty placeholders for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Fill with the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            p-2 rounded-lg text-center font-medium transition-colors
            ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-[#8cb662]'}
            ${isToday && !isSelected ? 'text-blue-500 font-bold' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return calendarDays;
  };

  const salesReportContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Sales Report (Line Chart) - Static SVG Placeholder */}
      <div className="p-6 bg-white rounded-xl shadow-sm lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Report</h2>
        <div className="w-full h-[350px] flex items-center justify-center">
          <p className="text-gray-500">No data available for sales report.</p>
        </div>
      </div>

      {/* Orders Breakdown (Pie Chart) */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Orders Breakdown
        </h2>

        {ordersBreakdownData.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            {/* Pie */}
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ordersBreakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    animationDuration={900}
                  >
                    {ordersBreakdownData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value?: number) =>
                      `₱ ${(value ?? 0).toFixed(2)}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Indicators BELOW */}
            <div className="w-full max-w-sm space-y-2 text-sm">
              {ordersBreakdownData.map((entry, index) => {
                const total = ordersBreakdownData.reduce(
                  (sum, d) => sum + d.value,
                  0
                );
                const percent =
                  total > 0
                    ? ((entry.value / total) * 100).toFixed(1)
                    : '0.0';

                return (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                    <span className="flex-1 font-medium">
                      {entry.name}
                    </span>
                    <span className="text-gray-500 font-semibold">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No data available.
          </p>
        )}
      </div>
    </div>
  );

  const bestSellingContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Top 6 Best-Selling Items Table */}
      <div className="p-6 bg-white rounded-xl shadow-sm lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 6 Best-Selling Items</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Filter search"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">No data available for top selling items.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Financial Summary
        </h2>

        {bestSellingPieData.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={bestSellingPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    animationDuration={900}
                  >
                    {bestSellingPieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value?: number) =>
                      `₱ ${(value ?? 0).toFixed(2)}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Indicators */}
            <div className="w-full max-w-sm space-y-2 text-sm">
              {bestSellingPieData.map((entry, index) => {
                const total = bestSellingPieData.reduce(
                  (sum, d) => sum + d.value,
                  0
                );
                const percent =
                  total > 0
                    ? ((entry.value / total) * 100).toFixed(1)
                    : '0.0';

                return (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                    <span className="flex-1 font-medium">
                      {entry.name}
                    </span>
                    <span className="text-gray-500 font-semibold">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No data available.
          </p>
        )}
      </div>
    </div>
  );

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);

    const csvContent = [
      headers.join(","), 
      ...rows.map(row =>
        headers
          .map(field => {
            const value = row[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (activeTab === "salesReport") {
      exportToCSV(
        `sales-report-${formattedDate}.csv`,
        filteredSalesItems.map(item => ({
          "Product Name": item.product_name,
          "Product Price": item.product_price,
          "Quantity": item.quantity,
          "Total Amount": item.total_amount,
        }))
      );
    }

    if (activeTab === "bestSelling") {
      exportToCSV(
        `best-selling-${formattedDate}.csv`,
        (metrics.bestSellingItems || []).map(item => ({
          Rank: item.rank,
          "Product Name": item.product_name,
          Category: item.category,
          "Total Sold": item.total_products_sold,
          "Total Amount": item.total_amount,
        }))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header section with tabs and controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 p-4 bg-white rounded-xl shadow-sm">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setActiveTab('salesReport')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'salesReport' ? 'bg-[#8cb662] text-white' : 'cursor-pointer text-gray-500 hover:text-gray-100 hover:bg-[#8cb662]'
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => setActiveTab('bestSelling')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'bestSelling' ? 'bg-[#8cb662] text-white' : 'cursor-pointer text-gray-500 hover:text-gray-100 hover:bg-[#8cb662]'
              }`}
            >
              Best Selling
            </button>
          </div>

          {/* Buttons and Date Picker */}
          <div className="flex flex-wrap items-center justify-end space-x-2">
            <button
              onClick={handleExport}
              className="cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-[#8cb662] hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.25-10.25a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5v-6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Export</span>
            </button>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium"
            >
              <option value="az_asc">A–Z (Ascending)</option>
              <option value="az_desc">A–Z (Descending)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {/* Filter By (Category) */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="relative" ref={calendarRef}>
              <input
                type="text"
                value={formattedDate}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-center font-medium pr-4 cursor-pointer"
              />
              {showCalendar && (
                <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-xl z-10 w-64">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-[#8cb662]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-semibold text-lg text-gray-800">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-[#8cb662]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-gray-500 font-medium">{day}</div>
                    ))}
                    {renderCalendarDays()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metric cards section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 11-2 0 1 1 0 012 0zm1.5-1.5a1 1 0 100-2 1 1 0 000 2zM12 7.5a1 1 0 100-2 1 1 0 000 2zm1.5-1.5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Daily Sales</h3>
                <p className="text-xl font-bold mt-1 text-gray-800">P 0.00</p>
              </div>
            </div>
            <div className={`text-sm font-semibold text-gray-500`}>
              0%
            </div>
          </div>
          <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9h6a1 1 0 110 2H7a1 1 0 110-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Orders</h3>
                <p className="text-xl font-bold mt-1 text-gray-800">0</p>
              </div>
            </div>
            <div className={`text-sm font-semibold text-gray-500`}>
              0%
            </div>
          </div>
          <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">New Customers</h3>
                <p className="text-xl font-bold mt-1 text-gray-800">0</p>
              </div>
            </div>
            <div className={`text-sm font-semibold text-gray-500`}>
              0%
            </div>
          </div>
          <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6 9a1 1 0 100-2 1 1 0 000 2zm-1.5-1.5a1 1 0 11-2 0 1 1 0 012 0zm1.5 1.5a1 1 0 100 2 1 1 0 000-2zm1.5 1.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Best-Selling Items</h3>
                <p className="text-xl font-bold mt-1 text-gray-800">0</p>
              </div>
            </div>
            <div className={`text-sm font-semibold text-gray-500`}>
              0%
            </div>
          </div>
        </div>

        {/* Conditional Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'salesReport' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {salesReportContent}
            </motion.div>
          )}

          {activeTab === 'bestSelling' && (
            <motion.div
              key="best"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {bestSellingContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}