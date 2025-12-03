import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';

interface ApiItem {
  id: number;
  name: string;
  description: string;
  type: string;
  categories: string[];
  subcategories: string[];
  image_path: string;
  price: {
    regular?: number;
    large?: number;
  };
}

interface FoodItem {
  id: number;
  name: string;
  description: string;
  category: 'Snacks' | 'Platters' | 'Croffles' | 'Quesadillas & Korean Corndogs';
  image: string;
  price: string;
  rawPrice: { regular?: number; large?: number };
}

const SUBCATEGORIES = ['Snacks', 'Platters', 'Croffles', 'Quesadillas & Korean Corndogs'] as const;
const categories: ('All' | FoodItem['category'])[] = ['All', ...SUBCATEGORIES];

const FoodItems: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | FoodItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedExtra, setSelectedExtra] = useState('');
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large' | ''>('');

  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data;

        console.log("Fetched menu items from API:", data);

        // Filter items whose subcategories include any of our main food subcategories
        const filtered = data.filter((item) =>
          item.subcategories.some((sub) =>
            SUBCATEGORIES.some((cat) => sub.endsWith(`:${cat}`))
          )
        );

        console.log("🔹 Items after subcategory filter:", filtered);

        // Map into FoodItem[]
        const foodItems: FoodItem[] = filtered.map((item) => {
          const sub = item.subcategories.find((sc) =>
            SUBCATEGORIES.some((cat) => sc.endsWith(`:${cat}`))
          );

          const subcategory = sub ? sub.split(":")[1].trim() : "Snacks"; // default to Snacks

          const { regular, large } = item.price;
          let formattedPrice = "";
          if (regular && large) formattedPrice = `₱${regular}/${large}`;
          else if (regular) formattedPrice = `₱${regular}`;
          else if (large) formattedPrice = `₱${large}`;

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category: subcategory as FoodItem['category'],
            image: `/storage/${item.image_path.replace(/^\//, '')}`,
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        console.log("🍔 Detected Food Items:", foodItems);

        setItems(foodItems);
      })
      .catch((e) => console.error("Error loading food items:", e));
  }, []);

  const filtered = items.filter((item) => {
    const byCat = activeTab === 'All' || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const getOptionsFor = (item: FoodItem) => {
    const optionsMap: Record<string, { flavors?: string[]; extras?: string[] }> = {
      'Fries': { flavors: ['Cheese', 'Sour & Cream', 'BBQ', 'Butter Cheese', 'Honey Butter'] },
      'Cheese Sticks': { extras: ['10 pcs', '15 pcs'] },
      'Hash Brown': { extras: ['2 pcs', '3 pcs'] },
      'Platter #1': { extras: ['Add Extra Nuggets'] },
      'Platter #2': { extras: ['Add Extra Nuggets'] },
      'Platter #3': { extras: ['Add Extra Nuggets'] },
      'Beef Quesadilla': { extras: ['Extra Garlic Sauce'] },
    };
    return optionsMap[item.name] || {};
  };

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border ${
                activeTab === t
                  ? 'bg-[#8CB662] text-white border-[#8CB662]'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-500 rounded-full border border-gray-400 focus:ring-2 focus:ring-[#8CB662]"
          />
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden bg-white border cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img src={item.image} alt={item.name} className="w-60 h-60 object-contain rounded-xl" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#2E3A2F]">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-right text-lg text-[#76B13A] font-bold">{item.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl p-8 md:p-10 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full md:w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded-xl"
              />
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-xl mb-4">{selectedItem.price}</div>
                <p className="text-md text-gray-700 mb-4 text-gray-900">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold text-gray-900">Quantity</label>
                  <div className="flex items-center gap-2 mt-1">
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

                {/* Size Selection (only if both prices exist) */}
                {(selectedItem.rawPrice.regular && selectedItem.rawPrice.large) && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-900">Size</label>
                    <div className="flex gap-2 mt-1">
                      {['regular', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size as 'regular' | 'large')}
                          className={`w-[95px] h-[30px] border rounded-4xl text-sm font-light shadow-lg text-gray-900 ${
                            selectedSize === size
                              ? 'bg-[#8CB662] text-white border-[#8CB662]'
                              : 'hover:bg-[#8CB662] hover:text-white'
                          }`}
                        >
                          {size === 'regular' ? 'Regular' : 'Large'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  if (!opts) return null;

                  return (
                    <>
                      {opts.flavors && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1 text-gray-900">Flavors</label>
                          <select
                            value={selectedFlavor}
                            onChange={(e) => setSelectedFlavor(e.target.value)}
                            className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm text-gray-900"
                          >
                            <option value="">Select flavor</option>
                            {opts.flavors.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {opts.extras && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1 text-gray-900">Extras</label>
                          <select
                            value={selectedExtra}
                            onChange={(e) => setSelectedExtra(e.target.value)}
                            className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm text-gray-900"
                          >
                            <option value="">Select extra</option>
                            {opts.extras.map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-6">
                  <button className="w-full md:w-[150px] border border-[#8CB662] text-[#8CB662] font-semibold py-2 rounded-4xl hover:bg-[#8CB662] hover:text-white">
                    Add to Cart
                  </button>
                  <button className="w-full md:w-[150px] border border-[#8CB662] text-[#8CB662] font-semibold py-2 rounded-4xl hover:bg-[#8CB662] hover:text-white">
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

export default FoodItems;
