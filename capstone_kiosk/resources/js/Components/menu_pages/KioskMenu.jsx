import React, { useState, useRef } from "react";
import { IoIosArrowBack, IoIosArrowUp } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function KioskMenu() {
  const [selectedCategory, setSelectedCategory] = useState("Premium Matcha");
  const [language, setLanguage] = useState("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const scrollRef = useRef(null);

  const goBack = () => {
    window.history.back();
  };

  const categories = [
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

  const allMenuItems = {
    "Coffee": [
      { id: 1, name: "Classic Iced Coffee", price: 80, image: "/images/ClassicIcedCoffee.png" },
      { id: 2, name: "Caramel Iced Coffee", price: 80, image: "/images/CaramelIcedCoffee.png" },
      { id: 3, name: "Vanilla Iced Coffee", price: 80, image: "/images/VanillaIcedCoffee.png" },
      { id: 4, name: "Hazelnut Iced Coffee", price: 80, image: "/images/HazelnutIcedCoffee.png" },
      { id: 5, name: "French Vanilla Iced Coffe", price: 80, image: "/images/FrenchVanillaIced.png" },
      { id: 6, name: "Iced Snow Coffee", price: 80, image: "/images/IceSnowCoffee.png" },
      { id: 7, name: "Brewed Coffee", price: 80, image: "/images/BrewedCoffee.png" },
    ],
    Snacks: [
      { id: 1, name: "French Fries", price: 70, image: "/images/Fries.png" },
      { id: 2, name: "Cheese Sticks", price: 90, image: "/images/CheeseSticks.png" },
      { id: 3, name: "Hash Brown", price: 100, image: "/images/HashBrown.png" }, 
      { id: 4, name: "Chicken Nuggets", price: 135, image: "/images/ChickenNuggets.png" },
      { id: 5, name: "Twister Fries", price: 100, image: "/images/TwisterFries.png" },
      { id: 6, name: "Mojos", price: 100, image: "/images/Mojos.png" },
    ],
    "Lemonade & Fruit Juices": [
      { id: 1, name: "Classic Lemonade", price: 70, image: "/images/ClassicLemonade.png" },
      { id: 2, name: "Strawberry Lemonade", price: 70, image: "/images/StrawberryLemonade.png" },
      { id: 3, name: "Charcoal Lemonade", price: 70, image: "/images/CharcoalLemonade.png" },
      { id: 4, name: "Cucumber Lemonade", price: 90, image: "/images/CucumberLemonade.png" },
      { id: 5, name: "Sugar-Free Lemonade", price: 65, image: "/images/SugarFreeLemonade.png" },
      { id: 6, name: "Citro Frutti ", price: 80, image: "/images/CitroFrutti.png" },
      { id: 7, name: "Mango Frutti", price: 80, image: "/images/MangoFrutti.png" }, 
      { id: 8, name: "Punch Tropical", price: 80, image: "/images/PunchTropical.png" },
      { id: 9, name: "Watermelon with Strawberry Popping Bobba", price: 100, image: "/images/PoppingBobba.png" },
      { id: 10, name: "Peach Iced Tea", price: 100, image: "/images/PeachIcedTea.png" }, 
    ],
    Croffles: [
      { id: 1, name: "Plain Croffle", price: 100, image: "/images/PlainCroffle.png" },
      { id: 2, name: "Syrup Croffle", price: 110, image: "/images/SyrupCroffle.png" },
      { id: 3, name: "Croffle with Whipped Cream & Syrup", price: 120, image: "/images/WhipppedCroffle.png" },
      { id: 4, name: "Oreo Croffle", price: 150, image: "/images/OreoCroffle.png" },
      { id: 5, name: "Matcha Croffle", price: 150, image: "/images/MatchaCroffle.png" },
      { id: 6, name: "Alcapone Croffle", price: 150, image: "/images/AlcaponeCroffle.png" },
      { id: 7, name: "Strawberry Graham Croffle", price: 150, image: "/images/StrawberryGraham.png" },
      { id: 8, name: "Blueberry Graham Croffle", price: 150, image: "/images/BlueberryGraham.png" },
      { id: 9, name: "Mango Graham Croffle", price: 150, image: "/images/MangoGraham.png" },
      { id: 10, name: "Banana Nutella Croffle", price: 160, image: "/images/BananaNutella.png" },
      { id: 11, name: "Biscoff Croffle", price: 160, image: "/images/BiscoffCroffle.png" },
    ],
    Platters: [
      { id: 1, name: "Platter #1", price: 120, image: "/images/Platter1.png" },
      { id: 2, name: "Platter #2", price: 160, image: "/images/Platter2.png" },
      { id: 3, name: "Platter #3", price: 210, image: "/images/Platter3.png" },
    ],
    "Specialty Coffee": [
      { id: 1, name: "Americano", price: 90, image: "/images/Americano.png" },
      { id: 2, name: "Spanish Latte", price: 170, image: "/images/SpanishLatte.png" },
      { id: 3, name: "Sea Salt Honey", price: 170, image: "/images/SeaSaltHoney.png" },
      { id: 4, name: "White Chocolate Mocha", price: 180, image: "/images/WhiteChocolateMocha.png" },
      { id: 5, name: "Dulce De Leche", price: 180, image: "/images/DulceDeLeche.png" },
     ],
    "Premium Matcha": [
      { id: 1, name: "Pure Matcha Latte", price: 120, image: "/images/PureMatchaLatte.png" },  
      { id: 2, name: "Pure Matcha Oat Latte", price: 160, image: "/images/PureMatchaOatLatte.png" },  
      { id: 3, name: "Matcha Ichigo", price: 120, image: "/images/MatchaIchigo.png" },
      { id: 4, name: "Specialty Matcha", price: 250, image: "/images/SpecialtyMatcha.png" },  
     ],
    "Quesadillas & Corndogs": [
      { id: 1, name: "Cheese Quesadillas", price: 120, image: "/images/CheeseQuesadilla.png" },  
      { id: 2, name: "Beef Quesadillas", price: 130, image: "/images/BeefQuesadilla.png" },  
      { id: 3, name: "Frenchfry Corndogs", price: 130, image: "/images/FrenchfryCorndogs.png" },
      { id: 4, name: "Mozza Corndogs", price: 135, image: "/images/MozzaCorndogs.png" },
      { id: 5, name: "Cheesy Corndogs", price: 135, image: "/images/CheesyCorndogs.png" },
      { id: 6, name: "Mozza Ramyeon Corndogs", price: 145, image: "/images/MozzaRamyeonCorndogs.png" },
      ],
    "Milk Tea": [
      { id: 1, name: "Classic Bubble", price: 90, image: "/images/ClassicBubble.png" },  
      { id: 2, name: "Okinawa", price: 90, image: "/images/Okinawa.png" },  
      { id: 3, name: "Wintermelon", price: 90, image: "/images/Wintermelon.png" },
      { id: 4, name: "Chocolate", price: 90, image: "/images/Chocolate.png" },
      { id: 5, name: "Oreo", price: 90, image: "/images/Oreo.png" },
      { id: 6, name: "Caramel", price: 90, image: "/images/Caramel.png" }, 
      { id: 7, name: "Java Chip", price: 90, image: "/images/JavaChip.png" }, 
      { id: 8, name: "Matcha", price: 90, image: "/images/Matcha.png" }, 
      { id: 9, name: "Oreo Cheesecake Overload", price: 140, image: "/images/OreoCheesecakeOverload.png" }, 
      { id: 10, name: "Oreo Cream Cheese", price: 130, image: "/images/OreoCreamCheese.png" }, 
      { id: 11, name: "Matcha Cheesecake", price: 130, image: "/images/MatchaCheesecake.png" }, 
      { id: 12, name: "Bobbatella", price: 130, image: "/images/Bobbatella.png" }, 
      { id: 13, name: "Meiji Apollo", price: 130, image: "/images/MeijiApollo.png" }, 
    ],
  };

  function scroll(direction) {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  const languages = ["EN", "JP", "KR", "CN"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 font-quicksand relative">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <button
          onClick={goBack}
          className="flex items-center text-[#76B13A] font-medium text-lg hover:opacity-80 transition"
        >
          <IoIosArrowBack className="mr-1 text-xl" /> Back
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="text-[#76B13A] font-semibold text-lg flex items-center"
          >
            {language} <IoIosArrowUp className="ml-1" />
          </button>

          <AnimatePresence>
            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-20 z-10"
              >
                {["EN", "JP", "KR", "CN"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-[#E9F0DE] ${
                      lang === language
                        ? "text-[#76B13A] font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/images/MiAmoreWelcome.png" alt="Logo" className="w-[90px]" />
      </div>

      {/* Category */}
      <div className="relative flex items-center justify-center px-6 mb-6">
        <button
          onClick={() => scroll("left")}
          className="p-3 bg-white shadow-md rounded-full hover:bg-[#EAF3E0] transition"
        >
          <FaChevronLeft className="text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide mx-4 space-x-4 py-4 px-4 bg-white rounded-2xl shadow-lg"
          style={{ width: "90%", scrollBehavior: "smooth" }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center justify-center min-w-[150px] cursor-pointer rounded-2xl p-4 transition-all duration-300 ${
                selectedCategory === cat.name
                  ? "bg-[#A4C879] text-white scale-105 shadow-lg"
                  : "bg-[#e7e7e7] text-gray-800 hover:bg-[#EAF3E0]"
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-230px] h-[160px] object-contain mb-2"
              />
              <span className="text-md sm:text-base font-semibold text-center leading-tight">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="p-3 bg-white shadow-md rounded-full hover:bg-[#EAF3E0] transition"
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>

      {/* Category Title */}
      <div className="flex justify-between items-center px-8 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{selectedCategory}</h2>
        <div className="flex items-center text-md text-gray-700">
          <span className="mr-1">Sort by</span>
          <select className="border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none">
            <option>Default</option>
            <option>Ascending</option>
            <option>Descending</option>
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-8 mb-24"
      >
        {allMenuItems[selectedCategory]?.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="bg-[#EAF3E0] rounded-xl p-4 flex flex-col items-center shadow-md hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-[250px] h-[250px] object-contain mb-3"
            />
            <p className="te-lg font-semibold text-gray-800 text-center">{item.name}</p>
            <p className="text-[#76B13A] text-xl font-semibold mt-1">
              ₱ {item.price.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-4 shadow-inner flex flex-col items-center">
        <IoIosArrowUp className="text-[#76B13A] text-2xl mb-2" />

        <div className="flex justify-between items-center w-full px-8 sm:px-16">
          <div className="flex space-x-4">
            <button className="bg-[#A4C879] text-white px-8 py-3 rounded-full text-base font-semibold shadow-md">
              Order Now
            </button>
            <button className="bg-[#DFF0D8] text-[#76B13A] px-8 py-3 rounded-full text-base font-semibold shadow-md">
              Restart Menu
            </button>
          </div>

          <div className="flex items-center text-gray-800 font-semibold text-lg">
            <p className="mr-2">Total</p>
            <span className="font-extrabold text-xl text-black">₱ 0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

