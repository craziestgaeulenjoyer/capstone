import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const WhyChooseUsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <section
      ref={ref}
      className="bg-white mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0"
    >
      <motion.div
        className="flex flex-col justify-center md:pl-40 md:pr-4"
        initial={{ x: -100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold tracking-wide text-gray-800 mb-2">FEATURED</p>
        <h2 className="text-4xl font-bold mb-4">
          <span className="text-[#B47B50] italic">Why </span>
          <span className="text-[#76B13A] italic">Choose </span>
          <span className="text-[#B47B50] italic">Us?</span>
          <span className="inline-block ml-1 text-5xl">🌿</span>
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-justify max-w-md">
          Since 2019, we've been dedicated to serving expertly brewed coffee, soothing tea,
          and freshly squeezed lemonade for a burst of natural flavor. With our focus on quality
          and a cozy ambiance, we provide the perfect place to relax, connect, and enjoy every sip.
        </p>
        <a href="/about">
          <button className="border-2 border-[#76B13A] text-[#76B13A] font-medium px-6 py-2 hover:bg-[#76B13A] hover:text-white transition-all duration-300">
            View More
          </button>
        </a>
      </motion.div>

      <motion.div
        className="relative flex justify-start items-center pl-6 md:pl-40 md:-ml-12 h-[350px] md:h-[400px]"
        initial={{ x: 100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div
          className="absolute w-[400px] h-[300px] bg-[#8CB662] z-0"
          style={{
            borderTopLeftRadius: '200px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '200px',
            transform: 'rotate(-25deg)',
          }}
        ></div>

        <img
          src="/images/choose-us-img.jpg"
          alt="Waffle or dessert"
          className="relative right-30 w-[400px] h-[300px] object-cover shadow-lg z-10"
        />
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;





