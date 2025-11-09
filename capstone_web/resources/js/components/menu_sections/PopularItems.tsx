// resources/js/Pages/website_pages/components/PopularItems.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface PopularItem {
  id: number;
  name: string;
  description: string;
  category:
    | 'Coffee'
    | 'Milk Tea'
    | 'Premium Matcha'
    | 'Specialty Coffee'
    | 'Lemonade & Fruit Juices'
    | 'Snacks'
    | 'Platters'
    | 'Quesadillas & Korean Corndogs'
    | 'Croffles';
  image: string;
  price: string;
}

const popularItems: PopularItem[] = [
  { 
    id: 1, 
    name: 'Iced Snow Coffee', 
    description: 'A unique, frosty iced coffee layered for an extra cold and creamy treat.', 
    category: 'Coffee',
    image: 'images/IceSnowCoffee.png', 
    price: '₱120' 
  },
  { 
    id: 2, 
    name: 'Sea Salt Honey', 
    description: 'A perfect balance of sweet honey, robust coffee, and a delicate hint of sea salt.', 
    category: 'Specialty Coffee', 
    image: '/images/SeaSaltHoney.png', 
    price: '₱170' 
  },
  { 
    id: 3, 
    name: 'White Chocolate Mocha', 
    description: 'Rich, creamy white chocolate is melted into smooth espresso and finished with steamed milk.', 
    category: 'Specialty Coffee', 
    image: '/images/WhiteChocolateMocha.png', 
    price: '₱180' 
  },
  { 
    id: 4, 
    name: 'Dulce De Leche', 
    description: 'Luxuriously sweet and comforting, featuring espresso infused with rich, caramelized milk goodness.', 
    category: 'Specialty Coffee', 
    image: '/images/DulceDeLeche.png', 
    price: '₱180' 
  },
  { 
    id: 5, 
    name: 'Classic Lemonade', 
    description: 'Perfectly refreshing that timeless balance of tart lemon and sweetness.', 
    category: 'Lemonade & Fruit Juices', 
    image: 'images/ClassicLemonade.png', 
    price: '₱60/70' 
  },
  { 
    id: 6, 
    name: 'Strawberry Lemonade', 
    description: 'Zesty, crisp lemonade infused with sweet, ripe strawberry juice.', 
    category: 'Lemonade & Fruit Juices', 
    image: 'images/StrawberryLemonade.png', 
    price: '₱70/80' 
  },
  { 
    id: 7, 
    name: 'Watermelon with Strawberry Popping Bobba', 
    description: 'Juicy watermelon juice with bursts of strawberry boba.', 
    category: 'Lemonade & Fruit Juices', 
    image: '/images/PoppingBobba.png', 
    price: '₱100' 
  },
  { 
    id: 8, 
    name: 'Peach Iced Tea', 
    description: 'Sweet, refreshing peach flavor perfectly blended with crisp iced tea.', 
    category: 'Lemonade & Fruit Juices', 
    image: '/images/PeachIcedTea.png', 
    price: '₱100' 
  },
  { 
    id: 9, 
    name: 'Okinawa', 
    description: 'Brown sugar and caramel notes meet classic milk tea for a deeply caramelized, signature flavor.', 
    category: 'Milk Tea', 
    image: '/images/Okinawa.png', 
    price: '₱90/100' 
  },
  { 
    id: 10, 
    name: 'Oreo Cheesecake Overload', 
    description: 'An indulgent milk tea layered with creamy cheesecake flavor and crunchy Oreo crumbs.', 
    category: 'Milk Tea', 
    image: '/images/OreoCheesecakeOverload.png', 
    price: '₱140' 
  },
  { 
    id: 11, 
    name: 'Wintermelon', 
    description: 'Refreshing, sweet, and unique milk tea with the mellow taste of wintermelon.', 
    category: 'Milk Tea', 
    image: '/images/Wintermelon.png', 
    price: '₱90/100' 
  },
   { 
    id: 12, 
    name: 'Oreo', 
    description: 'Creamy milk tea blended with crushed Oreo cookies and chewy boba.', 
    category: 'Milk Tea', 
    image: '/images/Oreo.png', 
    price: '₱90/100' 
  },
  { 
    id: 13, 
    name: 'Pure Matcha Oat Latte', 
    description: 'A truly authentic and vibrant experience. Premium matcha is perfectly blended with creamy milk.', 
    category: 'Premium Matcha', 
    image: '/images/PureMatchaOatLatte.png', 
    price: '₱160' 
  
  },
  { 
    id: 14, 
    name: 'Specialty Matcha', 
    description: 'Our exclusive, high-quality matcha blend, perfectly whisked for an unparalleled, authentic taste.', 
    category: 'Premium Matcha', 
    image: '/images/SpecialtyMatcha.png', 
    price: '₱250' 
  },
  { 
    id: 15, 
    name: 'Fries', 
    description: 'perfectly golden and crispy French fries, great for sharing.', 
    category: 'Snacks', 
    image: 'images/Fries.png', 
    price: '₱70/90' 
  },
  { 
    id: 16, 
    name: 'Cheese Sticks', 
    description: 'Deep-fried, gooey cheese sticks with a savory, crispy coating.', 
    category: 'Snacks', 
    image: 'images/CheeseSticks.png', 
    price: '₱60/80' 
  },
  { 
    id: 17, 
    name: 'Cheesy Corndogs', 
    description: 'Classic corndogs with a blend of savory hotdog and gooey, melted cheese.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: '/images/CheesyCorndogs.png', 
    price: '₱135' 
  },
  { 
    id: 18, 
    name: 'Beef Quesadilla', 
    description: 'Grilled tortilla filled with seasoned beef and cheese.', 
    category: 'Quesadillas & Korean Corndogs', 
    image: 'images/BeefQuesadilla.png', 
    price: '₱130' 
  },
  { 
    id: 19, 
    name: 'Platter #3', 
    description: 'The ultimate combo: Fries, 10 Cheese Sticks, 2 Hash Browns, and 3 Chicken Nuggets.', 
    category: 'Platters', 
    image: 'images/Platter3.png', 
    price: '₱250' 
  },
  { 
    id: 21, 
    name: 'Biscoff Croffle', 
    description: 'Croffle slathered with rich Biscoff spread and crunchy cookie crumbs.', 
    category: 'Croffles', 
    image: '/images/BiscoffCroffle.png', 
    price: '₱160' 
  },
  { 
    id: 22, 
    name: 'Croffle with Whipped Cream & Syrup', 
    description: 'Flaky croffle topped with fluffy whipped cream and sweet syrup.',
    category: 'Croffles', 
    image: '/images/WhipppedCroffle.png', 
    price: '₱120' 
  },
];

const PopularItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | PopularItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<PopularItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedAddOn, setSelectedAddOn] = useState<string>('');

  const categories: ('All' | PopularItem['category'])[] = [
    'All',
    'Coffee',
    'Milk Tea',
    'Premium Matcha',
    'Specialty Coffee',
    'Lemonade & Fruit Juices',
    'Snacks',
    'Platters',
    'Quesadillas & Korean Corndogs',
    'Croffles',
  ];

  const filtered = popularItems.filter((i) => {
    const byCat = activeTab === 'All' || i.category === activeTab;
    const bySearch = i.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const isDrinkCategory = (cat: PopularItem['category']) =>
    ['Coffee', 'Milk Tea', 'Premium Matcha', 'Specialty Coffee', 'Lemonade & Fruit Juices'].includes(cat);

  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    'Premium Matcha': { flavors: ['Hot', 'Cold'], addOns: ['Oat Milk'] },
    'Specialty Coffee': { flavors: ['Hot', 'Cold'], addOns: ['Oat Milk', 'Extra Espresso'] },
    'Lemonade & Fruit Juices': {
      flavors: [],
      addOns: [
        'Pearls',
        'Nata',
        'Coffee Jelly',
        'Strawberry Popping Bobba',
        
      ],
    },
    'Quesadillas & Korean Corndogs': { flavors: [], addOns: [] },
    'Coffee': { flavors: [], addOns: ['Extra Matcha','Extra Coffee Shot'] },
    'Milk Tea': { flavors: [], addOns: ['Pearls', 'Nata','Coffee Jelly','Crushed Oreo','Cream Cheese','Cheesecake','Extra Matcha Shot'] },
    'Snacks': { flavors: [], addOns: [] },
    'Platters': { flavors: [], addOns: [] },
    'Croffles': { flavors: [], addOns: [] },
  };

  const getOptionsFor = (item: PopularItem) => optionsMap[item.category] || { flavors: [], addOns: [] };

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
            placeholder="Search popular item..."
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

                {/* Size (Drinks Only) */}
                {isDrinkCategory(selectedItem.category) && (
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
                )}

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

export default PopularItems;

