import React, { useState, useEffect, useCallback } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { motion, AnimatePresence, Variants } from "framer-motion";
import apiClient from "@/apiClient";

interface Review {
  name: string;
  text: string;
  rating: number;
}

const CustomerReviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    apiClient
      .get("/feedback/approved")
      .then(res => {
        setReviews(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch approved reviews", err);
      })
      .finally(() => setLoading(false));
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
    const visibleCount = Math.min(itemsToShow, reviews.length);
    return reviews.slice(currentIndex, currentIndex + visibleCount);
  };

  const cardVariants: Variants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
    center: { 
      x: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
    },
    exit: (d: number) => ({ 
      x: d > 0 ? -50 : 50, 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.4 } 
    })
  };

  useEffect(() => {
    if (isPaused || reviews.length <= itemsToShow) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, reviews.length, itemsToShow]);

  if (loading) {
    return (
      <section className="bg-[#FAF9F6] py-24 text-center">
        <p className="text-[#5C2E0A] font-semibold">
          Loading reviews...
        </p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="bg-[#FAF9F6] py-24 text-center">
        <p className="text-[#5C2E0A] font-semibold">
          No reviews yet. Be the first to leave one!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F6] py-24 md:py-32 relative overflow-hidden w-full">
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="w-[90%] max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-8 h-[1px] bg-[#5C2E0A]/20" />
            <span className="text-[#8CB662] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
              Guest Experiences
            </span>
            <div className="w-8 h-[1px] bg-[#5C2E0A]/20" />
          </motion.div>

          <h2 
            className="text-4xl md:text-6xl font-bold text-[#5C2E0A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Words from our <br />
            <span className="italic font-medium text-[#8CB662]">Coffee Lovers</span>
          </h2>
        </div>

        <div 
          className="relative px-0 md:px-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {reviews.length > itemsToShow && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-white p-5 rounded-full shadow-xl text-[#5C2E0A] hidden xl:flex hover:bg-[#5C2E0A] hover:text-white transition-all duration-500 group"
              >
                <FaChevronLeft size={18} />
              </button>

              <button 
                onClick={nextSlide} 
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-white p-5 rounded-full shadow-xl text-[#5C2E0A] hidden xl:flex hover:bg-[#5C2E0A] hover:text-white transition-all duration-500 group"
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}

          <div className="flex justify-center gap-6 lg:gap-8 min-h-[380px] md:min-h-[420px]">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              {getVisibleReviews().map((review, i) => (
                <motion.div
                  key={`${currentIndex}-${review.name}-${i}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(92,46,10,0.08)] border border-[#5C2E0A]/5 flex flex-col items-center text-center relative"
                >
                  <FaQuoteLeft className="text-[#8CB662]/20 mb-8" size={32} />
                  
                  <p 
                    className="text-[#5C2E0A]/80 text-lg md:text-xl leading-relaxed italic mb-10 flex-grow"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "{review.text}"
                  </p>

                  <div className="flex flex-col items-center">
                    <div className="flex gap-1.5 mb-5 justify-center">
                      {[...Array(5)].map((_, idx) => (
                        <FaStar key={idx} className={idx < review.rating ? "text-[#D4AF37]" : "text-gray-100"} size={14} />
                      ))}
                    </div>
                    <h4 className="text-[#5C2E0A] font-bold text-lg tracking-tight uppercase">{review.name}</h4>
                    <p className="text-[#8CB662] text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Verified Guest</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {reviews.length > itemsToShow && (
            <div className="flex xl:hidden justify-center gap-4 mt-12">
              <button onClick={prevSlide} className="bg-white p-5 rounded-full shadow-md text-[#5C2E0A] active:scale-90 transition-all border border-[#5C2E0A]/5">
                <FaChevronLeft size={18} />
              </button>
              <button onClick={nextSlide} className="bg-white p-5 rounded-full shadow-md text-[#5C2E0A] active:scale-90 transition-all border border-[#5C2E0A]/5">
                <FaChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-16 gap-3">
          {reviews.length > 1 &&
            reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1.5 transition-all duration-700 rounded-full ${
                index === currentIndex 
                  ? "w-10 bg-[#8CB662]" 
                  : "w-2 bg-[#5C2E0A]/10 hover:bg-[#5C2E0A]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewSection;