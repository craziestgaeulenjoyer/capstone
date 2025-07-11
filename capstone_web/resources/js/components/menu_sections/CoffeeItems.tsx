// resources/js/components/menu_sections/CoffeeItems.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface CoffeeItem {
  id: number;
  name: string;
  description: string;
  type: 'Hot' | 'Iced';
  image: string;
  price: string;
}

const coffeeList: CoffeeItem[] = [
  {
    id: 1,
    name: 'Classic Iced Coffee',
    description: 'Bold, smooth, and refreshing  a timeless favorite served over ice.',
    type: 'Iced',
    image: 'images/ClassicIcedCoffee.png',
    price: '₱55',
  },
  {
    id: 2,
    name: 'Vanilla Iced Coffee',
    description: 'Smooth and creamy with a hint of vanilla for a refreshing treat.',
    type: 'Iced',
    image: 'images/VanillaIcedCoffee.png',
    price: '₱65',
  },
  {
    id: 3,
    name: 'Caramel Iced Coffee',
    description: 'A sweet blend of coffee and buttery caramel, perfectly chilled.',
    type: 'Iced',
    image: 'images/CaramelIcedCoffee.png',
    price: '₱75',
  },
  {
    id: 4,
    name: 'Hazelnut Iced Coffee',
    description: 'Rich coffee with a nutty hazelnut twist for a smooth, flavorful sip.',
    type: 'Iced',
    image: 'images/HazelnutIcedCoffee.png',
    price: '₱75',
  },
  {
    id: 5,
    name: 'French Vanilla Iced Coffee',
    description: 'A smooth and creamy blend of bold coffee and rich French vanilla, served chilled for the perfect pick-me-up.',
    type: 'Iced',
    image: 'images/FrenchVanillaIcedCoffee.png',
    price: '₱75',
  },
  {
    id: 6,
    name: 'Ice Snow Coffee',
    description: 'A refreshing icy coffee treat with a light, frosty texture—cool, bold, and made to energize.',
    type: 'Iced',
    image: 'images/IceSnowCoffee.png',
    price: '₱85',
  },
  {
    id: 7,
    name: 'Macadamia White Chocolate',
    description: 'A luxurious fusion of nutty macadamia and sweet white chocolate with a bold coffee base—comfort in every sip.',
    type: 'Iced',
    image: 'images/MacadamiaWhiteChocolate.png',
    price: '₱90',
  },
  {
    id: 8,
    name: 'Creme Brule Iced Coffee',
    description: 'Inspired by the classic dessert, this iced coffee features caramelized sweetness and rich espresso flavor.',
    type: 'Iced',
    image: 'images/CremeBruleeIcedCoffee.png',
    price: '₱95',
  },{
    id: 9,
    name: 'Brewed Iced Coffee',
    description: 'Slow-brewed and chilled to perfection—simple, strong, and refreshingly bold.',
    type: 'Iced',
    image: 'images/BrewedIcedCoffee.png',
    price: '₱50',
  },

  {
    id: 10,
    name: 'Brewed Hot Coffee',
    description: 'Freshly brewed for deep, smooth flavor—your classic, no-fuss hot coffee companion.',
    type: 'Hot',
    image: 'images/BrewedHotCoffee.png',
    price: '₱50',
  },
  {
    id: 11,
    name: 'Hot Chocolate with Marshmallows',
    description: 'Creamy and cozy hot cocoa topped with fluffy marshmallows a hug in a cup.',
    type: 'Hot',
    image: 'images/HotChocolateMarshamallows.png',
    price: '₱75',
  },
  {
    id: 12,
    name: 'Pure Matcha Latte',
    description: 'Authentic Japanese matcha blended with milk—earthy, vibrant, and full of green tea goodness.',
    type: 'Iced',
    image: 'images/PureMatchaLatte.png',
    price: '₱120',
  },
  {
    id: 13,
    name: 'Pure Matcha Oat Latte',
    description: 'A dairy-free delight featuring pure matcha and oat milk—smooth, creamy, and wellness-packed.',
    type: 'Iced',
    image: 'images/PureMatchaOatLLatte.png',
    price: '₱160',
  },
];

const CoffeeItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Hot' | 'Iced'>('All');
  const [search, setSearch] = useState('');

  const filteredItems = coffeeList.filter((item) => {
    const matchType = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex space-x-6">
          {['All', 'Hot', 'Iced'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'All' | 'Hot' | 'Iced')}
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
            placeholder="Search coffee..."
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
            No coffee items found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeItems;


