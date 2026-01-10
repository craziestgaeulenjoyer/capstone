import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Coffee, Truck, Sparkles, PartyPopper } from "lucide-react"; 

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const cards = [
    {
      icon: <Coffee size={28} strokeWidth={1.2} />, 
      title: "Artisanal Blends",
      text: "Crafted with care, our coffee and food are made to comfort. From bold brews to fresh bites, there's love in every sip.",
      color: "#5C2E0A", 
      bg: "bg-[#FDFBF7]",
    },
    {
      icon: <PartyPopper size={28} strokeWidth={1.2} />, 
      title: "Event Catering",
      text: "Book our mobile cart for your special days! We bring the full Mi Amore experience—coffee and snacks—to your venue.",
      color: "#8CB662", 
      bg: "bg-[#F9FAF6]",
    },
    {
      icon: <Truck size={28} strokeWidth={1.2} />, 
      title: "Express Delivery",
      text: "Bringing amore to your doorstep! Order your favorites and enjoy fast, reliable delivery perfect for cozy mornings.",
      color: "#5C2E0A", 
      bg: "bg-[#FDFBF7]",
    },
    {
      icon: <Sparkles size={28} strokeWidth={1.2} />, 
      title: "Loyalty Rewards",
      text: "Sip, earn, repeat. Collect points with every visit and get rewarded for loving Mi Amore as much as we love serving you.",
      color: "#8CB662", 
      bg: "bg-[#F9FAF6]",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#FAF9F6] py-20 px-6 md:py-28 lg:py-36 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-4xl mx-auto mb-16 md:mb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6"
        >
          <div className="w-6 md:w-8 h-[1px] bg-[#5C2E0A]/20" />
          <span className="text-[#8CB662] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[9px] md:text-xs">
            Our Premium Services
          </span>
          <div className="w-6 md:w-8 h-[1px] bg-[#5C2E0A]/20" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E0A] mb-6 md:mb-8 leading-[1.1]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Discover. Delight. <br />
          <span className="italic text-[#8CB662]/80 font-medium">Mi Amore Moments.</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-16 md:w-24 h-[1px] bg-[#5C2E0A]/10 mx-auto"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -12 }}
            className={`group relative ${card.bg} p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-[#5C2E0A]/5 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(92,46,10,0.12)] transition-all duration-700 flex flex-col items-center text-center h-full`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-32 h-1 bg-gradient-to-r from-transparent via-[#8CB662]/30 to-transparent transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center h-full">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 mb-8 rounded-full flex items-center justify-center transition-all duration-700 group-hover:bg-white group-hover:shadow-lg bg-transparent border border-[#5C2E0A]/10"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>

              <h3 
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#5C2E0A] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {card.title}
              </h3>
              
              <div className="w-8 h-[1px] bg-[#5C2E0A]/10 mb-6 group-hover:w-16 group-hover:bg-[#8CB662] transition-all duration-700" />

              <p className="text-[#5C2E0A]/60 leading-relaxed font-medium text-sm md:text-base px-2">
                {card.text}
              </p>
            </div>

            <div 
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-[0.04] transition-all duration-1000 group-hover:scale-150 pointer-events-none"
              style={{ backgroundColor: card.color }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;