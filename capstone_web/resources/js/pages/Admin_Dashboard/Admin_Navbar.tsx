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

// Import content components
import Dashboard from "@/pages/SuperAdminDashItems/Dashboard";
import Inventory from "@/pages/SuperAdminDashItems/Inventory";
import SalesOrder from "@/pages/SuperAdminDashItems/SalesOrder";
import CustomersContent from "@/pages/SuperAdminDashItems/Customer_View";
import ReportsContent from "@/pages/SuperAdminDashItems/Reports";
import AnalyticsContent from "@/pages/SuperAdminDashItems/Analytics";
import ManageItemsContent from "@/pages/SuperAdminDashItems/Manage_Items";

interface NavItem {
  name: string;
  icon: LucideIcon;
  component: React.ReactElement;
}

const Admin_Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutGrid, component: <Dashboard /> },
    { name: "Inventory", icon: Package, component: <Inventory /> },
    { name: "Sales Order", icon: ShoppingCart, component: <SalesOrder /> },
    { name: "Customers", icon: Users, component: <CustomersContent /> },
    { name: "Reports", icon: BarChart2, component: <ReportsContent /> },
    { name: "Analytics", icon: PieChart, component: <AnalyticsContent /> },
    { name: "Manage Items", icon: Settings, component: <ManageItemsContent /> },

  ];

  const handleItemClick = (itemName: string): void => {
    setActiveItem(itemName);
    setIsDropdownOpen(false);
  };

  const renderActiveContent = (): React.ReactElement => {
    const activeNavItem = navItems.find((item) => item.name === activeItem);
    return activeNavItem ? activeNavItem.component : <Dashboard />;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
                {isSidebarOpen && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">John Doe</span>
                    <span className="text-gray-500">Admin</span>
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
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fadeIn"
                  style={{ animation: "fadeIn 0.3s ease" }}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-300"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">{renderActiveContent()}</div>
      </main>
    </div>
  );
};

export default Admin_Navbar;
