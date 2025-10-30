import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function ProductFeature() {
  const [activeSlide, setActiveSlide] = useState(0);

  const drinks = [
    {
      id: 0,
      imageSrc: "/images/machaIchigo.jpg",
      title: "Matcha Ichigo",
      description:
        "Earthy matcha meets sweet strawberries for a refreshing twist.",
    },
    {
      id: 1,
      imageSrc: "/images/peachIceTea.jpg",
      title: "Peach Iced Tea",
      description:
        "A cool, fruity blend of peach and tea — perfectly chilled for any mood.",
    },
  ];

  const currentDrink = drinks[activeSlide];

   useEffect(() => {
    if (currentDrink.title === "Peach Iced Tea") {
      const timer = setTimeout(() => {
        router.visit("/pickorder"); // <-- redirect to your route
      }, 3000);

      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [currentDrink]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden transition-all duration-700">
      {/* --- Top Logo --- */}
      <img
        src="/images/MiAmoreWelcome.png"
        alt="Mi Amore Logo"
        className="absolute top-[-0.5rem] right-[1.5rem] w-[90px]"
      />

    
    {/* --- Drink Section --- */}
   <div className="flex flex-col items-center text-center mt-[-70px] space-y-2">
  {/* Oblong Frame */}
  <div className="relative flex items-center justify-center w-[260px] h-[310px] rounded-[55%/40%] overflow-hidden">
    {/* Product Image — fills the frame */}
    <img
      src={currentDrink.imageSrc}
      alt={currentDrink.title}
      className="w-full h-full object-cover transition-all duration-700"
    />
  </div>

        {/* Pagination Dots */}
        <div className="flex space-x-3 mt-2 mb-1">
          {drinks.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSlide === index ? "bg-[#76B13A]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* --- Text Section --- */}
        <h2 className="text-[#76B13A] font-bold text-lg mb-4">
          Fresh Flavors Are Here!
        </h2>

        <p className="text-gray-600 text-sm mt-0 mb-8 max-w-xs leading-snug">
          {currentDrink.description}
        </p>
      </div>

      {/* --- Decorative Bottom Half-Circle --- */}
      <div
        className="absolute bottom-[-220px] left-1/2 transform -translate-x-1/2
                   w-[100%] h-[300px] bg-[#8CB662] rounded-t-[90%]"
      />
    </div>
  );
}
