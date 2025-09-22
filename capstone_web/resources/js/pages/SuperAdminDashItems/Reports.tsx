import React, { useState, useEffect, useRef } from 'react';

// A simple utility function to get the number of days in a month.
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export default function Report() {
  // State for managing the active tab
  const [activeTab, setActiveTab] = useState('salesReport');
  // State for the calendar functionality
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close the calendar when clicking outside of it
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

      {/* Orders Breakdown (Pie Chart) - Static SVG Placeholder */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Breakdown</h2>
        <div className="flex flex-col items-center">
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-gray-500">No data available for orders breakdown.</p>
          </div>
        </div>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h2>
        <div className="space-y-4">
          <p className="text-gray-500">No data available for financial summary.</p>
        </div>
      </div>
    </div>
  );

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
                activeTab === 'salesReport' ? 'bg-[#8cb662] text-white' : 'text-gray-500 hover:bg-[#8cb662]'
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => setActiveTab('bestSelling')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'bestSelling' ? 'bg-[#8cb662] text-white' : 'text-gray-500 hover:bg-[#8cb662]'
              }`}
            >
              Best Selling
            </button>
          </div>

          {/* Buttons and Date Picker */}
          <div className="flex flex-wrap items-center justify-end space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-[#8cb662] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.25-10.25a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5v-6zM11.5 9.5a.5.5 0 00-1 0v4.5a.5.5 0 001 0V9.5z" clipRule="evenodd" />
              </svg>
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-[#8cb662] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 7a1 1 0 000 2h14a1 1 0 100-2H3zM3 11a1 1 0 000 2h14a1 1 0 100-2H3zM3 15a1 1 0 000 2h14a1 1 0 100-2H3z" />
              </svg>
              <span>Sort By</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-[#8cb662] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8 4a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
              </svg>
              <span>Filter By</span>
            </button>
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
        {activeTab === 'salesReport' ? salesReportContent : bestSellingContent}
      </div>
    </div>
  );
}