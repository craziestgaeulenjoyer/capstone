import React, { useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GallerySection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { id: 1, src: "/images/gallery1.jpg", span: "lg:row-span-2 lg:col-span-1" }, 
    { id: 2, src: "/images/gallery2.jpg", span: "md:col-span-2 lg:col-span-2" }, 
    { id: 3, src: "/images/gallery7.jpg", span: "lg:col-span-1" },              
    { id: 4, src: "/images/gallery4.jpg", span: "lg:row-span-2 lg:col-span-1" },
    { id: 5, src: "/images/gallery5.jpg", span: "md:col-span-2 lg:col-span-2" }, 
    { id: 6, src: "/images/gallery6.jpg", span: "lg:col-span-1" },              
    { id: 7, src: "/images/gallery3.jpg", span: "md:col-span-2 lg:col-span-2" },              
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveIndex(index);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const } 
    },
  };

  return (
    <section ref={ref} className="bg-[#FAF9F6] py-20 md:py-32 px-6 lg:px-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="w-8 h-[1px] bg-[#5C2E0A]/20" />
          <span className="text-[#8CB662] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
            Our Visual Journal
          </span>
          <div className="w-8 h-[1px] bg-[#5C2E0A]/20" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-[#5C2E0A] mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          A Taste of <span className="italic font-medium text-[#8CB662]">Mi Amore</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-[#5C2E0A]/60 max-w-2xl mx-auto text-base md:text-lg italic font-medium"
        >
          "Where every corner tells a story and every cup is crafted with heart."
        </motion.p>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div 
          ref={scrollRef}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 md:auto-rows-[220px] lg:auto-rows-[240px] gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-10 md:pb-0"
        >
          {images.map((img, i) => (
            <motion.div 
              key={img.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className={`relative flex-shrink-0 w-[85vw] md:w-auto h-[450px] md:h-full snap-center overflow-hidden rounded-[2.5rem] border-[10px] border-white shadow-[0_20px_40px_-15px_rgba(92,46,10,0.15)] group/card ${img.span}`}
            >
              <img 
                src={img.src} 
                alt={`Gallery image ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/card:scale-110" 
              />
              
              <div className="absolute inset-0 bg-[#5C2E0A]/5 group-hover/card:bg-transparent transition-colors duration-700" />
              
              <div className="absolute inset-4 border border-white/20 pointer-events-none rounded-[1.5rem]" />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex md:hidden justify-center items-center gap-3 mt-6">
          {images.map((_, i) => (
            <motion.div 
              key={i}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeIndex === i ? "w-8 bg-[#8CB662]" : "w-2 bg-[#5C2E0A]/10"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center justify-center mt-20 md:mt-28"
      >
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-[#5C2E0A]/10" />
          <span className="text-[#5C2E0A]/40 font-bold text-[10px] tracking-[0.4em] uppercase">
            Artisan Quality Since 2019
          </span>
          <div className="h-[1px] w-12 bg-[#5C2E0A]/10" />
        </div>
      </motion.div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default GallerySection;