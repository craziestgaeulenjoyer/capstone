import React, { useState, useEffect } from 'react';

// Define the types for the data structures to resolve TypeScript errors
interface SalesDataItem {
  value: number;
  name: string;
  color: string;
}

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
  activeThisWeek: number;
  averageGrowth: string;
}

interface CustomerFeedbackData {
  averageRating: number;
  totalReviews: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Sales Hub');
  const [timeframe, setTimeframe] = useState('Day');
  const [chartTimeframe, setChartTimeframe] = useState('Daily');
  const [salesTimeframe, setSalesTimeframe] = useState('Last 7 days');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Empty data arrays, now explicitly typed to resolve the TypeScript errors
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [productData, setProductData] = useState<ProductDataItem[]>([]);
  const [customerPercentage, setCustomerPercentage] = useState(0);
  const [customerInsightsData, setCustomerInsightsData] = useState<CustomerInsightsData>({
    totalRegistered: 0,
    activeThisWeek: 0,
    averageGrowth: '',
  });
  const [customerFeedbackData, setCustomerFeedbackData] = useState<CustomerFeedbackData>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [totalCustomersData, setTotalCustomersData] = useState<TotalCustomersDataItem[]>([]);
  const [addOnsData, setAddOnsData] = useState<AddOnDataItem[]>([]);
  const [loyaltyProgramData, setLoyaltyProgramData] = useState(0);

  // useEffect for data fetching
  useEffect(() => {
    // --- Data fetching logic would go here ---
    // Example:
    // fetch('https://api.example.com/dashboard-data')
    //   .then(response => response.json())
    //   .then(data => {
    //     setSalesData(data.sales);
    //     setProductData(data.products);
    //     setCustomerPercentage(data.customer_percentage);
    //     setCustomerInsightsData(data.customer_insights);
    //     setCustomerFeedbackData(data.customer_feedback);
    //     setTotalCustomersData(data.total_customers);
    //     setAddOnsData(data.common_addons);
    //     setLoyaltyProgramData(data.loyalty_program);
    //   });
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarDaysOfWeek = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  const totalDays = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);
  const combinedDays = [...emptyDays, ...daysArray];
  
  const formattedMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };


