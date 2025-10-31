import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function KioskHome() {
  const [activeTab, setActiveTab] = useState("Home");
  const [language, setLanguage] = useState("EN");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = ["EN", "KR", "JP", "CN", "PH"];

  const menuItems = [
    { id: 1, name: "Specialty Coffee", image: "/images/SpecialtyCoffee.png" },
    { id: 2, name: "Milk Tea", image: "/images/MilkTea.png" },
    { id: 3, name: "Lemonade & Fruit Juices", image: "/images/Lemonade_FruitJuices.png" },
    { id: 4, name: "Coffee", image: "/images/Coffee.png" },
    { id: 5, name: "Premium Matcha", image: "/images/PremiumMatcha.png" },
    { id: 6, name: "Snacks", image: "/images/Snacks.png" },
    { id: 7, name: "Croffles", image: "/images/Croffles.png" },
    { id: 8, name: "Quesadillas & Corndogs", image: "/images/Quesadillas_Corndogs.png" },
    { id: 9, name: "Platters", image: "/images/Platter3.png" },
  ];

  const bestSellers = [
    { id: 1, name: "Pure Matcha Oat Latte", image: "/images/PureMatchaOatLatte.png" },
    { id: 2, name: "Specialty Matcha", image: "/images/SpecialtyMatcha.png" },
    { id: 3, name: "Sea Salt Honey", image: "/images/SeaSaltHoney.png" },
    { id: 4, name: "White Chocolate Mocha", image: "/images/WhiteChocolateMocha.png" },
    { id: 5, name: "Dulce De Leche", image: "/images/DulceDeLeche.png" },
    { id: 6, name: "Ice Snow Coffee", image: "/images/IceSnowCoffee.png" },
    { id: 7, name: "Okinawa", image: "/images/Okinawa.png" },
    { id: 8, name: "Wintermelon", image: "/images/Wintermelon.png" },
    { id: 9, name: "Oreo", image: "/images/Oreo.png" },
    { id: 10, name: "Oreo Cheesecake Overload", image: "/images/OreoCheesecakeOverload.png" },
    { id: 11, name: "Classic Lemonade", image: "/images/ClassicLemonade.png" },
    { id: 12, name: "Strawberry Lemonade", image: "/images/StrawberryLemonade.png" },
    { id: 13, name: "Watermelon with Strawberry Popping Bobba", image: "/images/PoppingBobba.png" },
    { id: 14, name: "Peach Iced Tea", image: "/images/PeachIcedTea.png" },
    { id: 15, name: "Fries", image: "/images/Fries.png" },
    { id: 16, name: "Cheese Sticks", image: "/images/CheeseSticks.png" },
    { id: 17, name: "Platter #3", image: "/images/Platter3.png" },
    { id: 18, name: "Beef Quesadillas", image: "/images/BeefQuesadilla.png" },
    { id: 19, name: "Cheesy Corndogs", image: "/images/CheesyCorndogs.png" },
    { id: 20, name: "Croffle with Whipped Cream & Syrup", image: "/images/WhipppedCroffle.png" },
    { id: 21, name: "Biscoff Croffle", image: "/images/BiscoffCroffle.png" },
  ];

  const displayedItems = activeTab === "Home" ? menuItems : bestSellers;

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 font-quicksand flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <button className="flex items-center text-[#76B13A] font-medium text-sm">
          <IoIosArrowBack className="text-lg mr-1" /> Back
        </button>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-[#76B13A] font-semibold text-sm focus:outline-none"
          >
            {language} <IoIosArrowDown className="ml-1" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                {languages.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#E9F0DE] ${
                      language === lang ? "bg-[#A4C879] text-white" : "text-gray-700"
                    }`}
                  >
                    {lang}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-[-10px]">
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Logo"
          className="w-[90px] sm:w-[100px]"
        />
      </div>

      {/* Explore + Tabs */}
      <div className="flex justify-between items-center px-8 mt-2">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          Explore our Menu
        </h1>

        <div className="flex space-x-3">
          {["Home", "Popular"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1 rounded-full shadow-2xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#A4C879] text-white"
                  : "bg-[#ffff] text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6"
        >
          {displayedItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#f8f8f8] rounded-lg flex flex-col items-center p-4 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-[250px] sm:w-[250px] h-[250px] sm:h-[250px] object-contain"
              />
              <p className="mt-3 text-lg sm:text-base font-semibold text-gray-800 text-center">
                {item.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 w-full bg-white py-3 shadow-inner flex flex-col items-center">
        <motion.button
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <IoIosArrowUp className="text-[#76B13A] text-xl" />
        </motion.button>

        <div className="flex justify-between items-center w-full px-6 sm:px-12 mt-2">
          <div className="flex space-x-3">
            <button className="bg-[#A4C879] text-white px-6 py-2 rounded-full text-md sm:text-base font-semibold shadow-lg">
              Order Now
            </button>
            <button className="bg-[#d1f7d0] text-[#76B13A] px-6 py-2 rounded-full text-md sm:text-base font-semibold shadow-lg">
              Restart Menu
            </button>
          </div>

          <div className="flex items-center text-gray-800 font-semibold text-lg sm:text-base">
            <p className="mr-2">Total</p>
            <span className="font-extrabold text-lg text-black">₱ 0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
