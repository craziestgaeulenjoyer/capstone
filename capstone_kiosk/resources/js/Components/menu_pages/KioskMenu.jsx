import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ReceiptText } from "lucide-react";
import { router } from '@inertiajs/react';

export default function KioskMenu() {
  // --- STATES ---
  const [selectedCategory, setSelectedCategory] = useState("Specialty Coffee");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Regular 16oz");
  const [selectedTemp, setSelectedTemp] = useState("Iced");
  const [selectedFlavor, setSelectedFlavor] = useState("Cheese");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const scrollRef = useRef(null);
  const goBack = () => window.history.back();

  // --- DATA STRUCTURE ---
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
      { id: 101, name: "Classic Iced Coffee", price16oz: 70, price22oz: 80, hasSize: true, image: "/images/ClassicIcedCoffee.png" },
      { id: 102, name: "Vanilla Iced Coffee", price16oz: 80, price22oz: 90, hasSize: true, image: "/images/VanillaIcedCoffee.png" },
      { id: 103, name: "Caramel Iced Coffee", price16oz: 80, price22oz: 90, hasSize: true, image: "/images/CaramelIcedCoffee.png" },
      { id: 104, name: "Hazelnut Iced Coffee", price16oz: 80, price22oz: 90, hasSize: true, image: "/images/HazelnutIcedCoffee.png" },
      { id: 105, name: "French Vanilla Iced Coffee", price16oz: 80, price22oz: 90, hasSize: true, image: "/images/FrenchVanillaIced.png" },
      { id: 106, name: "Iced Snow Coffee", price: 120, hasSize: false, image: "/images/IceSnowCoffee.png" },
      { id: 107, name: "Brewed Coffee", price: 60, hasSize: false, hasTemp: true, image: "/images/BrewedCoffee.png" },
    ],
    "Snacks": [
      { id: 601, name: "French Fries", price: 70, priceLarge: 90, isFries: true, image: "/images/Fries.png" },
      { id: 602, name: "Cheese Sticks", price: 60, priceLarge: 80, isSticks: true, image: "/images/CheeseSticks.png" },
      { id: 603, name: "Hash Brown", price: 70, priceLarge: 100, isHash: true, image: "/images/HashBrown.png" },
      { id: 604, name: "Chicken Nuggets (5pcs)", price: 135, image: "/images/ChickenNuggets.png" },
      { id: 605, name: "Twister Fries", price: 100, image: "/images/TwisterFries.png" },
      { id: 606, name: "Mojos", price: 100, image: "/images/Mojos.png" },
    ],
    "Specialty Coffee": [
      { id: 401, name: "Americano", price: 90, hasTemp: true, hasSize: false, image: "/images/Americano.png" },
      { id: 402, name: "Spanish Latte", price: 170, hasTemp: true, hasSize: false, image: "/images/SpanishLatte.png" },
      { id: 403, name: "Sea Salt Honey", price: 170, hasTemp: true, hasSize: false, image: "/images/SeaSaltHoney.png" },
      { id: 404, name: "White Chocolate Mocha", price: 180, hasTemp: true, hasSize: false, image: "/images/WhiteChocolateMocha.png" },
      { id: 405, name: "Dulce De Leche", price: 180, hasTemp: true, hasSize: false, image: "/images/DulceDeLeche.png" },
    ],
    "Premium Matcha": [
      { id: 501, name: "Pure Matcha Latte", price: 120, hasTemp: true, hasSize: false, image: "/images/PureMatchaLatte.png" },
      { id: 502, name: "Pure Matcha Oat Latte", price: 160, hasTemp: true, hasSize: false, image: "/images/PureMatchaOatLatte.png" },
      { id: 503, name: "Matcha Ichigo (Iced Only)", price: 180, hasSize: false, image: "/images/MatchaIchigo.png" },
      { id: 504, name: "Specialty Matcha", price: 250, hasSize: false, isSpecialMatcha: true, image: "/images/SpecialtyMatcha.png" },
    ],
    "Milk Tea": [
      { id: 201, name: "Classic Bubble", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/ClassicBubble.png" },
      { id: 202, name: "Okinawa", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Okinawa.png" },
      { id: 203, name: "Wintermelon", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Wintermelon.png" },
      { id: 204, name: "Chocolate", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Chocolate.png" },
      { id: 205, name: "Oreo", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Oreo.png" },
      { id: 206, name: "Caramel", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Caramel.png" },
      { id: 207, name: "Java Chip", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/JavaChip.png" },
      { id: 208, name: "Matcha", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/Matcha.png" },
      { id: 209, name: "Oreo Cheesecake Overload", price: 140, hasSize: false, image: "/images/OreoCheesecakeOverload.png" },
      { id: 210, name: "Oreo Cream Cheese", price: 130, hasSize: false, image: "/images/OreoCreamCheese.png" },
      { id: 211, name: "Matcha Cheesecake", price: 130, hasSize: false, image: "/images/MatchaCheesecake.png" },
      { id: 212, name: "Bobbatella", price: 130, hasSize: false, image: "/images/Bobbatella.png" },
      { id: 213, name: "Meiji Apollo (Choco-Berry)", price: 130, hasSize: false, image: "/images/MeijiApollo.png" },
    ],
    "Lemonade & Fruit Juices": [
      { id: 301, name: "Classic Lemonade", price16oz: 60, price22oz: 70, hasSize: true, image: "/images/ClassicLemonade.png" },
      { id: 302, name: "Strawberry Lemonade", price16oz: 70, price22oz: 80, hasSize: true, image: "/images/StrawberryLemonade.png" },
      { id: 303, name: "Charcoal Lemonade", price16oz: 70, price22oz: 80, hasSize: true, image: "/images/CharcoalLemonade.png" },
      { id: 304, name: "Cucumber Lemonade", price16oz: 90, price22oz: 100, hasSize: true, image: "/images/CucumberLemonade.png" },
      { id: 305, name: "Sugar-Free Lemonade", price16oz: 65, price22oz: 75, hasSize: true, image: "/images/SugarFreeLemonade.png" },
      { id: 306, name: "Citro Fruitti", price: 80, hasSize: false, image: "/images/CitroFrutti.png" },
      { id: 307, name: "Mango Fruitti", price: 80, hasSize: false, image: "/images/MangoFrutti.png" },
      { id: 308, name: "Punch Tropicale", price: 80, hasSize: false, image: "/images/PunchTropical.png" },
      { id: 309, name: "Watermelon w/ Popping Bobba", price: 100, hasSize: false, image: "/images/PoppingBobba.png" },
      { id: 310, name: "Peach Iced Tea", price: 100, hasSize: false, image: "/images/PeachIcedTea.png" },
    ],
    "Croffles": [
      { id: 701, name: "Plain Croffle", price: 100, image: "/images/PlainCroffle.png" },
      { id: 702, name: "Croffle with syrup", price: 110, image: "/images/SyrupCroffle.png" },
      { id: 703, name: "Croffle w/ Whipped Cream & Syrup", price: 120, image: "/images/WhipppedCroffle.png" },
      { id: 704, name: "Oreo Croffle", price: 150, image: "/images/OreoCroffle.png" },
      { id: 705, name: "Matcha Croffle", price: 150, image: "/images/MatchaCroffle.png" },
      { id: 706, name: "Blueberry Croffle", price: 150, image: "/images/BlueberryGraham.png" },
      { id: 707, name: "Strawberry Croffle", price: 150, image: "/images/StrawberryGraham.png" },
      { id: 708, name: "Mango Graham Croffle", price: 150, image: "/images/MangoGraham.png" },
      { id: 709, name: "Banana Nutella Croffle", price: 160, image: "/images/BananaNutella.png" },
      { id: 710, name: "Biscoff Croffle", price: 160, image: "/images/BiscoffCroffle.png" },
    ],
    "Platters": [
      { id: 901, name: "Platter #1", price: 120, image: "/images/Platter1.png" },
      { id: 902, name: "Platter #2", price: 160, image: "/images/Platter2.png" },
      { id: 903, name: "Platter #3", price: 210, image: "/images/Platter3.png" },
    ],
    "Quesadillas & Corndogs": [
      { id: 801, name: "Beef Quesadillas", price: 130, isBeefQ: true, image: "/images/BeefQuesadilla.png" },
      { id: 802, name: "Cheese Quesadillas", price: 120, image: "/images/CheeseQuesadilla.png" },
      { id: 803, name: "Frenchfry Corndog", price: 130, image: "/images/FrenchfryCorndogs.png" },
      { id: 804, name: "Mozza Corndog", price: 130, image: "/images/MozzaCorndogs.png" },
      { id: 805, name: "Cheesy Corndogs", price: 135, image: "/images/CheesyCorndogs.png" },
      { id: 806, name: "Mozza Ramyeon Corndog", price: 145, image: "/images/MozzaRamyeonCorndogs.png" },
    ]
  };

  // --- LOGIC ---
  const getCurrentPrice = (item) => {
    if (!item) return 0;
    let base = 0;
    if (item.hasSize) {
      base = selectedSize === "Regular 16oz" ? item.price16oz : item.price22oz;
    } else if (item.isFries || item.isSticks || item.isHash) {
      base = (selectedSize === "Regular" || selectedSize === "10 pcs" || selectedSize === "2 pcs") ? item.price : item.priceLarge;
    } else {
      base = item.price || 0;
    }
    const addOns = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const flavorPlus = (item.isFries && selectedFlavor === "Honey Butter") ? 5 : 0;
    return (base + addOns + flavorPlus) * quantity;
  };

  const toggleAddOn = (addon) => {
    setSelectedAddOns(prev => prev.find(a => a.name === addon.name) ? prev.filter(a => a.name !== addon.name) : [...prev, addon]);
  };

  const handleAddToCart = () => {
    const pricePerUnit = getCurrentPrice(selectedItem) / quantity;
    const details = {
        size: (selectedItem.hasSize || selectedItem.isFries || selectedItem.isSticks || selectedItem.isHash) ? selectedSize : null,
        temp: selectedItem.hasTemp ? selectedTemp : null,
        flavor: selectedItem.isFries ? selectedFlavor : null,
        addOns: [...selectedAddOns]
    };

    const newItem = { 
        id: editingId || Date.now(), 
        name: selectedItem.name, 
        price: pricePerUnit, 
        quantity, 
        details, 
        image: selectedItem.image,
        rawItem: selectedItem 
    };

    if (editingId) {
        setCartItems(cartItems.map(item => item.id === editingId ? newItem : item));
    } else {
        setCartItems([...cartItems, newItem]);
    }

    setSelectedItem(null);
    setQuantity(1);
    setSelectedAddOns([]);
    setEditingId(null);
  };

  const deleteItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const startEdit = (item) => {
    setSelectedItem(item.rawItem);
    setSelectedSize(item.details.size || "Regular 16oz");
    setSelectedTemp(item.details.temp || "Iced");
    setSelectedFlavor(item.details.flavor || "Cheese");
    setSelectedAddOns(item.details.addOns || []);
    setQuantity(item.quantity);
    setEditingId(item.id);
    setShowCartPanel(false);
  };

  const totalPrice = cartItems.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-serif flex flex-col text-[#3D2317]">
      {/* HEADER */}
      <header className="px-8 py-6 bg-white border-b flex justify-between items-center">
        <button onClick={goBack} className="flex items-center text-[#8CB662] font-black uppercase text-[10px] tracking-widest">
          <IoIosArrowBack size={20} className="mr-1"/> Back
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-widest uppercase italic leading-none">Mi Amore</h1>
          <p className="text-[8px] tracking-[0.5em] uppercase mt-1 text-[#8CB662]">Est. 2026</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* CATEGORY NAV */}
      <nav className="px-6 py-6 bg-[#8CB662]/50 border-b flex items-center">
        <button onClick={() => scrollRef.current.scrollBy({left: -200, behavior:'smooth'})} className="p-2 text-[#8CB662]"><FaChevronLeft/></button>
        <div ref={scrollRef} className="flex-1 flex overflow-x-auto no-scrollbar gap-8 px-4">
          {categories.map(cat => (
            <div key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`flex flex-col items-center min-w-[120px] cursor-pointer border-b-2 ${selectedCategory === cat.name ? "border-[#7C8B7C]" : "border-transparent opacity-40"}`}>
              <img src={cat.image} className="w-12 h-12 object-contain mb-2" alt=""/>
              <span className="text-[9px] font-black uppercase tracking-widest mb-2">{cat.name}</span>
            </div>
          ))}
        </div>
        <button onClick={() => scrollRef.current.scrollBy({left: 200, behavior:'smooth'})} className="p-2 text-[#7C8B7C]"><FaChevronRight/></button>
      </nav>

      {/* MENU GRID */}
      <main className="flex-1 overflow-y-auto px-10 pt-10 pb-40">
        <h2 className="text-4xl font-black italic uppercase mb-10 border-l-4 border-[#8CB662] pl-6">{selectedCategory}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {allMenuItems[selectedCategory]?.map(item => (
            <motion.div key={item.id} whileTap={{scale:0.95}} onClick={() => {
                setSelectedItem(item);
                if(item.isFries) setSelectedSize("Regular");
                else if(item.isSticks) setSelectedSize("10 pcs");
                else if(item.isHash) setSelectedSize("2 pcs");
                else if(item.hasSize) setSelectedSize("Regular 16oz");
            }} className="bg-white p-6 border border-[#8CB662]/10 text-center cursor-pointer shadow-sm">
              <img src={item.image} className="w-full h-32 object-contain mb-4" alt=""/>
              <h3 className="font-black uppercase text-[10px] tracking-widest h-8 mb-2">{item.name}</h3>
              <p className="font-bold text-[#8CB662] text-xs">₱{item.hasSize ? `${item.price16oz}/${item.price22oz}` : (item.price || "—")}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ITEM MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#3D2317]/80 backdrop-blur-sm p-4">
            <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#FDFCF8] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden rounded-sm border-t-8 border-[#7C8B7C]">
              <div className="flex-1 overflow-y-auto p-10 relative">
                <button onClick={() => {setSelectedItem(null); setSelectedAddOns([]); setEditingId(null);}} className="absolute top-6 right-6 text-[#3D2317]"><X/></button>
                <div className="flex flex-col items-center">
                  <img src={selectedItem.image} className="w-40 h-40 object-contain mb-6" alt=""/>
                  <h2 className="text-2xl font-black uppercase italic text-center mb-2">{selectedItem.name}</h2>
                  
                  <div className="w-full max-w-sm space-y-8 mt-6">
                    {(selectedItem.hasSize || selectedItem.isFries || selectedItem.isSticks || selectedItem.isHash) && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#7C8B7C]">Select Size/Quantity</label>
                        <div className="grid grid-cols-2 gap-3">
                          {(selectedItem.hasSize ? ["Regular 16oz", "Large 22oz"] : 
                            selectedItem.isFries ? ["Regular", "Large"] :
                            selectedItem.isSticks ? ["10 pcs", "15 pcs"] : ["2 pcs", "3 pcs"]
                          ).map(sz => (
                            <button key={sz} onClick={() => setSelectedSize(sz)} className={`py-3 text-[10px] font-black border ${selectedSize === sz ? 'bg-[#7C8B7C] text-white border-[#7C8B7C]' : 'border-[#7C8B7C]/20'}`}>{sz}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedItem.hasTemp || ["Specialty Coffee", "Premium Matcha"].includes(selectedCategory)) && selectedItem.name !== "Matcha Ichigo (Iced Only)" && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8CB662]">Temperature</label>
                        <div className="flex gap-4">
                          {["Hot", "Iced"].map(t => (
                            <button key={t} onClick={() => setSelectedTemp(t)} className={`flex-1 py-3 text-[10px] font-black border ${selectedTemp === t ? 'bg-[#3D2317] text-white' : 'border-[#7C8B7C]/20'}`}>{t}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.isFries && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8CB662]">Flavor</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Cheese", "Sour & Cream", "BBQ", "Butter Cheese", "Honey Butter"].map(f => (
                            <button key={f} onClick={() => setSelectedFlavor(f)} className={`p-2 text-[9px] font-black border ${selectedFlavor === f ? 'bg-[#3D2317] text-white' : 'border-[#7C8B7C]/20'}`}>{f} {f === "Honey Butter" && "(+₱5)"}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {["Milk Tea", "Specialty Coffee", "Lemonade & Fruit Juices", "Quesadillas & Corndogs"].includes(selectedCategory) && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8CB662]">Extras / Add-ons</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            selectedCategory === "Milk Tea" ? [
                              {name:"Pearls", price:20}, {name:"Nata", price:20}, {name:"Coffee Jelly", price:25}, 
                              {name:"Crushed Oreo", price:20}, {name:"Cream Cheese", price:30}, {name:"Strawberry Popping Bobba", price:20}
                            ] : selectedCategory === "Specialty Coffee" ? [
                              {name:"Oat Milk", price:40}, {name:"Extra Espresso Shot", price:60}
                            ] : selectedCategory === "Lemonade & Fruit Juices" ? [
                                {name:"Pearls", price:20}, {name:"Nata", price:20}, {name:"Strawberry Popping Bobba", price:20}
                            ] : selectedItem.isBeefQ ? [
                                {name:"Extra Garlic Sauce", price:20}
                            ] : []
                          ).map(addon => (
                            <button key={addon.name} onClick={() => toggleAddOn(addon)} className={`p-3 text-[9px] font-black border flex justify-between items-center ${selectedAddOns.find(a => a.name === addon.name) ? 'bg-[#7C8B7C]/10 border-[#7C8B7C]' : 'border-[#7C8B7C]/10'}`}>
                              <span>{addon.name}</span>
                              <span className="opacity-60">+₱{addon.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center pt-6">
                      <span className="text-[9px] font-black uppercase text-[#8CB662] mb-4">Quantity</span>
                      <div className="flex items-center gap-8">
                        <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-10 h-10 border flex items-center justify-center font-bold text-xl">-</button>
                        <span className="text-3xl font-black italic">{quantity}</span>
                        <button onClick={() => setQuantity(quantity+1)} className="w-10 h-10 bg-[#8CB662] text-white flex items-center justify-center font-bold text-xl">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 border-t flex gap-4">
                <button onClick={() => {setSelectedItem(null); setSelectedAddOns([]); setEditingId(null);}} className="flex-1 py-4 uppercase font-black tracking-widest text-[10px] border">Cancel</button>
                <button onClick={handleAddToCart} className="flex-[2] bg-[#3D2317] text-white py-4 uppercase font-black tracking-widest text-[10px] shadow-lg">
                  {editingId ? 'Update Item' : 'Add to Order'} • ₱{getCurrentPrice(selectedItem).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART MODAL (ORDER REVIEW) */}
      <AnimatePresence>
        {showCartPanel && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center bg-[#3D2317]/90 backdrop-blur-md p-0 sm:p-4">
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-[#FDFCF8] w-full max-w-lg h-[90vh] sm:h-[80vh] flex flex-col shadow-2xl border-t-8 border-[#8CB662] overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <ReceiptText className="text-[#8CB662]" size={24}/>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Order Summary</h2>
                </div>
                <button onClick={() => setShowCartPanel(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                        <ShoppingBag size={64} className="mb-4"/>
                        <p>Your bag is empty</p>
                    </div>
                ) : cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-[#8CB662]/10 bg-white shadow-sm">
                    <img src={item.image} className="w-20 h-20 object-contain bg-[#F9F7F2]" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black uppercase text-xs tracking-widest">{item.name}</h3>
                        <p className="font-bold text-sm">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="text-[10px] text-[#8CB662] font-medium mt-1 leading-relaxed">
                        {item.details.size && <span>{item.details.size}</span>}
                        {item.details.temp && <span> • {item.details.temp}</span>}
                        {item.details.flavor && <span> • {item.details.flavor}</span>}
                        <div className="mt-1 font-black text-[#3D2317]">Qty: {item.quantity}</div>
                      </div>
                      <div className="flex gap-4 mt-3">
                        <button onClick={() => startEdit(item)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-800"><FaEdit/> Edit</button>
                        <button onClick={() => deleteItem(item.id)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-800"><FaTrash/> Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-[#8CB662]">Total Bill</span>
                    <span className="text-3xl font-black italic">₱{totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={() => { localStorage.setItem("kiosk_cart", JSON.stringify(cartItems)); router.visit("/paymentselect"); }} className="w-full bg-[#3D2317] text-white py-5 uppercase font-black tracking-[0.2em] text-[11px] shadow-xl flex justify-center items-center gap-2">
                  Confirm & Pay <IoIosArrowForward size={16}/>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BOTTOM BAR */}
      <footer 
        onClick={() => cartItems.length > 0 && setShowCartPanel(true)}
        className="fixed bottom-0 w-full bg-[#3D2317] text-white p-8 border-t-4 border-[#7C8B7C] z-[90] cursor-pointer"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white/5 p-4 border border-white/10 relative">
              <ShoppingBag size={24} className="text-[#8CB662]"/>
              <span className="absolute -top-2 -right-2 bg-[#8CB662] text-white w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full">{cartItems.length}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#8CB662] uppercase tracking-widest mb-1">Total Bill</p>
              <p className="text-3xl font-black italic">₱{totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-[#8CB662] uppercase font-black tracking-widest text-[10px] flex items-center gap-3">
            Review Bag <ReceiptText size={16}/>
          </div>
        </div>
      </footer>
    </div>
  );
}