  const hoursOfDay = ['12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
  
  const renderSalesHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Overview Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
          <div className="flex bg-gray-200 p-1 rounded-full space-x-1">
            {['Day', 'Week', 'Month', 'Year'].map((item) => (
              <button
                key={item}
                onClick={() => setTimeframe(item)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  timeframe === item ? 'bg-[#8cb662] shadow text-white' : 'text-gray-600 hover:bg-[#8cb662] hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-64 flex items-end justify-between px-2">
          {/* Y-axis labels and lines */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-400 h-full py-1">
            <span className="relative -top-1">100</span>
            <span className="relative -top-1">80</span>
            <span className="relative -top-1">60</span>
            <span className="relative -top-1">40</span>
            <span className="relative -top-1">20</span>
            <span className="relative -top-1">0</span>
          </div>
          <div className="absolute inset-y-0 w-full left-0 right-0 h-full">
            <div className="relative h-full border-l border-gray-300 ml-4 pl-4">
              <div className="absolute inset-x-0 top-0 h-1 border-b border-gray-200"></div>
              <div className="absolute inset-x-0 top-1/5 h-1 border-b border-gray-200"></div>
              <div className="absolute inset-x-0 top-2/5 h-1 border-b border-gray-200"></div>
              <div className="absolute inset-x-0 top-3/5 h-1 border-b border-gray-200"></div>
              <div className="absolute inset-x-0 top-4/5 h-1 border-b border-gray-200"></div>
              <div className="absolute inset-x-0 bottom-0 h-1 border-b border-gray-200"></div>
            </div>
          </div>
          {/* Bar chart bars */}
          <div className="relative flex flex-1 items-end h-full justify-around pl-4">
              {salesData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center z-10 w-8 mx-1">
                      <div
                      className={`w-full rounded-t-lg transition-all duration-300 ease-in-out ${data.color}`}
                      style={{ height: `${data.value}%` }}
                      ></div>
                      <span className="mt-2 text-xs text-gray-500">{data.name}</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Average Customers Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Average Customers</h2>
          <button
            onClick={() => setChartTimeframe(chartTimeframe === 'Daily' ? 'Weekly' : 'Daily')}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-[#8cb662] hover:text-white transition-colors rounded-full"
          >
            Daily
          </button>
        </div>
        <div className="relative flex flex-col justify-center items-center h-64">
          <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#22C55E ${customerPercentage}%, #E5E7EB ${customerPercentage}%)`,
              }}
            ></div>
            <div className="absolute w-36 h-36 rounded-full bg-white flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{customerPercentage}%</span>
            </div>
          </div>
          <div className="absolute bottom-4 text-center">
            <p className="text-xs text-gray-500">Peak hours: 11AM - 2PM</p>
            <button className="px-3 py-1 mt-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-[#8cb662] hover:text-white transition-colors">
              Daily
            </button>
          </div>
        </div>
      </div>
      
      {/* Sales per week Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Sales per week</h2>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.5 8.5L10 13l4.5-4.5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="p-2"></th>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="p-2 text-gray-500 text-sm font-normal">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hoursOfDay.map((hour, index) => (
                <tr key={index}>
                  <td className="pr-4 py-2 text-right text-gray-500 text-sm font-normal whitespace-nowrap">{hour}</td>
                  {daysOfWeek.map((day, index) => (
                    <td key={index} className="px-2 py-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-100"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products Card */}
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
              {productData.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="p-2 text-sm font-medium text-gray-600">{product.id}</td>
                  <td className="p-2 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="p-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${product.popularity}%`,
                          background: `linear-gradient(to right, #FFC107, #FF9800)`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-2 text-sm font-medium text-gray-600 text-right">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-400"
                          style={{ width: `${product.sales}%` }}
                        ></div>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-1 text-gray-600">{product.sales}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomerAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Customer Insights Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Customer Insights</h2>
          <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">...</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="text-base font-medium text-gray-500">Total Registered Customers</h3>
            <p className="text-4xl font-bold text-gray-800">{customerInsightsData.totalRegistered}</p>
            <h3 className="text-base font-medium text-gray-500 mt-4">Active customers this week</h3>
            <p className="text-4xl font-bold text-gray-800">{customerInsightsData.activeThisWeek}</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-base font-medium text-gray-500">Average Growth</h3>
            <div className="w-full h-40">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <path d={customerInsightsData.averageGrowth} stroke="#3B82F6" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Feedback Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Customer Feedback</h2>
          <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">...</button>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-500">Average rating</h3>
          <p className="text-4xl font-bold text-gray-800">{customerFeedbackData.averageRating}</p>
          <h3 className="text-base font-medium text-gray-500 mt-4">Total reviews this month</h3>
          <p className="text-4xl font-bold text-gray-800">{customerFeedbackData.totalReviews}</p>
        </div>
      </div>
      
      {/* Total Customers Bar Chart Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Total Customers</h2>
          <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">...</button>
        </div>
        <div className="flex h-52 items-end justify-between space-x-2">
          {totalCustomersData.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-8 rounded-t-lg h-full overflow-hidden">
                {data.segments.map((segment, segIndex) => (
                  <div
                    key={segIndex}
                    className="absolute inset-x-0"
                    style={{
                      bottom: `${data.segments.slice(0, segIndex).reduce((sum, s) => sum + s.height, 0)}%`,
                      height: `${segment.height}%`,
                      backgroundColor: segment.color,
                    }}
                  ></div>
                ))}
              </div>
              <span className="mt-2 text-sm text-gray-500">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-xs text-gray-500 font-semibold mb-2">Legend (Customer Status)</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#A6C561]"></span>
              <span>Very Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#FFC107]"></span>
              <span>Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#4285F4]"></span>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5722]"></span>
              <span>Very Low</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Common Add-Ons Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Common Add-Ons</h2>
          <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">...</button>
        </div>
        <div className="space-y-4">
          {addOnsData.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    background: `linear-gradient(to right, #6EE7B7, #10B981)`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty Program Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Loyalty Program</h2>
          <button className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">...</button>
        </div>
        <div className="flex flex-col items-center justify-center h-48">
          <h3 className="text-base text-gray-500">Rewards redeemed this month</h3>
          <p className="text-6xl font-bold text-gray-800 mt-2">{loyaltyProgramData}%</p>
        </div>
      </div>
    </div>
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
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 shadow-sm hover:bg-[#8cb662] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium hidden sm:block">Export</span>
          </button>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Sort By</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.5 8.5L10 13l4.5-4.5z" />
                </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Filter By</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.5 8.5L10 13l4.5-4.5z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center justify-between bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium pr-8 shadow-sm cursor-pointer"
            >
              <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.5 8.5L10 13l4.5-4.5z" />
                </svg>
              </div>
            </div>
            {showCalendar && (
              <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <button onClick={handlePrevMonth} className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="font-medium text-gray-800">{formattedMonth}</span>
                  <button onClick={handleNextMonth} className="text-gray-600 hover:bg-[#8cb662] hover:text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-xs text-center">
                  {calendarDaysOfWeek.map((day, index) => (
                    <div key={index} className="font-semibold text-gray-400">{day}</div>
                  ))}
                  {combinedDays.map((date, index) => (
                    <div
                      key={index}
                      className={`p-1 rounded-full transition-colors ${
                        date
                          ? `cursor-pointer hover:bg-[#8cb662] hover:text-white
                            ${date === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? 'bg-blue-500 text-white' : ''}`
                          : ''
                      }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'Sales Hub' ? renderSalesHub() : renderCustomerAnalytics()}
    </div>
  );
};

export default App;
