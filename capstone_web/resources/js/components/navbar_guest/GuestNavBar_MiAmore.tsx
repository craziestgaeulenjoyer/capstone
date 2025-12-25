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
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ───────────────────────────────
  // Fetch logged-in customer
  // ───────────────────────────────
  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem("customer_token");

      const config: any = { withCredentials: true };
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/customer/profile",
        config
      );

      setCustomer(res.data.customer);
    } catch (err) {
      console.error("Unauthorized:", err);
      localStorage.removeItem("customer_token");
      setCustomer(null);
      setCartCount(0);
    }
  };

  // ───────────────────────────────
  // Fetch cart count
  // ───────────────────────────────
  const fetchCartCount = async () => {
  try {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setCartCount(0);
      return;
    }

    const res = await axios.get("http://127.0.0.1:8000/api/cart/count", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCartCount(res.data.count || 0);
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    setCartCount(0);
  }
};

  // ───────────────────────────────
  // Initial load + login listener
  // ───────────────────────────────
  useEffect(() => {
    fetchCustomer();
    fetchCartCount();

    const handleLogin = () => {
      fetchCustomer();
      fetchCartCount();
    };

    window.addEventListener("customer-login", handleLogin);
    return () => window.removeEventListener("customer-login", handleLogin);
  }, []);

  // ───────────────────────────────
  // Refetch cart when customer changes
  // ───────────────────────────────
  useEffect(() => {
    if (customer) {
      fetchCartCount();
    }
  }, [customer]);

  // ───────────────────────────────
  // Close dropdown when clicking outside
  // ───────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ───────────────────────────────
  // Logout
  // ───────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    setCustomer(null);
    setCartCount(0);
    router.visit("/home");
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

  const cartLink = { name: "Cart", href: "/cart" };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#8e674acc] shadow-md text-white">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <img
          src="/images/MiAmore2.png"
          alt="Logo"
          className="h-11 md:h-14 object-contain"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between flex-grow ml-10">
          <ul className="flex space-x-7">
            {leftLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-[#8cb662]">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-6 ml-10">
            <ul className="flex space-x-6">
              {rightLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#8cb662]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Customer Section */}
            {customer ? (
              <div
                className="relative flex items-center gap-3"
                ref={dropdownRef}
              >
                {/* Cart Icon */}
                 <Link href="/customer-cart"  className="relative text-xl">
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <img
                  src={customer.avatar || "/images/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="font-semibold">{customer.full_name}</span>

                <ChevronDown
                  className={`cursor-pointer transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />

               {isDropdownOpen && (
  <div className="absolute right-0 top-full mt-1 w-56 bg-white text-black rounded-md shadow-lg overflow-hidden">

    {/* PROFILE SECTION */}
    <div className="flex items-center gap-3 px-4 py-3 border-b">
      <img
        src={customer.avatar || "/images/default-avatar.png"}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {customer.full_name}
        </span>
        <span className="text-xs text-gray-500">
          {customer.email}
        </span>
      </div>
    </div>

    {/* VIEW PROFILE */}
    <Link
      href="/profile"
      className="block px-4 py-2 text-sm hover:bg-gray-100"
    >
      View Profile
    </Link>

    {/* LOGOUT */}
    <button
      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
)}

              </div>
            ) : (
              <Link
                href="/signin"
                className="bg-[#88B04B] px-5 py-2 rounded-full hover:bg-[#7BA642]"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#8e674acc] py-4">
          <ul className="flex flex-col items-center space-y-4">
            {[...leftLinks, ...rightLinks].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {customer ? (
              <>
                <li className="font-semibold">{customer.full_name}</li>

                <li>
                  <Link
                    href="/cart"
                    className="relative bg-[#88B04B] px-4 py-2 rounded block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#88B04B] px-4 py-2 rounded"
                >
                  Join Now
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default GuestNavBar_MiAmore;
