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
  const { props } = usePage<PageProps>();
  const auth = props.auth;
  const isLoggedIn = Boolean(auth?.customer);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedAddOn, setSelectedAddOn] = useState("");

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => setItems(res.data.items || res.data))
      .catch(console.error);
  }, []);

  /* ---------------- CATEGORY ---------------- */
  const capitalize = (s: string) =>
    s.replace(/\b\w/g, (l) => l.toUpperCase());

  const categories = [
    "All",
    ...Array.from(
      new Set(items.flatMap((i) => i.categories.map(capitalize)))
    ),
  ];

  const filtered = items.filter((i) => {
    const matchTab =
      activeTab === "All" ||
      i.categories.some((c) => capitalize(c) === activeTab);
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  /* ---------------- OPTIONS ---------------- */
  const normalize = (s: string) => s.toLowerCase().trim();

  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    coffee: { flavors: [], addOns: ["Extra Coffee Shot"] },
    "specialty coffee": {
      flavors: ["Hot", "Cold"],
      addOns: ["Oat Milk", "Extra Espresso"],
    },
    "milk tea": {
      flavors: [],
      addOns: ["Pearls", "Nata", "Coffee Jelly"],
    },
    "premium matcha": {
      flavors: ["Hot", "Cold"],
      addOns: ["Oat Milk"],
    },
  };

  const getOptionsFor = (item: MenuItem) => {
    const all = [...item.categories, ...item.subcategories].map(normalize);
    const key = all.find((k) => optionsMap[k]);
    return key ? optionsMap[key] : { flavors: [], addOns: [] };
  };

  const getAvailableSizes = (price: { regular?: string; large?: string }) => {
    const sizes: string[] = [];
    if (price.regular) sizes.push("16oz");
    if (price.large) sizes.push("22oz");
    return sizes;
  };

  /* ---------------- CART ---------------- */
  const handleAddToCart = async () => {
    if (!isLoggedIn || !selectedItem) {
      alert("Please log in to order.");
      return;
    }

    try {
      await axios.post("/cart/add", {
        product_id: selectedItem.id,
        product_name: selectedItem.name,
        quantity,
        size: selectedSize,
        instructions: selectedAddOn || selectedFlavor || "",
        price:
          selectedSize === "22oz" && selectedItem.price.large
            ? selectedItem.price.large
            : selectedItem.price.regular,
      });

      alert("Item added to cart!");
      setSelectedItem(null);
      setQuantity(1);
      setSelectedSize(null);
      setSelectedFlavor("");
      setSelectedAddOn("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart.");
    }
  };
  /* ---------------- UI ---------------- */
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
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setSelectedSize("16oz");
              setQuantity(1);
              setSelectedFlavor("");
              setSelectedAddOn("");
            }}
            className="rounded-2xl shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-100 bg-white cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image_path}`}
                alt={item.name}
                className="w-60 h-60 object-contain rounded-xl"
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
                ₱{item.price.regular}
                {item.price.large && ` | ₱${item.price.large}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL — COPIED FROM CoffeeItems */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded p-8 relative">
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
                <h2 className="text-xl font-bold mb-2">
                  {selectedItem.name}
                </h2>

                <div className="text-[#65B741] font-bold text-xl mb-2">
                  {selectedSize === "22oz" && selectedItem.price.large
                    ? `₱${selectedItem.price.large}`
                    : `₱${selectedItem.price.regular}`}
                </div>

                <p className="text-md text-gray-700 mb-4">
                  {selectedItem.description}
                </p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Quantity</label>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size */}
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

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  if (!opts.flavors.length && !opts.addOns.length) return null;

                  return (
                    <>
                      {opts.flavors.length > 0 && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold">
                            Options
                          </label>
                          <div className="h-[2px] bg-[#8CB662] my-2" />
                          <select
                            value={selectedFlavor}
                            onChange={(e) =>
                              setSelectedFlavor(e.target.value)
                            }
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
                          <label className="text-sm font-semibold">
                            Add-ons
                          </label>
                          <div className="h-[2px] bg-[#8CB662] my-2" />
                          <select
                            value={selectedAddOn}
                            onChange={(e) =>
                              setSelectedAddOn(e.target.value)
                            }
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

                <div className="flex gap-10 mt-6">
                  {isLoggedIn ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-[150px] border border-[#8CB662] text-sm rounded-4xl text-[#8CB662] hover:bg-[#8CB662] hover:text-white font-semibold py-2"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularItems;
