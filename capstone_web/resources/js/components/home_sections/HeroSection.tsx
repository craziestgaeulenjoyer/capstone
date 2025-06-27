import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-20 md:py-32 overflow-hidden h-[500px] md:h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-background.png" 
          alt="Hero Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Centered Text Content */}
      <div className="z-10 w-full text-center flex flex-col items-center">
        <h1 className="text-black font-bold text-5xl md:text-5xl lg:text-5xl leading-tight mb-4">
          IT’S <span className="text-white italic font-black">MI AMORE</span> WITH <br />
          EVERY SIP <span className="font-black inline-flex items-center gap-1">COFFEE <img src="/images/leaf-icon.png" alt="Leaf Icon" className="w-15 h-15" /></span><br />
        </h1>
        <Link href="/order">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="bg-[#90CAF9] text-white py-3 px-8 rounded-full font-semibold text-md md:text-base shadow-lg hover:bg-[#64a5b6] transition mt-4"
          >
            Order Now
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;






