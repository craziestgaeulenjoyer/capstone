import React, { useState, useEffect, useCallback } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Review {
  name: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  { name: "James Miller", text: "The cozy atmosphere is perfect for unwinding. I love their specialty lattes!", rating: 5 },
  { name: "Olivia Harris", text: "Best café experience I've had! The cappuccino is rich and smooth, and the staff are always welcoming.", rating: 5 },
  { name: "Noah Scott", text: "Such a great vibe! Their avocado toast and latte are delicious. Perfect spot to work.", rating: 4 },
  { name: "Ava Carter", text: "Loved everything about this place! Their matcha latte is superb and the staff are very attentive.", rating: 5 },
  { name: "Mason Mitchell", text: "Great atmosphere for hanging out or getting work done. The pastries are on point.", rating: 5 },
  { name: "Isabella King", text: "A perfect place to relax and sip on their signature brews. Amazing options!", rating: 5 },
];

const CustomerReviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsToShow(1);     
      else if (width < 1280) setItemsToShow(2); 
      else setItemsToShow(3);                   
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = reviews.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < itemsToShow; i++) {
      result.push(reviews[(currentIndex + i) % totalSlides]);
    }
    return result;
  };

  const cardVariants: Variants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.9, transition: { duration: 0.3 } })
  };

  return (
    <section className="bg-[#fdf8f3] py-20 md:py-32 relative overflow-hidden w-full">
      <div className="w-[92%] max-w-[1600px] mx-auto relative">
        
        <div className="text-center mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#9D7353] font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
          >
            Testimonials
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold text-[#4a3427]" style={{ fontFamily: "'Kalam', cursive" }}>
            <span className="text-[#76B13A]">Words</span> from our <span className="text-[#B13A3A]">Coffee</span> Lovers
          </h2>
          <div className="w-24 h-1 bg-[#76B13A] mx-auto mt-6 rounded-full opacity-50" />
        </div>

        <div 
          className="relative px-2 md:px-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
        >
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg text-[#9D7353] hidden md:flex hover:bg-[#9D7353] hover:text-white transition-all">
            <FaChevronLeft size={20} />
          </button>

          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg text-[#9D7353] hidden md:flex hover:bg-[#9D7353] hover:text-white transition-all">
            <FaChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-6 md:gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              {getVisibleReviews().map((review, i) => (
                <motion.div
                  key={`${currentIndex}-${review.name}-${i}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(157,115,83,0.1)] border border-gray-50 flex flex-col items-center text-center relative"
                >
                  <div className="text-[#76B13A] mb-6 opacity-20">
                    <FaQuoteLeft size={40} />
                  </div>
                  
                  <p className="text-[#5c4a3e] text-lg md:text-xl leading-relaxed font-medium italic mb-8" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
                    "{review.text}"
                  </p>

                  <div className="mt-auto">
                    <div className="flex gap-1 mb-4 justify-center">
                      {[...Array(5)].map((_, idx) => (
                        <FaStar key={idx} className={idx < review.rating ? "text-[#FFB800]" : "text-gray-200"} size={18} />
                      ))}
                    </div>
                    <h4 className="text-[#4a3427] font-black text-lg uppercase tracking-tighter">{review.name}</h4>
                    <p className="text-[#76B13A] text-xs font-bold mt-1 uppercase tracking-widest">Verified Guest</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex md:hidden justify-between mt-8 px-4">
            <button onClick={prevSlide} className="bg-white p-4 rounded-2xl shadow-md text-[#9D7353] active:scale-90 transition-transform">
              <FaChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="bg-white p-4 rounded-2xl shadow-md text-[#9D7353] active:scale-90 transition-transform">
              <FaChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-12 bg-[#9D7353]" 
                  : "w-3 bg-[#9D7353]/20 hover:bg-[#9D7353]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewSection;