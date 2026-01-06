import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search } from 'lucide-react';

interface ApiItem {
  id: number;
  name: string;
  description: string;
  image_path: string;
  price: { regular?: string; large?: string };
  categories: string[];
}

interface PremiumMatchaItem {
  id: number;
  name: string;
  description: string;
  category: 'Premium Matcha';
  image: string;
  price: string;
  rawPrice: { regular?: string; large?: string };
}

const PremiumMatcha: React.FC = () => {
  const CATEGORY = 'Premium Matcha';

  const [items, setItems] = useState<PremiumMatchaItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<PremiumMatchaItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('16oz');
  const [selectedOption, setSelectedOption] = useState('');

  // FETCH PREMIUM MATCHA ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/menu');
        const data: ApiItem[] = res.data.items || res.data || [];

        const filtered = data.filter((item) =>
          item.categories.includes(CATEGORY)
        );

        const formatted: PremiumMatchaItem[] = filtered.map((item) => {
          const { regular, large } = item.price;

          let formattedPrice = '';
          if (regular && large) formattedPrice = `₱${regular}/${large}`;
          else if (regular) formattedPrice = `₱${regular}`;
          else if (large) formattedPrice = `₱${large}`;

          const imagePath = item.image_path.startsWith('/')
            ? item.image_path.slice(1)
            : item.image_path;

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category: 'Premium Matcha',
            image: imagePath,
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        setItems(formatted);
      } catch (error) {
        console.error('Error fetching Premium Matcha items:', error);
      }
    };

    fetchItems();
  }, []);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const getOptions = (item: PremiumMatchaItem) => {
    if (item.name === 'Matcha Ichigo') return ['Cold'];
    return ['Hot', 'Cold'];
  };

  // 🔥 NEW: Dynamic price based on selected size
  const getPriceForSize = (item: PremiumMatchaItem) => {
    if (!selectedSize) return item.price;
    return selectedSize === '22oz' && item.rawPrice.large
      ? `₱${item.rawPrice.large}`
      : `₱${item.rawPrice.regular}`;
  };

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Search */}
      <div className="flex justify-end mb-10">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search premium matcha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm rounded-full border border-gray-300 focus:ring-2 focus:ring-[#8CB662]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setSelectedOption('');
              setQuantity(1);
              setSelectedSize('16oz'); // default size
            }}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden bg-white border cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img
                src={`/storage/${item.image}`}
                alt={item.name}
                className="w-60 h-60 object-contain rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#2E3A2F]">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-right text-lg text-[#76B13A] font-bold">
                {item.price}
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
                src={`/storage/${selectedItem.image}`}
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

                {/* Size */}
                <div className="mb-4">
                  <label className="font-semibold">Cup Size</label>
                  <div className="flex gap-2 mt-2">
                    {['16oz', '22oz'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-1 border rounded-full ${
                          selectedSize === size ? 'bg-[#8CB662] text-white' : ''
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hot / Cold */}
                <div className="mb-6">
                  <label className="font-semibold">Option</label>
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full border rounded-md p-2 mt-2"
                  >
                    <option value="" disabled>Select option</option>
                    {getOptions(selectedItem).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
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

export default PremiumMatcha;
