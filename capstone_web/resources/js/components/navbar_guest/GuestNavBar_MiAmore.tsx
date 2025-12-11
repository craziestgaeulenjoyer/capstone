import React, { useState, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { Menu, X, ChevronDown } from "lucide-react";

interface Customer {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
}

const GuestNavBar_MiAmore: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCustomer = async () => {
  try {
    let token = localStorage.getItem("customer_token");

    // If no token, fallback to cookie-based authentication
    const config: any = { withCredentials: true }; // send cookies
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await axios.get("http://127.0.0.1:8000/api/customer/profile", config);

    // Update state and localStorage
    setCustomer(response.data.customer);
    if (!token && response.data.token) {
      // store token returned by backend if needed
      localStorage.setItem("customer_token", response.data.token);
    }
  } catch (err) {
    console.error("Unauthorized:", err);
    localStorage.removeItem("customer_token");
    setCustomer(null);
  }
};

useEffect(() => {
  fetchCustomer();

  // Re-fetch customer if login event occurs
  const handleLogin = () => fetchCustomer();
  window.addEventListener("customer-login", handleLogin);

  return () => window.removeEventListener("customer-login", handleLogin);
}, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("customer_token");
    setCustomer(null);
    router.visit("/home"); // redirect to home
  };

  const leftLinks = [
    { name: "Home", href: "/home" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about-us" },
    { name: "Event", href: "/event" },
  ];

  const rightLinks = [
    { name: "Location", href: "/location" },
    { name: "Contact", href: "/contact-us" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#8e674acc] shadow-md text-white">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/images/MiAmore2.png" alt="Logo" className="h-11 md:h-14 object-contain" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between flex-grow ml-10">
          <ul className="flex space-x-7">
            {leftLinks.map(link => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-[#8cb662]">{link.name}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-6 ml-10">
            <ul className="flex space-x-6">
              {rightLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#8cb662]">{link.name}</Link>
                </li>
              ))}
            </ul>

            {/* Customer / Join Now */}
            {customer ? (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <Link href="/cart" className="hover:text-[#8cb662] text-xl">🛒</Link>
                <img src={customer.avatar || "/images/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="hidden md:block font-semibold">{customer.full_name}</span>
                <ChevronDown
                  className={`cursor-pointer transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
                    <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="bg-[#88B04B] text-white px-5 py-2 rounded-full hover:bg-[#7BA642]">Join Now</Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#8e674acc] py-4">
          <ul className="flex flex-col items-center space-y-4">
            {[...leftLinks, ...rightLinks].map(link => (
              <li key={link.name}>
                <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>
              </li>
            ))}
            {customer ? (
              <>
                <li className="font-semibold">{customer.full_name}</li>
                <li>
                  <Link href="/cart" className="bg-[#88B04B] px-4 py-2 rounded mb-2 block text-center" onClick={() => setIsMobileMenuOpen(false)}>🛒 Cart</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded w-full">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#88B04B] px-4 py-2 rounded">Join Now</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default GuestNavBar_MiAmore;
