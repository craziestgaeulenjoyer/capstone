import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const WhyChooseUsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      
      <motion.div
        className="-mt-6"
        initial={{ x: -100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold tracking-wide text-gray-800 mb-2">FEATURED</p>
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-[#B47B50] italic">Why </span>
          <span className="text-[#76B13A] italic">Choose </span>
          <span className="text-[#B47B50] italic">Us?</span>
          <span className="inline-block ml-1 text-4xl">🌿</span>
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-justify">
          Since 2019, we've been dedicated to serving expertly brewed coffee, soothing tea,
          and freshly squeezed lemonade for a burst of natural flavor. With our focus on quality
          and a cozy ambiance, we provide the perfect place to relax, connect, and enjoy every sip.
        </p>
        <a href="/about">
          <button className="border-2 border-[#76B13A] text-[#76B13A] font-medium px-5 py-2 hover:bg-[#76B13A] hover:text-white transition-all duration-300">
            View More
          </button>
        </a>
      </motion.div>

      <motion.div
        className="relative w-full h-[280px] md:h-[320px] -mt-6"
        initial={{ x: 100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div
        className="absolute top-0 left-30 w-[65%] h-65 -rotate-[25deg] bg-[#8CB662] z-0"
          style={{
            borderTopLeftRadius: '200px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '200px',
          }}
        ></div>

        <img
          src="/images/choose-us-img.jpg"
          alt="Waffle or dessert"
          className="absolute top-0 right-45 w-[65%] h-55 object-cover z-10"
        />
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;



