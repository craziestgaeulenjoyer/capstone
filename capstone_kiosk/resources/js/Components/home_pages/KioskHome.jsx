import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";

export default function KioskHome() {
  const [activeTab, setActiveTab] = useState("Home");
  const [language, setLanguage] = useState("EN");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedAddon, setSelectedAddon] = useState("");
  const [selectedExtra, setSelectedExtra] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
const goBack = () => window.history.back();
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
  { id: 1, name: "Pure Matcha Oat Latte", image: "/images/PureMatchaOatLatte.png", price: 160 },
  { id: 2, name: "Specialty Matcha", image: "/images/SpecialtyMatcha.png", price: 250 },
  { id: 3, name: "Sea Salt Honey", image: "/images/SeaSaltHoney.png", price: 170 },
  { id: 4, name: "White Chocolate Mocha", image: "/images/WhiteChocolateMocha.png", price: 180 },
  { id: 5, name: "Dulce De Leche", image: "/images/DulceDeLeche.png", price: 180 },
  { id: 6, name: "Iced Snow Coffee", image: "/images/IceSnowCoffee.png", price: 120 },
  { id: 7, name: "Okinawa", image: "/images/Okinawa.png", price: 90 },
  { id: 8, name: "Wintermelon", image: "/images/Wintermelon.png", price: 90 },
  { id: 9, name: "Oreo", image: "/images/Oreo.png", price: 90 },
  { id: 10, name: "Oreo Cheesecake Overload", image: "/images/OreoCheesecakeOverload.png", price: 140 },
  { id: 11, name: "Classic Lemonade", image: "/images/ClassicLemonade.png", price: 60 },
  { id: 12, name: "Strawberry Lemonade", image: "/images/StrawberryLemonade.png", price: 70 },
  { id: 13, name: "Watermelon with Strawberry Popping Bobba", image: "/images/PoppingBobba.png", price: 100 },
  { id: 14, name: "Peach Iced Tea", image: "/images/PeachIcedTea.png", price: 100 },
  { id: 15, name: "French Fries", image: "/images/Fries.png", price: 70 },
  { id: 16, name: "Cheese Sticks", image: "/images/CheeseSticks.png", price: 50 },
  { id: 17, name: "Platter #3", image: "/images/Platter3.png", price: 210 },
  { id: 18, name: "Beef Quesadillas", image: "/images/BeefQuesadilla.png", price: 130 },
  { id: 19, name: "Cheesy Corndogs", image: "/images/CheesyCorndogs.png", price: 135 },
  { id: 20, name: "Croffle with Whipped Cream & Syrup", image: "/images/WhipppedCroffle.png", price: 120 },
  { id: 21, name: "Biscoff Croffle", image: "/images/BiscoffCroffle.png", price: 160 },
];

  const displayedItems = activeTab === "Home" ? menuItems : bestSellers;

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };


   // Detect Category Based on Product Name
  const detectCategory = (name) => {
    if (["Pure Matcha Oat Latte", "Specialty Matcha"].includes(name)) return "Premium Matcha";

    if (
      ["Sea Salt Honey", "White Chocolate Mocha", "Dulce De Leche"].includes(name)
    )
      return "Specialty Coffee";

    if (["Ice Snow Coffee"].includes(name)) return "Coffee";

    if (
      ["Okinawa", "Wintermelon", "Oreo", "Oreo Cheesecake Overload"].includes(name)
    )
      return "Milk Tea";

    if (
      ["Classic Lemonade", "Strawberry Lemonade", "Watermelon with Strawberry Popping Bobba", "Peach Iced Tea"].includes(name)
    )
      return "Lemonade & Fruit Juices";

    if (["Fries", "Cheese Sticks"].includes(name)) return "Snacks";

    if (["Platter #3"].includes(name)) return "Platters";

    if (["Beef Quesadillas"].includes(name)) return "Quesadillas";

    if (["Cheesy Corndogs"].includes(name)) return "Corndog";

    if (
      ["Croffle with Whipped Cream & Syrup", "Biscoff Croffle"].includes(name)
    )
      return "Croffle";

    return null;
  };

  // Option Mapping
  const optionConfig = {
    "Premium Matcha": {
      optionLabel: "Select Option",
      options: ["Hot", "Cold"],
      addOns: [],
      extras: [],
      flavors: [],
    },

    "Specialty Coffee": {
      optionLabel: "Select Option",
      options: ["Hot", "Cold"],
      addOns: ["Oat Milk", "Extra Espresso"],
    },

    Coffee: {
      optionLabel: null,
      options: [],
      addOns: ["Extra Matcha Shot", "Extra Coffee Shot"],
    },

    "Milk Tea": {
      optionLabel: null,
      options: [],
      addOns: [
        "Pearls",
        "Nata",
        "Coffee Jelly",
        "Crushed Oreo",
        "Cream Cheese",
        "Cheesecake",
        "Extra Match Shot",
      ],
    },

    "Lemonade & Fruit Juices": {
      options: [],
      addOns: ["Pearls", "Nata", "Coffee Jelly", "Strawberry Popping Bobba"],
    },

    Snacks: {
      flavors: ["Cheese", "Sour & Cream", "BBQ", "Butter Cheese", "Honey Butter"],
    },

    Platters: {
      extras: ["Add Extra Nuggets"],
    },

    Quesadillas: {
      extras: ["Extra Garlic Sauce"],
    },

    Corndog: {
      noOptions: true,
    },

    Croffle: {
      noOptions: true,
    },
  };

  const handleItemClick = (item) => {
     if (activeTab === "Home") {
      
 localStorage.setItem("kiosk_selected_category", item.name);
    // navigate to the other file (categories page)
    router.visit("/kioskmenu"); // 🔴 change route if needed

    return;
  }
    setSelectedItem(item);

    setQuantity(1);
    setSelectedOption("");
    setSelectedAddon("");
    setSelectedExtra("");
    setSelectedFlavor("");
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      item: selectedItem,
      quantity,
      option: selectedOption,
      addon: selectedAddon,
      extra: selectedExtra,
      flavor: selectedFlavor,
    });

    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 font-quicksand flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
         <button
                  onClick={goBack}
                  className="flex items-center text-[#76B13A] font-medium text-lg hover:opacity-80 transition"
                >
                  <IoIosArrowBack className="mr-1 text-xl" /> Back
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
              onClick={() => handleItemClick(item)}
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


{/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-[90%] max-w-[480px] rounded-[30px] p-5 relative shadow-2xl flex flex-col items-center text-center"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-[#8CB662]"
              >
                <X size={22} />
              </button>

              {/* IMAGE */}
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-[110px] h-[110px] object-contain mt-2"
              />

              {/* NAME */}
              <h2 className="text-base font-semibold mt-2">
                {selectedItem.name}
              </h2>

              {/* PRICE */}
              <p className="text-[#65B741] font-bold text-sm">
                ₱ {selectedItem.price?.toFixed(2)}
              </p>


              {/* QUANTITY */}
              <div className="mt-3 flex items-center space-x-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 border rounded"
                >
                  –
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              {/* OPTIONS BASED ON CATEGORY */}
              {(() => {
                const cat = selectedItem.category;
                const cfg = optionConfig[cat];

                if (!cfg || cfg.noOptions) return null;

                return (
                  <>
                    {/* OPTION (Hot/Cold) */}
                    {cfg.options?.length > 0 && (
                      <div className="mt-4 w-full px-4 text-left">
                        <p className="font-semibold mb-1 text-sm">
                          {cfg.optionLabel || "Select Option"}
                        </p>
                        <select
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="w-full border px-3 py-2 rounded-lg text-sm"
                        >
                          <option value="">Select option</option>
                          {cfg.options.map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* ADD-ONS */}
                    {cfg.addOns?.length > 0 && (
                      <div className="mt-4 w-full px-4 text-left">
                        <p className="font-semibold mb-1 text-sm">Add-ons</p>
                        <select
                          value={selectedAddon}
                          onChange={(e) => setSelectedAddon(e.target.value)}
                          className="w-full border px-3 py-2 rounded-lg text-sm"
                        >
                          <option value="">Select Add-on</option>
                          {cfg.addOns.map((ad) => (
                            <option key={ad} value={ad}>
                              {ad}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* FLAVORS */}
                    {cfg.flavors?.length > 0 && (
                      <div className="mt-4 w-full px-4 text-left">
                        <p className="font-semibold mb-1 text-sm">Select Flavor</p>
                        <select
                          value={selectedFlavor}
                          onChange={(e) => setSelectedFlavor(e.target.value)}
                          className="w-full border px-3 py-2 rounded-lg text-sm"
                        >
                          <option value="">Select Flavor</option>
                          {cfg.flavors.map((flav) => (
                            <option key={flav} value={flav}>
                              {flav}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* EXTRAS */}
                    {cfg.extras?.length > 0 && (
                      <div className="mt-4 w-full px-4 text-left">
                        <p className="font-semibold mb-1 text-sm">Extras</p>
                        <select
                          value={selectedExtra}
                          onChange={(e) => setSelectedExtra(e.target.value)}
                          className="w-full border px-3 py-2 rounded-lg text-sm"
                        >
                          <option value="">Select Extra</option>
                          {cfg.extras.map((ex) => (
                            <option key={ex} value={ex}>
                              {ex}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between w-full px-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#8CB662] text-white px-6 py-2 rounded-full text-xs font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-gray-300 px-6 py-2 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
