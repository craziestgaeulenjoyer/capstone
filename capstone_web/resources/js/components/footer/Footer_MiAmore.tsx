import React from 'react';
import { Link } from '@inertiajs/react';
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer_MiAmore: React.FC = () => {
    return (
        <footer className="bg-[#8e674a] text-white pt-10">
            <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10">
                {/* Logo & Description */}
                <div className="pr-10"> 
                    <div className="flex items-center space-x-2 mb-4">
                        <img src="/images/MiAmore2.png" alt="Logo" className="h-15 w-15 rounded-full bg-white p-1" />
                        <h1 
                        className="text-xl font-bold text-[#a6d37c] "
                        style={{ fontFamily: "'Kalam', cursive" }}
                         > 
                         Mi Amore
                        </h1>
                    </div>
                    <p className="text-sm">
                        Welcome to Mi Amore Café, a cozy spot where love meets coffee.
                        Enjoy handcrafted brews & delightful treats in every sip.
                    </p>
                    <div className="flex space-x-4 mt-4 text-2xl text-white">
                        <a href="#" className="hover:text-[#a6d37c]"><FaFacebookF /></a>
                        <a href="#" className="hover:text-[#a6d37c]"><FaInstagram /></a>
                        <a href="#" className="hover:text-[#a6d37c]"><FaTiktok /></a>
                    </div>
                </div>

                {/* Our Store */}
                <div>
                    <h3 className="font-semibold mb-4">Our Store</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-[#8cb662] transition-colors duration-300">Home</Link></li>
                        <li><Link href="/menu" className="hover:text-[#8cb662] transition-colors duration-300">Menu</Link></li>
                        <li><Link href="/about" className="hover:text-[#8cb662] transition-colors duration-300">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[#8cb662] transition-colors duration-300">Contact</Link></li>
                    </ul>
                </div>

                {/* Further Links */}
                <div>
                    <h3 className="font-semibold mb-4">Further Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terms" className="hover:text-[#8cb662] transition-colors duration-300">Terms & Condition</Link></li>
                        <li><Link href="/privacy" className="hover:text-[#8cb662] transition-colors duration-300">Privacy Policy</Link></li>
                        <li><Link href="/location" className="hover:text-[#8cb662] transition-colors duration-300">Location</Link></li>
                    </ul>
                </div>

                {/* Get in Touch */}
                <div>
                    <h3 className="font-semibold mb-4">Get in Touch</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start space-x-2">
                        <FaMapMarkerAlt className="text-[#a6d37c] mt-1" />
                        <span>JP Rizal St, Poblacion, Tuy, Batangas</span>
                        </li>
                        <li className="flex items-center space-x-2">
                        <FaPhoneAlt className="text-[#a6d37c]" />
                        <span>+63 917 892 4125</span>
                        </li>
                        <li className="flex items-center space-x-2">
                        <FaEnvelope className="text-[#a6d37c]" />
                        <span>miamore.cml@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-[#88B04B] text-center py-3 text-sm font-semibold">
                © 2025 Mi Amore Café. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer_MiAmore; 
