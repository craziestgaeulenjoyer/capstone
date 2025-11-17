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
  LayoutGrid,
  Menu,
  Bell,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

// Navbar Children prop
interface NavItem {
  name: string;
  icon: LucideIcon;
  route: string;
}

const Admin_Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutGrid, route: "/admin/dashboard" },
    { name: "Inventory", icon: Package, route: "/admin/dashboard/inventory" },
    { name: "Sales Order", icon: ShoppingCart, route: "/admin/dashboard/salesorder" },
    { name: "Customers", icon: Users, route: "/admin/dashboard/customers" },
    { name: "Reports", icon: BarChart2, route: "/admin/dashboard/reports" },
    { name: "Analytics", icon: PieChart, route: "/admin/dashboard/analytics" },
    { name: "Manage Items", icon: Settings, route: "/admin/dashboard/manage-items" },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosClient.post("/admin/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
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
                <a href={item.route} className={`flex items-center py-2 px-5 rounded-l-full transition-all duration-300 ease-in-out ${
                  window.location.pathname === item.route
                    ? "bg-gray-100 text-[#76B13A]"
                    : "text-white hover:bg-gray-100 hover:text-[#76B13A]"
                }`}>
                  <item.icon size={20} className="mr-4 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-bold">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <Menu size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          <div className="flex items-center space-x-6" ref={dropdownRef}>
            <Bell size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110" />
            <Settings size={24} className="text-gray-600 hover:text-[#76B13A] cursor-pointer transition-transform hover:scale-110" />
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src="\images\profile.jpg" alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
                {isSidebarOpen && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">John Doe</span>
                    <span className="text-gray-500">Admin</span>
                  </div>
                )}
                <ChevronDown size={16} className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fadeIn">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </main>
    </div>
  );
};

export default Admin_Navbar;
