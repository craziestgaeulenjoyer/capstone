import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Filter } from 'lucide-react';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  contact: string;
  orders: number;
  lastOrder: string;
  status: 'Active' | 'New' | 'Inactive';
  created_at: string;
}

interface Metrics {
  total: number;
  active: number;
  new: number;
}

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Customers');
  const [selectedSort, setSelectedSort] = useState<string>('Name (A-Z)');

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<any>(null);
  const [loyaltyModal, setLoyaltyModal] = useState<any>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filterOptions = [
    'Newest Customers', 
    'Active Customers', 
    'All Customers'
  ];

  const sortOptions = [
    'Name (A-Z)',
    'Date Created (Descending)',
    'Date Created (Ascending)',
    'Most Orders'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const dashboardRole = sessionStorage.getItem('dashboard_role');
      const authToken = localStorage.getItem('token');
      const apiRoleSegment = dashboardRole === 'super_admin' ? 'superadmin' : 'admin';
      const response = await axios.get(`/api/${apiRoleSegment}/customers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = response.data;

      const formattedData: Customer[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.full_name ?? 'N/A',
          contact: item.phone_number ?? item.email ?? 'N/A',
          orders: item.orders ?? 0,
          lastOrder: item.lastOrder ?? 'No Orders',
          status: item.status as Customer['status'] ?? 'Inactive',
          created_at: item.created_at ?? '',
      }));

      setCustomerData(formattedData);

      const total = formattedData.length;
      const active = formattedData.filter((c) => c.status === 'Active').length;
      const newCust = formattedData.filter((c) => c.status === 'New').length;
      setMetrics({ total, active, new: newCust });
    } catch {
      setCustomerData([]);
      setMetrics({ total: 0, active: 0, new: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // View Profile Modal
  const handleViewProfile = async (id: string) => {
    try {
      const dashboardRole = sessionStorage.getItem('dashboard_role');
      const apiRoleSegment = dashboardRole === 'super_admin' ? 'superadmin' : 'admin';
      const token = localStorage.getItem('token');

      const res = await axios.get(`/api/${apiRoleSegment}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile API Response:', res.data); // Debugging

      const data = res.data;

      // Set modal with safe defaults
      setProfileModal({
        id: data.id ?? '',
        full_name: data.full_name ?? 'No Name',
        gender: data.gender ?? 'N/A',
        birthday: data.birthday ?? 'N/A',
        phone_number: data.phone_number ?? data.email ?? 'N/A',
        email: data.email ?? 'N/A',
        profile_picture: data.profile_picture ?? null,
        orders: data.orders ?? 0,
        lastOrder: data.lastOrder ?? 'No Orders',
        status: data.status ?? 'Inactive',
        created_at: data.created_at ?? '',
    });

    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch customer profile.');
    }
  };

  // View Loyalty Modal
  const handleViewLoyalty = async (id: string) => {
    try {
      const dashboardRole = sessionStorage.getItem('dashboard_role');
      const apiRoleSegment = dashboardRole === 'super_admin' ? 'superadmin' : 'admin';
      const token = localStorage.getItem('token');

      const res = await axios.get(`/api/${apiRoleSegment}/customers/${id}/loyalty`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Loyalty API Response:', res.data); // Debugging

      setLoyaltyModal({
        customer_id: id,
        stamps: res.data?.stamps ?? 0, // default to 0 if undefined
      });

    } catch (error) {
      console.error('Error fetching loyalty:', error);
      alert('Failed to fetch loyalty progress.');
    }
  };

  const filteredAndSortedData = customerData
    .filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        customer.id.toLowerCase().includes(searchLower) ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.contact.toLowerCase().includes(searchLower);
      let matchesFilter = true;
      if (selectedFilter === 'Active Customers') matchesFilter = customer.status === 'Active';
      else if (selectedFilter === 'Newest Customers') {
        const createdDate = new Date(customer.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchesFilter = createdDate >= sevenDaysAgo;
      }
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'Name (A-Z)': return a.name.localeCompare(b.name);
        case 'Date Created (Descending)': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'Date Created (Ascending)': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'Most Orders': return b.orders - a.orders;
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
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
              {filterOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                >
                  <input
                    type="radio"
                    name="customerFilter"
                    value={option}
                    checked={selectedFilter === option}
                    onChange={() => setSelectedFilter(option)}
                  />
                  <span className="text-sm">{option}</span>
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

      {/* Top Bar for controls */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
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
            {filteredAndSortedData.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 text-sm">{customer.id}</td>
                <td className="px-6 py-4 text-sm">{customer.name}</td>
                <td className="px-6 py-4 text-sm">{customer.contact}</td>
                <td className="px-6 py-4 text-sm">{customer.orders}</td>
                <td className="px-6 py-4 text-sm">{customer.lastOrder}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusClasses(customer.status)}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <div ref={dropdownRef}>
                    <MoreHorizontal
                      className="cursor-pointer text-gray-500"
                      onClick={() => setMenuOpenId(menuOpenId === customer.id ? null : customer.id)}
                    />
                    {menuOpenId === customer.id && (
                      <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div
                          className="px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleViewProfile(customer.id);
                            setMenuOpenId(null);
                          }}
                        >
                          View Profile
                        </div>
                        <div
                          className="px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleViewLoyalty(customer.id);
                            setMenuOpenId(null);
                          }}
                        >
                          View Loyalty Progress
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PROFILE MODAL */}
      {profileModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-[999]">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Customer Profile</h2>

            <div className="flex flex-col items-center gap-3 mb-4">
              {profileModal.profile_picture ? (
                <img
                  src={profileModal.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold">{profileModal.full_name || 'N/A'}</h3>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Gender:</strong> {profileModal.gender || 'N/A'}</p>
              <p><strong>Birthday:</strong> {profileModal.birthday || 'N/A'}</p>
              <p><strong>Phone:</strong> {profileModal.phone_number || 'N/A'}</p>
              <p><strong>Email:</strong> {profileModal.email || 'N/A'}</p>
              <p><strong>Status:</strong> {profileModal.status || 'N/A'}</p>
              <p><strong>Created:</strong> {profileModal.created_at ? new Date(profileModal.created_at).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Total Orders:</strong> {profileModal.orders ?? 0}</p>
              <p><strong>Last Order:</strong> {profileModal.lastOrder || 'No Orders'}</p>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              onClick={() => setProfileModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {/* LOYALTY MODAL */}
      {loyaltyModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-[999]">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Loyalty Progress</h2>

            <p className="mb-2">Each circle represents 1 completed drink order.</p>
            <p className="mb-4">Redeem a free drink every 10 completed orders.</p>

            <div className="grid grid-cols-5 gap-3 mt-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm
                    ${i < (loyaltyModal.stamps ?? 0) ? 'bg-green-300 border-green-600' : 'bg-gray-200 border-gray-400'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <button
              className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              onClick={() => setLoyaltyModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Customer_View;