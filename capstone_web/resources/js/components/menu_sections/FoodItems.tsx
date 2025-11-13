import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  category: 'Snacks' | 'Platters' | 'Croffles' | 'Quesadillas & Korean Corndogs';
  image: string;
  price: string;
}

const foodItems: FoodItem[] = [
  // Snacks
  { 
    id: 1, 
    name: 'Fries', 
    description: 'Perfectly golden and crispy French fries, great for sharing.', 
    category: 'Snacks', 
    image: 'images/Fries.png', 
    price: '₱70/90' 
  },
  { 
    id: 2, 
    name: 'Cheese Sticks', 
    description: 'Deep-fried, gooey cheese sticks with a savory, crispy coating.', 
    category: 'Snacks', 
    image: 'images/CheeseSticks.png', 
    price: '₱60/80' 
  },
  { 
    id: 3, 
    name: 'Hash Brown', 
    description: 'Classic crispy, golden-brown shredded potato patty.', 
    category: 'Snacks', 
    image: 'images/HashBrown.png', 
    price: '₱70/100' 
  },
  { 
    id: 4, 
    name: 'Chicken Nuggets', 
    description: 'Tender pieces of chicken, breaded and fried until golden.', 
    category: 'Snacks', 
    image: 'images/ChickenNuggets.png', 
    price: '₱135' 
  },
  { 
    id: 5, 
    name: 'Mojos', 
    description: 'Thick-cut, savory potato slices, seasoned and fried to crispy perfection. The ultimate flavorful side dish or snack', 
    category: 'Snacks', 
    image: 'images/Mojos.png', 
    price: '₱100' 
  },
  { 
    id: 6, 
    name: 'Twister Fries', 
    description: 'Spiral-cut fries seasoned to perfection for extra crunch and flavor.', 
    category: 'Snacks', 
    image: 'images/TwisterFries.png', 
    price: '₱100' 
  },

  // Platters
  { 
    id: 7, 
    name: 'Platter #1', 
    description: 'A satisfying combo of Fries, 5 Cheese Sticks, and 1 Hash Brown.', 
    category: 'Platters', 
    image: 'images/Platter1.png', 
    price: '₱120' 
  },
  { 
    id: 8, 
    name: 'Platter #2', 
    description: 'A larger sharing platter featuring Fries, 10 Cheese Sticks, and 2 Hash Browns.',
    category: 'Platters', 
    image: 'images/Platter2.png', 
    price: '₱160' 
  },
  { 
    id: 9, 
    name: 'Platter #3', 
    description: 'The ultimate combo: Fries, 10 Cheese Sticks, 2 Hash Browns, and 3 Chicken Nuggets.', 
    category: 'Platters', 
    image: 'images/Platter3.png', 
    price: '₱210' 
  },

  // Quesadillas & Korean Corndogs
  { 
    id: 10, 
    name: 'Cheese Quesadilla', 
    description: 'Simply melted cheese grilled inside a crisp flour tortilla.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/CheeseQuesadilla.png', 
    price: '₱120' 
  },
  { 
    id: 11, 
    name: 'Beef Quesadilla', 
    description: 'Savory ground beef and melted cheese packed inside a crunchy tortilla.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/BeefQuesadilla.png', 
    price: '₱130' 
  },
  { 
    id: 12, 
    name: 'Frenchfry Corndogs', 
    description: 'Hotdogs covered in sweet batter, then rolled in crunchy French fries.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/FrenchfryCorndogs.png', 
    price: '₱130' 
  },
  { 
    id: 13, 
    name: 'Mozza Corndogs', 
    description: 'Crispy corndogs stuffed primarily with delicious, stretchy mozzarella cheese.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/MozzaCorndogs.png', 
    price: '₱135' 
  },
  { 
    id: 14, 
    name: 'Cheesy Corndogs', 
    description: 'Classic corndogs with a blend of savory hotdog and gooey, melted cheese.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/CheesyCorndogs.png', 
    price: '₱135' 
  },
  { 
    id: 15, 
    name: 'Mozza Ramyeon Corndogs', 
    description: 'A crispy batter coating covered in crunchy ramyeon noodles and stuffed with mozzarella.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/MozzaRamyeonCorndogs.png', 
    price: '₱145' 
  },


  // Croffles
  { 
    id: 16, 
    name: 'Plain Croffle', 
    description: 'The signature flaky, buttery croissant baked in a waffle press—perfectly crisp', 
    category: 'Croffles', 
    image: 'images/PlainCroffle.png', 
    price: '₱100' 
  },
  { 
    id: 17, 
    name: 'Croffle with Syrup', 
    description: 'Our crisp croffle drizzled with a simple, sweet syrup.', 
    category: 'Croffles', 
    image: 'images/SyrupCroffle.png', 
    price: '₱110' 
  },
  { 
    id: 18, 
    name: 'Croffle with Whipped Cream and Syrup', 
    description: 'Flaky croffle topped with fluffy whipped cream and sweet syrup.', 
    category: 'Croffles', 
    image: '/images/WhipppedCroffle.png', 
    price: '₱120' 
  },
  { 
    id: 19, 
    name: 'Oreo Croffle', 
    description: 'Croffle topped with sweet glaze and crushed Oreo cookies.', 
    category: 'Croffles', 
    image: 'images/OreoCroffle.png', 
    price: '₱150' 
  },
  { 
    id: 20, 
    name: 'Matcha Croffle', 
    description: 'Croffle glazed with a sweet, slightly earthy matcha flavoring.', 
    category: 'Croffles', 
    image: 'images/MatchaCroffle.png', 
    price: '₱150' 
  },
  { 
    id: 21, 
    name: 'Alcapone Croffle', 
    description: 'Croffle topped with white chocolate and crunchy, sliced almonds.', 
    category: 'Croffles', 
    image: 'images/AlcaponeCroffle.png', 
    price: '₱150' 
  },
  { 
    id: 22, 
    name: 'Blueberry Croffle', 
    description: 'Croffle topped with a vibrant blueberry glaze or fresh blueberries.', 
    category: 'Croffles', 
    image: 'images/BlueberryGraham.png', 
    price: '₱150' 
  },
  { 
    id: 23, 
    name: 'Strawberry Croffle', 
    description: 'Croffle topped with a sweet strawberry glaze or fresh strawberries.', 
    category: 'Croffles', 
    image: 'images/StrawberryGraham.png', 
    price: '₱150' 
  },
  { 
    id: 24, 
    name: 'Mango Graham Croffle', 
    description: 'A tropical delight! Our crispy croffle topped with sweet, juicy mango chunks, creamy sauce, and crunchy graham cracker crumbs.', 
    category: 'Croffles', 
    image: 'images/MangoGraham.png', 
    price: '₱150' 
  },
  { 
    id: 25, 
    name: 'Banana Nutella Croffle', 
    description: 'Croffle topped with creamy Nutella and sliced fresh banana.', 
    category: 'Croffles', 
    image: 'images/BananaNutella.png', 
    price: '₱160' 
  },
  { 
    id: 26, 
    name: 'Biscoff Croffle', 
    description: 'Croffle slathered with rich Biscoff spread and crunchy cookie crumbs.', 
    category: 'Croffles', 
    image: 'images/BiscoffCroffle.png', 
    price: '₱160' 
  },
];

const categories: ('All' | FoodItem['category'])[] = ['All', 'Snacks', 'Platters', 'Croffles', 'Quesadillas & Korean Corndogs'];

const optionsMap: Record<string, { flavors?: string[]; extras?: string[] }> = {
  'Fries': { flavors: ['Cheese', 'Sour & Cream', 'BBQ', 'Butter Cheese', 'Honey Butter'] },
  'Cheese Sticks': { extras: ['10 pcs', '15 pcs'] },
  'Hash Brown': { extras: ['2 pcs', '3 pcs'] },
  'Platter #1': { extras: ['Add Extra Nuggets'] },
  'Platter #2': { extras: ['Add Extra Nuggets'] },
  'Platter #3': { extras: ['Add Extra Nuggets'] },
  'Beef Quesadilla': { extras: ['Extra Garlic Sauce'] },
};

const FoodItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | FoodItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedExtra, setSelectedExtra] = useState('');

  const filtered = foodItems.filter((item) => {
    const byCat = activeTab === 'All' || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const getOptionsFor = (item: FoodItem) => optionsMap[item.name] || {};

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
                <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-xl md:text-2xl mb-4">{selectedItem.price}</div>
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base font-semibold block mb-1">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDecrease}
                      className="px-3 py-1 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-3 py-1 border rounded-full shadow hover:bg-[#8CB662] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Green Divider */}
                <div className="h-[2px] bg-[#8CB662] rounded-full my-4" />

                {/* Options */}
                {(() => {
                  const opts = getOptionsFor(selectedItem);
                  if (!opts) return null;

                  return (
                    <>
                      {opts.flavors && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1">Flavors</label>
                          <select
                            value={selectedFlavor}
                            onChange={(e) => setSelectedFlavor(e.target.value)}
                            className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm"
                          >
                            <option value="">Select flavor</option>
                            {opts.flavors.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {opts.extras && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1">Extras</label>
                          <select
                            value={selectedExtra}
                            onChange={(e) => setSelectedExtra(e.target.value)}
                            className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm"
                          >
                            <option value="">Select extra</option>
                            {opts.extras.map((e) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
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




