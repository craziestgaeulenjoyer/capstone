import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Filter, Search, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

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
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, active: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const statusOptions = ['Available', 'Low Stock', 'Out of Stock'];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const sortOptions = ['Name (A-Z)', 'Stock (Low to High)', 'Stock (High to Low)', 'Expiry (Soonest)'];
  const [selectedSort, setSelectedSort] = useState<string>('Name (A-Z)');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const dashboardRole = sessionStorage.getItem('dashboard_role');
        const authToken = localStorage.getItem('token'); 

        let apiRoleSegment = '';

        if (!authToken) {
            console.warn('Authentication token not found in session storage. Redirecting to login or showing unauthorized message.');
            // Optionally redirect to login page or display a specific "Please log in" message
            setCustomerData([]);
            setMetrics({ total: 0, active: 0, new: 0 });
            setLoading(false);
            return; // Stop execution if no token
        }

        if (dashboardRole === 'super_admin') {
          apiRoleSegment = 'superadmin';
        } else if (dashboardRole === 'admin') {
          apiRoleSegment = 'admin';
        } else {
          console.warn('Unauthorized role or no role found in session storage. Defaulting to an empty state.');
          setCustomerData([]);
          setMetrics({ total: 0, active: 0, new: 0 });
          setLoading(false);
          return;
        }

        const apiUrl = `/api/${apiRoleSegment}/customers`;
        console.log(`Attempting to fetch customers from: ${apiUrl}`); // Log the URL for debugging

        // Make the Axios request with the Authorization header
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}` // <--- IMPORTANT: Add the Bearer token
          }
        });

        const data = response.data;
        console.log('API Response Data:', data); // Log the raw data here

        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          setCustomerData([]);
          setMetrics({ total: 0, active: 0, new: 0 });
          return;
        }

        const formattedData: Customer[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name || 'N/A',
          contact: item.contact || 'N/A',
          orders: item.orders !== undefined ? Number(item.orders) : 0,
          lastOrder: item.lastOrder || 'No Orders',
          status: item.status as Customer['status'] || 'Inactive',
        }));

        console.log('Formatted Customer Data:', formattedData);

        setCustomerData(formattedData);

        // Metrics calculation
        const total = formattedData.length;
        const active = formattedData.filter((c: Customer) => c.status === 'Active').length;
        const newCust = formattedData.filter((c: Customer) => c.status === 'New').length;

        setMetrics({ total, active, new: newCust });
      } catch (error) {
        console.error('Error fetching customers:', error);
        // If it's a 401, you might want to specifically handle it (e.g., redirect to login)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error('Authentication failed, please log in.');
            // Example: window.location.href = '/login';
        }
        setCustomerData([]);
        setMetrics({ total: 0, active: 0, new: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); 

  const filteredAndSortedData = customerData
  .filter((customer) => {
    // Search by ID or name or contact
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      customer.id.toLowerCase().includes(searchLower) ||
      customer.name.toLowerCase().includes(searchLower) ||
      customer.contact.toLowerCase().includes(searchLower);

    // Filter by status
    const matchesFilter =
      selectedFilters.length === 0 || selectedFilters.includes(customer.status);

    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    switch (selectedSort) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Stock (Low to High)':
        return a.orders - b.orders;
      case 'Stock (High to Low)':
        return b.orders - a.orders;
      case 'Expiry (Soonest)':
        // Assuming lastOrder is a date string
        return new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      {/* Top Bar for controls */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-4">
        {/* Sort by Button */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-[#8cb662] hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={() => {
              setSortOpen(!sortOpen);      // toggle sort
              if (!sortOpen) setFilterOpen(false); // close filter if opening sort
            }}
          >
            <MoreHorizontal size={16} />
            Sort by
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    selectedSort === option ? 'bg-gray-100 font-semibold' : ''
                  }`}
                  onClick={() => {
                    setSelectedSort(option);
                    setSortOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter by Button */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-[#8cb662] hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={() => {
              setFilterOpen(!filterOpen);     // toggle filter
              if (!filterOpen) setSortOpen(false); // close sort if opening filter
            }}
          >
            <Filter size={16} />
            Filter by
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50 p-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFilters([...selectedFilters, status]);
                      } else {
                        setSelectedFilters(selectedFilters.filter((f) => f !== status));
                      }
                    }}
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6CB74A] text-white rounded-lg border border-gray-300 hover:bg-[#8cb662] transition-colors duration-200 cursor-pointer">
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
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    Loading customer data...
                  </td>
                </tr>
              ) : filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No matching customers found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((customer) => (
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
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer_View;