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

  // ---------------------------
  // FETCH PREMIUM MATCHA ITEMS
  // ---------------------------
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/menu');
        const data: ApiItem[] = res.data.items || res.data || [];

        console.log('Fetched menu items from API:', data);

        // Filter only Premium Matcha category
        const filtered = data.filter((item) =>
          item.categories.includes(CATEGORY)
        );

        console.log('Filtered Premium Matcha items:', filtered);

        // Map into PremiumMatchaItem with price formatting
        const formatted: PremiumMatchaItem[] = filtered.map((item) => {
          const { regular, large } = item.price;
          let formattedPrice = '';
          if (regular && large) formattedPrice = `₱${regular}/${large}`;
          else if (regular) formattedPrice = `₱${regular}`;
          else if (large) formattedPrice = `₱${large}`;

          // Fix image URL (remove leading slash if exists)
          const imagePath = item.image_path.startsWith('/')
            ? item.image_path.slice(1)
            : item.image_path;

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category: 'Premium Matcha',
            image: `/${imagePath}`,
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        console.log('🍵 Formatted Premium Matcha items:', formatted);
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

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Search bar */}
      <div className="flex justify-end mb-10">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
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
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setSelectedOption('');
              setQuantity(1);
            }}
            className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden bg-white border cursor-pointer"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img src={`/storage/${item.image}`} alt={item.name} className="w-60 h-60 object-contain rounded-xl" />
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
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={`/${selectedItem.image}`}
                alt={selectedItem.name}
                className="w-[350px] h-[350px] object-contain bg-[#E1E1E1] rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{selectedItem.name}</h2>
                <div className="text-[#65B741] font-bold text-xl mb-2">{selectedItem.price}</div>
                <p className="text-md text-gray-700 mb-4 text-gray-900">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold text-gray-900">Quantity</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={handleDecrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white text-gray-900"
                    >
                      -
                    </button>
                    <span className='text-gray-900'>{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-3 border rounded-full shadow hover:bg-[#8CB662] hover:text-white text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cup Size */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-900">Cup Size</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <div className="flex gap-2">
                    {['16oz', '22oz'].map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-[95px] h-[30px] border rounded-4xl text-sm font-light shadow-lg text-gray-900 ${
                          selectedSize === size
                            ? 'bg-[#8CB662] text-white border-[#8CB662]'
                            : 'hover:bg-[#8CB662] hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hot/Cold Option */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900">Option</label>
                  <div className="h-[2px] bg-[#8CB662] my-2" />
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#8CB662] text-gray-900"
                  >
                    <option value="" disabled>Select option</option>
                    {getOptions(selectedItem).map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

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

export default PremiumMatcha;
