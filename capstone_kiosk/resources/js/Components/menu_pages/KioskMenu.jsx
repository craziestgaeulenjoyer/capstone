import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowUp } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { router } from '@inertiajs/react';

export default function KioskMenu() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [language, setLanguage] = useState("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Regular 16oz");
  const [quantity, setQuantity] = useState(1);
  // ✅ CART STATE
const [cartItems, setCartItems] = useState([]);
const [showCartPanel, setShowCartPanel] = useState(false);
const [selectedAddOns, setSelectedAddOns] = useState([]);
const [orderType, setOrderType] = useState("");
const [sortOrder, setSortOrder] = useState("default"); // default | asc | desc




  
  const scrollRef = useRef(null);

  const goBack = () => window.history.back();

  // Define drink size options
  const drinkOptions = {
    sizes: ["Regular 16oz", "Large 22oz"],
    addOns: [
      "Pearls",
      "Nata",
      "Coffee Jelly",
      "Strawberry Popping Bobba",
    ],
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


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
      { id: 1, name: "Classic Iced Coffee", price: 70, image: "/images/ClassicIcedCoffee.png" },
      { id: 2, name: "Caramel Iced Coffee", price: 80, image: "/images/CaramelIcedCoffee.png" },
      { id: 3, name: "Vanilla Iced Coffee", price: 80, image: "/images/VanillaIcedCoffee.png" },
      { id: 4, name: "Hazelnut Iced Coffee", price: 80, image: "/images/HazelnutIcedCoffee.png" },
      { id: 5, name: "French Vanilla Iced Coffe", price: 80, image: "/images/FrenchVanillaIced.png" },
      { id: 6, name: "Iced Snow Coffee", price: 120, image: "/images/IceSnowCoffee.png" },
      { id: 7, name: "Brewed Coffee", price: 60, image: "/images/BrewedCoffee.png" },
    ],
    Snacks: [
      { id: 1, name: "French Fries", price: 70, image: "/images/Fries.png" },
      { id: 2, name: "Cheese Sticks", price: 60, image: "/images/CheeseSticks.png" },
      { id: 3, name: "Hash Brown", price: 70, image: "/images/HashBrown.png" }, 
      { id: 4, name: "Chicken Nuggets", price: 135, image: "/images/ChickenNuggets.png" },
      { id: 5, name: "Twister Fries", price: 100, image: "/images/TwisterFries.png" },
      { id: 6, name: "Mojos", price: 100, image: "/images/Mojos.png" },
    ],
    "Lemonade & Fruit Juices": [
      { id: 1, name: "Classic Lemonade", price: 60, image: "/images/ClassicLemonade.png" },
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
      { id: 3, name: "Matcha Ichigo", price: 180, image: "/images/MatchaIchigo.png" },
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
      { id: 4, name: "Chocolate", price:  90, image: "/images/Chocolate.png" },
      { id: 5, name: "Oreo", price:  90, image: "/images/Oreo.png" },
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

 const handleAddToCart = () => {
  if (!selectedItem) return;

  const cartItem = {
    id: Date.now(),
    name: selectedItem.name,
    price: selectedItem.price,
    quantity,
    size: selectedSize,
    category: selectedCategory,
    addOns: selectedAddOns,
    image: selectedItem.image,
  };

  setCartItems((prev) => [...prev, cartItem]);

  // reset modal state
  setQuantity(1);
  setSelectedSize("Regular 16oz");
  setSelectedItem(null);
   setSelectedAddOns([]);
};
// ✅ TOTAL PRICE
const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);


  useEffect(() => {
    const saved = localStorage.getItem("kiosk_selected_category");

    if (saved) {
      setSelectedCategory(saved);

      // optional cleanup
      localStorage.removeItem("kiosk_selected_category");
    } else {
      setSelectedCategory("Premium Matcha"); // fallback
    }
  }, []);
useEffect(() => {
  const storedOrderType = localStorage.getItem("order_type");
  if (storedOrderType) {
    setOrderType(storedOrderType);
  }
}, []);


const sortedMenuItems = React.useMemo(() => {
  if (!selectedCategory || !allMenuItems[selectedCategory]) return [];

  const items = [...allMenuItems[selectedCategory]];

  if (sortOrder === "asc") {
    return items.sort((a, b) => a.price - b.price);
  }

  if (sortOrder === "desc") {
    return items.sort((a, b) => b.price - a.price);
  }

  return items; // default order
}, [selectedCategory, sortOrder]);


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
          <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  className="border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none"
