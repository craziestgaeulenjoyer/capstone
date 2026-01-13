// resources/js/Components/MenuHeader.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PopularItems from './PopularItems';
import CoffeeItems from './CoffeeItems';
import MilkTeaItems from './MilkTeaItems';
import FruiteaJuiceItems from './FruiteaJuiceItems';
import FoodItems from './FoodItems';
import PremiumMatcha from './PremiumMatchaItems';

const MenuHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Popular');
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = ['Popular', 'Coffees', 'Milktea', 'Lemonade & Fruitti Juice', 'Premium Matcha', 'Foods'];

  const handleTabClick = (tab: string, e: React.MouseEvent) => {
    setActiveTab(tab);
    const target = e.currentTarget as HTMLElement;
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen"> 
      
      {/* Sticky Navigation */}
      <nav className="w-full pt-16 md:pt-24 lg:pt-28 pb-0 sticky top-0 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#5C2E0A]/10 z-40">
        <div className="max-w-600 mx-auto px-4 md:px-12 relative">
            <div 
              ref={scrollRef}
              className="flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar gap-6 md:gap-10 xl:gap-20 px-2"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={(e) => handleTabClick(tab, e)}
                    className={`group relative whitespace-nowrap pb-4 text-[10px] sm:text-xs xl:text-sm 2xl:text-base font-bold tracking-widest transition-all duration-300 shrink-0 uppercase ${
                      isActive ? 'text-[#5C2E0A]' : 'text-[#5C2E0A]/40 hover:text-[#5C2E0A]/70'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span className="relative z-20">{tab}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-t-full z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
        </div>
      </nav>

      <div className="max-w-600 mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 mt-4 md:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="relative rounded-3xl md:rounded-[3rem] xl:rounded-[4rem] overflow-hidden shadow-2xl border border-[#5C2E0A]/10 bg-[#E8E7E1]"
          >
            {/* IMAGE SECTION */}
            <div className="relative h-[45vh] sm:h-[55vh] lg:h-[60vh] xl:h-[65vh] 2xl:h-[75vh] min-h-100 w-full overflow-hidden">
              <motion.img
                src="images/MENU.png"
                alt="Menu Banner"
                className="w-full h-full object-cover object-[85%_center] md:object-[right_30%_center] lg:object-[right_20%_center] xl:object-[right_15%_center]"
              />
              {/* Refined Gradient Overlay for Laptop Visibility */}
              <div className="absolute inset-0 bg-linear-to-t from-[#FAF9F6] via-[#FAF9F6]/20 to-transparent md:bg-linear-to-r md:from-[#FAF9F6] md:via-[#FAF9F6]/50 md:to-transparent z-10" />
            </div>

            {/* TEXT OVERLAY - Laptop Optimized */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center p-6 sm:p-12 lg:p-16 xl:p-24 2xl:p-32 pointer-events-none pb-12 md:pb-0">
              <div className="max-w-full sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-4xl pointer-events-auto">
                <motion.span 
                  className="text-[#8CB662] font-black tracking-[0.2em] uppercase text-[8px] sm:text-[10px] lg:text-[12px] xl:text-sm block mb-2"
                >
                  Mi Amore Signature
                </motion.span>
                
                <motion.h2
                  className="text-3xl sm:text-5xl lg:text-5xl xl:text-7xl 2xl:text-9xl text-[#3d230d] mb-4 md:mb-6 leading-[1.1] font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Taste the <br />
                  <span className="italic font-normal">Masterpiece</span>
                </motion.h2>
                
                <motion.p 
                  /* Laptop Fix: max-w-[350px] para hindi lumagpas sa kalahati ng screen */
                  className="text-[#5C2E0A]/90 text-[10px] sm:text-sm lg:text-base xl:text-xl 2xl:text-3xl font-medium leading-relaxed max-w-45 sm:max-w-75 lg:max-w-100 xl:max-w-125"
                >
                  Indulge in our carefully curated selection of premium blends and artisanal treats.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- GRID --- */}
        <div className="py-10 md:py-20 xl:py-28">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeTab}-content`}>
              {activeTab === 'Popular' && <PopularItems />}
              {activeTab === 'Coffees' && <CoffeeItems />}
              {activeTab === 'Milktea' && <MilkTeaItems />}
              {activeTab === 'Lemonade & Fruitti Juice' && <FruiteaJuiceItems />}
              {activeTab === 'Premium Matcha' && <PremiumMatcha />}
              {activeTab === 'Foods' && <FoodItems />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuHeader;