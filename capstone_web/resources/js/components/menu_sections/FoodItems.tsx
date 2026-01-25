import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface AuthProps {
  user: null | { id: number; name: string; email: string };
  customer: null | { id: number; name: string; email: string; role: "customer" };
}

interface PageProps extends InertiaPageProps {
  auth: AuthProps;
}

interface ApiItem {
  id: number;
  name: string;
  description: string;
  categories: string[];
  subcategories: string[];
  image_path: string;
  price: { regular?: number; large?: number };
  is_available: boolean;
}

interface FoodItem {
  id: number;
  name: string;
  description: string;
  category: "Snacks" | "Platters" | "Croffles" | "Quesadillas & Korean Corndogs";
  image: string;
  rawPrice: { regular?: number; large?: number };
  is_available: boolean;
}

const SUBCATEGORIES = [
  "Snacks",
  "Platters",
  "Croffles",
  "Quesadillas & Korean Corndogs",
] as const;

const categories: ("All" | FoodItem["category"])[] = ["All", ...SUBCATEGORIES];

const FoodItems: React.FC = () => {
  const { props } = usePage<PageProps>();
  const auth = props.auth;
  const isLoggedIn = Boolean(auth?.customer);

  const [items, setItems] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | FoodItem["category"]>("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>("regular");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedExtra, setSelectedExtra] = useState("");

  /* ---------------- HELPERS ---------------- */
  const handleDecrease = () => quantity > 1 && setQuantity((q) => q - 1);
  const handleIncrease = () => setQuantity((q) => q + 1);

  const getAvailableSizes = (price: { regular?: number; large?: number }) => {
    const sizes: string[] = [];
    if (price.regular) sizes.push("regular");
    if (price.large) sizes.push("large");
    return sizes;
  };

  const getOptionsFor = (item: FoodItem) => {
    const map: Record<string, { flavors?: string[]; extras?: string[] }> = {
      Fries: { flavors: ["Cheese", "BBQ", "Sour Cream"] },
      "Cheese Sticks": { extras: ["10 pcs", "15 pcs"] },
      "Hash Brown": { extras: ["2 pcs", "3 pcs"] },
    };
    return map[item.name] || {};
  };

  const getPriceForSize = (item: FoodItem) =>
    selectedSize === "large" && item.rawPrice.large
      ? `₱${item.rawPrice.large}`
      : `₱${item.rawPrice.regular}`;

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data || [];
        const foodItems: FoodItem[] = data
          .filter((item) =>
            item.subcategories.some((sub) =>
              SUBCATEGORIES.some((cat) => sub.endsWith(`:${cat}`))
            )
          )
          .map((item) => {
            const sub = item.subcategories.find((sc) =>
              SUBCATEGORIES.some((cat) => sc.endsWith(`:${cat}`))
            );
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              category: (sub?.split(":")[1] || "Snacks") as FoodItem["category"],
              image: `/storage/${item.image_path}`,
              rawPrice: item.price,
              is_available: item.is_available,
            };
          });

        setItems(foodItems);
      })
      .catch(console.error);
  }, []);

  /* ---------------- FILTER ---------------- */
  const filtered = items.filter((item) => {
    const byCat = activeTab === "All" || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    if (!isLoggedIn || !selectedItem) {
      alert("Please log in to add items to cart.");
      return;
    }
    if (!selectedItem.is_available) {
      alert("This item is sold out.");
      return;
    }

    const price =
      selectedSize === "large" ? selectedItem.rawPrice.large : selectedItem.rawPrice.regular;

    try {
      await axios.post("/cart/add", {
        product_id: selectedItem.id,
        product_name: selectedItem.name,
        size: selectedSize,
        quantity,
        instructions: selectedExtra || selectedFlavor || "",
        price,
      });

      alert("Item added to cart!");
      setSelectedItem(null);
      setQuantity(1);
      setSelectedSize("regular");
      setSelectedFlavor("");
      setSelectedExtra("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart.");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="w-full md:w-auto overflow-hidden">
          <div
            className="flex flex-nowrap gap-3 pb-2 md:pb-0 overflow-x-auto no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {categories.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`whitespace-nowrap px-6 py-2 rounded-full border font-bold text-sm transition-all duration-200 ${
                  activeTab === t
                    ? "bg-[#8CB662] text-white border-[#8CB662] shadow-md"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:max-w-xs lg:max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8CB662]/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (!item.is_available) return;
              setSelectedItem(item);
              setSelectedSize("regular");
              setQuantity(1);
              setSelectedFlavor("");
              setSelectedExtra("");
            }}
            className={`rounded-2xl transition text-black ${
              item.is_available
                ? "bg-white shadow hover:shadow-lg cursor-pointer"
                : "bg-gray-100 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="relative bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={item.image}
                className={`w-60 h-60 object-contain rounded-xl ${!item.is_available ? "grayscale" : ""}`}
              />
              {!item.is_available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="text-right text-[#76B13A] font-bold">
                ₱{item.rawPrice.regular}
                {item.rawPrice.large && ` | ₱${item.rawPrice.large}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full rounded p-8 relative text-black">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedItem.image}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>

                <div className="text-[#65B741] font-bold text-xl mb-2">
                  {getPriceForSize(selectedItem)}
                </div>

                <p className="text-gray-700 mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Quantity</label>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-3 border rounded-full bg-white text-black hover:bg-[#8CB662] hover:text-white"
                      onClick={handleDecrease}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="px-3 border rounded-full bg-white text-black hover:bg-[#8CB662] hover:text-white"
                      onClick={handleIncrease}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Size</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <div className="flex gap-2">
                    {getAvailableSizes(selectedItem.rawPrice).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-1 rounded-full border text-sm ${
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

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  return (
                    <>
                      {opts.flavors && (
                        <select
                          value={selectedFlavor}
                          onChange={(e) => setSelectedFlavor(e.target.value)}
                          className="border rounded px-2 py-1 mb-3 w-[300px] bg-white text-black"
                        >
                          <option value="">Select flavor</option>
                          {opts.flavors.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      )}

                      {opts.extras && (
                        <select
                          value={selectedExtra}
                          onChange={(e) => setSelectedExtra(e.target.value)}
                          className="border rounded px-2 py-1 mb-4 w-[300px] bg-white text-black"
                        >
                          <option value="">Select extra</option>
                          {opts.extras.map((e) => (
                            <option key={e}>{e}</option>
                          ))}
                        </select>
                      )}
                    </>
                  );
                })()}

                {/* Add to Cart */}
                {isLoggedIn ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedItem.is_available}
                    className={`w-[150px] rounded-full font-semibold py-2 ${
                      selectedItem.is_available
                        ? "border border-[#8CB662] bg-white text-black hover:bg-[#8CB662] hover:text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {selectedItem.is_available ? "Add to Cart" : "Sold Out"}
                  </button>
                ) : (
                  <div className="text-red-500 font-semibold">Please log in to order.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;
