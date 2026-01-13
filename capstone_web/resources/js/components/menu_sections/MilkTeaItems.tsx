import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';

interface MilkTeaItem {
  id: number;
  name: string;
  description: string;
  category: 'Classic' | 'Special';
  subcategories: string[];
  image_path: string;
  price: { regular: string; large?: string };
}

const MilkTeaItems: React.FC = () => {
  const [items, setItems] = useState<MilkTeaItem[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MilkTeaItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedAddOn, setSelectedAddOn] = useState('');

  useEffect(() => {
    axios
      .get('/api/menu')
      .then((res) => {
        const milkTeas = (res.data.items || res.data).filter((i: any) =>
          i.subcategories.some((sub: string) => sub.startsWith('Milktea:'))
        );
        setItems(milkTeas);
      })
      .catch((e) => console.error('Error loading milk tea items:', e));
  }, []);

  const milkTeaOnly = items.filter((i) =>
    i.subcategories.some((sub) => sub.startsWith('Milktea:'))
  );

  const milkTeaSubcategories = Array.from(
    new Set(
      milkTeaOnly
        .flatMap((i) => i.subcategories)
        .map((sub) => (sub.includes(':') ? sub.split(':')[1] : sub))
        .filter((sub) => sub !== 'Milktea')
    )
  );

  const tabs = ['All', ...milkTeaSubcategories];

  const filtered = milkTeaOnly.filter((i) => {
    const subcategoriesCleaned = i.subcategories.map((sub) =>
      sub.includes(':') ? sub.split(':')[1] : sub
    );
    const matchTab = activeTab === 'All' || subcategoriesCleaned.includes(activeTab);
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const optionsMap: Record<string, { flavors: string[]; addOns: string[] }> = {
    Classic: {
      flavors: [],
      addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Crushed Oreo', 'Cream Cheese', 'Cheesecake', 'Extra Matcha Shot'],
    },
    Special: {
      flavors: ['Hot', 'Cold'],
      addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Crushed Oreo', 'Cream Cheese', 'Cheesecake', 'Extra Matcha Shot'],
    },
  };

  const getOptionsFor = (item: MilkTeaItem) =>
    optionsMap[item.category] || optionsMap.Classic;

  const formatPrice = (price: { regular: string; large?: string }) =>
    [`₱${price.regular}`, price.large && `₱${price.large}`].filter(Boolean).join(' | ');

  const getAvailableSizes = (price: { regular?: string; large?: string }) => {
    const sizes: string[] = [];
    if (price.regular) sizes.push('16oz');
    if (price.large) sizes.push('22oz');
    return sizes;
  };

  /* 🔥 NEW: Dynamic price based on selected size */
  const getPriceForSize = (item: MilkTeaItem) => {
    if (!selectedSize) return formatPrice(item.price);
    return selectedSize === '22oz' && item.price.large
      ? `₱${item.price.large}`
      : `₱${item.price.regular}`;
  };

  return (
    <div className="px-6 pt-10 pb-16">
    {/* Tabs & Search Container */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
  
  {/* Tabs Section */}
  <div className="w-full md:w-auto overflow-hidden">
    <div 
      className="flex flex-nowrap gap-3 pb-2 md:pb-0 overflow-x-auto no-scrollbar"
      style={{
        WebkitOverflowScrolling: 'touch', 
        scrollbarWidth: 'none',          
        msOverflowStyle: 'none'          
      }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`whitespace-nowrap text-sm font-bold px-6 py-2.5 rounded-full border transition-all duration-200 ${
            activeTab === t
              ? 'bg-[#8CB662] text-white border-[#8CB662] shadow-md'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>

  {/* Search Bar Section */}
  <div className="relative w-full md:max-w-xs lg:max-w-md">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input
      type="text"
      placeholder="Search milk tea..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8CB662]/50 transition-all shadow-sm"
    />
  </div>
</div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
              setSelectedSize('16oz'); // default to 16oz
              setSelectedFlavor('');
              setSelectedAddOn('');
            }}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden border bg-white cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image_path}`}
                alt={item.name}
                className="w-60 h-60 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-right text-lg text-[#76B13A] font-bold">
                {formatPrice(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded p-10 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={`/storage/${selectedItem.image_path}`}
                alt={selectedItem.name}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>

                {/* 🔥 DYNAMIC PRICE */}
                <div className="text-[#65B741] font-bold text-xl mb-2">
                  {getPriceForSize(selectedItem)}
                </div>

                <p className="mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="font-semibold">Quantity</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={handleDecrease} className="px-3 border rounded-full">-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease} className="px-3 border rounded-full">+</button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <label className="font-semibold">Cup Size</label>
                  <div className="flex gap-2 mt-2">
                    {getAvailableSizes(selectedItem.price).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-6 py-1 border rounded-full ${
                          selectedSize === s ? 'bg-[#8CB662] text-white' : ''
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-6">
                  <button className="border px-6 py-2 rounded-full text-[#8CB662] hover:bg-[#8CB662] hover:text-white">
                    Add to Cart
                  </button>
                  <button className="border px-6 py-2 rounded-full text-[#8CB662] hover:bg-[#8CB662] hover:text-white">
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

export default MilkTeaItems;
