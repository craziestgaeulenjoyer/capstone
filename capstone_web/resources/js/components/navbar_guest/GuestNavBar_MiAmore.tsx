import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import axiosClient from "@/axiosClient";

declare var route: any;

interface AuthProps {
  user: null | {
    id: number;
    name: string;
    email: string;
  };

  // ✅ ADDED (does NOT remove anything)
  customer: null | {
    id: number;
    name: string;
    email: string;
    role: "customer";
  };
}

interface PageProps extends InertiaPageProps {
  auth: AuthProps;
}

const GuestNavBar_MiAmore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  const { props } = usePage<PageProps>();
  const auth = props.auth;

  console.log("AUTH PROPS:", props.auth);
  // ✅ ADDED (single source of truth)
  const isCustomer = Boolean(auth?.customer);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoute = (routeName: string) => {
    try {
      return route(routeName);
    } catch (e) {
      return "#";
    }
  };

  const handleLogout = () => {
    router.post(route('customer.logout'));
  };

   const fetchCartCount = async () => {
  if (!isCustomer) return;

  try {
    const res = await axiosClient.get("/cart/count");
    setCartCount(res.data.count);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchCartCount();
  window.addEventListener("cart-updated", fetchCartCount);

  return () => window.removeEventListener("cart-updated", fetchCartCount);
}, [isCustomer]);

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about-us" },
    { name: "Event", href: "/event" },
    { name: "Contact", href: "/contact-us" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-[#3d230d]/90 backdrop-blur-xl shadow-2xl py-3 border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/home" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/images/MiAmore2.png"
                alt="Mi Amore Logo"
                className={`h-12 md:h-14 w-auto transition-all duration-500 rounded-full bg-[#FAF9F6] p-1 ${
                  !scrolled ? "shadow-lg" : "shadow-md"
                }`}
              />
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 italic ${
                      scrolled
                        ? "text-[#FAF9F6]/80 hover:text-[#8CB662]"
                        : "text-[#3d230d] hover:text-[#8CB662]"
                    }`}
                  >
                    {link.name}
                    <motion.span
                      className={`absolute -bottom-2 left-0 h-[1.5px] ${
                        scrolled ? "bg-[#8CB662]" : "bg-[#3d230d]"
                      }`}
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className={`h-5 w-[1px] ${
                scrolled ? "bg-white/10" : "bg-[#3d230d]/10"
              }`}
            />

            <div className="flex items-center space-x-5">
              {/* ✅ CHANGED CONDITION ONLY */}
              {!isCustomer ? (
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={getRoute("SignIn")}
                    className="bg-[#8CB662] text-[#FAF9F6] px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#7aa352] transition-colors"
                  >
                    Join Now
                  </Link>
                </motion.div>
              ) : (
                <div className="flex items-center gap-5">
                  <Link
                    href="/cart"
                    className={`relative transition-transform hover:scale-110 ${
                      scrolled ? "text-white" : "text-[#3d230d]"
                    }`}
                  >
                    <ShoppingCart size={20} strokeWidth={2.5} />
                    <span className="absolute -top-2 -right-2 bg-[#8CB662] text-[9px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold">
                       {cartCount}
                    </span>
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2 border px-5 py-2 rounded-full transition-all text-[11px] font-bold uppercase tracking-widest ${
                        scrolled
                          ? "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                          : "bg-[#3d230d]/5 hover:bg-[#3d230d]/10 border-[#3d230d]/20 text-[#3d230d]"
                      }`}
                    >
                      <User size={14} className="text-[#8CB662]" />
                      <span className="max-w-[90px] truncate">
                        {auth.customer!.name}
                      </span>
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all ${
                scrolled
                  ? "text-white hover:bg-white/10"
                  : "text-[#3d230d] hover:bg-black/5"
              }`}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#3d230d]/60 backdrop-blur-md lg:hidden z-[60]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[80%] max-w-[320px] bg-[#FAF9F6] shadow-[-20px_0_60px_rgba(0,0,0,0.2)] p-10 flex flex-col lg:hidden z-[70]"
            >
              <div className="flex justify-between items-center mb-12">
                <img
                  src="/images/MiAmore2.png"
                  alt="Logo"
                  className="h-12 w-auto"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#3d230d] p-1"
                >
                  <X size={28} />
                </button>
              </div>

              <ul className="flex flex-col space-y-8 mb-12">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold text-[#3d230d] uppercase tracking-[0.2em] hover:text-[#8CB662] block transition-colors italic"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto space-y-4">
                {/* ✅ CHANGED CONDITION ONLY */}
                {!isCustomer ? (
                  <Link
                    href={getRoute("SignIn")}
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-[#3d230d] text-[#FAF9F6] py-4 rounded-xl font-bold uppercase tracking-widest text-center block shadow-xl"
                  >
                    Join Now
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/customer-cart"
                      onClick={() => setIsOpen(false)}
                      className="w-full border-2 border-[#3d230d]/20 text-[#3d230d] py-3 rounded-xl block text-center font-bold uppercase tracking-widest"
                    >
                      My Cart
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-[#8CB662] text-white py-4 rounded-xl block text-center font-bold uppercase tracking-widest"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full bg-red-500 text-white py-4 rounded-xl block text-center font-bold uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuestNavBar_MiAmore;