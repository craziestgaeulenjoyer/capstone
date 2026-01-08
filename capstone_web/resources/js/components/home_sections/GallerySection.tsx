import React, { useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GallerySection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { id: 1, src: "/images/gallery1.jpg", span: "lg:row-span-2" }, 
    { id: 2, src: "/images/gallery2.jpg", span: "sm:col-span-2" }, 
    { id: 3, src: "/images/gallery7.jpg", span: "" },              
    { id: 4, src: "/images/gallery4.jpg", span: "lg:row-span-2" },
    { id: 5, src: "/images/gallery5.jpg", span: "sm:col-span-2" }, 
    { id: 6, src: "/images/gallery6.jpg", span: "" },              
    { id: 7, src: "/images/gallery3.jpg", span: "sm:col-span-2" },              
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / (width * 0.85)); 
      setActiveIndex(index);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section ref={ref} className="bg-[#faf7f2] py-12 md:py-20 px-4 sm:px-10 lg:px-20 overflow-hidden">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>


      <div className="max-w-6xl mx-auto text-center mb-8 md:mb-12">
        <motion.span className="text-[#8CB662] font-black tracking-[0.2em] uppercase text-[10px] md:text-xs block mb-2">
          Our Visual Story
        </motion.span>
        <motion.h2 
          className="text-3xl md:text-5xl font-bold text-[#4A4A4A] mb-3"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          A Taste of <span className="text-[#B47B50]">Mi Amore</span>
        </motion.h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base italic" style={{ fontFamily: "'Playfair Display', serif" }}>
          "Where every corner tells a story and every cup is crafted with love."
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div 
          ref={scrollRef}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 md:auto-rows-[180px] lg:auto-rows-[200px] gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-6 md:pb-0"
        >
          {images.map((img, i) => (
            <motion.div 
              key={img.id}
              variants={cardVariants}
              
              className={`relative flex-shrink-0 w-[85%] md:w-auto h-[350px] md:h-full snap-center overflow-hidden rounded-[2rem] border-[5px] border-white shadow-lg md:shadow-md group/card ${img.span}`}
            >
              <img 
                src={img.src} 
                alt={`Gallery ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
              />
              <div className="absolute inset-0 bg-black/5 group-hover/card:bg-transparent transition-colors duration-500" />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex md:hidden justify-center items-center gap-2 mt-4">
          {images.map((_, i) => (
            <div 
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                activeIndex === i ? "w-6 bg-[#8CB662]" : "w-1.5 bg-[#B47B50]/20"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="flex flex-col items-center justify-center mt-12 md:mt-16 gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-[#8E67AC]/20" />
          <span className="text-[#B47B50] font-extrabold text-[9px] tracking-[0.3em] uppercase opacity-60">
            Handcrafted with Heart
          </span>
          <div className="h-[1px] w-8 bg-[#8E67AC]/20" />
        </div>
      </motion.div>
    </section>
  );
};

export default GallerySection;