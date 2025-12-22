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
  const [activeTab, setActiveTab] = useState("profile");

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
        profile_picture: "/images/profile.jpg",
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

      console.log("LOYALTY:", res.data);

      setLoyaltyModal({
        customer_id: id,
        stamps: res.data?.stamps ?? 0,
        free_drink_available: res.data?.free_drink_available ?? false,
        free_drink_redeemed: res.data?.free_drink_redeemed ?? false,
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
                          setMenuOpenId(null); // dropdown closes
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* PROFILE MODAL */}
      {profileModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-[999] p-4">

          {/* MODAL CARD */}
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

            {/* TOP BANNER */}
            <div className="relative h-32 bg-gray-200">
              <img
                src="/images/profile-banner.jpg"
                className="w-full h-full object-cover opacity-70"
              />
            </div>

            {/* AVATAR */}
            <div className="relative flex justify-center -mt-12">
              <img
                src="/images/profile.jpg"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>

            {/* NAME + EMAIL */}
            <div className="text-center mt-3">
              <h2 className="text-xl font-semibold">{profileModal.full_name}</h2>
              <p className="text-gray-500 text-sm">{profileModal.email}</p>
            </div>

            {/* TAB STATE */}
            {/** Add this at the top of your component */}
            {/* const [activeTab, setActiveTab] = useState("profile"); */}

            {/* TABS */}
            <div className="flex justify-center gap-10 mt-5 border-b pb-2">
              <button
                className={`text-sm font-medium pb-1 ${
                  activeTab === "profile"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>

              <button
                className={`text-sm font-medium pb-1 ${
                  activeTab === "details"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Other Details
              </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="p-6 space-y-4">

              {/* === PROFILE TAB === */}
              {activeTab === "profile" && (
                <>
                  {/* FULL NAME */}
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      defaultValue={profileModal.full_name}
                      className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-300"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      defaultValue={profileModal.email}
                      className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-300"
                    />
                  </div>

                  {/* USERNAME */}
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <input
                      type="text"
                      defaultValue={
                        "@" + profileModal.full_name.replace(/\s+/g, "").toLowerCase()
                      }
                      className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                </>
              )}

              {/* === OTHER DETAILS TAB === */}
              {activeTab === "details" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={profileModal.phone_number}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Birthday</label>
                      <input
                        type="text"
                        defaultValue={profileModal.birthday}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Gender</label>
                      <input
                        type="text"
                        defaultValue={profileModal.gender}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <input
                        type="text"
                        defaultValue={profileModal.status}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Total Orders</label>
                      <input
                        type="text"
                        defaultValue={profileModal.orders}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Last Order</label>
                      <input
                        type="text"
                        defaultValue={profileModal.lastOrder}
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Created At</label>
                      <input
                        type="text"
                        defaultValue={
                          profileModal.created_at
                            ? new Date(profileModal.created_at).toLocaleDateString()
                            : "N/A"
                        }
                        className="w-full mt-1 px-4 py-2 rounded-lg border"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end px-6 py-4 bg-gray-50">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                onClick={() => setProfileModal(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOYALTY MODAL */}
      {loyaltyModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-[999] p-4">

          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-center mb-4">
              Loyalty Progress
            </h2>

            <p className="text-sm text-gray-600 text-center">
              1 drink = 1 stamp. Collect 10 stamps to earn a free drink.
            </p>

            {/* STATUS BADGE */}
            <div className="text-center mt-4">
              {loyaltyModal.free_drink_redeemed ? (
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  Free drink already redeemed 🎉
                </span>
              ) : loyaltyModal.free_drink_available ? (
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  Free drink unlocked! 🎁
                </span>
              ) : (
                <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-600">
                  {10 - loyaltyModal.stamps} more stamps to unlock reward
                </span>
              )}
            </div>

            {/* STAMP CIRCLES */}
            <div className="grid grid-cols-5 gap-3 mt-6 justify-center">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = i < loyaltyModal.stamps;

                return (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center font-semibold text-sm
                      ${filled ? 'bg-green-300 border-green-600' : 'bg-gray-200 border-gray-400'}
                    `}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* CLOSE BUTTON */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setLoyaltyModal(null)}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Customer_View;