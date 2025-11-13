// resources/js/Pages/website_pages/components/MilkTea.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface MilkTeaItem {
  id: number;
  name: string;
  description: string;
  category: 'Classic' | 'Special';
  image: string;
  price: string;
}

const milkTeaList: MilkTeaItem[] = [
  // Classic Milk Tea
  { 
    id: 1, 
    name: 'Classic Bubble', 
    description: 'The traditional favorite: rich, creamy milk tea with chewy boba pearls.', 
    category: 'Classic', 
    image: '/images/ClassicBubble.png', 
    price: '₱90/100' 
  },
  { 
    id: 2, 
    name: 'Okinawa', 
    description: 'Brown sugar and caramel notes meet classic milk tea for a deeply caramelized, signature flavor.', 
    category: 'Classic', 
    image: '/images/Okinawa.png', 
    price: '₱90/100' 
  },
  { 
    id: 3, 
    name: 'Wintermelon', 
    description: 'Refreshing, sweet, and unique milk tea with the mellow taste of wintermelon.', 
    category: 'Classic', 
    image: '/images/Wintermelon.png', 
    price: '₱90/100' 
  },
  { 
    id: 4, 
    name: 'Chocolate', 
    description: 'Rich, indulgent chocolate flavor combined with classic milk tea and boba.', 
    category: 'Classic', 
    image: '/images/Chocolate.png', 
    price: '₱90/100' 
  },
  { 
    id: 5, 
    name: 'Oreo', 
    description: 'Creamy milk tea blended with crushed Oreo cookies and chewy boba.', 
    category: 'Classic', 
    image: '/images/Oreo.png', 
    price: '₱90/100' 
  },
  { 
    id: 6, 
    name: 'Caramel', 
    description: 'Sweet and buttery caramel swirl blended into classic milk tea.', 
    category: 'Classic', 
    image: '/images/Caramel.png', 
    price: '₱90/100' 
  },
  { 
    id: 7, 
    name: 'Java Chip', 
    description: 'Classic milk tea mixed with rich chocolate chips and a hint of coffee flavor.', 
    category: 'Classic', 
    image: '/images/JavaChip.png', 
    price: '₱90/100' 
  },
  { 
    id: 8, 
    name: 'Matcha', 
    description: 'Earthy and sweet matcha green tea mixed into a creamy milk tea base.', 
    category: 'Classic', 
    image: '/images/Matcha.png', 
    price: '₱90/100' 
  },

  // Special Milk Tea
  { 
    id: 9, 
    name: 'Oreo Cheesecake Overload', 
    description: 'An indulgent milk tea layered with creamy cheesecake flavor and crunchy Oreo crumbs.', 
    category: 'Special', 
    image: '/images/OreoCheesecakeOverload.png', 
    price: '₱140' 
  },
  { 
    id: 10, 
    name: 'Oreo Cream Cheese', 
    description: 'Classic milk tea topped with a thick, slightly savory Oreo cream cheese foam.', 
    category: 'Special', 
    image: '/images/OreoCreamCheese.png', 
    price: '₱130' 
  },
  { 
    id: 11, 
    name: 'Matcha Cheesecake', 
    description: 'Matcha milk tea finished with a rich cheesecake-flavored foam on top.', 
    category: 'Special', 
    image: '/images/MatchaCheesecake.png', 
    price: '₱130' 
  },
  { 
    id: 12, 
    name: 'Bobbatella', 
    description: 'Creamy milk tea with the delightful chocolate-hazelnut flavor of Nutella.', 
    category: 'Special', 
    image: '/images/Bobbatella.png', 
    price: '₱130' 
  },
  { 
    id: 13, 
    name: 'Meiji Apollo (Choco-Berry)', 
    description: 'A nostalgic blend of creamy chocolate and sweet strawberry flavor.', 
    category: 'Special', 
    image: '/images/MeijiApollo.png', 
    price: '₱130' 
  },
];

const MilkTea: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | MilkTeaItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MilkTeaItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedAddOn, setSelectedAddOn] = useState<string>('');
  

  const categories: ('All' | MilkTeaItem['category'])[] = ['All', 'Classic', 'Special'];

  const filtered = milkTeaList.filter((i) => {
    const byCat = activeTab === 'All' || i.category === activeTab;
    const bySearch = i.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

   const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    'Classic': { flavors: [], addOns: ['Pearls', 'Nata','Coffee Jelly','Crushed Oreo','Cream Cheese','Cheesecake','Extra Matcha Shot'] },
    'Special': { flavors: [''], addOns: ['Pearls', 'Nata','Coffee Jelly','Crushed Oreo','Cream Cheese','Cheesecake','Extra Matcha Shot'] },
  };

  const getOptionsFor = (item: MilkTeaItem) => optionsMap[item.category] || { flavors: [], addOns: [] };

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
            placeholder="Search milk tea..."
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
                <div className="mb-6">
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

export default MilkTea;

