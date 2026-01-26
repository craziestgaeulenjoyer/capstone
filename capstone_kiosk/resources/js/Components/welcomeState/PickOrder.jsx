import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { Utensils, ShoppingBag, Package  } from "lucide-react"; 

export default function PickOrder() {
  const [selectedOption, setSelectedOption] = useState(null);


 const handleSelect = (option) => {
  setSelectedOption(option);

  let fulfillmentMethod = "";
  let redirectTo = "/kioskhome";

  if (option === "dinein") fulfillmentMethod = "Dine In";
  if (option === "takeout") fulfillmentMethod = "Take out";
  if (option === "bulk") {
    fulfillmentMethod = "Bulk Order";
    redirectTo = "/ordernumber";
  }

  localStorage.setItem("fulfillment_method", fulfillmentMethod);

  setTimeout(() => {
    router.visit(redirectTo);
  }, 500);
};


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] overflow-hidden p-6 md:p-12">
      
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" 
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} 
      />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-20 mb-12 text-center"
      >
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Mi Amore Logo"
          className="w-32 md:w-48 mx-auto mb-4 drop-shadow-md"
        />
        <div className="h-[1px] w-24 bg-[#8CB662] mx-auto opacity-30" />
      </motion.div>

      <div className="z-20 text-center mb-16 px-4">
        <h2 className="text-[#3D2317] text-3xl md:text-6xl font-black italic font-serif uppercase leading-tight tracking-tighter">
          Where will you <br /> 
          <span className="text-[#7C8B7C]">enjoy your coffee?</span>
        </h2>
      </div>

      <div className="z-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-5xl">
        
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect("dinein")}
          className={`relative group flex flex-col items-center justify-center p-12 md:p-20 rounded-[50px] transition-all duration-500 border-2 overflow-hidden ${
            selectedOption === "dinein"
              ? "bg-[#3D2317] border-[#8CB662] shadow-[0_20px_50px_rgba(61,35,23,0.3)]"
              : "bg-white border-[#3D2317]/5 shadow-sm hover:border-[#8CB662]/40"
          }`}
        >
          <AnimatePresence>
            {selectedOption === "dinein" && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-white"
              />
            )}
          </AnimatePresence>

          <div className={`p-8 rounded-full mb-8 transition-all duration-500 ${
            selectedOption === "dinein" ? "bg-[#8CB662] scale-110" : "bg-[#F2F4F2] group-hover:bg-[#8CB662]/10"
          }`}>
            <Utensils 
              size={56} 
              className={selectedOption === "dinein" ? "text-white" : "text-[#8CB662]"} 
              strokeWidth={1}
            />
          </div>
          
          <span className={`text-2xl md:text-4xl font-bold italic uppercase tracking-widest transition-colors ${
            selectedOption === "dinein" ? "text-white" : "text-[#3D2317]"
          }`}>
            Dine In
          </span>
          <p className={`text-[10px] md:text-xs uppercase mt-3 tracking-[0.3em] font-bold ${
            selectedOption === "dinein" ? "text-[#8CB662]" : "text-[#3D2317]/30"
          }`}>
            Cozy & Warm
          </p>
        </motion.button>

        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect("takeout")}
          className={`relative group flex flex-col items-center justify-center p-12 md:p-20 rounded-[50px] transition-all duration-500 border-2 overflow-hidden ${
            selectedOption === "takeout"
              ? "bg-[#3D2317] border-[#8CB662] shadow-[0_20px_50px_rgba(61,35,23,0.3)]"
              : "bg-white border-[#3D2317]/5 shadow-sm hover:border-[#8CB662]/40"
          }`}
        >
          <AnimatePresence>
            {selectedOption === "takeout" && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-white"
              />
            )}
          </AnimatePresence>

          <div className={`p-8 rounded-full mb-8 transition-all duration-500 ${
            selectedOption === "takeout" ? "bg-[#8CB662] scale-110" : "bg-[#F2F4F2] group-hover:bg-[#8CB662]/10"
          }`}>
            <ShoppingBag 
              size={56} 
              className={selectedOption === "takeout" ? "text-white" : "text-[#8CB662]"} 
              strokeWidth={1}
            />
          </div>
          
          <span className={`text-2xl md:text-4xl font-bold italic uppercase tracking-widest transition-colors ${
            selectedOption === "takeout" ? "text-white" : "text-[#3D2317]"
          }`}>
            Take Out
          </span>
          <p className={`text-[10px] md:text-xs uppercase mt-3 tracking-[0.3em] font-bold ${
            selectedOption === "takeout" ? "text-[#8CB662]" : "text-[#3D2317]/30"
          }`}>
            Grab & Go
          </p>
        </motion.button>
        <motion.button
  whileHover={{ y: -8, scale: 1.02 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleSelect("bulk")}
 className={`relative group flex flex-col items-center justify-center p-12 md:p-20 rounded-[50px] transition-all duration-500 border-2 overflow-hidden md:col-span-2 mx-auto ${

    selectedOption === "bulk"
      ? "bg-[#3D2317] border-[#8CB662] shadow-[0_20px_50px_rgba(61,35,23,0.3)]"
      : "bg-white border-[#3D2317]/5 shadow-sm hover:border-[#8CB662]/40"
  }`}
>
  <AnimatePresence>
    {selectedOption === "bulk" && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0 bg-white"
      />
    )}
  </AnimatePresence>

  <div className={`p-8 rounded-full mb-8 transition-all duration-500 ${
    selectedOption === "bulk"
      ? "bg-[#8CB662] scale-110"
      : "bg-[#F2F4F2] group-hover:bg-[#8CB662]/10"
  }`}>
    <Package
      size={56}
      className={selectedOption === "bulk" ? "text-white" : "text-[#8CB662]"}
      strokeWidth={1}
    />
  </div>

  <span className={`text-2xl md:text-4xl font-bold italic uppercase tracking-widest transition-colors ${
    selectedOption === "bulk" ? "text-white" : "text-[#3D2317]"
  }`}>
    Bulk Order
  </span>

  <p className={`text-[10px] md:text-xs uppercase mt-3 tracking-[0.3em] font-bold ${
    selectedOption === "bulk" ? "text-[#8CB662]" : "text-[#3D2317]/30"
  }`}>
    Events & Groups
  </p>
</motion.button>


      </div>

      <footer className="z-20 mt-16 md:mt-24">
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-[#3D2317]" />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-[#3D2317] font-black">
            Select Your Experience
          </p>
        </motion.div>
      </footer>

      {/* --- BACKGROUND  --- */}
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8CB662] opacity-5 rounded-full blur-3xl z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3D2317] opacity-[0.03] rounded-full blur-3xl z-0" />
    </div>
  );
}