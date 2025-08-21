import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [activeCustomerInsightTab, setActiveCustomerInsightTab] = useState('Monthly');
  const [activeRevenueOverviewTab, setActiveRevenueOverviewTab] = useState('Monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const [customerInsightsData, setCustomerInsightsData] = useState<Record<string, number[]>>({});
  const [revenueOverviewData, setRevenueOverviewData] = useState<Record<string, number[][]>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); 

       
        setCustomerInsightsData({});
        setRevenueOverviewData({});

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.getTime() - now.getTime();
    };

    let timer: NodeJS.Timeout;

    const scheduleDailyUpdate = () => {
      const delay = calculateTimeUntilMidnight();
      timer = setTimeout(() => {
        setCurrentDate(new Date());
        setSelectedDay(new Date().getDate());
        scheduleDailyUpdate();
      }, delay);
    };

    scheduleDailyUpdate();

    return () => clearTimeout(timer);
  }, []);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); 

    const days = [];


    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-day-${i}`} className="p-2 text-center text-gray-400">
          {daysInPrevMonth - i}
        </div>
      );
    }


    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = i === selectedDay && month === currentDate.getMonth() && year === currentDate.getFullYear();

      let dayClassName = 'p-2 text-center cursor-pointer transition duration-200';

      if (isToday) {
        dayClassName += ' border-2 border-green-600 rounded-full font-bold text-gray-800';
      } else if (isSelected) {
        dayClassName += ' bg-blue-100 rounded-lg text-gray-800';
      } else {
        dayClassName += ' hover:bg-gray-100 rounded-lg text-gray-800';
      }

      days.push(
        <div
          key={`day-${i}`}
          className={dayClassName}
          onClick={() => setSelectedDay(i)}
        >
          {i}
        </div>
      );
    }


    const totalDaysInGrid = days.length;
    const remainingSlots = 42 - totalDaysInGrid; 
    for (let i = 1; i <= remainingSlots; i++) {
        days.push(
            <div key={`next-day-${i}`} className="p-2 text-center text-gray-400">
                {i}
            </div>
        );
    }

    return days;
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  const currentCustomerInsights = customerInsightsData[activeCustomerInsightTab] || [];

  
  const maxCustomerInsightValue = currentCustomerInsights.length > 0 ? Math.max(...currentCustomerInsights) : 1;


  const currentRevenueOverview = revenueOverviewData[activeRevenueOverviewTab] || [[], []];

  const allRevenueValues = currentRevenueOverview.flat();
 
  const maxRevenueOverviewValue = allRevenueValues.length > 0 ? Math.max(...allRevenueValues) : 1;


 
  const calculateOverviewValues = (data: number[][]) => {
    
    if (data.length === 0 || (data[0].length === 0 && data[1]?.length === 0)) {
        return {
            totalSales: 0,
            expense: 0,
            revenue: 0,
            percentageChangeSales: '0%',
            isPositiveSales: true,
            percentageChangeExpense: '0%',
            isPositiveExpense: true,
            percentageChangeRevenue: '0%',
            isPositiveRevenue: true
        };
    }

    const totalSales = data[0]?.reduce((sum, val) => sum + val, 0) || 0;
    const expense = data[1]?.reduce((sum, val) => sum + val, 0) * 0.5 || 0; 
    const revenue = totalSales - expense;
  
    const percentageChangeSales = totalSales > 0 ? '12.5%' : '0%';
    const isPositiveSales = totalSales > 0;
    const percentageChangeExpense = expense > 0 ? '5.2%' : '0%';
    const isPositiveExpense = expense > 0;
    const percentageChangeRevenue = revenue > 0 ? '8.1%' : '0%';
    const isPositiveRevenue = revenue > 0;

    return { totalSales, expense, revenue, percentageChangeSales, isPositiveSales, percentageChangeExpense, isPositiveExpense, percentageChangeRevenue, isPositiveRevenue };
  };

  const { totalSales, expense, revenue, percentageChangeSales, isPositiveSales, percentageChangeExpense, isPositiveExpense, percentageChangeRevenue, isPositiveRevenue } = calculateOverviewValues(currentRevenueOverview);

  const overviewCards = [
    {
      title: 'Total Sales',
      value: `₱${totalSales.toLocaleString()}`,
      percentageChange: percentageChangeSales,
      isPositiveChange: isPositiveSales,
      cardBg: 'bg-[#8cb662]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12m-6-4h.01M3 12l2.408 1.11A5.5 5.5 0 016.5 12"></path>
        </svg>
      )
    },
    {
      title: 'Expense',
      value: `₱${expense.toLocaleString()}`,
      percentageChange: percentageChangeExpense,
      isPositiveChange: isPositiveExpense, 
      cardBg: 'bg-blue-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m4 0h1M3 15h2c2 0 2 2 4 2h2s2 0 2 2h2a2 2 0 002-2h2c2 0 2-2 4-2H3"></path>
        </svg>
      )
    },
    {
      title: 'Revenue',
      value: `₱${revenue.toLocaleString()}`,
      percentageChange: percentageChangeRevenue,
      isPositiveChange: isPositiveRevenue,
      cardBg: 'bg-red-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L11 20m-4-1V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path>
        </svg>
      )
    },
  ];


  const createAreaPath = (data: number[], maxValue: number, chartWidth: number, chartHeight: number) => {
    const numPoints = data.length;
    if (numPoints === 0) return "";

    const pointWidth = numPoints > 1 ? chartWidth / (numPoints - 1) : 0; 
    let path = `M 0,${chartHeight}`; 

 
    if (numPoints === 1) {
      const firstPointY = chartHeight - (data[0] / maxValue) * chartHeight;
      path += ` L 0,${firstPointY}`;
    } else {
     
      const firstPointX = 0;
      const firstPointY = chartHeight - (data[0] / maxValue) * chartHeight;
      path += ` L ${firstPointX},${firstPointY}`;

     
      for (let i = 1; i < numPoints; i++) {
        const x = i * pointWidth;
        const y = chartHeight - (data[i] / maxValue) * chartHeight;
        path += ` L ${x},${y}`;
      }
    }


    
    path += ` L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
    return path;
  };

  const chartWidth = 300; 
  const chartHeight = 150;

  const pathData1 = createAreaPath(currentRevenueOverview[0], maxRevenueOverviewValue, chartWidth, chartHeight);
  const pathData2 = createAreaPath(currentRevenueOverview[1], maxRevenueOverviewValue, chartWidth, chartHeight);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Good Morning Card */}
        <div className="lg:col-span-2 bg-[#90caf9] rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
          <div className="flex-1 text-left mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-[#8cb662] mb-2">Good Morning, John Doe!</h2>
            <p className="text-gray-600 text-sm mb-4 max-w-md font-bold">
              Manage your team, track insights, and keep everything running smoothly. Let's make today productive!
            </p>
            <button className="bg-[#8e674a] text-white px-6 py-2 rounded-full font-bold">
              Go to Team Roles
            </button>
          </div>
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0">
            <img
              src="https://placehold.co/250x250/E0F2F7/263238?text=Hello+Illustration" // Placeholder image
              alt="Hello Illustration"
              className="absolute bottom-0 right-0 w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Customer Insights Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Customer Insights</h3>
            <div className="flex bg-gray-200 rounded-lg p-1">
              {['Monthly', 'Weekly', 'Today'].map((tab: string) => (
                <button
                  key={tab}
                  className={`w-24 px-3 py-1 text-sm rounded-md transition-all duration-300 flex-none text-center
                    ${activeCustomerInsightTab === tab ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}
                  onClick={() => setActiveCustomerInsightTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 flex flex-col justify-end relative">
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between h-full pr-2 text-xs text-gray-500 pb-4">
              {[100, 75, 50, 25, 0].map(label => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col justify-between pb-4 pl-8">
              {[100, 75, 50, 25, 0].map((_ , i) => (
                <hr key={i} className="border-t border-gray-200 w-full" />
              ))}
            </div>
            <div className="flex flex-1 justify-around items-end h-full pl-8">
              {currentCustomerInsights.map((value: number, index: number) => (
                <div
                  key={`bar-${index}`}
                  className={`w-4 rounded-t-lg transition-all duration-300 ease-out
                    ${index % 2 === 0 ? 'bg-green-600' : 'bg-amber-800'}`}
                  style={{ height: `${(value / maxCustomerInsightValue) * 100}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-around items-end pt-2 text-xs text-gray-500 pl-8">
              {activeCustomerInsightTab === 'Monthly' && [...Array(10).keys()].map((label: number) => (
                <span key={`x-label-ci-${label}`}>{label + 1}</span> 
              ))}
              {activeCustomerInsightTab === 'Weekly' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label: string) => (
                <span key={`x-label-ci-${label}`}>{label}</span> 
              ))}
              {activeCustomerInsightTab === 'Today' && ['9a', '12p', '3p', '6p', '9p'].map((label: string) => (
                <span key={`x-label-ci-${label}`}>{label}</span> 
              ))}
            </div>
          </div>
        </div>

        {/* Overview Cards Section */}
        <div className="lg:col-span-full" >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xl font-bold text-gray-800">Overview</h3>
            <button className="text-sm mr-130 text-blue-500 font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols- lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {overviewCards.map((card, index) => (
              <div key={index} className={`${card.cardBg} rounded-xl shadow-md p-6 text-white flex flex-col justify-between`}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-white p-2 rounded-full">
                    {card.icon}
                  </div>
                  <span className="text-lg font-semibold">{card.title}</span>
                </div>
                <div>
                  <h4 className="text-3xl font-bold mb-2">{card.value}</h4>
                  <div className="flex items-center text-sm font-medium">
                    <span className={`${card.isPositiveChange ? 'text-green-200' : 'text-red-200'} flex items-center`}>
                      {card.isPositiveChange ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {card.percentageChange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <button onClick={goToPreviousMonth} className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300">
                &larr;
              </button>
              <button onClick={goToToday} className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300">
                Today
              </button>
              <button onClick={goToNextMonth} className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300">
                &rarr;
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day: string) => (
              <div key={day} className="font-semibold text-center text-gray-500 p-2">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        {/* Revenue Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
            
            <div className="relative">
              <select
                className="appearance-none bg-[#E6B88B] text-white font-semibold text-sm py-2 px-6 rounded-full shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D8A474] transition-colors duration-200"
                value={activeRevenueOverviewTab}
                onChange={(e) => setActiveRevenueOverviewTab(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Today">Today</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
               
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-64 relative flex items-end pb-4 pl-8">
            <svg className="absolute inset-0 w-full h-full pb-8 pl-10" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              {[0, 25, 50, 75, 100].map((value, i) => (
                <line
                  key={`grid-line-${i}`}
                  x1="0"
                  y1={chartHeight - (value / maxRevenueOverviewValue) * chartHeight}
                  x2={chartWidth}
                  y2={chartHeight - (value / maxRevenueOverviewValue) * chartHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              <path d={pathData1} fill="rgba(134, 239, 172, 0.6)" stroke="#16a34a" strokeWidth="2" />
              <path d={pathData2} fill="rgba(191, 219, 254, 0.6)" stroke="#2563eb" strokeWidth="2" />
            </svg>

            <div className="absolute inset-y-0 left-0 flex flex-col justify-between h-full pr-2 text-xs text-gray-500 pb-4">
              {[maxRevenueOverviewValue.toLocaleString(), (maxRevenueOverviewValue * 0.75).toLocaleString(), (maxRevenueOverviewValue * 0.50).toLocaleString(), (maxRevenueOverviewValue * 0.25).toLocaleString(), 0].map(label => (
                <span key={`y-label-ro-${label}`}>₱{label}</span>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full flex justify-around text-xs text-gray-500 pl-8">
              {activeRevenueOverviewTab === 'Monthly' && [...Array(10).keys()].map((label: number) => (
                <span key={`x-label-ro-${label}`}>{label + 1}</span> 
              ))}
              {activeRevenueOverviewTab === 'Weekly' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label: string) => (
                <span key={`x-label-ro-${label}`}>{label}</span> 
              ))}
              {activeRevenueOverviewTab === 'Today' && ['9a', '12p', '3p', '6p', '9p'].map((label: string) => (
                <span key={`x-label-ro-${label}`}>{label}</span> 
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
