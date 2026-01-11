import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react"; 

export default function QRcode() {
  const goBack = () => window.history.back();

  // Color Palette
  const brandGreen = "#8CB662";
  const brandBrown = "#3D2317";

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden font-serif">
      
      {/* 1. TEXTURE & DECOR */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
      
      {/* 2. HEADER */}
      <div className="w-full max-w-5xl flex items-center justify-between z-20">
        <button
          onClick={goBack}
          className="flex items-center font-black text-sm md:text-lg hover:opacity-70 transition group"
          style={{ color: brandBrown }}
        >
          <IoIosArrowBack className="mr-1 group-hover:-translate-x-1 transition-transform" /> BACK
        </button>
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Mi Amore Logo"
          className="w-20 md:w-32 object-contain drop-shadow-sm"
        />
        <div className="w-20 md:w-32" /> 
      </div>

      {/* 3. MAIN SCAN SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-20 flex flex-col items-center text-center max-w-lg w-full px-4"
      >
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter" style={{ color: brandBrown }}>
            Please scan <br />
            <span style={{ color: brandGreen }}>to pay</span>
          </h2>
          <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mt-4">
            Position your phone camera in front of the code
          </p>
        </div>

        {/* QR FRAME */}
        <div className="relative p-6 md:p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100 flex flex-col items-center group">
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: brandGreen }} />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: brandGreen }} />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: brandGreen }} />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: brandGreen }} />

          <motion.img
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            src="/images/InitialQRcode.png"
            alt="QR Code"
            className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10"
          />
          
          <div className="mt-6 flex items-center gap-2 opacity-40">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brandGreen }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandBrown }}>Awaiting Payment</span>
          </div>
        </div>
      </motion.div>

      <div className="z-20 w-full max-w-md flex flex-col items-center gap-6">
        <Link href="/ordernumber" className="w-full">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-white shadow-2xl transition-all"
            style={{ backgroundColor: brandBrown }}
          >
            I have paid
          </motion.button>
        </Link>
        
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-30 text-center" style={{ color: brandBrown }}>
          Mi Amore Kiosk Payment Gateway
        </p>
      </div>

      <div
        className="absolute bottom-[-180px] left-1/2 transform -translate-x-1/2
                   w-[110%] h-[350px] opacity-10 rounded-t-[100%] z-10 pointer-events-none"
        style={{ backgroundColor: brandGreen }}
      />
      
      <div className="absolute top-10 right-10 w-40 h-40 opacity-5 pointer-events-none border-t-2 border-r-2" 
           style={{ borderColor: brandBrown, borderRadius: '0 40px 0 0' }} />
    </div>
  );
}