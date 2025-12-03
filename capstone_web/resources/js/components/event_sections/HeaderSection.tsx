import React from "react";
import { motion } from "framer-motion";

export default function HeaderSection() {
  return (
    <section
      className="
        relative
        w-full 
        min-h-[90vh]
        flex flex-col 
        justify-center 
        items-center 
        text-center 
        px-6 
        md:px-12 
        py-16 
        bg-cover 
        bg-bottom 
        bg-no-repeat
      "
      style={{
        backgroundImage: "url('/images/HeaderEvent.png')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/10" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          style={{ fontFamily: "'Kalam', cursive" }}
          className="
            text-[2rem] 
            md:text-[2.8rem] 
            lg:text-[3.2rem] 
            font-bold 
            text-white
            tracking-wide 
          "
        >
          <span className="text-[#76B13A] italic">Taste the </span>
          <span className="text-[#B13A3A] italic">Love </span>
          <span className="text-[#76B13A] italic">in </span>
          <span className="text-[#9D7353] italic">Every Sip</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.1 }}
          style={{ fontFamily:  "'Tangerine', cursive" }}
          className="
            max-w-3xl 
            mt-4 
            text-white 
            text-[1rem] 
            md:text-[1.2rem]
            leading-relaxed 
            px-4
            italic
            drop-shadow-[0_3px_4px_rgba(0,0,0,0.7)]
          "
        >
          Discover the perfect blend of flavors at Mi Amore Café. Enjoy rich coffee,
          creamy milk tea, refreshing fruit juices, and smooth matcha — 
          <span className="italic"> all made with love in every cup.</span>
        </motion.p>
      </div>
    </section>
  );
}
