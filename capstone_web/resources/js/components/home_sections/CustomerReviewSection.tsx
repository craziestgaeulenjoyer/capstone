import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import Leaf from "/public/images/leaf-icon.png";
import { motion } from "framer-motion";

interface Review {
  name: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "James Miller",
    text:
      "The cozy atmosphere is perfect for unwinding. I love their specialty lattes! The only downside is that it's a bit crowded on weekends.",
    rating: 4.5,
  },
  {
    name: "Olivia Harris",
    text:
      "Best café experience I've had! The cappuccino is rich and smooth, and the staff are always welcoming. It’s my new favorite spot!",
    rating: 5,
  },
  {
    name: "Noah Scott",
    text:
      "Such a great vibe! Their avocado toast and latte are delicious. Perfect spot to meet up with friends or do some work.",
    rating: 4.6,
  },
  {
    name: "Ava Carter",
    text:
      "Loved everything about this place! Their matcha latte is superb and the staff are very attentive. A must-visit!",
    rating: 4.9,
  },
  {
    name: "Mason Mitchell",
    text:
      "Great atmosphere for hanging out or getting work done. The cappuccinos are strong and the pastries are on point.",
    rating: 4.8,
  },
  {
    name: "Isabella King",
    text:
      "A perfect place to relax and sip on their signature brews. They also have amazing gluten-free options!",
    rating: 5,
  },
  {
    name: "Elijah Turner",
    text:
      "Cozy, chill vibes, and delicious coffee. A little on the pricier side, but the quality is worth it.",
    rating: 4.7,
  },
  {
    name: "Charlotte Moore",
    text:
      "Best café in the neighborhood! Their coffee is always fresh, and the staff is friendly and helpful.",
    rating: 5,
  },
];

const CustomerReviewSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsPerSlide = 4;
  const totalSlides = Math.ceil(reviews.length / cardsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="bg-[#bfe6f5] py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 relative">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            <span className="text-[#41E2DA]">What</span>
            <span className="text-black">our</span>
            <span className="text-[#76B13A]">Customers</span>
            <span className="text-black">say!</span>
            <img
              src={Leaf}
              alt="Leaf Icon"
              className="inline-block w-15 h-15 ml-2 absolute top-[-20px] right-[350px]"
            />
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full justify-center transition-transform duration-700 ease-in-out">
          <FaQuoteLeft className="text-5xl text-gray-400 absolute top-[-50px] left-[-30px] transform -translate-x-4 -translate-y-4 z-10" />
          <FaQuoteRight className="text-5xl text-gray-400 absolute bottom-[-50px] right-[-30px] transform translate-x-4 translate-y-4 z-10" />

          {reviews
            .slice(currentSlide * cardsPerSlide, (currentSlide + 1) * cardsPerSlide)
            .map((review, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 relative flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <FaQuoteLeft className="text-xl text-[#6D9C40] absolute left-4 top-4 z-10" />
                <p className="text-sm text-gray-700 mt-6 mb-6 px-2 text-center">
                  {review.text}
                </p>
                <FaQuoteRight className="text-xl text-[#76B13A] absolute right-4 bottom-4 z-10" />
                <div className="border-t border-gray-300 pt-3 text-center">
                  <p className="font-bold text-black text-sm mb-1">{review.name}</p>
                  <div className="flex items-center justify-center gap-1 text-[#FFB800] text-sm">
                    {[...Array(Math.floor(review.rating))].map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                    <span className="ml-1 text-black">({review.rating}/5)</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 rounded-full cursor-pointer ${
                index === currentSlide ? "bg-[#6D9C40]" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewSection;









