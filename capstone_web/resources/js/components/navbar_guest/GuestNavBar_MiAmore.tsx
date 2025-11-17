import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface AuthProps {
  user: null | {
    id: number;
    name: string;
    email: string;
  };
}

interface PageProps extends InertiaPageProps {
  auth: AuthProps;
  [key: string]: any;
}

const GuestNavBar_MiAmore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = usePage<PageProps>().props;

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
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#8e674acc] shadow-md text-white font-sans transition-all duration-300">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img
            src="images/MiAmore2.png"
            alt="Mi Amore Logo"
            className="h-11 md:h-14 object-contain select-none"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between flex-grow ml-10">
          <ul className="flex space-x-7 font-semibold text-[0.95rem] tracking-wide">
            {leftLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative group text-white hover:text-[#8cb662] transition-all duration-300"
                >
                  <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:transition-all after:duration-500 group-hover:after:w-full">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Navigation + Auth Buttons */}
          <div className="flex items-center space-x-6 font-semibold text-[0.95rem] tracking-wide">
            <ul className="flex space-x-6">
              {rightLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="relative group text-white hover:text-[#8cb662] transition-all duration-300"
                  >
                    <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:transition-all after:duration-500 group-hover:after:w-full">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {auth?.user === null ? (
              <Link
                href={route("SignIn")}
                className="bg-[#88B04B] text-white px-5 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-transform duration-300 hover:scale-105"
              >
                Join Now
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/cart"
                  className="bg-[#88B04B] text-white px-5 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-transform duration-300 hover:scale-105"
                >
                  Add to Cart
                </Link>
                <Link
                  href="/profile"
                  className="bg-white text-[#8e674a] px-5 py-2 rounded-full font-bold shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-center md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none transition-transform duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-[#8e674acc] backdrop-blur-md border-t border-[#7c5b3f]"
          >
            <ul className="flex flex-col items-center space-y-4 py-5 font-medium text-[1rem]">
              {[...leftLinks, ...rightLinks].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-[#8cb662] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {auth?.user === null ? (
                <li>
                  <Link
                    href={route("SignIn")}
                    onClick={() => setIsOpen(false)}
                    className="bg-[#88B04B] text-white px-10 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-transform duration-300 hover:scale-105"
                  >
                    Join Now
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="bg-[#88B04B] text-white px-10 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-transform duration-300 hover:scale-105"
                    >
                      Add to Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="bg-white text-[#8e674a] px-10 py-2 rounded-full font-bold shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
                    >
                      Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default GuestNavBar_MiAmore;


