// resources/js/components/events/HeaderSection.tsx
import React from "react";
import { motion, Variants } from "framer-motion";

export default function HeaderSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-[#FAF9F6] overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 2 }}
            className="text-[20rem] md:text-[35rem] font-bold text-[#3d230d] select-none"
        >
          AMORE
        </motion.span>
      </div>

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-10 group cursor-default">
          <div className="flex items-center gap-3 border border-[#3d230d]/20 px-6 py-2 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#8CB662] animate-pulse" />
            <span className="text-[#3d230d] text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">
              Now Hosting: 2024 Events
            </span>
          </div>
        </motion.div>

        <div className="relative mb-12 flex flex-col items-center">
            <motion.h1
              variants={itemVariants}
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-5xl md:text-8xl lg:text-9xl text-[#3d230d] leading-[0.9] text-center font-black tracking-tighter"
            >
              CRAFTED <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1px #3d230d" }}>GATHERINGS</span>
            </motion.h1>
            
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="h-[2px] bg-[#8CB662] mt-4" 
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end w-full max-w-4xl">
            <motion.div variants={itemVariants} className="text-center md:text-left">
                <p 
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="text-[#3d230d]/80 text-lg md:text-2xl leading-relaxed italic font-light"
                >
                    "Experience the fusion of <span className="text-[#8CB662] font-semibold">Artisan Coffee</span> and soulful celebrations."
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-end gap-6">
                <p className="text-[#3d230d]/60 text-sm md:text-base text-center md:text-right leading-relaxed max-w-[300px]">
                    From intimate acoustic sessions to private creative workshops. Your story starts here.
                </p>
                
                <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 group cursor-pointer"
                >
                    <span className="text-[#3d230d] font-bold text-xs uppercase tracking-widest">Explore Calendar</span>
                    <div className="w-12 h-[1px] bg-[#3d230d] group-hover:w-16 transition-all" />
                </motion.div>
            </motion.div>
        </div>

        <motion.div 
            variants={itemVariants}
            className="mt-20 relative w-full h-[1px] bg-[#3d230d]/10"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-[#FAF9F6]">
                <div className="flex gap-8 opacity-30">
                    <span className="text-[10px] tracking-[1em] uppercase">Private</span>
                    <span className="text-[10px] tracking-[1em] uppercase">Corporate</span>
                    <span className="text-[10px] tracking-[1em] uppercase">Social</span>
                </div>
            </div>
        </motion.div>

      </motion.div>

      <div className="absolute left-10 bottom-10 hidden lg:block">
         <p className="text-[9px] uppercase tracking-[0.8em] text-[#3d230d]/30 rotate-[-90deg] origin-left">MI AMORE CAFE EST 2019</p>
      </div>

    </section>
  );
}