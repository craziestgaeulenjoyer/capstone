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
  const [activeTab, setActiveTab] = useState<"All" | "Lemonade" | "Fruit">("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<FruiteaItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddOn, setSelectedAddOn] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const drinkOptions = {
    sizes: ["16oz", "22oz"],
    addOns: ["Pearls", "Nata", "Coffee Jelly", "Strawberry Popping Bobba"],
  };

  /* 🔐 CHECK LOGIN */
  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    setIsLoggedIn(!!token);
  }, []);

  /* 📦 FETCH ITEMS */
  useEffect(() => {
    axios.get("/api/menu")
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data;

        const filtered = data.filter((item) =>
          item.subcategories.some((sub) =>
            sub.startsWith("Lemonade and Fruitti Juice:")
          )
        );

        const fruiteaItems: FruiteaItem[] = filtered.map((item) => {
          const sub = item.subcategories.find((sc) =>
            sc.startsWith("Lemonade and Fruitti Juice:")
          );

          let category: "Lemonade" | "Fruit" = "Lemonade";
          if (sub?.split(":")[1]?.trim() === "Fruit") category = "Fruit";

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
            image: item.image_path,
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        setItems(fruiteaItems);
      })
      .catch(console.error);
  }, []);

  /* 🔍 FILTER */
  const filteredItems = items.filter((item) => {
    const byCat = activeTab === "All" || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  /* 🛒 ADD TO CART */
  const handleAddToCart = async () => {
    const token = localStorage.getItem("customer_token");
    if (!token || !selectedItem) {
      alert("Please log in to add items to cart.");
      return;
    }

    const price =
      selectedSize === "22oz"
        ? selectedItem.rawPrice.large
        : selectedItem.rawPrice.regular;

    try {
      await axios.post(
        "/api/cart/add",
        {
          product_id: selectedItem.id,
          product_name: selectedItem.name,
          size: selectedSize,
          quantity,
          instructions: selectedAddOn || "",
          price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Item added to cart!");
      setSelectedItem(null);
      setQuantity(1);
      setSelectedSize(null);
      setSelectedAddOn("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart.");
    }
  };

  /* GET DYNAMIC PRICE BASED ON SIZE */
  const getPriceForSize = (item: FruiteaItem) => {
    if (!selectedSize) return item.price;
    return selectedSize === "22oz" && item.rawPrice.large
      ? `₱${item.rawPrice.large}`
      : `₱${item.rawPrice.regular}`;
  };

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex gap-3">
          {["All", "Lemonade", "Fruit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full border ${
                activeTab === tab
                  ? "bg-[#8CB662] text-white"
                  : "border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fruitea juice..."
            className="w-full pl-10 pr-4 py-2 rounded-full border"
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
              setSelectedSize("16oz"); // default selected size
              setSelectedAddOn("");
            }}
            className="bg-white rounded-xl shadow cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image}`}
                className="w-60 h-60 object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm">{item.description}</p>
              <div className="text-right text-[#76B13A] font-bold">
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white max-w-4xl w-full p-10 rounded relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>

            {/* Dynamic Price */}
            <div className="text-gray-900 font-bold text-xl mb-4">
              {getPriceForSize(selectedItem)}
            </div>

            {/* Quantity */}
            <div className="flex gap-2 mb-4">
              <button onClick={handleDecrease} className="px-3 border rounded">-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease} className="px-3 border rounded">+</button>
            </div>

            {/* Sizes */}
            <div className="flex gap-2 mb-4">
              {drinkOptions.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1 border rounded-full ${
                    selectedSize === s ? "bg-[#8CB662] text-white" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Add-ons */}
            <select
              value={selectedAddOn}
              onChange={(e) => setSelectedAddOn(e.target.value)}
              className="border px-2 py-1 mb-6"
            >
              <option value="">Select add-on</option>
              {drinkOptions.addOns.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {/* Buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleAddToCart}
                className="border px-6 py-2 rounded hover:bg-[#8CB662] hover:text-white"
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
