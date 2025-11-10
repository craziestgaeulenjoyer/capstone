import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User } from 'lucide-react'; 


type AuthProps = {
  auth: {
    user: null | {
      id: number;
      name: string;
      email: string;
    };
  };
};
// -------------------

const GuestNavBar_MiAmore: React.FC = () => {
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
      <div className="w-full px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="images/MiAmore2.png" alt="Logo" className="h-10 md:h-12" />
        </div>

        {/* Desktop Links */}
        <div className="flex items-center justify-between w-full ml-10">
          {/* Left Links */}
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

          {/* Right Links + Buttons */}
          <div className="flex items-center space-x-6 font-semibold">
            {/* Right Links */}
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

            {/* BUTTON SWITCH */}
            {auth.user === null ? (
              <Link
                href={route('SignIn')}
                className="bg-[#88B04B] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all flex items-center gap-2"
              >
                Join Now
              </Link>
            ) : (
              <div className="flex gap-4">
                {/* Cart Button */}
                <Link
                  href="/cart"
                  className="bg-[#88B04B] text-white px-4 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all flex items-center justify-center"
                >
                  <ShoppingCart size={20} />
                </Link>

                {/* Profile Button */}
                <Link
                  href="/profile"
                  className="bg-white text-[#8e674a] px-4 py-2 rounded-full font-bold shadow hover:bg-gray-200 transition-all flex items-center justify-center"
                >
                  <User size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavBar_MiAmore;
