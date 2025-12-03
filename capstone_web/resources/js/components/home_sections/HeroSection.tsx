import React from "react";
import { Link } from "@inertiajs/react";
import { useInView } from 'react-intersection-observer';
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-14 py-16 md:py-20 bg-[#B8D892] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 max-w-xl text-center md:text-left flex flex-col items-center md:items-start"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="leading-snug text-[#2b2b2b] mb-3 flex flex-col items-center md:items-start"
            style={{ fontFamily: "'Avant Guard', cursive" }}
          >
            <span className="flex items-center justify-center md:justify-start gap-2 flex-wrap text-[24px] sm:text-[28px] md:text-[34px] lg:text-[35px] xl:text-[35px]">
              Brewed with love, served with{" "}
              <motion.img
                src="/images/leaf-icon.png"
                alt="Leaf"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ margin: 0, verticalAlign: "middle" }}
              />
            </span>

            <span className="mt-2 text-[22px] sm:text-[26px] md:text-[32px] lg:text-[36px] xl:text-[30px]">
              care that’s{" "}
              <span
                className="font-bold text-[#7B3F00]"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                Mi Amore
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[#333] mb-8 max-w-md text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Where every sip warms your heart and every moment feels like home.
          </motion.p>

          <Link href="/menu">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#7B3F00] text-white px-8 py-3 rounded-full text-[14px] sm:text-[15px] md:text-[16px] font-semibold shadow-md transition"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ORDER NOW
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full md:w-[45%] flex justify-center md:justify-end mt-10 md:mt-0"
        >
          <img
            src="/images/MiAmore-Cup.png"
            alt="Cup"
            className="w-[250px] sm:w-[300px] md:w-[380px] lg:w-[350px] xl:w-[380px] mt-6 object-contain hidden sm:block"
          />
        </motion.div>

        <style>
          {`
            /* Tablet view adjustments */
            @media (max-width: 1024px) {
              section {
                flex-direction: column;
                text-align: center;
                padding: 4rem 2rem;
              }
              section div.z-10 {
                text-align: center;
                align-items: center;
                max-width: 90%;
              }
              section img[alt="Cup"] {
                display: block !important;
                margin: 2rem auto 0 auto;
                width: 340px !important;
              }
            }

            /* Mobile view adjustments */
            @media (max-width: 768px) {
              section {
                padding: 3rem 1.5rem;
              }
              h1 {
                text-align: center !important;
              }
              section img[alt="Cup"] {
                display: none !important;
              }
            }

            /* Small mobile fine-tune */
            @media (max-width: 480px) {
              section {
                padding: 2.5rem 1.2rem;
              }
              h1 {
                font-size: 20px !important;
                line-height: 1.3 !important;
              }
              p {
                font-size: 13px !important;
              }
            }
          `}
        </style>
      </section>
    </>
  );
};

export default HeroSection;

















