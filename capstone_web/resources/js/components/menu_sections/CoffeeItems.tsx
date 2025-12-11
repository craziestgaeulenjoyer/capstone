// resources/js/Pages/website_pages/components/CoffeeItems.tsx
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

const CoffeeItems: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedAddOn, setSelectedAddOn] = useState("");

  // ───────────────────────────────
  // Fetch Menu Items
  // ───────────────────────────────
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        console.log("Full menu fetched:", res.data.items || res.data);
        setItems(res.data.items || res.data);
      })
      .catch((e) => console.error("Error loading coffee items:", e));
  }, []);

  // ───────────────────────────────
  // Filter coffee items
  // ───────────────────────────────
  const coffeeFiltered = items.filter((i) => {
    const inMainCat = i.categories.includes("Coffees");

    // Extract only the subcategory after the colon
    const subcategoriesCleaned = i.subcategories.map((sub) =>
      sub.includes(":") ? sub.split(":")[1] : sub
    );

    const inSub = subcategoriesCleaned.some(
      (sub) => sub === "Coffee" || sub === "Specialty Coffee"
    );

    const result = inMainCat && inSub;

    if (!result) {
      console.log("Filtered out:", {
        name: i.name,
        categories: i.categories,
        subcategories: subcategoriesCleaned,
      });
    } else {
      console.log("✅ Coffee item detected:", {
        name: i.name,
        categories: i.categories,
        subcategories: subcategoriesCleaned,
      });
    }

    return result;
  });

  // ───────────────────────────────
  // Auto-generate tabs from subcategories under "Coffees"
  // ───────────────────────────────
  const coffeeSubcategories = Array.from(
    new Set(
      coffeeFiltered.flatMap((i) =>
        i.subcategories
          .filter((sub) => sub.startsWith("Coffees:"))
          .map((sub) => sub.split(":")[1])
      )
    )
  );

  const tabs = ["All", ...coffeeSubcategories];

  // ───────────────────────────────
  // Filter based on active tab & search
  // ───────────────────────────────
  const filtered = coffeeFiltered.filter((i) => {
    const subcategoriesCleaned = i.subcategories.map((sub) =>
      sub.includes(":") ? sub.split(":")[1] : sub
    );

    const matchTab =
      activeTab === "All" || subcategoriesCleaned.includes(activeTab);

    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  // ───────────────────────────────
  // Quantity handlers
  // ───────────────────────────────
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  // ───────────────────────────────
  // Options
  // ───────────────────────────────
  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    Coffee: {
      flavors: [],
      addOns: ["Extra Matcha Shot", "Extra Coffee Shot"],
    },
    "Specialty Coffee": {
      flavors: ["Hot", "Cold"],
      addOns: ["Oat Milk", "Extra Espresso"],
    },
  };

  const getOptionsFor = (item: MenuItem) => {
    const sub = item.subcategories
      .map((s) => (s.includes(":") ? s.split(":")[1] : s))
      .find((s) => optionsMap[s]);
    return sub ? optionsMap[sub] : { flavors: [], addOns: [] };
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
      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border ${
                activeTab === t
                  ? "bg-[#8CB662] text-white border-[#8CB662]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-700" size={18} />
          <input
            type="text"
            placeholder="Search coffee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-500 rounded-full border border-gray-400 focus:ring-2 focus:ring-[#8CB662]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
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
              <h3 className="text-lg font-bold text-[#2E3A2F]">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>

              <div className="text-right text-lg text-[#76B13A] font-bold">
                <div className="text-right text-lg text-[#76B13A] font-bold">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded p-10000 relative">
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

export default CoffeeItems;
