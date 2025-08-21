import React from 'react';
import { Link } from '@inertiajs/react';

const GuestNavBar_MiAmore: React.FC = () => {
    const leftLinks = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'About Us', href: '/about-us' }, 
    ];

    const rightLinks = [
        { name: 'Location', href: '/location' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="bg-[#8e674a] text-white py-4 shadow-md">
            <div className="w-full px-10 flex items-center justify-between">
                {/* Left side: Logo and Links */}
                <div className="flex items-center space-x-12">
                    <img src="images/MiAmore2.png" alt="Logo" className="h-12" />
                    <ul className="flex space-x-6 font-semibold">
                        {leftLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                            href={link.href}
                            className="relative group text-white hover:text-[#8cb662] transition-colors duration-300"
                            >
                            <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:shadow-md after:transition-all after:duration-500 group-hover:after:w-full">
                                {link.name}
                            </span>
                            </Link>
                        </li>
                        ))}
                    </ul>
                </div>

                {/* Right side: Links and Button */}
                <div className="flex items-center space-x-12 font-semibold">
                    <ul className="flex space-x-6">
                        {rightLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                            href={link.href}
                            className="relative group text-white hover:text-[#8cb662] transition-colors duration-300"
                            >
                            <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#8cb662] after:shadow-md after:transition-all after:duration-500 group-hover:after:w-full">
                                {link.name}
                            </span>
                            </Link>
                        </li>
                        ))}
                    </ul>

                    { /* Button */ }
                    <div className="relative">
                    <Link
  href={route('SignIn')}
  className="bg-[#88B04B] text-white px-10 py-2 rounded-full font-bold shadow hover:bg-[#7BA642] transition-all hover:cursor-pointer"
>
  Join Now
</Link>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default GuestNavBar_MiAmore;