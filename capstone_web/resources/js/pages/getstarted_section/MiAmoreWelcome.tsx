import React from "react";
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const MiAmoreWelcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#8A9A84] px-4 md:px-8 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
      
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-[#4A5D45]/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-[#C5A059]/10 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-[#FAF9F6] shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden w-full max-w-2xl rounded-[1.5rem] border border-[#C5A059]/20 relative z-10"
      >
        <div className="px-8 py-10 md:px-12 md:py-14 flex flex-col items-center text-center">
          
          <div className="w-full flex justify-start mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-[#4A5D45]/60 hover:text-[#4A5D45] text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 transition-all font-bold"
            >
              <span className="text-sm">←</span> Return
            </button>
          </div>

          <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="mb-8"
          >
            <img 
              src="/images/MiAmore2.png" 
              alt="Mi Amore Logo" 
              className="h-16 md:h-20 w-auto mx-auto brightness-[0.2]" 
            />
            <div className="h-[1px] w-20 bg-[#C5A059]/40 mx-auto mt-4" />
          </motion.div>
          
          <h2 className="text-[#4A5D45] text-[10px] md:text-xs uppercase tracking-[0.5em] font-black mb-6 opacity-80">
            Premium Coffee Experience
          </h2>
          
          <h1 className="text-[#3d230d] text-3xl md:text-5xl font-serif mb-6 leading-tight">
            A Journey of <br />
            <span className="text-[#C5A059] italic font-light">Passion & Elegance</span>
          </h1>
          
          <p className="text-[#4A5D45]/70 text-sm md:text-base font-light leading-relaxed mb-10 max-w-md italic">
            "Every cup is a masterpiece, every visit is a memory. 
            Join our community of coffee lovers today."
          </p>

          <div className="w-full max-w-sm flex flex-col sm:flex-row gap-4">
            <Link
              href={route('SignInCard')}
              className="flex-1 bg-[#4A5D45] text-[#FAF9F6] font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-[#3d4b38] hover:shadow-xl transition-all duration-300 active:scale-95 text-[11px] uppercase tracking-widest border border-[#4A5D45]"
            >
              Sign In
            </Link>
            <Link
              href={route('SignUpForm')}
              className="flex-1 bg-transparent border-2 border-[#4A5D45] text-[#4A5D45] font-bold py-4 px-8 rounded-xl hover:bg-[#4A5D45] hover:text-[#FAF9F6] transition-all duration-300 active:scale-95 text-[11px] uppercase tracking-widest"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-14 w-full">
            <div className="flex items-center justify-center gap-4 mb-4 opacity-20">
              <div className="h-[1px] flex-1 bg-[#3d230d]" />
              <span className="text-[#3d230d] text-lg">☕</span>
              <div className="h-[1px] flex-1 bg-[#3d230d]" />
            </div>
            <p className="text-[#4A5D45]/40 text-[9px] uppercase tracking-[0.4em] font-medium">
              &copy; 2025 Mi Amore Café • Batangas, PH
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MiAmoreWelcome;