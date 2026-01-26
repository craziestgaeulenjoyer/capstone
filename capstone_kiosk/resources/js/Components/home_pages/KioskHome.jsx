import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { router } from "@inertiajs/react";

export default function KioskHome() {
  // Only the categories available in your kiosk menu
  const categories = [
    { id: "c1", name: "Popular", image: "/images/SpecialtyCoffee.png" },
    { id: "c2", name: "Coffees", image: "/images/Coffee.png" },
    { id: "c3", name: "Milktea", image: "/images/MilkTea.png" },
    { id: "c4", name: "Lemonade and Fruitti Juice", image: "/images/Lemonade_FruitJuices.png" },
    { id: "c5", name: "Premium Matcha", image: "/images/PremiumMatcha.png" },
    { id: "c6", name: "Foods", image: "/images/Snacks.png" },
  ];

  const handleCategoryClick = (categoryName) => {
    router.visit(`/kioskmenu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="h-screen w-screen bg-[#FDFCF8] font-serif flex flex-col overflow-hidden text-[#3D2317] select-none">
      
      {/* HEADER */}
      <header className="bg-white border-b border-[#8CB662]/20 px-8 py-6 flex justify-between items-center shrink-0 z-30 shadow-sm">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center text-[#8CB662] font-bold hover:opacity-70 transition-opacity"
        >
          <IoIosArrowBack size={24} /> 
          <span className="ml-2 tracking-[0.2em] uppercase text-[10px]">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-[0.3em] uppercase italic leading-none text-[#3D2317]">Mi Amore</h1>
          <p className="text-[8px] tracking-[0.4em] uppercase mt-1 text-[#8CB662]">Est. 2026 • Tablet Kiosk</p>
        </div>
        <div className="w-16" /> 
      </header>

      {/* CONTENT GRID */}
      <main className="flex-1 overflow-y-auto px-8 py-10 bg-[#FDFCF8]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex flex-col items-center">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#3D2317]">Browse Categories</h2>
            <div className="w-20 h-1 bg-[#8CB662] mt-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-10">
            {categories.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(item.name)}
                className="group cursor-pointer bg-white border border-[#8CB662]/10 shadow-sm flex flex-col items-center p-6 hover:border-[#8CB662]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square w-full mb-6 flex items-center justify-center p-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="w-full text-center">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#3D2317]">{item.name}</h3>
                  <div className="mt-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-bold text-[#8CB662] uppercase tracking-widest">Select Category</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#3D2317] p-4 text-center border-t-4 border-[#8CB662]">
        <p className="text-[9px] uppercase font-bold text-[#8CB662] tracking-[0.4em]">Please tap your selection above</p>
      </footer>
    </div>
  );
}
