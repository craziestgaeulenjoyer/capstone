import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Filter, Search, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the types for your data structures to avoid 'any'
interface Customer {
  id: string;
  name: string;
  contact: string;
  orders: number;
  lastOrder: string;
  status: 'Active' | 'New' | 'Inactive';
}

interface Metrics {
  total: number;
  active: number;
  new: number;
}

// Helper function to get the status tag style, with typed parameter
const getStatusClasses = (status: Customer['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-100 text-emerald-800';
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Inactive':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Customer_View = () => {
  // State for the customer data and metrics, now explicitly typed
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, active: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  // State for calendar functionality
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Simulate fetching data from a backend
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Data is now empty as per your request
      setCustomerData([]);
      setMetrics({
        total: 0,
        active: 0,
        new: 0
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
  }, []);

  const generateCalendar = (date: Date) => {
    const calendarDays = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    // Fill in leading empty days
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="text-center p-2 text-gray-400"></div>);
    }

    // Fill in the days of the month
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isSelected = dayDate.toDateString() === selectedDate.toDateString();
      const isToday = dayDate.toDateString() === new Date().toDateString();

      calendarDays.push(
        <div
          key={`day-${i}`}
          className={`text-center p-2 rounded-lg cursor-pointer transition-colors duration-200
            ${isSelected ? 'bg-blue-600 text-white font-bold' : ''}
            ${!isSelected && isToday ? 'bg-gray-200 text-gray-900' : ''}
            ${!isSelected && !isToday ? 'hover:bg-[#8cb662] text-gray-700' : ''}
          `}
          onClick={() => {
            setSelectedDate(dayDate);
            setShowCalendar(false);
          }}
        >
          {i}
        </div>
      );
    }
    return calendarDays;
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(selectedDate);
  const calendarMonthYear = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      {/* Top Bar for controls */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-8">
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-[#8cb662] transition-colors duration-200">
          <MoreHorizontal size={16} />
          Sort by
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-[#8cb662] transition-colors duration-200">
          <Filter size={16} />
          Filter by
        </button>
        <div className="relative" ref={calendarRef}>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-[#8cb662] transition-colors duration-200"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {formattedDate}
            <MoreHorizontal size={16} />
          </button>
          {showCalendar && (
            <div className="absolute top-12 right-0 z-10 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-[#8cb662]">
                  <ChevronLeft size={16} />
                </button>
                <h3 className="font-semibold text-gray-900">{calendarMonthYear}</h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-[#8cb662]">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="grid grid-cols-7 text-sm">
                {generateCalendar(currentDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Total Customers Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-500">Total Customers</h3>
            <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold">{loading ? '...' : metrics.total}</span>
            <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
              {metrics.total > 0 ? '100%' : '0%'}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">All registered customers</p>
        </div>
        
        {/* Active Customers Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-500">Active Customers</h3>
            <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold">{loading ? '...' : metrics.active}</span>
            <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
              {metrics.total > 0 ? `${Math.round((metrics.active / metrics.total) * 100)}%` : '0%'}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Recently engaged customers</p>
        </div>
        
        {/* New Customers Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-500">New Customers</h3>
            <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold">{loading ? '...' : metrics.new}</span>
            <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
              {metrics.total > 0 ? `${Math.round((metrics.new / metrics.total) * 100)}%` : '0%'}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Joined this week</p>
        </div>
      </div>

      {/* Customer Overview Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        
        {/* Table Header with controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Customer Overview</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter search"
                className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-[#8cb662] transition-colors duration-200">
              <Filter size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-[#8cb662] transition-colors duration-200">
              <Upload size={16} />
              Export
            </button>
          </div>
        </div>

        {/* The main table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  {/* Corrected: colSpan expects a number */}
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    Loading customer data...
                  </td>
                </tr>
              ) : (
                customerData.length === 0 ? (
                  <tr>
                    {/* Corrected: colSpan expects a number */}
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No customer data available.
                    </td>
                  </tr>
                ) : (
                  customerData.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastOrder}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer_View;
