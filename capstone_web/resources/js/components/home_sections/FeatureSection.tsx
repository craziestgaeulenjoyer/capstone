import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GiCoffeeBeans, GiTruck, GiSwipeCard } from "react-icons/gi";

const FeaturesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(1); 

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const controls = useAnimation();

  if (inView) {
    controls.start("visible");
  }

  const cards = [
    {
      icon: <GiCoffeeBeans className="text-[#7B3F00] text-4xl" />,
      title: "TYPES OF COFFEE",
      text: "Crafted with care, our coffee and food are made to comfort. From bold brews to fresh bites, there's love in every sip and every plate.",
    },
    {
      icon: <GiTruck className="text-[#7B3F00] text-4xl" />,
      title: "FAST DELIVERY",
      text: "Bringing amore to your doorstep! Order your favorites and enjoy fast, reliable delivery perfect for cozy mornings or busy afternoons.",
    },
    {
      icon: <GiSwipeCard className="text-[#7B3F00] text-4xl" />,
      title: "EARN POINTS",
      text: "Sip, earn, repeat. Collect points with every visit and get rewarded for loving Mi Amore as much as we love serving you.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-white py-20 px-6 md:px-12 lg:px-20 text-center"
    >
      {/* Header with scroll animation */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="max-w-3xl mx-auto mb-14"
      >
        <h2
          className="text-3xl sm:text-4xl font-semibold text-[#2b2b2b] mb-3"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          Discover. Delight.{" "}
          <span className="text-[#6FC14B] font-semibold">Mi Amore.</span>
        </h2>
        <p
          className="text-gray-700 text-[15px] sm:text-[16px] leading-relaxed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Experience the perfect blend of coffee, cuisine, and unforgettable
          moments at Mi Amore Café.
        </p>
      </motion.div>

      {/* Cards with staggered scroll animation */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {cards.map((card, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.div
              key={index}
              custom={index}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -5 }}
              onClick={() => setActiveIndex(index)}
              className={`w-[280px] sm:w-[320px] md:w-[340px] px-6 py-8 rounded-xl cursor-pointer transition-all duration-300 ${
                isActive
                  ? "border-2 border-[#6FC14B] shadow-md"
                  : "border border-transparent"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center mb-5 text-5xl ${
                    isActive ? "text-[#6FC14B]" : "text-[#7B3F00]"
                  }`}
                >
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold mb-3 text-[#2b2b2b]">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-[13.5px] leading-relaxed">
                  {card.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Responsive Adjustments */}
      <style>
        {`
          @media (max-width: 768px) {
            section {
              padding: 4rem 2rem;
            }
            h2 {
              font-size: 1.8rem !important;
            }
            p {
              font-size: 14px !important;
            }
          }
          @media (max-width: 480px) {
            h2 {
              font-size: 1.5rem !important;
            }
            p {
              font-size: 13px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default FeaturesSection;





















