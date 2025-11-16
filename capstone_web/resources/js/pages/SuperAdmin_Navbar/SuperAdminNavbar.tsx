import axiosClient from "@/axiosClient";
import { router } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";

// Import content components
import Dashboard from "@/pages/SuperAdminDashItems/Dashboard";
import Inventory from "@/pages/SuperAdminDashItems/Inventory";
import SalesOrder from "@/pages/SuperAdminDashItems/SalesOrder";
import CustomersContent from "@/pages/SuperAdminDashItems/Customer_View";
import ReportsContent from "@/pages/SuperAdminDashItems/Reports";
import AnalyticsContent from "@/pages/SuperAdminDashItems/Analytics";
import ManageItemsContent from "@/pages/SuperAdminDashItems/Manage_Items";
import TeamsContent from "@/pages/SuperAdminDashItems/Teams";

import {
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  PieChart,
  Settings,
  Users2,
  LayoutGrid,
  Menu,
  Bell,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

// Modal Component
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", transition: "background-color 0.3s ease" }}
    >
      {/* Modal Card */}
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

// Account Settings component
const AccountSettings = () => (
  <div className="p-8 w-full">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h2>
    <p className="text-gray-500 mb-8">
      Here, you can change your account information and password.
    </p>

    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Email Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Address</h3>
        <p className="text-gray-600">
          Your email address is{" "}
          <span className="font-medium text-[#8cb662]">email@example.com</span>
          <button className="text-[#8cb662] ml-4 hover:underline">Change</button>
        </p>
      </div>

      {/* Password */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Password</h3>
        <div className="flex space-x-4">
          <input
            type="password"
            placeholder="New password"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
          />
          <input
            type="password"
            placeholder="Current password"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
          />
        </div>
        <p className="text-gray-500 mt-2">
          Can't remember your current password?{" "}
          <button className="text-[#8cb662] hover:underline">Reset your password</button>
        </p>
        <button className="mt-4 px-6 py-2 bg-[#8cb662] text-white rounded-lg shadow-md hover:bg-[#78a252] transition-colors duration-200">
          Save password
        </button>
      </div>

      {/* Delete Account */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete account</h3>
        <p className="text-gray-600 mb-2">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="text-red-500 hover:underline">I want to delete my account</button>
      </div>
    </div>
  </div>
);

interface NavItem {
  name: string;
  icon: LucideIcon;
  component: React.ReactElement;
}

const SuperAdminNavbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutGrid, component: <Dashboard /> },
    { name: "Inventory", icon: Package, component: <Inventory /> },
    { name: "Sales Order", icon: ShoppingCart, component: <SalesOrder /> },
    { name: "Customers", icon: Users, component: <CustomersContent /> },
    { name: "Reports", icon: BarChart2, component: <ReportsContent /> },
    { name: "Analytics", icon: PieChart, component: <AnalyticsContent /> },
    { name: "Manage Items", icon: Settings, component: <ManageItemsContent /> },
    { name: "Teams", icon: Users2, component: <TeamsContent /> },
  ];

  const handleItemClick = (itemName: string): void => {
    setActiveItem(itemName);
    setIsDropdownOpen(false);
  };

  const renderActiveContent = (): React.ReactElement => {
    const activeNavItem = navItems.find((item) => item.name === activeItem);
    return activeNavItem ? activeNavItem.component : <Dashboard />;
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = window.location.pathname.includes("superadmin")
        ? "/superadmin/logout"
        : "/admin/logout";
      await axiosClient.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("authToken");
      router.visit("/dashboardgetstarted");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = window.location.pathname.includes("superadmin")
          ? "/api/superadmin/profile"
          : "/api/admin/profile";

        const response = await axiosClient.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#8cb662] text-white flex flex-col z-50 transform transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "w-64 rounded-r-lg" : "w-20"} `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-center border-b border-[#7ca551]">
          <img
            src="\images\MiAmoreLogo.png"
            alt="Mi Amore Logo"
            className={`transition-all duration-300 ${isSidebarOpen ? "h-20" : "h-12"}`}
          />
        </div>

        {/* Nav Items */}
        <nav className="mt-6 flex-grow">
          {isSidebarOpen && (
            <div className="px-6 mb-4 text-sm font-semibold text-white transition-opacity duration-300">
              Menu
            </div>
          )}
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-3 group relative">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.name);
                  }}
                  className={`flex items-center py-2 px-5 rounded-l-full transition-all duration-300 ease-in-out
                    ${
                      activeItem === item.name
                        ? "bg-gray-100 text-[#76B13A]"
                        : "text-white hover:bg-gray-100 hover:text-[#76B13A]"
                    }`}
                >
                  <item.icon size={20} className="mr-4 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-bold">{item.name}</span>}
                </a>

                {/* Tooltip when collapsed */}
                {!isSidebarOpen && (
                  <span
                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                               px-2 py-1 bg-[#7ca551] text-white text-xs rounded opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50"
                  >
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <Menu
              size={24}
              className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h1 className="text-xl font-extrabold text-gray-800">{activeItem}</h1>
          </div>

          <div className="flex items-center space-x-6">
            <Bell
              size={24}
              className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110"
            />
            <Settings
              size={24}
              className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110"
            />
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src="\images\profile.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                {isSidebarOpen && user && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">{user ? user.username : "Loading..."}</span>
                    <span className="text-gray-500">{user ? user.role : ""}</span>
                  </div>
                )}
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      openAccountModal();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                  >
                    Account Settings
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-300 cursor-pointer" 
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">{renderActiveContent()}</div>
      </main>

      {/* Account Settings Modal */}
      {isAccountModalOpen && <Modal onClose={closeAccountModal}><AccountSettings /></Modal>}
    </div>
  );
};

export default SuperAdminNavbar;
