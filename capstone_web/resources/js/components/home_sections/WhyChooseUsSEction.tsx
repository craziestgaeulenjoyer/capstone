import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowUpRight } from 'react-icons/fi';

const WhyChooseUsSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const textContainer = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="bg-white overflow-hidden py-16 md:py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <motion.div
          className="relative group"
          initial={{ x: -100, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#76B13A]/10 rounded-full blur-3xl group-hover:bg-[#76B13A]/20 transition-all duration-500"></div>
          
          <div className="relative z-10 w-full max-w-lg mx-auto lg:mx-0">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <img
                src="/images/coffee-cup.jpg"
                alt="Mi Amore Coffee Craft"
                className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 md:p-6 rounded-2xl shadow-xl hidden sm:block border border-gray-100">
              <p className="text-[#76B13A] font-bold text-3xl">6+</p>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Years of Love</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col text-center lg:text-left items-center lg:items-start"
          variants={textContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p variants={itemFade} className="text-[#76B13A] text-sm font-black tracking-[0.3em] uppercase mb-4">
            Our Story
          </motion.p>

          <motion.div variants={itemFade} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <h2 className="text-4xl sm:text-6xl font-extrabold leading-tight text-[#3d2b1f]" style={{ fontFamily: "'Kalam', cursive" }}>
              <span className="text-[#B47B50]">Why </span>
              <span className="text-[#76B13A]">Choose </span>
              <span className="text-[#B47B50]">Us?</span>
            </h2>
          </motion.div>

          <motion.p variants={itemFade} className="text-gray-600 leading-relaxed text-base md:text-lg max-w-xl mb-10">
            Since <span className="text-[#B47B50] font-bold text-xl">2019</span>, we've been dedicated to serving expertly brewed coffee, soothing tea, and
            freshly squeezed lemonade for a burst of natural flavor. With our focus on quality and
            a cozy ambiance, we provide the perfect place to relax, connect, and enjoy every sip.
          </motion.p>

          <motion.div variants={itemFade}>
            <a href="/about-us" className="inline-block">
              <button className="group relative flex items-center gap-3 bg-white border-2 border-[#76B13A] text-[#76B13A] font-extrabold px-10 py-4 rounded-full overflow-hidden transition-all duration-300 active:scale-95 shadow-lg hover:shadow-[#76B13A]/30">
                <span className="absolute inset-0 bg-[#76B13A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative z-10 text-lg transition-colors duration-300 group-hover:text-white">
                  Learn More About Us
                </span>
                <FiArrowUpRight className="relative z-10 text-2xl transition-all duration-300 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;