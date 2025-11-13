// resources/js/Pages/website_pages/components/CoffeeItems.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface CoffeeItem {
  id: number;
  name: string;
  description: string;
  category: 'Coffee' | 'Specialty Coffee';
  image: string;
  price: string;
}

const coffeeItems: CoffeeItem[] = [
  {
    id: 1,
    name: "Classic Iced Coffee",
    description:
      "Your go-to refreshing iced coffee—smooth, strong, and perfectly chilled.",
    category: "Coffee",
    image: "images/ClassicIcedCoffee.png",
    price: "₱70/80",
  },
  {
    id: 2,
    name: "Vanilla Iced Coffee",
    description:
      "Smooth and creamy with a hint of vanilla for a refreshing treat.",
    category: "Coffee",
    image: "/images/VanillaIcedCoffee.png",
    price: "₱80/90",
  },
  {
    id: 3,
    name: "Caramel Iced Coffee",
    description:
      "A sweet blend of coffee and buttery caramel, perfectly chilled.",
    category: "Coffee",
    image: "/images/CaramelIcedCoffee.png",
    price: "₱80/90",
  },
  {
    id: 4,
    name: "Hazelnut Iced Coffee",
    description:
      "Rich coffee with a nutty hazelnut twist for a smooth, flavorful sip.",
    category: "Coffee",
    image: "/images/HazelnutIcedCoffee.png",
    price: "₱80/90",
  },
  {
    id: 5,
    name: "French Vanilla Iced Coffee",
    description:
      "A smooth and creamy blend of bold coffee and rich French vanilla, served chilled for the perfect pick-me-up.",
    category: "Coffee",
    image: "/images/FrenchVanillaIced.png",
    price: "₱80/90",
  },
  {
    id: 6,
    name: "Ice Snow Coffee",
    description:
      "A unique, frosty iced coffee layered for an extra cold and creamy treat.",
    category: "Coffee",
    image: "/images/IceSnowCoffee.png",
    price: "₱120",
  },
  {
    id: 7,
    name: "Americano",
    description:
      "Bold espresso shots diluted with hot water for a strong, straightforward coffee experience.",
    category: "Specialty Coffee",
    image: "/images/Americano.png",
    price: "₱90",
  },
  {
    id: 8,
    name: "Spanish Latte",
    description:
      "Sweet and creamy—espresso is mixed with condensed milk for a rich, velvety treat.",
    category: "Specialty Coffee",
    image: "/images/SpanishLatte.png",
    price: "₱170",
  },
  {
    id: 9,
    name: "Sea Salt Honey",
    description:
      "A perfect balance of sweet honey, robust coffee, and a delicate hint of sea salt.",
    category: "Specialty Coffee",
    image: "/images/SeaSaltHoney.png",
    price: "₱170",
  },
  {
    id: 10,
    name: "White Chocolate Mocha",
    description:
      "Rich, creamy white chocolate is melted into smooth espresso and finished with steamed milk.",
    category: "Specialty Coffee",
    image: "/images/WhiteChocolateMocha.png",
    price: "₱180",
  },
  {
    id: 11,
    name: "Dulce De Leche",
    description:
      "Luxuriously sweet and comforting, featuring espresso infused with rich, caramelized milk goodness.",
    category: "Specialty Coffee",
    image: "/images/DulceDeLeche.png",
    price: "₱180",
  },
  {
    id: 12,
    name: "Brewed Coffee",
    description:
      "Simple, dark, and satisfying. Enjoy it hot for a classic experience or perfectly iced for a cool refreshment.",
    category: "Specialty Coffee",
    image: "/images/BrewedCoffee.png",
    price: "₱60",
  },
];

const CoffeeItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | CoffeeItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<CoffeeItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedAddOn, setSelectedAddOn] = useState<string>('');

  const categories: ('All' | CoffeeItem['category'])[] = ['All', 'Coffee', 'Specialty Coffee'];

  const filtered = coffeeItems.filter((i) => {
    const byCat = activeTab === 'All' || i.category === activeTab;
    const bySearch = i.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    'Coffee': { flavors: [], addOns: ['Extra Matcha Shot','Extra Coffee Shot'] },
    'Specialty Coffee': { flavors: ['Hot', 'Cold'], addOns: ['Oat Milk', 'Extra Espresso'] },
  };

  const getOptionsFor = (item: CoffeeItem) => optionsMap[item.category] || { flavors: [], addOns: [] };

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs */}
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
            placeholder="Search coffee item..."
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
          <div className="bg-white w-full max-w-4xl rounded p-10 relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-xl mb-2">{selectedItem.price}</div>
                <p className="text-md text-gray-700 mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold">Quantity</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={handleDecrease} className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white">
                      -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease} className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white">
                      +
                    </button>
                  </div>
                </div>

                {/* Cup Size */}
                <div className="mb-4">
                  <label className="text-sm font-semibold">Cup Size</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <div className="flex gap-2">
                    {['16oz', '22oz'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-[95px] h-[30px] border rounded-4xl text-sm font-light shadow-lg ${
                          selectedSize === s
                            ? 'bg-[#8CB662] text-white border-[#8CB662]'
                            : 'hover:bg-[#8CB662] hover:text-white'
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


