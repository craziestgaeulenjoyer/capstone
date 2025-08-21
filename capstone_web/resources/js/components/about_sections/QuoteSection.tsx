import React from 'react';
import { motion } from 'framer-motion';

function QuoteSection() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#F0F6F5] flex flex-col md:flex-row items-center justify-center gap-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className="md:w-1/3 flex justify-center"
      >
        <img
          src="/images/img2.jpg"
          alt="Mi Amore Cafe product cup with green leaves"
          className="rounded-tl-[5rem] rounded-br-[5rem] shadow-lg w-full max-w-md object-cover"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainerVariants}
        className="md:w-2/3 text-center md:text-left px-4 md:px-8 py-8"
      >
        <motion.p variants={itemVariants} className="text-9xl text-[#8bc662] mb-4 leading-none">“</motion.p>
        <motion.p
          variants={itemVariants}
          className="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-4"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          At Mi Amore Cafe, every brew tells a story — one of passion, freshness, and heartfelt moments.
        </motion.p>
        <motion.p variants={itemVariants} className="text-9xl text-[#8bc662] mt-4 text-right leading-none">”</motion.p>
      </motion.div>
    </section>
  );
}

export default QuoteSection;
