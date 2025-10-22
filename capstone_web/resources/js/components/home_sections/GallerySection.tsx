import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GallerySection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  const fadeInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -80 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={ref}
      className="bg-white py-15 px-6 sm:px-10 lg:px-20 flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInDown}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-[#2b2b2b]"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          A Taste of <span className="text-[#7B3F00]">Mi Amore</span>
        </h2>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 mt-2 text-[15px] sm:text-[17px]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          A glimpse into our cozy corner of coffee, comfort, and crafted flavors.
        </motion.p>
      </motion.div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Top Left */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-lg shadow-md sm:col-span-1 lg:col-span-1"
        >
          <img
            src="/images/gallery1.jpg"
            alt="Mi Amore Gallery 1"
            className="w-full h-[250px] sm:h-[280px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Top Right */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden rounded-lg shadow-md sm:col-span-1 lg:col-span-1"
        >
          <img
            src="/images/gallery2.jpg"
            alt="Mi Amore Gallery 2"
            className="w-full h-[250px] sm:h-[280px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Center Large */}
        <motion.div
          variants={fadeInDown}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="overflow-hidden rounded-lg shadow-md sm:col-span-2 lg:col-span-2 row-span-2"
        >
          <img
            src="/images/gallery3.jpg"
            alt="Mi Amore Gallery 3"
            className="w-full h-[530px] sm:h-[585px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Bottom Left */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="overflow-hidden rounded-lg shadow-md sm:col-span-1 lg:col-span-1"
        >
          <img
            src="/images/gallery4.jpg"
            alt="Mi Amore Gallery 4"
            className="w-full h-[250px] sm:h-[280px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Bottom Right */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="overflow-hidden rounded-lg shadow-md sm:col-span-1 lg:col-span-1"
        >
          <img
            src="/images/gallery5.jpg"
            alt="Mi Amore Gallery 5"
            className="w-full h-[250px] sm:h-[280px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;



