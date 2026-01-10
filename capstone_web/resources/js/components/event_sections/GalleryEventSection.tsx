import React from "react";
import { motion, Variants } from "framer-motion";

const galleryImages = {
  topLeft: "/images/Event-Images3.jpg",
  small1: "/images/Event-Images4.jpg",
  small2: "/images/Event-Images2.jpg",
  rightTall: "/images/Event-Images1.jpg",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

const GalleryEventSection = () => {
  return (
    <section className="bg-[#faf7f2] py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          className="text-[#8CB662] font-bold uppercase text-[10px] mb-4"
        >
          Visual Journal
        </motion.span>
        <h2 className="text-3xl md:text-5xl font-bold text-[#5C2E0A] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Captured <span className="italic">Amore</span> Moments
        </h2>
        <div className="w-12 h-[2px] bg-[#5C2E0A]/20 mt-6" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col gap-8">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-sm rotate-2 z-20 shadow-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="overflow-hidden rounded-2xl shadow-xl border-[12px] border-white">
              <motion.img
                src={galleryImages.topLeft}
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-1000"
                alt="Event detail"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="group overflow-hidden rounded-xl shadow-lg border-[8px] border-white">
              <motion.img
                src={galleryImages.small1}
                className="w-full h-40 md:h-56 object-cover group-hover:rotate-3 group-hover:scale-125 transition-transform duration-700"
                alt="Event catering"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="group overflow-hidden rounded-xl shadow-lg border-[8px] border-white">
              <motion.img
                src={galleryImages.small2}
                className="w-full h-40 md:h-56 object-cover group-hover:-rotate-3 group-hover:scale-125 transition-transform duration-700"
                alt="Event atmosphere"
              />
            </motion.div>
          </div>
        </div>

        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 relative group"
        >
          <div className="absolute inset-4 border border-white/40 z-10 pointer-events-none" />
          
          <div className="overflow-hidden rounded-3xl shadow-2xl h-full border-[12px] border-white">
            <motion.img
              src={galleryImages.rightTall}
              className="w-full h-[400px] md:h-[600px] lg:h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
              alt="Main event feature"
            />
            
            <div className="absolute inset-0 bg-[#5C2E0A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
              <div className="text-white">
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2">Mi Amore Premium</p>
                <h3 className="text-2xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif" }}>Artisan Gatherings</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }}
      />
    </section>
  );
};

export default GalleryEventSection;