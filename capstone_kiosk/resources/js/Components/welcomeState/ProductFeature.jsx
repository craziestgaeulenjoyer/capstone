import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";

export default function ProductFeature() {
  const [activeSlide, setActiveSlide] = useState(0);

  const drinks = [
    {
      id: 0,
      imageSrc: "/images/machaIchigo.jpg",
      title: "Matcha Ichigo",
      tagline: "Earthy & Sweet",
      description: "Earthy matcha meets sweet strawberries for a refreshing twist.",
    },
    {
      id: 1,
      imageSrc: "/images/peachIceTea.jpg",
      title: "Peach Iced Tea",
      tagline: "Cool & Fruity",
      description: "A cool, fruity blend of peach and tea — perfectly chilled for any mood.",
    },
  ];

  // Auto-slide logic
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev === drinks.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [drinks.length]);

  const handleOrderRedirect = () => {
    router.visit("/pickorder");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] overflow-hidden w-full">
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          backgroundColor: '#FDFCF8' 
        }} 
      />
      
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 hidden sm:block">
        <p className="text-[#3D2317] text-[10px] tracking-[0.6em] uppercase font-bold opacity-40">Mi Amore Kiosk</p>
        <div className="w-12 h-[1px] bg-[#8CB662] mt-2"></div>
      </div>

      {/* --- Top Right Logo --- */}
      <img
        src="/images/MiAmoreWelcome.png"
        alt="Logo"
        className="absolute top-6 right-6 w-16 md:w-28 z-20 drop-shadow-sm"
      />

      {/* --- MAIN SHOWCASE SECTION --- */}
      <div className="z-10 flex flex-col items-center w-full max-w-6xl px-6 py-12">
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 w-full">
          
          {/* IMAGE SECTION */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#8CB662] opacity-10 blur-3xl rounded-full translate-y-10"></div>
            
            <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-80 md:h-[450px] rounded-[100px] md:rounded-[140px] border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide}
                  src={drinks[activeSlide].imageSrc}
                  alt={drinks[activeSlide].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            
            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-[#3D2317] text-[#FDFCF8] px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold rotate-12 shadow-lg z-30">
              Featured
            </div>
          </motion.div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left md:max-w-md">
            <div className="min-h-[150px] md:min-h-[200px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 md:space-y-6"
                >
                  <span className="text-[#8CB662] font-bold text-xs uppercase tracking-[0.4em] block">
                    {drinks[activeSlide].tagline}
                  </span>
                  <h2 className="text-[#3D2317] text-4xl sm:text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                    {drinks[activeSlide].title}
                  </h2>
                  <p className="text-[#3D2317]/70 text-sm md:text-lg leading-relaxed italic max-w-xs md:max-w-none">
                    "{drinks[activeSlide].description}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex space-x-3 mt-8">
              {drinks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    activeSlide === index ? "w-10 h-2 bg-[#8CB662]" : "w-2 h-2 bg-[#3D2317]/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- ORDER BUTTON --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 mb-12 z-20 flex flex-col items-center gap-4"
      >
        <button
          onClick={handleOrderRedirect}
          className="bg-[#3D2317] text-white px-10 py-4 md:px-16 md:py-5 rounded-full text-sm md:text-xl uppercase font-black tracking-[0.3em] shadow-2xl border-2 border-[#7C8B7C] hover:scale-105 active:scale-95 transition-all"
        >
          Order Now
        </button>
        <p className="text-[#3D2317]/40 text-[10px] uppercase tracking-widest font-bold animate-pulse">
          Tap screen to start
        </p>
      </motion.div>

      <div
        className="absolute bottom-[-180px] left-1/2 transform -translate-x-1/2
                   w-[110%] h-[350px] bg-[#8CB662] opacity-5 rounded-t-[100%] z-0"
      />
    </div>
  );
}