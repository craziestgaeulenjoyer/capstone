// resources/js/components/aboutus/HeroSection.tsx
import React, { useState } from 'react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

    const handleImageLoad = (id: string) => {
        setImagesLoaded(prev => ({ ...prev, [id]: true }));
    };

    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const yTransform = useTransform(scrollY, [0, 400], [0, 80]);
    const rotateImg = useTransform(scrollY, [0, 400], [0, 5]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
            } 
        }
    };

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAF9F6] pt-24 md:pt-28 lg:pt-32 pb-12">
            
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#fdfcf0] via-[#FAF9F6] to-[#f2f0e4]" />
            <div className="absolute inset-0 opacity-[0.06] z-10 pointer-events-none" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />

            <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                    
                    {/* TEXT CONTENT */}
                    <motion.div
                        style={{ opacity, y: yTransform }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1"
                    >
                        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                            <span className="text-[#8CB662] uppercase tracking-[0.4em] text-[10px] md:text-xs font-black">
                                Since 2019
                            </span>
                            <div className="h-[1px] w-12 bg-[#3d230d]/20 hidden md:block" />
                        </motion.div>

                        <motion.h1 
                            variants={itemVariants}
                            className="text-[#3d230d] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-6 tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            A Journey <br />
                            <span className="italic font-light text-[#8CB662]">Of Passion</span>
                        </motion.h1>

                        <motion.p 
                            variants={itemVariants}
                            className="max-w-md lg:max-w-lg text-[#3d230d]/70 text-sm md:text-base lg:text-lg leading-relaxed font-light tracking-wide italic mb-8"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            "Mi Amore wasn't just built on coffee; it was built on the shared laughter, 
                            quiet mornings, and the love for our craft."
                        </motion.p>
                        
                        <motion.div variants={itemVariants} className="hidden lg:block">
                            <div className="h-[2px] w-20 bg-[#8CB662]/30" />
                        </motion.div>
                    </motion.div>

                    {/* IMAGE SECTION */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full lg:w-1/2 relative flex items-center justify-center order-1 lg:order-2 h-[320px] sm:h-[400px] lg:h-[500px]"
                    >
                        <div className="absolute inset-0 bg-[#3d230d]/5 rounded-full blur-[80px] scale-90 -z-10" />

                        {/* SMALL FLOATING IMAGE */}
                        <motion.div 
                            style={{ rotate: rotateImg }}
                            className="absolute -left-4 sm:left-0 lg:-left-6 top-0 w-32 h-44 md:w-44 md:h-64 lg:w-52 lg:h-72 shadow-2xl z-20 border-[6px] md:border-[8px] border-white overflow-hidden hidden sm:block bg-[#f2f0e4]"
                        >
                            <AnimatePresence>
                                {!imagesLoaded['img1'] && (
                                    <div className="absolute inset-0 bg-[#f2f0e4] animate-pulse" />
                                )}
                            </AnimatePresence>
                            <motion.img 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: imagesLoaded['img1'] ? 1 : 0 }}
                                src="/images/about-us-1.jpg" 
                                alt="Process" 
                                className="w-full h-full object-cover"
                                onLoad={() => handleImageLoad('img1')}
                                fetchPriority="high"
                            />
                        </motion.div>

                        {/* MAIN IMAGE */}
                        <div className="w-48 h-64 sm:w-60 sm:h-80 md:w-72 md:h-[420px] lg:w-[320px] lg:h-[460px] shadow-2xl relative z-10 border-[8px] md:border-[10px] border-white overflow-hidden bg-[#f2f0e4]">
                            <AnimatePresence>
                                {!imagesLoaded['img2'] && (
                                    <div className="absolute inset-0 bg-[#f2f0e4] animate-pulse" />
                                )}
                            </AnimatePresence>
                            <motion.img 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: imagesLoaded['img2'] ? 1 : 0 }}
                                src="/images/about-us-2.jpg" 
                                alt="Our Store" 
                                className="w-full h-full object-cover"
                                onLoad={() => handleImageLoad('img2')}
                                loading="eager"
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-[#3d230d]/5 mix-blend-multiply pointer-events-none" />
                        </div>

                        {/* LOCATION TAG */}
                        <div className="absolute -bottom-4 right-2 sm:right-6 lg:-right-4 bg-[#3d230d] text-[#FAF9F6] px-4 py-3 md:px-6 md:py-4 shadow-2xl z-30">
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold italic">
                                Batangas, Philippines
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* SCROLL INDICATOR */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 right-12 z-20 hidden xl:flex flex-col items-center gap-4"
            >
                <span className="text-[#3d230d]/30 text-[9px] uppercase tracking-[0.4em] [writing-mode:vertical-lr] font-bold">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#3d230d]/20 to-transparent" />
            </motion.div>
        </section>
    );
}

export default HeroSection;