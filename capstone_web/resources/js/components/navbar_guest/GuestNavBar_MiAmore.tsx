import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

// ---- TYPE FIX HERE ----
type AuthProps = {
  auth: {
    user: null | {
      id: number;
      name: string;
      email: string;
    };
  };
};
// ------------------------

const GuestNavBar_MiAmore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // usePage is typed -- no more TS error
  const { auth } = usePage<AuthProps>().props;

  const leftLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about-us' },
  ];

  const rightLinks = [
    { name: 'Location', href: '/location' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-[#8e674a] text-white shadow-md">
      <div className="w-full px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="images/MiAmore2.png" alt="Logo" className="h-10 md:h-12" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-between w-full ml-10">
          <ul className="flex space-x-8 font-semibold">
            {leftLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative group text-white hover:text-[#8cb662] transition-colors duration-300"
                >
                  <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:transition-all after:duration-500 group-hover:after:w-full">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-8 font-semibold">
            <ul className="flex space-x-6">
              {rightLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="relative group text-white hover:text-[#8cb662] transition-colors duration-300"
                  >
                    <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:transition-all after:duration-500 group-hover:after:w-full">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* BUTTON SWITCH (DESKTOP) */}
            {auth.user === null ? (
              <Link
                href={route('SignIn')}
                className="bg-[#88B04B] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all"
              >
                Join Now
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/cart"
                  className="bg-[#88B04B] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all"
                >
                  Add to Cart
                </Link>

                <Link
                  href="/profile"
                  className="bg-white text-[#8e674a] px-6 py-2 rounded-full font-bold shadow hover:bg-gray-200 transition-all"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-[#8e674a] border-t border-[#7c5b3f] animate-fadeIn">
          <ul className="flex flex-col items-center space-y-4 py-4 font-medium">
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

            {/* BUTTON SWITCH (MOBILE) */}
            {auth.user === null ? (
              <Link
                href={route('SignIn')}
                onClick={() => setIsOpen(false)}
                className="bg-[#88B04B] text-white px-10 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all"
              >
                Join Now
              </Link>
            ) : (
              <>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#88B04B] text-white px-10 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all"
                >
                  Add to Cart
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="bg-white text-[#8e674a] px-10 py-2 rounded-full font-bold shadow hover:bg-gray-200 transition-all"
                >
                  Profile
                </Link>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default GuestNavBar_MiAmore;
