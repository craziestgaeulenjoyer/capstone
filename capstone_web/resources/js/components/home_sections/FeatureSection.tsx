import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Coffee, Truck, Sparkles, PartyPopper } from "lucide-react"; 

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const cards = [
    {
      icon: <Coffee size={40} strokeWidth={1} />, 
      title: "Artisanal Blends",
      subtitle: "The Heart of Mi Amore",
      text: "Every bean is a promise of quality. We roast in small batches to ensure that the soul of the coffee reaches your cup with unrivaled freshness.",
      color: "#5C2E0A", 
      accent: "#C5A059"
    },
    {
      icon: <PartyPopper size={40} strokeWidth={1} />, 
      title: "Event Catering",
      subtitle: "Celebrations Redefined",
      text: "Transform your gatherings with our signature mobile bar. We bring the elegance of a café straight to your most cherished milestones.",
      color: "#4A5D45", 
      accent: "#8CB662"
    },
    {
      icon: <Truck size={40} strokeWidth={1} />, 
      title: "Express Delivery",
      subtitle: "Amore at Your Door",
      text: "Crafted in our kitchen, enjoyed in yours. Experience the same premium warmth delivered with speed and meticulous care.",
      color: "#5C2E0A", 
      accent: "#C5A059"
    },
    {
      icon: <Sparkles size={40} strokeWidth={1} />, 
      title: "Loyalty Rewards",
      subtitle: "A Token of Gratitude",
      text: "You are part of our family. Earn points with every visit and unlock exclusive experiences designed specifically for our regulars.",
      color: "#4A5D45", 
      accent: "#8CB662"
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#FAF9F6] py-28 px-6 md:py-40 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />
      
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[15vw] font-serif italic text-[#3d230d]/[0.02] whitespace-nowrap pointer-events-none select-none">
        Authentic Experience
      </div>

      <div className="max-w-6xl mx-auto mb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={inView ? { opacity: 1, letterSpacing: "0.5em" } : {}}
          transition={{ duration: 1.5 }}
          className="text-[#8CB662] font-black uppercase text-[10px] md:text-xs mb-6"
        >
          &bull; The Mi Amore Way &bull;
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif italic text-[#3d230d] leading-tight"
        >
          Crafting <span className="text-[#C5A059] not-italic font-bold">Connections.</span>
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 lg:gap-8"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative h-[450px] md:h-[500px] cursor-default"
          >
            <div className="absolute inset-0 bg-white rounded-[4rem] overflow-hidden border border-[#3d230d]/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out">
              
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ background: `radial-gradient(circle at top right, ${card.accent}10, transparent)` }}
              />

              <div className="relative h-full p-10 flex flex-col items-center justify-center text-center">
                
                <div className="relative mb-12">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-[#FAF9F6] border border-[#3d230d]/5 flex items-center justify-center text-[#3d230d] group-hover:text-[#C5A059] group-hover:border-[#C5A059]/30 group-hover:bg-white shadow-sm group-hover:shadow-2xl transition-all duration-700"
                  >
                    {card.icon}
                  </motion.div>
                  <div className="absolute inset-[-8px] rounded-full border border-dashed border-[#C5A059]/20 group-hover:rotate-180 transition-all duration-[2s]" />
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 block">
                    {card.subtitle}
                  </span>
                  
                  <h3 className="text-3xl font-serif italic text-[#3d230d] group-hover:scale-110 transition-transform duration-700">
                    {card.title}
                  </h3>

                  <div className="w-8 h-[1px] bg-[#3d230d]/10 mx-auto group-hover:w-20 group-hover:bg-[#C5A059] transition-all duration-700" />

                  <p className="text-[#4A5D45]/60 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    {card.text}
                  </p>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-0 group-hover:h-12 bg-gradient-to-b from-[#C5A059] to-transparent transition-all duration-1000" />
              </div>
            </div>

            <div className="absolute -top-6 -right-4 text-8xl font-serif italic text-[#3d230d]/[0.03] group-hover:text-[#C5A059]/10 transition-colors duration-700 select-none z-0">
              0{index + 1}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-20 flex justify-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#C5A059] to-transparent opacity-30" />
      </div>
    </section>
  );
};

export default FeaturesSection;