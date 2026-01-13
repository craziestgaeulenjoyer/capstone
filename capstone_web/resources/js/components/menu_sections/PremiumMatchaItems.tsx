import React, { useEffect, useState } from "react";
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
}

interface PremiumMatchaItem {
  id: number;
  name: string;
  description: string;
  image: string;
  rawPrice: { regular?: string; large?: string };
}

const PremiumMatcha: React.FC = () => {
  const CATEGORY = "Premium Matcha";

  const [items, setItems] = useState<PremiumMatchaItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<PremiumMatchaItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("");


const { props } = usePage<PageProps>();
const auth = props.auth;
const isLoggedIn = Boolean(auth?.customer);


  /* 📦 FETCH ITEMS */
  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data || [];

        const formatted = data
          .filter((item) => item.categories.includes(CATEGORY))
          .map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            image: item.image_path,
            rawPrice: item.price,
          }));

        setItems(formatted);
      })
      .catch(console.error);
  }, []);

  /* 🔍 SEARCH */
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDecrease = () => quantity > 1 && setQuantity((q) => q - 1);
  const handleIncrease = () => setQuantity((q) => q + 1);

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
      instructions: selectedOption,
      price:
        selectedSize === "22oz" && selectedItem.rawPrice.large
          ? selectedItem.rawPrice.large
          : selectedItem.rawPrice.regular,
    });

    alert("Item added to cart!");

    setSelectedItem(null);
    setQuantity(1);
    setSelectedSize(null);
    setSelectedOption("");
  } catch (err) {
    console.error(err);
    alert("Failed to add item to cart.");
  }
};

  return (
    <div className="px-6 pt-10 pb-16 text-black">
      {/* Search */}
      <div className="flex justify-end mb-10">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search premium matcha..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-400 bg-white text-black"
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
              setSelectedSize("16oz");
              setQuantity(1);
              setSelectedOption("");
            }}
            className="rounded-2xl shadow hover:shadow-lg transition border bg-white cursor-pointer text-black"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image}`}
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
                {item.rawPrice.large && ` | ₱${item.rawPrice.large}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded p-8 relative text-black">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={`/storage/${selectedItem.image}`}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">
                  {selectedItem.name}
                </h2>

                <div className="text-[#65B741] font-bold text-xl mb-2">
                  {selectedSize === "22oz" && selectedItem.rawPrice.large
                    ? `₱${selectedItem.rawPrice.large}`
                    : `₱${selectedItem.rawPrice.regular}`}
                </div>

                <p className="text-gray-700 mb-4">
                  {selectedItem.description}
                </p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Quantity</label>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleDecrease}
                      className="px-3 border rounded-full bg-white text-black"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-3 border rounded-full bg-white text-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cup Size */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Cup Size</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <div className="flex gap-2">
                    {getAvailableSizes(selectedItem.rawPrice).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-[95px] h-[30px] border rounded-full text-sm
                          ${
                            selectedSize === size
                              ? "bg-[#8CB662] text-white border-[#8CB662]"
                              : "bg-white text-black hover:bg-[#8CB662] hover:text-white"
                          }
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="mb-6">
                  <label className="text-sm font-semibold">Options</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="border border-[#8CB662] rounded px-2 py-1 text-sm w-[300px] bg-white text-black"
                  >
                    <option value="">Select option</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumMatcha;
