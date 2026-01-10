import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const SectionDivider: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-24 bg-[#8CB662] overflow-hidden">
      <svg 
        className="absolute bottom-0 w-full h-24 text-[#8CC0BE] fill-current" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
      >
        <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20">
        <motion.button 
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          viewport={{ once: true }}
          title="Scroll to Top"
          className="relative flex items-center justify-center p-0 m-0 bg-transparent border-none outline-none focus:outline-none"
        >
          <div className="bg-[#FAF9F6] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl border-4 border-[#8CC0BE] flex items-center justify-center transition-transform duration-300">
            <FaArrowUp className="text-[#5C2E0A]" size={18} />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default SectionDivider;