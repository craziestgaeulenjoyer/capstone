import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface MilkTeaItem {
  id: number;
  name: string;
  description: string;
  type: 'Classic' | 'Special';
  image: string;
  price: string;
}

const milkTeaList: MilkTeaItem[] = [
  // Classic Milk Tea
  { id: 1, name: 'Classic Bubble', description: 'Timeless milk tea with chewy black pearls.', type: 'Classic', image: 'images/ClassicBubble.png', price: '₱80' },
  { id: 2, name: 'Okinawa', description: 'A brown sugar infused classic milk tea.', type: 'Classic', image: 'images/Okinawa.png', price: '₱90' },
  { id: 3, name: 'Wintermelon', description: 'Sweet and aromatic milk tea with wintermelon flavor.', type: 'Classic', image: 'images/Wintermelon.png', price: '₱80' },
  { id: 4, name: 'Chocolate', description: 'Rich and creamy chocolate infused milk tea.', type: 'Classic', image: 'images/Chocolate.png', price: '₱90' },
  { id: 5, name: 'Oreo', description: 'Milk tea loaded with crushed Oreo goodness.', type: 'Classic', image: 'images/Oreo.png', price: '₱80' },
  { id: 6, name: 'Caramel', description: 'Smooth caramel milk tea with a sweet finish.', type: 'Classic', image: 'images/Caramel.png', price: '₱90' },
  { id: 7, name: 'Salted Caramel', description: 'Sweet and salty blend of caramel milk tea.', type: 'Classic', image: 'images/SaltedCaramel.png', price: '₱90' },
  { id: 8, name: 'Cappuccino', description: 'Coffee-flavored milk tea with a creamy touch.', type: 'Classic', image: 'images/Cappuccino.png', price: '₱80' },
  { id: 9, name: 'Java Chip', description: 'Blended chocolate and coffee chips milk tea.', type: 'Classic', image: 'images/JavaChip.png', price: '₱90' },
  { id: 10, name: 'Matcha', description: 'Earthy matcha milk tea for green tea lovers.', type: 'Classic', image: 'images/Matcha.png', price: '₱80' },
  { id: 11, name: 'Taro', description: 'A creamy and nutty purple yam milk tea.', type: 'Classic', image: 'images/Taro.png', price: '₱80' },

  // Special Milk Tea
  { id: 12, name: 'Oreo Cheesecake Overload', description: 'Creamy cheesecake topped with Oreo and boba.', type: 'Special', image: 'images/OreoCheesecake.png', price: '₱120' },
  { id: 13, name: 'Oreo Cream Cheese', description: 'Oreo milk tea with rich cream cheese foam.', type: 'Special', image: 'images/OreoCreamCheese.png', price: '₱110' },
  { id: 14, name: 'Taro Cheesecake', description: 'Taro milk tea topped with creamy cheesecake foam.', type: 'Special', image: 'images/TaroCheesecake.png', price: '₱110' },
  { id: 15, name: 'Matcha Cheesecake', description: 'Matcha milk tea layered with cheesecake cream.', type: 'Special', image: 'images/MatchaCheesecake.png', price: '₱110' },
  { id: 16, name: 'Butterball', description: 'Butterscotch milk tea with a rich flavor punch.', type: 'Special', image: 'images/Butterball.png', price: '₱110' },
  { id: 17, name: 'Bobbatella', description: 'Nutella and boba meet in this delightful mix.', type: 'Special', image: 'images/Bobbatella.png', price: '₱110' },
  { id: 18, name: 'Meiji Apollo / Choco-Berry', description: 'Strawberry-chocolate combo inspired by Meiji.', type: 'Special', image: 'images/MeijiApollo.png', price: '₱110' },
  { id: 19, name: 'Creme Brulee Milk Tea', description: 'Milk tea with caramelized sugar and creamy topping.', type: 'Special', image: 'images/CremeBruleeIcedCoffee.png', price: '₱110' },
];

const MilkteaItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Classic' | 'Special'>('All');
  const [search, setSearch] = useState('');

  const filteredItems = milkTeaList.filter((item) => {
    const matchType = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex space-x-6">
          {['All', 'Classic', 'Special'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'All' | 'Classic' | 'Special')}
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
            placeholder="Search milk tea..."
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
            No milk tea items found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkteaItems;
