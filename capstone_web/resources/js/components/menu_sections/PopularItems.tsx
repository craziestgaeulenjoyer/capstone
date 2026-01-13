// resources/js/Pages/website_pages/components/PopularItems.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  type: "food" | "drink";
  categories: string[];
  subcategories: string[];
  price: { regular: string; large?: string };
  image_path: string;
}

const PopularItems: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedAddOn, setSelectedAddOn] = useState<string>("");

  // Fetch menu items from backend
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }, []);

  // Capitalize first letter of each word
  const capitalize = (str: string) =>
    str.replace(/\b\w/g, (l) => l.toUpperCase());

  // Dynamic categories from DB
  const categories = [
    "All",
    ...Array.from(
      new Set(
        items
          .flatMap((i) => i.categories.map((c) => capitalize(c)))
          .filter((c) => c !== "Popular") // ⬅ REMOVE "Popular"
      )
    ),
  ];

  // Filter logic
  const filtered = items.filter((i) => {
    const matchesCategory =
      activeTab === "All" ||
      i.categories.some((c) => capitalize(c) === activeTab);
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Quantity handlers
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  // Helper: map DB category/subcategory to optionsMap key
  const mapToOptionsKey = (name: string) => {
    const key = name.toLowerCase().replace(/fruitti/g, "fruit").trim();
    if (["coffee", "coffees"].includes(key)) return "coffee";
    if (["milk tea", "milktea"].includes(key)) return "milk tea";
    if (["premium matcha"].includes(key)) return "premium matcha";
    if (["specialty coffee"].includes(key)) return "specialty coffee";
    if (["lemonade and fruit juices", "lemonade and frutti juice"].includes(key))
      return "lemonade and fruit juices";
    return key;
  };

  // Check if item is a drink
  const isDrinkCategory = (item: MenuItem) => {
    const drinkKeys = [
      "coffee",
      "milk tea",
      "premium matcha",
      "specialty coffee",
      "lemonade and fruit juices",
    ];
    const allCats = [...item.categories, ...item.subcategories].map(mapToOptionsKey);
    return allCats.some((c) => drinkKeys.includes(c));
  };

  // Get options for item
  const getOptionsFor = (item: MenuItem) => {
    const allCats = [...item.categories, ...item.subcategories].map(mapToOptionsKey);
    const cat = allCats.find((c) => optionsMap[c]);
    return cat ? optionsMap[cat] : { flavors: [], addOns: [] };
  };

  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    "premium matcha": { flavors: ["Hot", "Cold"], addOns: ["Oat Milk"] },
    "specialty coffee": { flavors: ["Hot", "Cold"], addOns: ["Oat Milk", "Extra Espresso"] },
    "lemonade and fruit juices": {
      flavors: [],
      addOns: ["Pearls", "Nata", "Coffee Jelly", "Strawberry Popping Bobba"],
    },
    coffee: { flavors: [], addOns: ["Extra Matcha", "Extra Coffee Shot"] },
    "milk tea": {
      flavors: [],
      addOns: [
        "Pearls",
        "Nata",
        "Coffee Jelly",
        "Crushed Oreo",
        "Cream Cheese",
        "Cheesecake",
        "Extra Matcha Shot",
      ],
    },
  };

  const formatPrice = (price: { regular: string; large?: string }) => {
    if (!price) return "";

    const values = [
      price.regular ? `₱${price.regular}` : null,
      price.large ? `₱${price.large}` : null,
    ];

    return values.filter(Boolean).join(" | ");
  };

  const getAvailableSizes = (price: { regular?: string; large?: string }) => {
    const sizes: string[] = [];

    if (price.regular) sizes.push("16oz");
    if (price.large) sizes.push("22oz");

    return sizes;
  };

  return (
    <div className="px-6 pt-10 pb-16">
    {/* Tabs & Search Container */}
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
  
  <div className="w-full lg:flex-1 overflow-hidden relative">
    <div 
      className="flex flex-nowrap items-center gap-2 sm:gap-3 pb-3 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {categories.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`whitespace-nowrap text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 rounded-full border transition-all duration-300 flex-shrink-0 ${
            activeTab === t
              ? "bg-[#8CB662] text-white border-[#8CB662] shadow-md scale-105"
              : "border-gray-200 text-gray-600 hover:border-[#8CB662] hover:text-[#8CB662] bg-white"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>

  {/* Search Bar */}
  <div className="relative w-full lg:w-[300px] xl:w-[400px] flex-shrink-0">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input
      type="text"
      placeholder="Search popular item..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-11 pr-4 py-2.5 text-sm bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8CB662]/50 transition-all shadow-sm"
    />
  </div>
</div>
      

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => {
          const isDrink = isDrinkCategory(item);
          const displayPrice = formatPrice(item.price);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="rrounded-2xl shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-100 bg-white cursor-pointer"
            >
              <div className="bg-[#E1E1E1] p-4 flex justify-center">
                <img
                  src={`/storage/${item.image_path}`}
                  alt={item.name}
                  className="w-60 h-60 object-contain rounded-xl"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#2E3A2F]">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="text-right text-lg text-[#76B13A] font-bold">
                  {displayPrice}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded p-10 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row gap-8 text-gray-900">
              <img
                src={`/storage/${selectedItem.image_path}`}
                alt={selectedItem.name}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-xl mb-2">
                  {formatPrice(selectedItem.price)}
                </div>
                <p className="text-md text-gray-700 mb-4">
                  {selectedItem.description}
                </p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold">Quantity</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={handleDecrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size (Drinks Only) */}
                {isDrinkCategory(selectedItem) && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold">Cup Size</label>
                    <div className="h-[2px] bg-[#8CB662] my-2" />
                    <div className="flex gap-2">
                      {getAvailableSizes(selectedItem.price).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-[95px] h-[30px] border rounded-4xl text-sm font-light shadow-lg ${
                            selectedSize === s
                              ? "bg-[#8CB662] text-white border-[#8CB662]"
                              : "hover:bg-[#8CB662] hover:text-white"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  const hasOptions = opts.flavors.length || opts.addOns.length;
                  if (!hasOptions) return null;

                  return (
                    <>
                      {opts.flavors.length > 0 && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold">Options</label>
                          <div className="h-[2px] bg-[#8CB662] my-2" />
                          <select
                            value={selectedFlavor}
                            onChange={(e) => setSelectedFlavor(e.target.value)}
                            className="border border-[#8CB662] rounded px-2 py-1 text-sm w-[300px]"
                          >
                            <option value="">Select option</option>
                            {opts.flavors.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {opts.addOns.length > 0 && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold">Add-ons</label>
                          <div className="h-[2px] bg-[#8CB662] my-2" />
                          <select
                            value={selectedAddOn}
                            onChange={(e) => setSelectedAddOn(e.target.value)}
                            className="border border-[#8CB662] rounded px-2 py-1 text-sm w-[300px]"
                          >
                            <option value="">Select an add-on</option>
                            {opts.addOns.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Buttons */}
                <div className="flex gap-10 mt-6">
                  <button className="w-[150px] border border-[#8CB662] text-sm rounded-4xl text-[#8CB662] hover:bg-[#8CB662] hover:text-white font-semibold py-2">
                    Add to Cart
                  </button>
                  <button className="w-[150px] border border-[#8CB662] text-sm rounded-4xl text-[#8CB662] hover:bg-[#8CB662] hover:text-white font-semibold py-2">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularItems;
