import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface AuthProps {
  user: null | {
    id: number;
    name: string;
    email: string;
  };
  customer: null | {
    id: number;
    name: string;
    email: string;
    role: "customer";
  };
}

interface PageProps extends InertiaPageProps {
  auth: AuthProps;
}


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
  rawPrice: { regular?: string; large?: string };
}

const FruiteaJuiceItems: React.FC = () => {
  const [items, setItems] = useState<FruiteaItem[]>([]);
  const [activeTab, setActiveTab] =
    useState<"All" | "Lemonade" | "Fruit">("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<FruiteaItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("16oz");
  const [selectedAddOn, setSelectedAddOn] = useState("");


  const drinkOptions = {
    sizes: ["16oz", "22oz"],
    addOns: ["Pearls", "Nata", "Coffee Jelly", "Strawberry Popping Bobba"],
  };

const { props } = usePage<PageProps>();
const auth = props.auth;
const isLoggedIn = Boolean(auth?.customer);

  /* 📦 FETCH MENU */
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data || [];

        const fruiteaItems = data
          .filter((item) =>
            item.subcategories.some((sub) =>
              sub.startsWith("Lemonade and Fruitti Juice:")
            )
          )
          .map((item) => {
            const sub = item.subcategories.find((sc) =>
              sc.startsWith("Lemonade and Fruitti Juice:")
            );

            const category: "Lemonade" | "Fruit" =
              sub?.split(":")[1]?.trim() === "Fruit"
                ? "Fruit"
                : "Lemonade";

            return {
              id: item.id,
              name: item.name,
              description: item.description,
              category,
              image: item.image_path,
              rawPrice: item.price,
            };
          });

        setItems(fruiteaItems);
      })
      .catch(console.error);
  }, []);

  /* 🔍 FILTER */
  const filteredItems = items.filter((item) => {
    const matchTab = activeTab === "All" || item.category === activeTab;
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  /* HELPERS */
  const handleDecrease = () => quantity > 1 && setQuantity((q) => q - 1);
  const handleIncrease = () => setQuantity((q) => q + 1);

  const getPriceForSize = (item: FruiteaItem) =>
    selectedSize === "22oz" && item.rawPrice.large
      ? `₱${item.rawPrice.large}`
      : `₱${item.rawPrice.regular}`;

  /* 🛒 ADD TO CART */
  const handleAddToCart = async () => {
  if (!isLoggedIn || !selectedItem) {
    alert("Please log in to add items to cart.");
    return;
  }

  const price =
    selectedSize === "22oz" && selectedItem.rawPrice.large
      ? selectedItem.rawPrice.large
      : selectedItem.rawPrice.regular;

  try {
    await axios.post("/cart/add", {
      product_id: selectedItem.id,
      product_name: selectedItem.name,
      size: selectedSize,
      quantity,
      instructions: selectedAddOn || "",
      price,
    });

    alert("Item added to cart!");

    setSelectedItem(null);
    setQuantity(1);
    setSelectedSize("16oz");
    setSelectedAddOn("");
  } catch (err) {
    console.error(err);
    alert("Failed to add item to cart.");
  }
};


  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs & Search Container */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
  
  {/* Tabs Section */}
  <div className="w-full md:w-auto overflow-hidden">
    <div 
      className="flex flex-nowrap gap-3 pb-2 md:pb-0 overflow-x-auto no-scrollbar"
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

      {["All", "Lemonade", "Fruit"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-sm font-bold transition-all duration-200 ${
            activeTab === tab
              ? "bg-[#8CB662] text-white border-[#8CB662] shadow-md"
              : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>

  {/* Search Bar Section */}
  <div className="relative w-full md:max-w-xs lg:max-w-md">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search fruitea juice..."
      className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8CB662]/50 transition-all shadow-sm"
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
              setSelectedSize("16oz");
              setSelectedAddOn("");
            }}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden border bg-white cursor-pointer text-black"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image}`}
                alt={item.name}
                className="w-60 h-60 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.description}
              </p>
              <div className="text-right text-[#76B13A] font-bold">
                ₱{item.rawPrice.regular}
                {item.rawPrice.large &&
                  ` | ₱${item.rawPrice.large}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded p-8 relative text-black">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>

            {/* Dynamic Price */}
            <div className="text-gray-900 font-bold text-xl mb-4">
              {getPriceForSize(selectedItem)}
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Quantity</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleDecrease}
                  className="px-3 border rounded-full bg-white text-black hover:bg-[#8CB662] hover:text-white"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="px-3 border rounded-full bg-white text-black hover:bg-[#8CB662] hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Cup Size</label>
              <div className="h-[2px] bg-[#8CB662] my-2" />
              <div className="flex gap-2">
                {drinkOptions.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-[95px] h-[30px] border rounded-full text-sm ${
                      selectedSize === s
                        ? "bg-[#8CB662] text-white border-[#8CB662]"
                        : "bg-white text-black hover:bg-[#8CB662] hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Add-ons</label>
              <div className="h-[2px] bg-[#8CB662] my-2" />
              <select
                value={selectedAddOn}
                onChange={(e) => setSelectedAddOn(e.target.value)}
                className="border border-[#8CB662] bg-white text-black rounded px-2 py-1 text-sm w-[300px]"
              >
                <option value="">Select an add-on</option>
                {drinkOptions.addOns.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart */}
            {isLoggedIn ? (
              <button
                onClick={handleAddToCart}
                className="w-[150px] border border-[#8CB662] bg-white text-black hover:bg-[#8CB662] hover:text-white rounded-full font-semibold py-2"
              >
                Add to Cart
              </button>
            ) : (
              <div className="text-red-500 font-semibold">
                Please log in to order.
              </div>
            )}
          </div>
        </div>
      )}
          </div>
       
    );
};

export default FruiteaJuiceItems;
