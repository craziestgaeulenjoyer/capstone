import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer_MiAmore: React.FC = () => {

    const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const section = document.getElementById("contact"); 
        section?.scrollIntoView({ behavior: "smooth" });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, duration: 0.6 }
        }
    };

    const navLinkStyle = "group flex items-center justify-center sm:justify-start transition-all duration-300 hover:text-[#a6d37c]";

    return (
        <footer className="bg-[#8e674a] text-white pt-16">
            <motion.div 
                className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-12 text-center sm:text-left"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                
                <motion.div variants={containerVariants} className="flex flex-col items-center sm:items-start"> 
                    <div className="flex items-center space-x-3 mb-6">
                        <img src="/images/MiAmore2.png" alt="Logo" className="h-14 w-14 rounded-full bg-white p-1 shadow-lg" />
                        <h1 
                            className="text-2xl font-bold text-[#a6d37c]"
                            style={{ fontFamily: "'Kalam', cursive" }}
                        > 
                            Mi Amore
                        </h1>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
                        Welcome to Mi Amore Café, a cozy spot where love meets coffee.
                        Enjoy handcrafted brews & delightful treats in every sip.
                    </p>
                    
                    <div className="flex space-x-4 mt-8">
                        {[
                            { icon: <FaFacebookF />, link: "#" },
                            { icon: <FaInstagram />, link: "#" },
                            { icon: <FaTiktok />, link: "#" }
                        ].map((social, index) => (
                            <motion.a 
                                key={index}
                                href={social.link} 
                                whileHover={{ scale: 1.15, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-white text-[#a6d37c] p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-[#a6d37c] hover:text-white"
                            >
                                <span className="text-lg">{social.icon}</span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={containerVariants}>
                    <h3 className="text-[#a6d37c] font-bold text-lg mb-6 uppercase tracking-wider">Our Store</h3>
                    <ul className="space-y-3 text-gray-200">
                        {['Home', 'Menu', 'About Us', 'Contact'].map((item) => (
                            <li key={item}>
                                <a 
                                    href={item === 'Contact' ? "#contact" : `/${item.toLowerCase().replace(' ', '-')}`} 
                                    onClick={item === 'Contact' ? scrollToContact : undefined}
                                    className={navLinkStyle}
                                >
                                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                                        {item}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={containerVariants}>
                    <h3 className="text-[#a6d37c] font-bold text-lg mb-6 uppercase tracking-wider">Further Links</h3>
                    <ul className="space-y-3 text-gray-200">
                        {[
                            { name: 'Terms & Conditions', path: '/termsandcondition' },
                            { name: 'Privacy Policy', path: '/privacypolicy' },
                            { name: 'Location', path: '/location' }
                        ].map((link) => (
                            <li key={link.name}>
                                <a href={link.path} className={navLinkStyle}>
                                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                                        {link.name}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={containerVariants}>
                    <h3 className="text-[#a6d37c] font-bold text-lg mb-6 uppercase tracking-wider">Get in Touch</h3>
                    <ul className="space-y-4 text-gray-200 text-sm">
                        <li className="flex items-start justify-center sm:justify-start space-x-3 group cursor-pointer">
                            <FaMapMarkerAlt className="text-[#a6d37c] mt-1 group-hover:scale-125 transition-transform duration-300" />
                            <span className="group-hover:text-white transition-colors duration-300">JP Rizal St, Poblacion, Tuy, Batangas</span>
                        </li>
                        <li className="flex items-center justify-center sm:justify-start space-x-3 group cursor-pointer">
                            <FaPhoneAlt className="text-[#a6d37c] group-hover:scale-125 transition-transform duration-300" />
                            <span className="group-hover:text-white transition-colors duration-300">+63 917 892 4125</span>
                        </li>
                        <li className="flex items-center justify-center sm:justify-start space-x-3 group cursor-pointer">
                            <FaEnvelope className="text-[#a6d37c] group-hover:scale-125 transition-transform duration-300" />
                            <span className="group-hover:text-white transition-colors duration-300">miamore.cml@gmail.com</span>
                        </li>
                    </ul>
                </motion.div>

            </motion.div>

            <div className="bg-[#8CB662] text-center py-6 text-xs md:text-sm font-bold text-white shadow-inner">
                <p>© 2025 Mi Amore Café. Crafted with Love. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer_MiAmore;