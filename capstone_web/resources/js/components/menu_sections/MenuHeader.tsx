// resources/js/Pages/website_pages/components/MenuHeader.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PopularItems from './PopularItems';
import CoffeeItems from './CoffeeItems';
import MilkteaItems from './MilkTeaItems';
import FruiteaJuiceItems from './FruiteaJuiceItems';
import FoodItems from './FoodItems';
import PremiumMatcha from './PremiumMatchaItems';


const MenuHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Coffees');

  const tabs = ['Popular', 'Coffees', 'Milktea', 'Lemonade & Fruitti Juice', 'Premium Matcha' , 'Foods'];

  useEffect(() => {}, [activeTab]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <nav className="flex space-x-6 text-gray-700 font-semibold px-6 py-4 text-md">
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer hover:text-[#8CB662] ${
              activeTab === tab ? 'text-[#8CB662] border-b-3 border-[#8CB662] pb-1' : ''
            }`}
          >
            {tab}
          </span>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative mx-6 mt-2 rounded-xl overflow-hidden"
        >
          <img
            src="images/MatchaLatteCover.png"
            alt="Banner Background"
            className="w-full object-cover rounded-xl max-h-[450px]"
          />

          <div className="absolute top-0 left-0 w-full h-full flex items-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-md text-black"
            >
              <h2
                className="text-4xl mb-3 leading-tight"
                style={{ fontFamily: '"Patrick Hand", cursive' }}
              >
                A Perfect Blend of <br />
                Flavor & Wellness
              </h2>
              <p className="text-md mb-4">
                Earthy matcha meets creamy oat milk for a smooth, energizing delight!
              </p>
              <button className="bg-transparent text-[#8CB662] border-2 border-[#8CB662] px-5 py-2 rounded-full font-extrabold hover:bg-[#8CB662] hover:text-white transition">
                Order now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PopularItems*/}
      <AnimatePresence mode="wait">
        {activeTab === 'Popular' && (
          <motion.div
            key="popular-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <PopularItems />
          </motion.div>
        )}

      {/* CoffeeItems */}
        {activeTab === 'Coffees' && (
          <motion.div
            key="coffee-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <CoffeeItems />
          </motion.div>
        )}

        {/* MilkteaItems */}
        {activeTab === 'Milktea' && (
          <motion.div
            key="milktea-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <MilkteaItems />
          </motion.div>
        )}

        {/* Lemonade & FruiteaJuiceItems */}
        {activeTab === 'Lemonade & Fruitti Juice' && (
          <motion.div
            key="fruitea-juice-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <FruiteaJuiceItems />
          </motion.div>
        )}
        
        {/* PremiumMatchaItems */}
        {activeTab === 'Premium Matcha' && (
          <motion.div
            key="premium-matcha-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <PremiumMatcha/>
          </motion.div>
        )}


        {/* FoodsItems */}
        {activeTab === 'Foods' && (
          <motion.div
            key="food-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 py-8"
          >
            <FoodItems />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default MenuHeader;
