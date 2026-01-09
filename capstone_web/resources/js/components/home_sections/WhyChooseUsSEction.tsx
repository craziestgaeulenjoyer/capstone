import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowUpRight } from 'react-icons/fi';

const WhyChooseUsSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const textContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2, 
        delayChildren: 0.3 
      }
    }
  };

  const itemFade: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    }
  };

  return (
    <section ref={ref} className="bg-[#FAF9F6] overflow-hidden py-24 md:py-32 px-6 relative">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        <motion.div
          className="relative group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="absolute -top-8 -left-8 w-48 h-48 border-l-2 border-t-2 border-[#8CB662]/30 hidden md:block" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 border-r-2 border-b-2 border-[#5C2E0A]/20 hidden md:block" />
          
          <div className="relative z-10 w-full max-w-lg mx-auto lg:mx-0">
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(92,46,10,0.3)] border-[12px] border-white"
            >
              <img
                src="/images/coffee-cup.jpg"
                alt="Mi Amore Coffee Craft"
                className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#5C2E0A]/5 group-hover:bg-transparent transition-colors duration-700" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-8 -right-4 md:-right-10 bg-[#5C2E0A] p-6 md:p-8 rounded-2xl shadow-2xl text-center min-w-[140px]"
            >
              <p className="text-[#8CB662] font-bold text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>6+</p>
              <p className="text-[#FAF9F6]/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 leading-tight">Years of <br/> Craftsmanship</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col text-center lg:text-left items-center lg:items-start"
          variants={textContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemFade} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#8CB662]" />
            <p className="text-[#8CB662] text-[11px] font-bold tracking-[0.5em] uppercase">
              Our Heritage
            </p>
          </motion.div>

          <motion.h2 
            variants={itemFade} 
            className="text-4xl md:text-6xl font-bold leading-tight text-[#5C2E0A] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Choose <br />
            <span className="italic text-[#8CB662]">Mi Amore?</span>
          </motion.h2>

          <motion.p 
            variants={itemFade} 
            className="text-[#5C2E0A]/70 leading-relaxed text-base md:text-xl max-w-xl mb-12 font-medium"
          >
            Since <span className="text-[#5C2E0A] font-bold border-b border-[#8CB662]">2019</span>, we have been curators of fine moments. Our dedication to premium beans and artisan brewing creates a sanctuary where every sip tells a story of passion and quality.
          </motion.p>

          <motion.div variants={itemFade} className="grid grid-cols-2 gap-8 mb-12 w-full max-w-md">
            <div className="border-l border-[#5C2E0A]/10 pl-4 group/item">
              <h4 className="text-[#5C2E0A] font-bold text-sm uppercase tracking-wider mb-2 group-hover/item:text-[#8CB662] transition-colors">Quality</h4>
              <p className="text-[#5C2E0A]/50 text-xs italic">Hand-selected premium beans</p>
            </div>
            <div className="border-l border-[#5C2E0A]/10 pl-4 group/item">
              <h4 className="text-[#5C2E0A] font-bold text-sm uppercase tracking-wider mb-2 group-hover/item:text-[#8CB662] transition-colors">Ambiance</h4>
              <p className="text-[#5C2E0A]/50 text-xs italic">Cozy & Timeless spaces</p>
            </div>
          </motion.div>

          <motion.div variants={itemFade}>
            <a href="/about-us" className="group relative inline-flex items-center gap-4 bg-[#5C2E0A] text-[#FAF9F6] px-10 py-5 rounded-full overflow-hidden transition-all duration-500 shadow-2xl hover:bg-[#3d1f07]">
              <div className="absolute inset-0 bg-[#8CB662] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em]">
                Discover Our Journey
              </span>
              <FiArrowUpRight className="relative z-10 text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;