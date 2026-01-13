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


interface MilkTeaItem {
  id: number;
  name: string;
  description: string;
  category: "Classic" | "Special";
  subcategories: string[];
  image_path: string;
  price: { regular: string; large?: string };
}

const MilkTeaItems: React.FC = () => {
  const [items, setItems] = useState<MilkTeaItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<MilkTeaItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("16oz");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedAddOn, setSelectedAddOn] = useState("");



 const { props } = usePage<PageProps>();
const auth = props.auth;
const isLoggedIn = Boolean(auth?.customer);


  /* 📦 FETCH MENU */
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        const milkTeas = (res.data.items || res.data).filter((i: any) =>
          i.subcategories.some((sub: string) =>
            sub.startsWith("Milktea:")
          )
        );
        setItems(milkTeas);
      })
      .catch((e) =>
        console.error("Error loading milk tea items:", e)
      );
  }, []);

  /* ---------------- FILTERING ---------------- */
  const milkTeaOnly = items.filter((i) =>
    i.subcategories.some((sub) => sub.startsWith("Milktea:"))
  );

  const milkTeaSubcategories = Array.from(
    new Set(
      milkTeaOnly
        .flatMap((i) => i.subcategories)
        .map((sub) => (sub.includes(":") ? sub.split(":")[1] : sub))
        .filter((sub) => sub !== "Milktea")
    )
  );

  const tabs = ["All", ...milkTeaSubcategories];

  const filtered = milkTeaOnly.filter((i) => {
    const subs = i.subcategories.map((sub) =>
      sub.includes(":") ? sub.split(":")[1] : sub
    );

    return (
      (activeTab === "All" || subs.includes(activeTab)) &&
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ---------------- HELPERS ---------------- */
  const handleDecrease = () => quantity > 1 && setQuantity((q) => q - 1);
  const handleIncrease = () => setQuantity((q) => q + 1);

  const optionsMap: Record<
    string,
    { flavors: string[]; addOns: string[] }
  > = {
    Classic: {
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
    Special: {
      flavors: ["Hot", "Cold"],
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

  const getOptionsFor = (item: MilkTeaItem) =>
    optionsMap[item.category] || optionsMap.Classic;

  const getAvailableSizes = (price: {
    regular?: string;
    large?: string;
  }) => {
    const sizes: string[] = [];
    if (price.regular) sizes.push("16oz");
    if (price.large) sizes.push("22oz");
    return sizes;
  };

  /* 🛒 ADD TO CART */
  const handleAddToCart = async () => {
  if (!isLoggedIn || !selectedItem) {
    alert("Please log in to add items to cart.");
    return;
  }

  try {
    await axios.post("/cart/add", {
      product_id: selectedItem.id,
      product_name: selectedItem.name,
      size: selectedSize,
      quantity,
      instructions: selectedAddOn || selectedFlavor || "",
      price:
        selectedSize === "22oz" && selectedItem.price.large
          ? selectedItem.price.large
          : selectedItem.price.regular,
    });

    alert("Item added to cart!");

    setSelectedItem(null);
    setQuantity(1);
    setSelectedSize("16oz");
    setSelectedFlavor("");
    setSelectedAddOn("");
  } catch (error) {
    console.error(error);
    alert("Failed to add item to cart.");
  }
};

  return (
    <div className="px-6 pt-10 pb-16 text-black">
      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border
                ${
                  activeTab === t
                    ? "bg-[#8CB662] text-white border-[#8CB662]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-2.5 text-black"
            size={18}
          />
          <input
            type="text"
            placeholder="Search milk tea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full border bg-white text-black focus:ring-2 focus:ring-[#8CB662]"
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
              setQuantity(1);
              setSelectedSize("16oz");
              setSelectedFlavor("");
              setSelectedAddOn("");
            }}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden border bg-white cursor-pointer text-black"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image_path}`}
                alt={item.name}
                className="w-60 h-60 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
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

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded p-8 relative text-black">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
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
                  {selectedSize === "22oz" &&
                  selectedItem.price.large
                    ? `₱${selectedItem.price.large}`
                    : `₱${selectedItem.price.regular}`}
                </div>

                <p className="text-md text-gray-700 mb-4">
                  {selectedItem.description}
                </p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">
                    Quantity
                  </label>
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

                {/* Cup Size */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">
                    Cup Size
                  </label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <div className="flex gap-2">
                    {getAvailableSizes(selectedItem.price).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-[95px] h-[30px] border rounded-full text-sm
                            ${
                              selectedSize === s
                                ? "bg-[#8CB662] text-white border-[#8CB662]"
                                : "bg-white text-black hover:bg-[#8CB662] hover:text-white"
                            }
                          `}
                        >
                          {s}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  if (!opts.flavors.length && !opts.addOns.length)
                    return null;

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
                            className="border border-[#8CB662] bg-white text-black rounded px-2 py-1 text-sm w-[300px]"
                          >
                            <option value="">
                              Select option
                            </option>
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
                            className="border border-[#8CB662] bg-white text-black rounded px-2 py-1 text-sm w-[300px]"
                          >
                            <option value="">
                              Select an add-on
                            </option>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MilkTeaItems;
