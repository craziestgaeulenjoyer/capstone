import React from 'react';
import { motion, Variants } from 'framer-motion';

const QuoteSection: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
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
    <section className="relative py-16 md:py-24 lg:py-32 px-6 bg-[#FAF9F6] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <motion.div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        
        <motion.div variants={itemVariants} className="w-full md:w-5/12 flex justify-center order-2 md:order-1">
          <div className="relative group p-3 md:p-4 bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.05)] rotate-[-1deg] hover:rotate-0 transition-transform duration-700 ease-in-out">
            <div className="overflow-hidden border border-gray-100">
              <img
                src="/images/img2.jpg"
                alt="Artisan Brew"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            
            <div className="absolute -bottom-3 -left-3 bg-[#8CB662] text-white text-[10px] tracking-[0.2em] px-4 py-2 font-bold uppercase shadow-lg">
              Crafted with Love
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full md:w-7/12 text-center md:text-left relative order-1 md:order-2"
        >
          <motion.span 
            variants={itemVariants}
            className="absolute -top-12 left-1/2 -translate-x-1/2 md:left-[-20px] md:translate-x-0 text-7xl md:text-8xl lg:text-9xl text-[#8CB662] opacity-20 font-serif leading-none"
          >
            &ldquo;
          </motion.span>

          <div className="relative z-10 pt-4 md:pt-0">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#3d230d] leading-[1.3] md:leading-[1.4] mb-8 font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              At Mi Amore Cafe, every brew tells a story &mdash; one of <span className="italic text-[#8CB662]">passion</span>, freshness, and heartfelt moments.
            </motion.h2>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4"
            >
              <div className="hidden md:block h-[1px] w-12 bg-[#8CB662]" />
              <p 
                className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold text-[#3d230d]/60"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                The Heart of Mi Amore
              </p>
              <div className="md:hidden h-[1px] w-12 bg-[#8CB662] mt-2" />
            </motion.div>
          </div>

          <motion.span 
            variants={itemVariants}
            className="absolute -bottom-16 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 text-7xl md:text-8xl lg:text-9xl text-[#8CB662] opacity-20 font-serif leading-none"
          >
            &rdquo;
          </motion.span>
        </motion.div>

      </motion.div>
    </section>
  );
}

export default QuoteSection;