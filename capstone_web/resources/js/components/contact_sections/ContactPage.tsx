// resources/js/Pages/website_pages/Contact.tsx
import React from "react";
import { motion, Variants } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';


const ContactPage: React.FC = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
        }
    };

    return (
        <NavbarLayout>
            
            <div className="bg-[#FAF9F6] overflow-hidden relative">
                
                <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-[#3d230d]">
                    <div className="absolute inset-0 opacity-20 z-10 pointer-events-none" 
                         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
                    
                    <motion.div 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070" 
                            alt="Cafe Background" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <div className="relative z-20 text-center px-6 max-w-5xl">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <motion.span variants={fadeInUp} className="text-[#8CB662] text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold mb-6 block">
                                Establish your connection
                            </motion.span>
                            <motion.h1 
                                variants={fadeInUp}
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-5xl md:text-8xl text-[#FAF9F6] leading-tight mb-8"
                            >
                                Let’s Start a <br /> <span className="italic font-light text-[#8CB662]">Conversation.</span>
                            </motion.h1>
                            <motion.div variants={fadeInUp} className="w-12 md:w-20 h-[1px] bg-[#8CB662] mx-auto" />
                        </motion.div>
                    </div>
                </section>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div variants={fadeInUp}>
                            <h3 className="text-[#3d230d] text-xs uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-[#8CB662]" /> Visit Us
                            </h3>
                            <p className="text-[#3d230d]/80 text-xl md:text-3xl font-medium italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                JP Rizal St, Poblacion, Tuy, Batangas
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-10 md:justify-end">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#8CB662] mb-2">Socials</h4>
                                <div className="flex gap-4 text-[#3d230d]">
                                    <FaFacebookF className="hover:text-[#8CB662] cursor-pointer transition-colors" />
                                    <FaInstagram className="hover:text-[#8CB662] cursor-pointer transition-colors" />
                                    <FaTiktok className="hover:text-[#8CB662] cursor-pointer transition-colors" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#8CB662] mb-2">Direct</h4>
                                <p className="text-[#3d230d] text-sm font-bold">+63 917 892 4125</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-7xl mx-auto px-6 mb-24"
                >
                    <div className="relative p-2 md:p-4 bg-white border border-[#3d230d]/5 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#8CB662] z-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#8CB662] z-20 pointer-events-none" />
                        
                        <div className="relative w-full h-[400px] md:h-[500px] bg-[#e5e7eb] grayscale-[0.8] contrast-[1.1] brightness-[0.9] hover:grayscale-0 transition-all duration-1000">
                            <iframe 
                                title="Mi Amore Tuy Batangas"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.524584478148!2d120.7289569!3d13.9189916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd06f5713486db%3A0xe549520037a3536!2sJP%20Rizal%20St%2C%20Tuy%2C%20Batangas!5e0!3m2!1sen!2sph!4v1700000000000" 
                                className="w-full h-full border-0"
                                allowFullScreen={true} 
                                loading="lazy"
                            />
                        </div>
                        
                        <div className="absolute top-8 left-8 z-30 bg-[#3d230d] text-[#FAF9F6] px-6 py-3 shadow-xl hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Find us in the heart of Tuy</p>
                        </div>
                    </div>
                </motion.div>


            </div>
        </NavbarLayout>
    );
}

export default ContactPage;