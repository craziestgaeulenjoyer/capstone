import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-14 py-12 sm:py-16 md:py-24 bg-[#B8D892] overflow-hidden min-h-[85vh] md:min-h-screen">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-xl text-center md:text-left flex flex-col items-center md:items-start order-1 md:order-1"
        >
          <motion.h1
            className="leading-tight text-[#2b2b2b] mb-4 flex flex-col items-center md:items-start tracking-tight"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            <span className="text-[26px] xs:text-[30px] sm:text-[36px] md:text-[38px] lg:text-[45px]">
              Brewed with love, served with
            </span>

            <span className="mt-1 text-[24px] xs:text-[28px] sm:text-[34px] md:text-[36px] lg:text-[42px]">
              care that’s{" "}
              <span className="font-bold text-[#7B3F00]">Mi Amore</span>
            </span>
          </motion.h1>

          <motion.p
            className="text-[#333] mb-8 max-w-[90%] md:max-w-md text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Where every sip warms your heart and every moment feels like home. 
            Experience the finest blends crafted just for you.
          </motion.p>

          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-[#7B3F00] text-white px-10 py-3.5 rounded-full text-[14px] sm:text-[16px] font-bold shadow-xl transition-all group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="relative z-10">ORDER NOW</span>
              
              <motion.div 
                className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40"
                animate={{ left: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full md:w-[50%] flex justify-center items-center mt-12 md:mt-0 order-2 md:order-2"
        >
          <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-white/30 blur-[80px] rounded-full" />
          
          <motion.img
            src="/images/LAYOUT .png"
            alt="Mi Amore Special Cup"
            animate={{ 
              opacity: [1, 0.7, 1], 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-10 w-[85%] xs:w-[80%] sm:w-[70%] md:w-[95%] lg:w-[105%] max-w-[580px] object-contain drop-shadow-2xl"
          />
        </motion.div>

      </section>
    </>
  );
};

export default HeroSection;