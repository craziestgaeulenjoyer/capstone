import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowUpRight } from 'react-icons/fi';

const WhyChooseUsSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-white mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
    >
      <motion.div
        className="relative flex justify-start items-center md:pl-45"
        initial={{ x: -100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="relative w-full h-full md:w-[420px] md:h-[420px] rounded-full overflow-hidden shadow-lg">
          <img
            src="/images/coffee-cup.jpg"
            alt="Coffee Cup"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col justify-start gap-4 md:pr-20"
        initial={{ x: 100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-sm font-bold tracking-wide text-black">FEATURED</p>

        <div className="flex items-center gap-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight" style={{ fontFamily: 'Figma Hand, cursive' }}>
            <span className="text-[#B47B50]">Why </span>
            <span className="text-[#76B13A]">Choose </span>
            <span className="text-[#B47B50]">Us?</span>
          </h2>
          <img
            src="/images/leaf-icon.png"
            alt="Leaf Icon"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>

        <p className="text-gray-800 leading-relaxed text-justify text-base sm:text-lg max-w-md">
          Since 2019, we've been dedicated to serving expertly brewed coffee, soothing tea, and
          freshly squeezed lemonade for a burst of natural flavor. With our focus on quality and
          a cozy ambiance, we provide the perfect place to relax, connect, and enjoy every sip.
        </p>

        <a href="/about-us" className="inline-block mt-2">
          <button className="flex items-center gap-2 border-2 border-[#76B13A] text-[#76B13A] font-semibold px-6 py-2 shadow-md hover:bg-[#76B13A] hover:text-white transition duration-300">
            Learn more <FiArrowUpRight className="text-xl" />
          </button>
        </a>
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;










