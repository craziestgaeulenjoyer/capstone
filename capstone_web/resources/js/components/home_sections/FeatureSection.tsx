import React from "react";
import { motion, Variants, TargetAndTransition } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GiCoffeeBeans, GiTruck, GiSwipeCard } from "react-icons/gi";

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const cards = [
    {
      icon: <GiCoffeeBeans />,
      title: "TYPES OF COFFEE",
      text: "Crafted with care, our coffee and food are made to comfort. From bold brews to fresh bites, there's love in every sip.",
      color: "#E0A478", 
      gradient: "from-[#E0A478] to-[#fdceac]",
    },
    {
      icon: <GiTruck />,
      title: "FAST DELIVERY",
      text: "Bringing amore to your doorstep! Order your favorites and enjoy fast, reliable delivery perfect for cozy mornings.",
      color: "#8CB662", 
      gradient: "from-[#8CB662] to-[#76a14d]",
    },
    {
      icon: <GiSwipeCard />,
      title: "EARN POINTS",
      text: "Sip, earn, repeat. Collect points with every visit and get rewarded for loving Mi Amore as much as we love serving you.",
      color: "#8CC0BE", 
      gradient: "from-[#8CC0BE] to-[#76a14d]",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingAnimation: TargetAndTransition = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#faf7f2] py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-6xl font-bold text-[#2b2b2b] mb-6 leading-tight"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          Discover. Delight. <span className="text-[#8CB662]">Mi Amore.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-gray-500 text-lg md:text-xl italic max-w-2xl mx-auto"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          "Where every blend is a masterpiece and every service is an act of love."
        </motion.p>
      </div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="group relative bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col items-center text-center transition-all duration-500 min-h-[420px]"
          >
            <div className="p-10 pt-12 flex flex-col items-center z-10">
              <motion.div
                animate={floatingAnimation}
                className="text-5xl mb-6 transition-transform duration-500 group-hover:scale-110"
                style={{ color: card.color }}
              >
                {card.icon}
              </motion.div>

              <h3 className="text-xl font-black mb-4 text-[#2b2b2b] tracking-wide uppercase">
                {card.title}
              </h3>
            </div>

            <div className={`relative mt-auto w-full h-56 bg-gradient-to-br ${card.gradient} transition-transform duration-500 group-hover:scale-105`}>
              
              <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] translate-y-[-99%]">
                <svg
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                  className="h-20 w-full"
                >
                  <path
                    d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                    style={{ stroke: "none", fill: card.color }}
                  ></path>
                </svg>
                <svg
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                  className="h-20 w-full absolute top-0 left-0 opacity-30"
                >
                  <path
                    d="M0.00,49.98 C150.00,150.00 271.49,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                    style={{ stroke: "none", fill: "#ffffff" }}
                  ></path>
                </svg>
              </div>

              <div className="relative z-10 p-8 pt-4">
                <p className="text-white/95 leading-relaxed text-sm md:text-[15px] font-medium">
                  {card.text}
                </p>
                
                <div className="mt-6 text-white/50 text-2xl group-hover:text-white transition-colors">
                  <span className="animate-bounce block">↓</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;