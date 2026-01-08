import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
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
}

const GuestNavBar_MiAmore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { auth } = usePage<PageProps>().props;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about-us" },
    { name: "Event", href: "/event" },
    { name: "Location", href: "/location" },
    { name: "Contact", href: "/contact-us" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[#6b4d36f2] backdrop-blur-lg shadow-lg py-2" 
          : "bg-[#8e674acc] backdrop-blur-md py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        <Link href="/home" className="flex-shrink-0">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="images/MiAmore2.png"
            alt="Mi Amore Logo"
            className="h-10 md:h-14 object-contain"
          />
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-6 font-medium text-[0.95rem] tracking-wide">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative group text-white/90 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8cb662] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-[1px] bg-white/20 mx-2" />

          <div className="flex items-center space-x-4">
            {auth?.user === null ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={route("SignIn")}
                  className="relative overflow-hidden bg-[#88B04B] text-white px-7 py-2.5 rounded-full font-bold shadow-lg flex items-center group"
                >
                  <span className="relative z-10">Join Now</span>
                  <motion.div 
                    className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40"
                    animate={{ left: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/cart" className="text-white hover:text-[#8cb662] transition-colors relative">
                  <ShoppingCart size={22} />
                </Link>
                <Link href="/profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-full transition-all">
                  <User size={18} className="text-[#8cb662]" />
                  <span className="text-sm font-semibold text-white">Profile</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[75%] max-w-[300px] bg-[#7c5b3f] shadow-2xl p-8 flex flex-col lg:hidden"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                  <X size={30} />
                </button>
              </div>

              <ul className="flex flex-col space-y-6">
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
                      className="text-xl font-medium text-white/90 hover:text-[#8cb662] block transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                {auth?.user === null ? (
                  <Link
                    href={route("SignIn")}
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-[#88B04B] text-white py-4 rounded-2xl font-bold shadow-lg block text-center"
                  >
                    Join Now
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="w-full bg-white/10 text-white py-3 rounded-xl block text-center border border-white/20">
                      My Cart
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="w-full bg-[#88B04B] text-white py-3 rounded-xl block text-center">
                      Profile Settings
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default GuestNavBar_MiAmore;