import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

function WelcomeSection() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 text-center bg-white">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className="text-4xl md:text-5xl font-bold text-[#5b8c3d] mb-4"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        Welcome
        <img
          src="/images/leaf-icon.png"
          alt="Leaf icon"
          className="inline-block w-15 h-15 ml-2 mb-1"
        />
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className="text-base md:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10"
        style={{ fontFamily:  "'Tangerine', cursive" }}
      >
        Established in 2019, Mi Amore Cafe was built on a passion for great flavors and warm
        connections. From our expertly brewed coffee and soothing teas to our freshly squeezed
        lemonade, every sip and bite is made with love. Whether you're here for a quick refreshment
        or a cozy gathering, Mi Amore is your go-to spot for quality drinks, delicious treats,
        and a welcoming ambiance.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className="flex justify-center items-center gap-5"
      >
        <a
          href="https://facebook.com/miamorecafe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#7ba642] hover:bg-[#8bc662] transition duration-300 transform hover:scale-105"
        >
          <FaFacebookF className="text-white text-xl" />
        </a>

        <a
          href="https://instagram.com/miamorecafe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#7ba642] hover:bg-[#8bc662] transition duration-300 transform hover:scale-105"
        >
          <FaInstagram className="text-white text-xl" />
        </a>

        <a
          href="https://tiktok.com/@miamorecafe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#7ba642] hover:bg-[#8bc662] transition duration-300 transform hover:scale-105"
        >
          <FaTiktok className="text-white text-xl" />
        </a>
      </motion.div>
    </section>
  );
}

export default WelcomeSection;


