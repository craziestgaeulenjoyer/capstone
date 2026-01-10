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

  return (
    <div className="w-full bg-[#FAF9F6]"> 
      
      <nav className="w-full pt-24 md:pt-32 pb-4 md:pb-8 sticky top-0 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#5C2E0A]/5 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div 
              ref={scrollRef}
              className="flex md:grid md:grid-cols-3 lg:grid-cols-6 overflow-x-auto no-scrollbar gap-2 md:gap-4 items-center justify-start md:justify-center"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`group relative whitespace-nowrap md:whitespace-normal px-6 py-3 rounded-full text-xs md:text-sm font-bold tracking-wide flex items-center justify-center min-w-fit md:min-w-0 transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-[#5C2E0A]/50 hover:text-[#5C2E0A]'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span className="relative z-20 text-center transition-transform duration-300 group-active:scale-90">
                      {tab}
                    </span>
                    
                    {!isActive && (
                      <motion.div 
                        className="absolute inset-0 bg-[#5C2E0A]/5 rounded-full z-0"
                        layoutId="hoverBg"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {isActive && (
                      <motion.div 
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#5C2E0A] rounded-full z-10 shadow-xl shadow-[#5C2E0A]/20"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 1,
                        }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-[#5C2E0A]/10 group"
          >
            <div className="relative h-[45vh] sm:h-[50vh] lg:h-[65vh] w-full overflow-hidden bg-[#E8E7E1]">
              <motion.img
                src="images/MENU.png"
                alt="Menu Banner"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full object-cover object-right sm:object-center lg:object-[center_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/30 to-transparent md:bg-gradient-to-r md:from-[#FAF9F6] md:via-[#FAF9F6]/40 md:to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end md:items-center p-6 sm:p-12 lg:p-20">
              <div className="max-w-xs sm:max-w-md lg:max-w-xl w-full">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#8CB662] font-black tracking-[0.3em] uppercase text-[8px] sm:text-[10px] lg:text-xs mb-2 md:mb-4 block"
                >
                  Premium Selection
                </motion.span>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-5xl lg:text-7xl text-[#3d230d] mb-3 md:mb-6 leading-[1.1] font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Taste the <br className="hidden sm:block" />
                  <span className="italic font-normal">Masterpiece</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#5C2E0A]/80 text-[10px] sm:text-sm lg:text-lg mb-6 md:mb-10 font-medium leading-relaxed max-w-[200px] sm:max-w-sm lg:max-w-md"
                >
                  Every cup is a story of tradition and quality, brewed to perfection just for you.
                </motion.p>
                
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "#7aa352" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#8CB662] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-[9px] sm:text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#8CB662]/20"
                >
                  Order Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- MENU ITEMS GRID --- */}
        <div className="py-10 md:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-content`}
              initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(5px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuHeader;