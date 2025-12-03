import axiosClient from "@/axiosClient";
import { router } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
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
      {/* Email */}
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
  route: string;
}

const SuperAdminNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutGrid, route: "/superadmin/dashboard" },
    { name: "Inventory", icon: Package, route: "/superadmin/dashboard/inventory" },
    { name: "Sales Order", icon: ShoppingCart, route: "/superadmin/dashboard/salesorder" },
    { name: "Customers", icon: Users, route: "/superadmin/dashboard/customers" },
    { name: "Reports", icon: BarChart2, route: "/superadmin/dashboard/reports" },
    { name: "Analytics", icon: PieChart, route: "/superadmin/dashboard/analytics" },
    { name: "Manage Items", icon: Settings, route: "/superadmin/dashboard/manage-items" },
    { name: "Teams", icon: Users2, route: "/superadmin/dashboard/teams" },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.post("/superadmin/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("token");
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
        const response = await axiosClient.get("/api/superadmin/profile", {
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
      <aside className={`fixed top-0 left-0 h-full bg-[#8cb662] text-white flex flex-col z-50 transition-all duration-500 ease-in-out ${isSidebarOpen ? "w-64 rounded-r-lg" : "w-20"}`}>
        <div className="p-6 flex items-center justify-center border-b border-[#7ca551]">
          <img src="\images\MiAmoreLogo.png" alt="Mi Amore Logo" className={`transition-all duration-300 ${isSidebarOpen ? "h-20" : "h-12"}`} />
        </div>

        <nav className="mt-6 flex-grow">
          {isSidebarOpen && <div className="px-6 mb-4 text-sm font-semibold text-white transition-opacity duration-300">Menu</div>}
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-3 group relative">
                <a
                  href={item.route}
                  className={`flex items-center py-2 px-5 rounded-l-full transition-all duration-300 ease-in-out ${
                    window.location.pathname === item.route
                      ? "bg-gray-100 text-[#76B13A]"
                      : "text-white hover:bg-gray-100 hover:text-[#76B13A]"
                  }`}
                >
                  <item.icon size={20} className="mr-4 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-bold">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex flex-col h-full transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "ml-64" : "ml-20"}`}
        style={{ width: `calc(100% - ${isSidebarOpen ? "16rem" : "5rem"})` }}
      >
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <Menu size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h1 className="text-xl font-extrabold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-6" ref={dropdownRef}>
            <Bell size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110" />
            <Settings size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110" />
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src="\images\profile.jpg" alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
                {isSidebarOpen && user && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">{user.username}</span>
                    <span className="text-gray-500">{user.role}</span>
                  </div>
                )}
                <ChevronDown size={16} className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fadeIn">
                  <button onClick={() => setIsAccountModalOpen(true)} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                    Account Settings
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {isAccountModalOpen && <Modal onClose={() => setIsAccountModalOpen(false)}><AccountSettings /></Modal>}
    </div>
  );
};

export default SuperAdminNavbar;
