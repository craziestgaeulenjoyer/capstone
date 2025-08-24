import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FruiteaItem {
  id: number;
  name: string;
  description: string;
  type: 'Lemonade' | 'Fruit';
  image: string;
  price: string;
}

const fruiteaList: FruiteaItem[] = [
  {
    id: 1,
    name: 'Classic Lemonade',
    description: 'Fresh and zesty lemonade for that classic citrus refreshment.',
    type: 'Lemonade',
    image: 'images/ClassicLemonade.png',
    price: '₱55',
  },
  {
    id: 2,
    name: 'Strawberry Lemonade',
    description: 'A fruity fusion of ripe strawberries and tart lemon.',
    type: 'Lemonade',
    image: 'images/StrawberryLemonade.png',
    price: '₱60',
  },
  {
    id: 3,
    name: 'Charcoal Lemonade',
    description: 'Detox-friendly black lemonade with activated charcoal.',
    type: 'Lemonade',
    image: 'images/CharcoalLemonade.png',
    price: '₱60',
  },
  {
    id: 4,
    name: 'Cucumber Lemonade',
    description: 'Light and hydrating cucumber blended with zesty lemon.',
    type: 'Lemonade',
    image: 'images/CucumberLemonade.png',
    price: '₱70',
  },
  {
    id: 5,
    name: 'Citro Frutti',
    description: 'A citrus explosion of fruity goodness in every sip.',
    type: 'Fruit',
    image: 'images/CitroFrutti.png',
    price: '₱70',
  },
  {
    id: 6,
    name: 'Mango Frutti',
    description: 'Juicy mango infused with tropical fruit flavors.',
    type: 'Fruit',
    image: 'images/MangoFrutti.png',
    price: '₱70',
  },
  {
    id: 7,
    name: 'Punch Tropical',
    description: 'A tropical medley of pineapple, orange, and mango.',
    type: 'Fruit',
    image: 'images/PunchTropical.png',
    price: '₱70',
  },
  {
    id: 8,
    name: 'Watermelon with Strawberry Popping Bobba',
    description: 'Juicy watermelon juice with bursts of strawberry boba.',
    type: 'Fruit',
    image: 'images/WatermelonStrawberryBoba.png',
    price: '₱75',
  },
];

const FruiteaJuiceItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Lemonade' | 'Fruit'>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<FruiteaItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const filteredItems = fruiteaList.filter((item) => {
    const matchType = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

    const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex space-x-6">
          {['All', 'Lemonade', 'Fruit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'All' | 'Lemonade' | 'Fruit')}
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 ${
                activeTab === tab ? 'bg-[#8CB662] text-white border-[#8CB662]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="rounded-2xl shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-100 bg-white"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-50 h-50 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#2E3A2F]">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-right text-lg text-[#76B13A] font-bold">{item.price}</div>
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
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-[300px] h-[300px] object-contain border-[12px] border-[#E1E1E1] rounded bg-[#E1E1E1]"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-lg mb-2">{selectedItem.price}</div>
                <p className="text-sm text-gray-700 mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold">Quantity</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={handleDecrease}
                      className="px-2 border rounded hover:bg-[#8CB662] hover:text-white transition"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-2 border rounded hover:bg-[#8CB662] hover:text-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Size Options */}
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-1">Size options</label>
                  <div className="h-[2px] w-full bg-[#8CB662] my-1" />
                  <div className="flex space-x-2 mt-4">
                    {['Small', 'Medium', 'Large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-[95px] h-[25px] border px-3 py-1 rounded-full text-xs shadow-md transition-colors
                          ${selectedSize === size 
                            ? 'bg-[#8CB662] text-white border-[#8CB662]' 
                            : 'hover:bg-[#8CB662] hover:text-white'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Options */}
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-1">What’s included</label>
                  <div className="h-[2px] w-full bg-[#8CB662] my-2" />

                  <label className="text-xs block font-semibold mb-1">Flavors</label>
                  <select className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs">
                    <option>No Vanilla Syrup</option>
                    <option>Vanilla Syrup</option>
                    <option>Caramel Syrup</option>
                    <option>Hazelnut Syrup</option>
                  </select>
                </div>

                {/* Add-ins */}
                <div className="mb-4">
                  <label className="text-xs block font-semibold mb-1">Add-ins</label>
                  <select className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs">
                    <option>No Vanilla Sweet Cream</option>
                    <option>Vanilla Sweet Cream</option>
                  </select>
                </div>

                {/* Extra Options */}
                <div className="mb-8">
                  <label className="text-xs block font-semibold mb-1">Extras</label>
                  <select className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs">
                    <option>Ice</option>
                    <option>Extra Milk</option>
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
