import React, { useState, useCallback, useEffect } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subText: {
    text: string;
    icon: React.ReactNode;
  };
  icon: React.ReactNode;
  color: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  last: string;
  expiry: string;
  status: 'In-Stock' | 'Low' | 'Critical' | 'Expired';
  updated: string;
}

interface Activity {
  id: string;
  timestamp: string;
  description: string;
  user: string;
}

interface TableRowProps {
  product: Product;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subText, icon, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      {icon}
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold">{value}</span>
      <button className="flex items-center text-sm ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md">
        <span className={`mr-1`} style={{ color: color }}>{subText.icon}</span>
        <span className={`text-xs`} style={{ color: color }}>{subText.text}</span>
      </button>
    </div>
  </div>
);

const TableRow: React.FC<TableRowProps> = ({ product }) => {
  const getStatusStyle = (status: Product['status']) => {
    switch (status) {
      case 'In-Stock':
        return {
          backgroundColor: '#e8f3de',
          color: '#2b391a'
        };
      case 'Low':
        return {
          backgroundColor: 'rgb(254 243 199)',
          color: 'rgb(146 64 14)'
        };
      case 'Critical':
        return {
          backgroundColor: 'rgb(254 226 226)',
          color: 'rgb(153 27 27)'
        };
      case 'Expired':
        return {
          backgroundColor: 'rgb(243 244 246)',
          color: 'rgb(55 65 81)'
        };
      default:
        return {
          backgroundColor: 'rgb(243 244 246)',
          color: 'rgb(55 65 81)'
        };
    }
  };

  const statusStyle = getStatusStyle(product.status);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600 rounded-sm" />
          <span className="ml-2">{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.last}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.expiry}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm">
        <span
          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          style={statusStyle}
        >
          {product.status}
        </span>
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.updated}</td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex items-center space-x-3 text-sm">
    <div className="flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="flex-1">
      <p className="text-gray-800">{activity.description}</p>
      <p className="text-gray-500 text-xs mt-1">
        <span className="font-medium">{activity.user}</span> at {new Date(activity.timestamp).toLocaleString()}
      </p>
    </div>
  </div>
);
const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value);
  }, []);

  const handleDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <style>
        {`
          .bg-custom-green {
            background-color: #8cb662;
          }
          .bg-custom-green:hover {
            background-color: #769c54;
          }
        `}
      </style>
      <div className="flex items-center justify-end mb-6 space-x-2 flex-wrap sm:flex-nowrap">
  <a href="#" className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md transition-colors my-1 hover:bg-[#8cb662] hover:text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
    Export
  </a>
  <a href="#" className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md transition-colors my-1 hover:bg-[#8cb662] hover:text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11.586l-4.293 4.293a1 1 0 001.414 1.414L17 5.414V11a1 1 0 102 0V4a1 1 0 00-1-1h-7a1 1 0 000 2h4.586l-4.293 4.293a1 1 0 00-1.414-1.414L10 5.414V11a1 1 0 102 0V4a1 1 0 00-1-1H3z" clipRule="evenodd" />
    </svg>
    Sort By
  </a>
  <a href="#" className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md transition-colors my-1 hover:bg-[#8cb662] hover:text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 7a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 7a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
    Filter By
  </a>
  
  <div className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md transition-colors my-1 hover:bg-[#8cb662] hover:text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      className="bg-transparent text-gray-700 focus:outline-none cursor-pointer"
    />
  </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          title="Total Products"
          value={0}
          subText={{ text: 'Inventory Overview', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg> }}
          color="#8cb662"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>}
        />
        <SummaryCard
          title="Low Stock"
          value={0}
          subText={{ text: 'Action required', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg> }}
          color="rgb(239 68 68)"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 10a3 3 0 11-6 0 3 3 0 016 0zM17 10a3 3 11 6 0 3 3 0 01-6 0z" /></svg>}
        />
        <SummaryCard
          title="Expiring Soon"
          value={0}
          subText={{ text: 'Upcoming expirations', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg>} }
          color="rgb(253 224 71)"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <SummaryCard
          title="Total Number of Stocks"
          value={0}
          subText={{ text: 'Overall stock count', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg> }}
          color="#8cb662"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        />
        <SummaryCard
          title="Critical Stock Level"
          value={0}
          subText={{ text: 'Immediate action needed', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg> }}
          color="rgb(239 68 68)"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
        />
        <SummaryCard
          title="Inventory Turnover Rate"
          value="0.0"
          subText={{ text: 'No recent sales', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" clipRule="evenodd" /></svg> }}
          color="rgb(59 130 246)"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 10a3 3 0 11-6 0 3 3 0 016 0zM17 10a3 3 11 6 0 3 3 0 01-6 0z" /></svg>}
        />
      </div>

         
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Product Inventory</h2>
            <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-auto my-1 sm:my-0">
                <input
                  type="text"
                  placeholder="Search product"
                  className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select className="border rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 my-1 sm:my-0" value={filterCategory} onChange={handleFilterChange}>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat} Category</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <TableRow key={product.id} product={product} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredProducts.length > 0 ? 1 : 0}</span> to <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> results
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Inventory Activities</h2>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;