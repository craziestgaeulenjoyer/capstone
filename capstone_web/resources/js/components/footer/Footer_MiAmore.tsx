import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer_MiAmore: React.FC = () => {

    const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const section = document.getElementById("contact-us");
        section?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="bg-[#8e674a] text-white pt-10">
            <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10">
                
                {/* Logo & Description */}
                <div className="pr-10"> 
                    <div className="flex items-center space-x-2 mb-4">
                        <img src="/images/MiAmore2.png" alt="Logo" className="h-15 w-15 rounded-full bg-white p-1" />
                        <h1 
                            className="text-xl font-bold text-[#a6d37c]"
                            style={{ fontFamily: "'Kalam', cursive" }}
                        > 
                            Mi Amore
                        </h1>
                    </div>
                    <p className="text-sm">
                        Welcome to Mi Amore Café, a cozy spot where love meets coffee.
                        Enjoy handcrafted brews & delightful treats in every sip.
                    </p>
                    <div className="flex space-x-4 mt-4 text-xl">
                        <a href="#" className="bg-white text-[#4267B2] p-3 rounded-full shadow-md hover:scale-110 transition transform duration-300">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="bg-white text-[#C13584] p-3 rounded-full shadow-md hover:scale-110 transition transform duration-300">
                            <FaInstagram />
                        </a>
                        <a href="#" className="bg-white text-[#000000] p-3 rounded-full shadow-md hover:scale-110 transition transform duration-300">
                            <FaTiktok />
                        </a>
                    </div>
                </div>

                {/* Our Store */}
                <div>
                    <h3 className="font-semibold mb-4">Our Store</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/home" className="hover:text-[#8cb662] transition-colors duration-300">Home</a></li>
                        <li><a href="/menu" className="hover:text-[#8cb662] transition-colors duration-300">Menu</a></li>
                        <li><a href="/about-us" className="hover:text-[#8cb662] transition-colors duration-300">About Us</a></li>
                        <li>
                            <a
                                href="#contact-us"
                                onClick={scrollToContact}
                                className="hover:text-[#8cb662] transition-colors duration-300"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Further Links */}
                <div>
                    <h3 className="font-semibold mb-4">Further Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/termsandcondition" className="hover:text-[#8cb662] transition-colors duration-300">Terms & Conditions</a></li>
                        <li><a href="/privacypolicy" className="hover:text-[#8cb662] transition-colors duration-300">Privacy Policy</a></li>
                        <li><a href="/location" className="hover:text-[#8cb662] transition-colors duration-300">Location</a></li>
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


