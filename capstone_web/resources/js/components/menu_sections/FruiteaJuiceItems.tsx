import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";

interface ApiItem {
  id: number;
  name: string;
  description: string;
  image_path: string;
  price: { regular?: string; large?: string };
  categories: string[];
  subcategories: string[];
}

interface FruiteaItem {
  id: number;
  name: string;
  description: string;
  category: "Lemonade" | "Fruit";
  image: string;
  price: string;
  rawPrice: { regular?: string; large?: string };
}

const FruiteaJuiceItems: React.FC = () => {
  const [items, setItems] = useState<FruiteaItem[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Lemonade" | "Fruit">(
    "All"
  );
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<FruiteaItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddOn, setSelectedAddOn] = useState("");

  const drinkOptions = {
    sizes: ["16oz", "22oz"],
    addOns: ["Pearls", "Nata", "Coffee Jelly", "Strawberry Popping Bobba"],
  };

  // ---------------------------
  // FETCH ITEMS FROM API
  // ---------------------------
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        // Grab the array safely like MilkteaItems.tsx
        const data: ApiItem[] = res.data.items || res.data;

        console.log("✅ Fetched menu items from API:", data);

        // Filter items whose subcategories include MAIN_CATEGORY
        const filtered = data.filter((item) =>
          item.subcategories.some((sub) =>
            sub.startsWith("Lemonade and Fruitti Juice:")
          )
        );

        console.log("🔹 Items after subcategory filter:", filtered);

        // Map into FruiteaItem[]
        const fruiteaItems: FruiteaItem[] = filtered.map((item) => {
          const sub = item.subcategories.find((sc) =>
            sc.startsWith("Lemonade and Fruitti Juice:")
          );

          let category: "Lemonade" | "Fruit" = "Lemonade";
          if (sub) {
            const subCategory = sub.split(":")[1].trim();
            if (subCategory === "Fruit") category = "Fruit";
          }

          const { regular, large } = item.price;
          let formattedPrice = "";
          if (regular && large) formattedPrice = `₱${regular}/${large}`;
          else if (regular) formattedPrice = `₱${regular}`;
          else if (large) formattedPrice = `₱${large}`;

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category,
            image: item.image_path, // <-- just use it as is
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        console.log("🍹 Detected Fruitea Items:", fruiteaItems);

        setItems(fruiteaItems);
      })
      .catch((e) => console.error("Error loading fruitea items:", e));
  }, []);

  // ---------------------------
  // FILTER ITEMS
  // ---------------------------
  const filteredItems = items.filter((item) => {
    const matchCategory = activeTab === "All" || item.category === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Quantity handlers
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex flex-wrap gap-3">
          {["All", "Lemonade", "Fruit"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "All" | "Lemonade" | "Fruit")
              }
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#8CB662] text-white border-[#8CB662]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-700">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fruitea juice..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-500 rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8CB662]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
              setSelectedSize(null);
              setSelectedAddOn("");
            }}
            className="rounded-2xl shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-100 bg-white cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image}`}
                alt={item.name}
                className="w-50 h-50 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#2E3A2F]">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.description}
              </p>
              <div className="text-right text-lg text-[#76B13A] font-bold">
                {item.price}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No fruitea juice items found.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-full max-w-4xl rounded p-10 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={`/storage/${selectedItem.image}`}
                alt={selectedItem.name}
                className="w-[350px] h-[350px] object-contain border-[12px] border-[#E1E1E1] rounded bg-[#E1E1E1]"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {selectedItem.name}
                </h2>

                <div className="text-[#65B741] font-bold text-lg mb-2">
                  {selectedItem.price}
                </div>

                <p className="text-sm text-gray-700 mb-4 text-gray-900">
                  {selectedItem.description}
                </p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold text-gray-900">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={handleDecrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white text-gray-900"
                    >
                      -
                    </button>
                    <span className="text-gray-900">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size Options */}
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-1 text-gray-900">
                    Size options
                  </label>
                  <div className="h-[2px] w-full bg-[#8CB662] my-1" />

                  <div className="flex space-x-2 mt-4">
                    {drinkOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-[95px] h-[25px] border px-3 py-1 rounded-full text-xs shadow-md transition-colors text-gray-900 ${
                          selectedSize === size
                            ? "bg-[#8CB662] text-white border-[#8CB662]"
                            : "hover:bg-[#8CB662] hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div className="mb-8">
                  <label className="text-sm block font-semibold mb-1 text-gray-900">
                    Add-ons
                  </label>
                  <select
                    value={selectedAddOn}
                    onChange={(e) => setSelectedAddOn(e.target.value)}
                    className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-sm text-gray-900"
                  >
                    <option value="" disabled>
                      Select an add-on
                    </option>
                    {drinkOptions.addOns.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-40">
                  <button className="w-[150px] h-[35px] border border-[#8CB662] text-sm text-[#8CB662] rounded-lg font-semibold hover:bg-[#8CB662] shadow-md hover:text-white transition-colors">
                    Add to Cart
                  </button>
                  <button className="w-[150px] h-[35px] border border-[#8CB662] text-sm text-[#8CB662] rounded-lg font-semibold hover:bg-[#8CB662] shadow-md hover:text-white transition-colors">
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

export default FruiteaJuiceItems;