>
  <option value="default">Default</option>
  <option value="asc">Price: Low → High</option>
  <option value="desc">Price: High → Low</option>
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
       {sortedMenuItems.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedItem(item)}
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

                  {/* Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[90%] max-w-[480px] rounded-[30px] p-5 relative shadow-2xl flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-[#8CB662] hover:text-[#6CA043] transition"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Drink Image */}
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-[110px] h-[110px] object-contain mt-2"
              />

              {/* Title + Price */}
              <h2 className="text-base font-semibold mt-2 leading-tight">
                {selectedItem.name}
              </h2>
              <p className="text-[#65B741] font-bold text-sm mt-0.5">
                ₱ {selectedItem.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <div className="mt-2">
                <p className="font-medium text-gray-700 mb-0.5 text-xs">Quantity</p>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={handleDecrease}
                    className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-md text-sm font-bold hover:bg-[#8CB662] hover:text-white transition"
                  >
                    –
                  </button>
                  <span className="text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-md text-sm font-bold hover:bg-[#8CB662] hover:text-white transition"
                  >
                    +
                  </button>
                </div>
              </div>

            {/* Size Options */}
            {["Specialty Coffee", "Premium Matcha", "Milk Tea", "Lemonade & Fruit Juices", "Coffee"].includes(selectedCategory) && (
              <div className="mt-3 w-full flex flex-col items-center">
                <div className="w-[90%]">
                  <p className="font-medium text-gray-700 mb-1 text-xs text-left">Cup Size</p>
                  <div className="h-[1px] w-full bg-[#8CB662] mb-2"></div>
                </div>

                <div className="flex justify-center space-x-2">
                  {["Regular 16oz", "Large 22oz"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-full border text-xs font-medium transition-all shadow-sm ${
                        selectedSize === size
                          ? "bg-[#8CB662] text-white border-[#8CB662]"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-[#E9F4E1]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
              

             {/* Modal Options / Add-ons */}
{["Specialty Coffee","Milk Tea","Lemonade & Fruit Juices","Coffee","Premium Matcha","Snacks","Quesadillas & Corndogs","Platters"].includes(selectedCategory) ? (
  <div className="mt-3 w-full flex flex-col items-center space-y-3 text-xs">
    <div className="w-[90%] flex flex-col items-start">
      <p className="font-medium text-gray-700 mb-1 text-xs text-left">
        {(() => {
          switch (selectedCategory) {
            case "Specialty Coffee":
            case "Premium Matcha":
              return "Options";
            case "Milk Tea":
            case "Lemonade & Fruit Juices":
            case "Coffee":
              return "Add-ons";
            case "Snacks":
              return "Flavors";
            case "Quesadillas & Corndogs":
            case "Platters":
              return "Extras";
            default:
              return "";
          }
        })()}
      </p>
      <div className="h-[1px] w-full bg-[#8CB662] mb-2"></div>
    </div>

    {/* Specialty Coffee */}
        {selectedCategory === "Specialty Coffee" && (
          <>
              <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
              <option>Select option</option>
              <option>Hot</option>
              <option>Cold</option>
            </select>
            <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
              <option>Select Add-ons</option>
              <option>Oat Milk</option>
              <option>Extra Espresso</option>
            </select>
          </>
        )}

        {/* Milk Tea */}
        {selectedCategory === "Milk Tea" && (
           <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select an add-on</option>
            <option>Pearls</option>
            <option>Nata</option>
            <option>Coffee Jelly</option>
            <option>Crushed Oreo</option>
            <option>Cream Cheese</option>
            <option>Cheesecake</option>
            <option>Extra Match Shot</option>
          </select>
        )}

        {/* Lemonade & Fruit Juices */}
        {selectedCategory === "Lemonade & Fruit Juices" && (
          <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select Add-ons</option>
            <option>Pearls</option>
            <option>Nata</option>
            <option>Coffee Jelly</option>
            <option>Strawberry Popping Bobba</option>
          </select>
        )}

        {/* Coffee */}
        {selectedCategory === "Coffee" && (
           <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select Add-ons</option>
            <option>Extra Matcha Shot</option>
            <option>Extra Coffee Shot</option>
          </select>
        )}

        {/* Premium Matcha */}
        {selectedCategory === "Premium Matcha" && (
            <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select option</option>
            <option>Hot</option>
            <option>Cold</option>
          </select>
        )}

        {/* Snacks */}
        {selectedCategory === "Snacks" && (
         <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select Flavor</option>
            <option>Cheese</option>
            <option>Sour & Cream</option>
            <option>BBQ</option>
            <option>Butter Cheese</option>
            <option>Honey Butter</option>
          </select>
        )}

        {/* Quesadillas & Corndogs - Only for Beef Quesadillas */}
        {selectedCategory === "Quesadillas & Corndogs" && selectedItem?.name === "Beef Quesadillas" && (
         <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Select Extra</option>
            <option>Extra Garlic Sauce</option>
          </select>
        )}

        {/* Platters */}
        {selectedCategory === "Platters" && (
           <select
      className="w-[180px] border border-[#8CB662] rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#8CB662]"
      value={selectedAddOns[0] || ""}
      onChange={(e) => setSelectedAddOns([e.target.value])} // single selection
    >
            <option>Add Extra Nuggets</option>
          </select>
        )}

          </div>
        ) : null}

         {/* Action Buttons */}
      <div className="mt-4 w-full flex justify-between px-4">
       <button
  onClick={handleAddToCart}
  className="bg-[#8CB662] text-white px-6 py-1.5 rounded-full text-xs font-semibold hover:bg-[#7AAF55] transition"
>
  Add to Cart
</button>

        <button
          onClick={() => setSelectedItem(null)}
          className="bg-gray-300 text-gray-700 px-6 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
            </motion.div>
          </div>
        )}

      {/* Bottom Controls */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-4 shadow-inner flex flex-col items-center">
    <motion.button
  onClick={() => setShowCartPanel(!showCartPanel)}
  animate={{ rotate: showCartPanel ? 180 : 0 }}
  transition={{ duration: 0.3 }}
>
  <IoIosArrowUp className="text-[#76B13A] text-2xl mb-2" />
</motion.button>


{/* ================= CART PANEL INSIDE PAGE ================= */}
<AnimatePresence>
  {showCartPanel && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full overflow-hidden"
    >
      <div className="w-full bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 shadow-inner px-6 py-5 max-h-[420px] overflow-y-auto rounded-t-3xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-3" />
          <h3 className="font-bold text-lg text-gray-800">Your Order</h3>
        </div>

        {/* Order Type */}
        {orderType && (
          <div className="mb-4 flex justify-center">
            <div className="px-4 py-1.5 rounded-full bg-[#8CB662]/15 text-[#6FA84C] text-xs font-semibold tracking-wide shadow-sm">
              {orderType}
            </div>
          </div>
        )}

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <p className="text-sm">Your cart is empty</p>
            <p className="text-xs mt-1">Start adding delicious items 🍵</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1"
                />

                {/* Info */}
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-sm text-gray-800">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.size} × {item.quantity}
                  </p>

                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      + {item.addOns.join(", ")}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">
                    ₱ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sticky Total */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-200 mt-6 pt-4 pb-2 flex justify-between items-center">
            <p className="font-semibold text-gray-700 text-sm">Total</p>
            <p className="font-extrabold text-xl text-gray-900">
              ₱ {totalPrice.toFixed(2)}
            </p>
          </div>
        )}

      </div>
    </motion.div>
  )}
</AnimatePresence>




   {/* Bottom buttons */}
<div className="flex justify-between items-center w-full px-8 sm:px-16">
  <div className="flex space-x-4">
    {/* Order Now */}
    <button
      onClick={() => {
        // Save cart items to localStorage
        localStorage.setItem("kiosk_cart_items", JSON.stringify(cartItems));
        // Save the current category if needed
        localStorage.setItem("kiosk_selected_category", selectedCategory);
        // Navigate to checkout page using Inertia.js router
        router.visit("/paymentselect");
      }}
      className="bg-[#A4C879] text-white px-8 py-3 rounded-full text-base font-semibold shadow-md"
    >
      Order Now
    </button>

    {/* Restart Menu */}
    <button
      onClick={() => {
        // Clear cart
        setCartItems([]);
        localStorage.removeItem("kiosk_cart_items");
        localStorage.removeItem("kiosk_selected_category");
        // Navigate back to menu home page
        router.visit("/kioskhome");
      }}
      className="bg-[#DFF0D8] text-[#76B13A] px-8 py-3 rounded-full text-base font-semibold shadow-md"
    >
      Restart Menu
    </button>
  </div>

  {/* Cart total */}
  <div className="flex items-center text-gray-800 font-semibold text-lg">
    <p className="mr-2">Total ({cartItems.length})</p>
    <span className="font-extrabold text-xl text-black">
      ₱ {totalPrice.toFixed(2)}
    </span>
  </div>
</div>

      </div>
    </div>
  );
}
