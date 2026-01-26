import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ReceiptText } from "lucide-react";
import { router } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import axios from "axios";

export default function KioskMenu() {
  // --- STATES ---
  const [selectedCategory, setSelectedCategory] = useState("");
  const { url } = usePage();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Regular 16oz");
  const [selectedTemp, setSelectedTemp] = useState("Iced");
  const [selectedFlavor, setSelectedFlavor] = useState("Cheese");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [menuStatus, setMenuStatus] = useState({});
  const [menuItems, setMenuItems] = useState({});

  const scrollRef = useRef(null);
  const goBack = () => {
    axios.post("/kiosk/cart/clear").finally(() => {
      setCartItems([]);
      setSelectedItem(null);
      setSelectedAddOns([]);
      setQuantity(1);
      setEditingId(null);
      setShowCartPanel(false);
      router.visit("/kioskhome"); // safer than history.back() for kiosks
    });
  };

  // --- DATA STRUCTURE ---

  // Main categories
  const categories = [
    { id: "c1", name: "Popular", image: "/images/SpecialtyCoffee.png" },
    { id: "c2", name: "Coffees", image: "/images/Coffee.png" },
    { id: "c3", name: "Milktea", image: "/images/MilkTea.png" },
    { id: "c4", name: "Lemonade and Fruitti Juice", image: "/images/Lemonade_FruitJuices.png" },
    { id: "c5", name: "Premium Matcha", image: "/images/PremiumMatcha.png" },
    { id: "c6", name: "Foods", image: "/images/Snacks.png" },
  ];

  // Optional: Local images for fallback
  const localImages = {
    'Coffee': '/images/Coffee.png',
    'Specialty Coffee': '/images/SpecialtyCoffee.png',
    'Milk Tea': '/images/MilkTea.png',
    'Lemonade and Fruit Juices': '/images/Lemonade_FruitJuices.png',
    'Premium Matcha': '/images/PremiumMatcha.png',
    'Snacks': '/images/Snacks.png',
    'Croffles': '/images/Croffles.png',
    'Quesadillas & Korean Corndogs': '/images/Quesadillas_Corndogs.png',
    'Platters': '/images/Platter3.png',
  };

  useEffect(() => {
    axios.get("/kiosk/cart").then(res => {
      setCartItems(res.data);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(url.split("?")[1]);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl && menuItems[categoryFromUrl]) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("Popular"); // default category
    }
  }, [url, menuItems]);

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    const lower = cat.toLowerCase().trim();
    switch (lower) {
      case 'milktea': return 'Milk Tea';
      case 'coffees': return 'Coffee';
      case 'lemonade and fruitti juice': return 'Lemonade and Fruit Juices';
      case 'premium matcha': return 'Premium Matcha';
      case 'popular': return 'Specialty Coffee';
      case 'foods': return 'Snacks';
      default: return cat;
    }
  };
  
  useEffect(() => {
    axios.get("/kiosk/menu-status")
      .then(res => {
        const apiMenu = res.data; // grouped by category from backend

        // Merge API menu with local images
        const mergedMenu = {};
        Object.keys(apiMenu).forEach(category => {
          mergedMenu[category] = apiMenu[category].map(item => {
            const categoryName = normalizeCategory(item.category);

            return {
              ...item,

              image: item.image
                ? `http://127.0.0.1:8000/storage/${item.image}`
                : localImages[normalizeCategory(item.category)] || "",

              status: item.is_available ? "available" : "not_available",
              maxQuantity: Number(item.max_quantity ?? 0),
            };
          });
        });
        setMenuItems(mergedMenu);
      });
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
    }
  }, [selectedItem]);

  const getMenuItemsForCategory = (category) => {
    if (!category) return [];

    return Object.values(menuItems)
      .flat()
      .filter(item => item.category === category);
  };

  // --- LOGIC ---
  const getCurrentPrice = (item) => {
    if (!item || !item.price) return 0;

    let base = 0;

    // DRINKS WITH SIZES
    if (item.sizes && item.sizes.length > 1) {
      if (selectedSize?.toLowerCase().includes("large")) {
        base = Number(item.price.large ?? item.price.regular ?? 0);
      } else {
        base = Number(item.price.regular ?? item.price.large ?? 0);
      }
    } 
    // SINGLE SIZE ITEMS (foods, single-size drinks)
    else {
      base = Number(item.price.regular ?? item.price.large ?? 0);
    }

    const addOnsTotal = selectedAddOns.reduce(
      (sum, a) => sum + Number(a.price || 0),
      0
    );

    const flavorPlus =
      item.isFries && selectedFlavor === "Honey Butter" ? 5 : 0;

    return (base + addOnsTotal + flavorPlus) * quantity;
  };

  const toggleAddOn = (addon) => {
    setSelectedAddOns(prev => prev.find(a => a.name === addon.name) ? prev.filter(a => a.name !== addon.name) : [...prev, addon]);
  };

  const handleAddToCart = () => {
    const pricePerUnit = Number(getCurrentPrice(selectedItem) / quantity);
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

  const totalPrice = cartItems.reduce((s, i) => s + (Number(i.price) * i.quantity), 0);

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
            <div
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center min-w-[120px] cursor-pointer border-b-2 
                ${selectedCategory === cat.name 
                  ? "border-[#7C8B7C]" 
                  : "border-transparent opacity-40"}`}
            >
              {/* Category Image */}
              <img 
                src={cat.image || localImages[cat.name]} 
                className="w-12 h-12 object-contain mb-2" 
                alt={cat.name} 
              />
              {/* Category Name */}
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
          {getMenuItemsForCategory(selectedCategory).map(item => (
            <motion.div
              key={item.id}
              whileTap={item.status === "available" ? { scale: 0.95 } : {}}
              onClick={() => {
                if (item.status !== "available") return;

                setSelectedItem(item);
                setQuantity(1);

                setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : "Regular 16oz");
              }}
              className={`
                bg-white p-6 border border-[#8CB662]/10 text-center shadow-sm relative
                ${item.status !== "available"
                  ? "opacity-40 grayscale cursor-not-allowed"
                  : "cursor-pointer"}
              `}
            >
              <img src={item.image} className="w-full h-32 object-contain mb-4" alt=""/>
              <h3 className="font-black uppercase text-[10px] tracking-widest h-8 mb-2">{item.name}</h3>
              <p className="font-bold text-[#8CB662] text-xs">
                {item.price?.regular && item.price?.large
                  ? `₱${item.price.regular} / ₱${item.price.large}`
                  : item.price?.regular
                    ? `₱${item.price.regular}`
                    : item.price?.large
                      ? `₱${item.price.large}`
                      : "₱—"}
              </p>
            
              {item.status !== "available" && (
                <div className="absolute top-2 right-2 bg-red-700 text-white text-[9px] px-2 py-1 font-black uppercase">
                  {item.status === "sold_out" ? "Sold Out" : "Not Available"}
                </div>
              )}
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
                    {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#7C8B7C]">Select Size/Quantity</label>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedItem.sizes.map(sz => (
                            <button 
                              key={sz} 
                              onClick={() => setSelectedSize(sz)} 
                              className={`py-3 text-[10px] font-black border ${selectedSize === sz ? 'bg-[#7C8B7C] text-white border-[#7C8B7C]' : 'border-[#7C8B7C]/20'}`}
                            >
                              {sz}
                            </button>
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
                        <button
                          onClick={() =>
                            setQuantity(q => Math.min(q + 1, selectedItem.maxQuantity))
                          }
                          disabled={quantity >= selectedItem.maxQuantity}
                          className="w-10 h-10 bg-[#8CB662] text-white flex items-center justify-center font-bold text-xl disabled:opacity-30"
                        >
                          +
                        </button>

                        <p className="text-[9px] uppercase font-black text-[#8CB662] mt-2 text-center">
                          Available: {selectedItem.maxQuantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 border-t flex gap-4">
                <button onClick={() => {setSelectedItem(null); setSelectedAddOns([]); setEditingId(null);}} className="flex-1 py-4 uppercase font-black tracking-widest text-[10px] border">Cancel</button>
                <button
                  disabled={selectedItem.status !== "available"}
                  onClick={handleAddToCart}
                  className="flex-[2] bg-[#3D2317] disabled:opacity-40 text-white py-4 uppercase font-black tracking-widest text-[10px] shadow-lg"
                >
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
                <button onClick={() => { axios.post("/kiosk/cart/add", {
                          cartItems
                        }).then(() => {
                          router.visit("/paymentselect", {
                          
                          });
                        });}} className="w-full bg-[#3D2317] text-white py-5 uppercase font-black tracking-[0.2em] text-[11px] shadow-xl flex justify-center items-center gap-2">
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