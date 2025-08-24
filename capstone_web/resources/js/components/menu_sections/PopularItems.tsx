// resources/js/Pages/website_pages/components/PopularItems.tsx
import React, { useState } from 'react';
import { Search, X  } from 'lucide-react';

interface PopularItem {
  id: number;
  name: string;
  description: string;
  category: 'Coffee' | 'Classic Milk Tea' | 'Special Milk Tea' | 'Fruit Juices' | 'Snacks' | 'Platters';
  image: string;
  price: string;
}

const popularItems: PopularItem[] = [
  {
    id: 1,
    name: 'Iced Snow Coffee',
    description: 'Chilled coffee with a creamy frosty texture — your iced indulgence.',
    category: 'Coffee',
    image: 'images/IceSnowCoffee.png',
    price: '₱85',
  },
  {
    id: 2,
    name: 'Classic Lemonade',
    description: 'Fresh and zesty lemonade for that classic citrus refreshment.',
    category: 'Fruit Juices',
    image: 'images/ClassicLemonade.png',
    price: '₱45',
  },
  {
    id: 3,
    name: 'Strawberry Lemonade',
    description: 'A fruity fusion of ripe strawberries and tart lemon.',
    category: 'Fruit Juices',
    image: 'images/StrawberryLemonade.png',
    price: '₱60',
  },
  {
    id: 4,
    name: 'Cucumber Lemonade',
    description: 'Light and hydrating cucumber blended with zesty lemon.',
    category: 'Fruit Juices',
    image: 'images/CucumberLemonade.png',
    price: '₱60',
  },
  {
    id: 5,
    name: 'Watermelon with Strawberry Popping Boba',
    description: 'Juicy watermelon juice with bursts of strawberry boba.',
    category: 'Fruit Juices',
    image: 'images/WatermelonStrawberryBoba.png',
    price: '₱75',
  },
  {
    id: 6,
    name: 'Okinawa',
    description: 'Brown sugar milk tea with a rich roasted caramel flavor.',
    category: 'Classic Milk Tea',
    image: 'images/Okinawa.png',
    price: '₱90',
  },
  {
    id: 7,
    name: 'Wintermelon',
    description: 'Mild and sweet milk tea with classic wintermelon notes.',
    category: 'Classic Milk Tea',
    image: 'images/Wintermelon.png',
    price: '₱80',
  },
  {
    id: 8,
    name: 'Oreo',
    description: 'Crushed Oreos blended into creamy milk tea — every sip is a treat.',
    category: 'Classic Milk Tea',
    image: 'images/Oreo.png',
    price: '₱80',
  },
  {
    id: 9,
    name: 'Pure Matcha Oat Latte',
    description: 'Smooth, earthy matcha paired with creamy oat milk.',
    category: 'Coffee',
    image: 'images/PureMatchaOatLLatte.png',
    price: '₱160',
  },
  {
    id: 10,
    name: 'Oreo Cheesecake Overload',
    description: 'Loaded with cheesecake and Oreos — dessert in a cup!',
    category: 'Special Milk Tea',
    image: 'images/OreoCheesecake.png',
    price: '₱120',
  },
  {
    id: 11,
    name: 'Oreo Cream Cheese',
    description: 'Cream cheese foam layered on top of Oreo milk tea.',
    category: 'Special Milk Tea',
    image: 'images/OreoCreamCheese.png',
    price: '₱120',
  },
  {
    id: 12,
    name: 'Bobbatella',
    description: 'Nutella milk tea with chewy boba pearls — smooth & sweet.',
    category: 'Special Milk Tea',
    image: 'images/Bobbatella.png',
    price: '₱110',
  },
  {
    id: 13,
    name: 'Fries',
    description: 'Golden, crispy fries — the ultimate snack companion.',
    category: 'Snacks',
    image: 'images/Fries.png',
    price: '₱50',
  },
  {
    id: 14,
    name: 'Cheese Sticks',
    description: 'Melty cheese wrapped in a crispy roll — snack perfection.',
    category: 'Snacks',
    image: 'images/CheeseSticks.png',
    price: '₱45',
  },
  {
    id: 15,
    name: 'Beef Quesadilla',
    description: 'Grilled tortilla filled with seasoned beef and cheese.',
    category: 'Snacks',
    image: 'images/BeefQuesadilla.png',
    price: '₱120',
  },
  {
    id: 16,
    name: 'Platter #2',
    description: 'Fries, 10pcs cheese sticks, 2pc hash browns — a satisfying combo.',
    category: 'Platters',
    image: 'images/Platter2.png',
    price: '₱140',
  },
  {
    id: 17,
    name: 'Platter #3',
    description: 'Fries, 10pcs cheese sticks, 22pcs hash browns, 3pc nuggets.',
    category: 'Platters',
    image: 'images/Platter3.png',
    price: '₱170',
  },
];

const PopularItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | PopularItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<PopularItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const categories: ('All' | PopularItem['category'])[] = [
    'All',
    'Coffee',
    'Classic Milk Tea',
    'Special Milk Tea',
    'Fruit Juices',
    'Snacks',
    'Platters',
  ];

  const filtered = popularItems.filter((item) => {
    const matchCategory = activeTab === 'All' || item.category === activeTab;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#8CB662] text-white border-[#8CB662]'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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
            placeholder="Search popular item..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-500 rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8CB662]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
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

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No items found.
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
                  <label className="text-xs block font-semibold mb-1">Add-ins</label>
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

export default PopularItems;
