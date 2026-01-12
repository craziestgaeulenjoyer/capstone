import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";

export default function BubbleWelcome() {
  const [isExiting, setIsExiting] = useState(false);

  // --- THEME COLORS ---
  const colors = {
    sage: "#8CB662",
    sageSoft: "#A3B1A3",
    brown: "#3D2317",
    cream: "#FDFCF8",
  };

  const handleStart = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => router.visit("/productfeature"), 600);
  };

  useEffect(() => {
    const autoRedirect = setTimeout(() => {
      handleStart();
    }, 6000);

    return () => clearTimeout(autoRedirect);
  }, []);

  const bubbles = useMemo(() => [
    { size: "w-[40vw] h-[40vw]", top: "-10%", left: "-5%", delay: 0, duration: 25 },
    { size: "w-[50vw] h-[50vw]", bottom: "-15%", right: "-10%", delay: 2, duration: 30 },
    { size: "w-[25vw] h-[25vw]", top: "15%", right: "5%", delay: 1, duration: 20 },
    { size: "w-[30vw] h-[30vw]", bottom: "10%", left: "10%", delay: 4, duration: 28 },
  ], []);

  return (
    <div 
      onClick={handleStart} 
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#FDFCF8] cursor-pointer"
    >
      
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }}></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            animate={{ 
              x: [0, 40, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute rounded-full blur-[80px] md:blur-[120px] opacity-20 ${b.size}`}
            style={{ backgroundColor: colors.sage, top: b.top, left: b.left, right: b.right, bottom: b.bottom }}
          />
        ))}
      </div>

      {/* 3. MAIN CONTENT */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-20 flex flex-col items-center text-center px-8"
          >
            <motion.img
              src="/images/MiAmoreWelcome.png"
              alt="Logo"
              className="w-40 h-40 md:w-64 md:h-64 object-contain mb-6 drop-shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="space-y-2">
              <h1 className="text-5xl md:text-8xl font-black italic uppercase text-[#3D2317] tracking-tighter">
                Welcome
              </h1>
              <p className="text-[#8CB662] text-sm md:text-lg font-bold tracking-[0.4em] uppercase">
                Mi Amore Kiosk
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-16 z-30 flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-[#3D2317] text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold mb-2">
            Tap anywhere to order
          </span>
          <div className="w-40 h-[2px] bg-[#3D2317]/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="w-full h-full bg-[#8CB662]"
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-8 border border-[#3D2317]/5 pointer-events-none">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#8CB662]"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#8CB662]"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#8CB662]"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#8CB662]"></div>
      </div>
    </div>
  );
}