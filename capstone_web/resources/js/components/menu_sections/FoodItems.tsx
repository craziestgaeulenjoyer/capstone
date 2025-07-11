// resources/js/components/menu_sections/FoodItems.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  type: 'Snacks' | 'Platters' | 'Croffles' | 'Quesadillas & Corndogs';
  image: string;
  price: string;
}

const foodList: FoodItem[] = [
  // Snacks
  { id: 1, name: 'Fries', description: 'Crispy golden potato fries.', type: 'Snacks', image: 'images/Fries.png', price: '₱50' },
  { id: 2, name: 'Cheese Sticks', description: 'Crunchy sticks with melted cheese inside.', type: 'Snacks', image: 'images/CheeseSticks.png', price: '₱45' },
  { id: 3, name: 'Hash Brown', description: 'Golden and crispy hash brown patty.', type: 'Snacks', image: 'images/HashBrown.png', price: '₱80' },
  { id: 4, name: 'Chicken Nuggets', description: 'Juicy bite-sized chicken pieces.', type: 'Snacks', image: 'images/ChickenNuggets.png', price: '₱90' },
  { id: 5, name: 'Mojos', description: 'Seasoned potato slices, fried to perfection.', type: 'Snacks', image: 'images/Mojos.png', price: '₱90' },
  { id: 6, name: 'Twister Fries', description: 'Curly fries with a kick of flavor.', type: 'Snacks', image: 'images/TwisterFries.png', price: '₱90' },

  // Platters
  { id: 7, name: 'Platter #1', description: 'Fries, 5 pcs Cheese Sticks, 1 pc Hash Brown.', type: 'Platters', image: 'images/Platter1.png', price: '₱105' },
  { id: 8, name: 'Platter #2', description: 'Fries, 10 pcs Cheese Sticks, 2 pcs Hash Brown.', type: 'Platters', image: 'images/Platter2.png', price: '₱140' },
  { id: 9, name: 'Platter #3', description: 'Fries, 10 pcs Cheese Sticks, 2 pcs Hash Brown, 3 pc Nuggets.', type: 'Platters', image: 'images/Platter3.png', price: '₱170' },

  // Quesadillas & Corndogs
  { id: 10, name: 'Cheese Quesadilla with Fries', description: 'Toasted quesadilla with fries on the side.', type: 'Quesadillas & Corndogs', image: 'images/CheeseQuesadilla.png', price: '₱100' },
  { id: 11, name: 'Beef Quesadilla with Garlic Sauce', description: 'Savory beef quesadilla with garlic sauce & fries.', type: 'Quesadillas & Corndogs', image: 'images/BeefQuesadilla.png', price: '₱120' },
  { id: 12, name: 'Korean Corndogs', description: 'Crispy Korean-style corndogs with cheese.', type: 'Quesadillas & Corndogs', image: 'images/KoreanCorndogs.png', price: '₱104' },

  // Croffles
  { id: 13, name: 'Plain Croffle', description: 'Simple and crispy croffle.', type: 'Croffles', image: 'images/PlainCroffle.png', price: '₱90' },
  { id: 14, name: 'Croffle with Syrup', description: 'Topped with chocolate or strawberry syrup.', type: 'Croffles', image: 'images/SyrupCroffle.png', price: '₱100' },
  { id: 15, name: 'Croffle with Whipped Cream & Syrup', description: 'Creamy and sweet.', type: 'Croffles', image: 'images/WhipppedCroffle.png', price: '₱120' },
  { id: 16, name: 'Oreo Croffle', description: 'Topped with crushed Oreos.', type: 'Croffles', image: 'images/OreoCroffle.png', price: '₱140' },
  { id: 17, name: 'Matcha Croffle', description: 'Croffle infused with matcha flavor.', type: 'Croffles', image: 'images/MatchaCroffle.png', price: '₱140' },
  { id: 18, name: 'Alcapone Croffle', description: 'Almonds and white chocolate topping.', type: 'Croffles', image: 'images/AlcaponeCroffle.png', price: '₱140' },
  { id: 19, name: 'Blueberry Graham', description: 'Sweet blueberry and crushed graham topping.', type: 'Croffles', image: 'images/BlueberryGraham.png', price: '₱140' },
  { id: 20, name: 'Strawberry Graham', description: 'Strawberry and graham with syrup.', type: 'Croffles', image: 'images/StrawberryGraham.png', price: '₱140' },
  { id: 21, name: 'Mango Graham', description: 'Fresh mango slices with graham bits.', type: 'Croffles', image: 'images/MangoGraham.png', price: '₱140' },
  { id: 22, name: 'Banana Nutella Croffle', description: 'Sweet banana slices drizzled with Nutella.', type: 'Croffles', image: 'images/BananaNutella.png', price: '₱150' },
  { id: 23, name: 'Biscoff Croffle', description: 'Topped with Biscoff spread and crumbs.', type: 'Croffles', image: 'images/BiscoffCroffle.png', price: '₱150' },
];

const FoodItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Snacks' | 'Platters' | 'Croffles' | 'Quesadillas & Corndogs'>('All');
  const [search, setSearch] = useState('');

  const filteredItems = foodList.filter((item) => {
    const matchType = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex flex-wrap gap-3">
          {['All', 'Snacks', 'Platters', 'Croffles', 'Quesadillas & Corndogs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
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
            placeholder="Search food..."
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
            No food items found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItems;
