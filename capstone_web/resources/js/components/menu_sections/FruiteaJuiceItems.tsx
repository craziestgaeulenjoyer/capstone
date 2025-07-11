import React, { useState } from 'react';
import { Search } from 'lucide-react';

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

  const filteredItems = fruiteaList.filter((item) => {
    const matchType = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

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
    </div>
  );
};

export default FruiteaJuiceItems;
