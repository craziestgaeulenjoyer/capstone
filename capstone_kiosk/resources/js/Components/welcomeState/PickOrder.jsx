import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function PickOrder() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);

   
    localStorage.setItem("order_type", option);


    router.visit("/kioskhome");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">

      {/* --- Mi Amore Logo --- */}
      <div className="mb-2 mt-[-170px]">
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Mi Amore Logo"
          className="w-[150px] mx-auto"
        />
      </div>

      {/* --- Question --- */}
      <h2 className="text-gray-800 text-center text-lg font-medium mb-8">
        What would you like to{" "}
        <span className="text-[#76B13A] font-semibold">sip & eat</span> today?
      </h2>

      {/* --- Option Buttons --- */}
      <div className="flex space-x-8">

        {/* Dine In */}
        <button
          className={`flex flex-col items-center justify-center w-36 h-44 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ${
            selectedOption === "dinein"
              ? "bg-[#76B13A] text-white"
              : "bg-gray-100 text-[#76B13A]"
          }`}
          onClick={() => handleSelect("dinein")}
        >
          <img src="/images/dine.png" alt="Dine In" className="w-16 h-16 mb-4" />
          <span className="text-lg font-semibold">Dine In</span>
        </button>

        {/* Take Out */}
        <button
          className={`flex flex-col items-center justify-center w-36 h-44 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ${
            selectedOption === "takeout"
              ? "bg-[#76B13A] text-white"
              : "bg-gray-100 text-[#76B13A]"
          }`}
          onClick={() => handleSelect("takeout")}
        >
          <img src="/images/takeout.png" alt="Take Out" className="w-16 h-16 mb-4" />
          <span className="text-lg font-semibold">Take Out</span>
        </button>

      </div>

      {/* --- Decorative Bottom Curve --- */}
      <div
        className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2 
                   w-full h-[260px] bg-[#8CB662] rounded-t-[90%]"
      />
    </div>
  );
}
