import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react'; 

const Footer_MiAmore: React.FC = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, duration: 0.8 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const navLinkStyle = "group relative flex items-center justify-center sm:justify-start text-sm text-[#FAF9F6]/80 transition-all duration-300 hover:text-[#8CB662]";

    return (
        <footer className="relative bg-[#3d230d] text-[#FAF9F6] pt-20 overflow-hidden z-20">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />

            <motion.div 
                className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 pb-16 relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >

                <motion.div variants={itemVariants} className="flex flex-col items-center sm:items-start"> 
                    <div className="flex items-center space-x-4 mb-8">
                        <img src="/images/MiAmore2.png" alt="Logo" className="h-16 w-16 rounded-full bg-[#FAF9F6] p-1.5 shadow-2xl border border-[#8CB662]/30" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#8CB662]" style={{ fontFamily: "'Playfair Display', serif" }}>Mi Amore</h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold">Café & Bistro</p>
                        </div>
                    </div>
                    <p className="text-[#FAF9F6]/60 text-sm leading-relaxed italic text-center sm:text-left max-w-xs mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        "Where every sip warms your heart and every moment feels like home." 
                    </p>
                    
                    <div className="flex space-x-5">
    {[
        { 
            icon: <FaFacebookF />, 
            link: "https://www.facebook.com/MiAmore.CML", 
            label: "Facebook"
        },
        { 
            icon: <FaInstagram />, 
            link: "https://www.instagram.com/miamore.cml", 
            label: "Instagram"
        },
        { 
            icon: <FaTiktok />, 
            link: "https://www.tiktok.com/@miamore.cml", 
            label: "TikTok"
        }
    ].map((social, index) => (
        <motion.a 
            key={index} 
            href={social.link} 
            target="_blank"             
            rel="noopener noreferrer"    
            aria-label={social.label}    
            whileHover={{ y: -5, backgroundColor: "#8CB662", color: "#FAF9F6" }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#FAF9F6]/20 text-[#FAF9F6] transition-all duration-300"
        >
            <span className="text-sm">{social.icon}</span>
        </motion.a>
    ))}
</div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center sm:text-left">
                    <h3 className="text-[#8CB662] font-bold text-xs uppercase tracking-[0.4em] mb-8 font-montserrat">Menu</h3>
                    <ul className="space-y-4">
                        {[
                            { name: 'Home', path: '/home' },
                            { name: 'Menu', path: '/menu' },
                            { name: 'About Us', path: '/about-us' },
                            { name: 'Contact', path: '/contact-us' } 
                        ].map((item) => (
                            <li key={item.name}>
                                <Link 
                                    href={item.path} 
                                    className={navLinkStyle}
                                >
                                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#8CB662] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center sm:text-left">
                    <h3 className="text-[#8CB662] font-bold text-xs uppercase tracking-[0.4em] mb-8 font-montserrat">Experience</h3>
                    <ul className="space-y-4">
                        {[
                            { name: 'Privacy Policy', path: '/privacypolicy' }, 
                            { name: 'Terms & Conditions', path: '/termsandcondition' }, 
                        ].map((link) => (
                            <li key={link.name}>
                                <Link href={link.path} className={navLinkStyle}>
                                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#8CB662] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center sm:text-left">
                    <h3 className="text-[#8CB662] font-bold text-xs uppercase tracking-[0.4em] mb-8 font-montserrat">Get in Touch</h3>
                    <ul className="space-y-6 text-[#FAF9F6]/70 text-sm">
                        <li className="flex items-start justify-center sm:justify-start space-x-4 group cursor-default">
                            <FaMapMarkerAlt className="text-[#8CB662] mt-1 shrink-0" />
                            <span className="leading-relaxed group-hover:text-white transition-colors">JP Rizal St, Poblacion,<br/>Tuy, Batangas</span>
                        </li>
                        <li className="flex items-center justify-center sm:justify-start space-x-4 group cursor-default">
                            <FaPhoneAlt className="text-[#8CB662] shrink-0" />
                            <span className="group-hover:text-white transition-colors">+63 917 892 4125</span>
                        </li>
                    </ul>
                </motion.div>
            </motion.div>

            <div className="border-t border-[#FAF9F6]/5 bg-[#2a1809]/50 py-8 relative z-10">
                <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#FAF9F6]/40">
                    <p>© 2026 Mi Amore Café. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-[#8CB662]">Crafted with Love</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ y: -5, backgroundColor: "#8CB662" }}
                        onClick={scrollToTop}
                        className="fixed bottom-10 right-6 md:right-10 z-[60] w-12 h-12 rounded-full bg-[#5C2E0A] text-white flex items-center justify-center shadow-2xl border border-[#FAF9F6]/10 transition-colors"
                    >
                        <FaChevronUp size={18} />
                    </motion.button>
                )}
            </AnimatePresence>

        </footer>
    );
};

export default Footer_MiAmore;