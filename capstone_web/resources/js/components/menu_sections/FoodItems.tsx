import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';

interface ApiItem {
  id: number;
  name: string;
  description: string;
  type: string;
  categories: string[];
  subcategories: string[];
  image_path: string;
  price: {
    regular?: number;
    large?: number;
  };
}

interface FoodItem {
  id: number;
  name: string;
  description: string;
  category: 'Snacks' | 'Platters' | 'Croffles' | 'Quesadillas & Korean Corndogs';
  image: string;
  price: string;
  rawPrice: { regular?: number; large?: number };
}

const SUBCATEGORIES = ['Snacks', 'Platters', 'Croffles', 'Quesadillas & Korean Corndogs'] as const;
const categories: ('All' | FoodItem['category'])[] = ['All', ...SUBCATEGORIES];

const FoodItems: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | FoodItem['category']>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedExtra, setSelectedExtra] = useState('');
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large' | ''>('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* 🔐 CHECK LOGIN (same as CoffeeItems) */
  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    setIsLoggedIn(!!token);
  }, []);

  /* 📦 FETCH MENU */
  useEffect(() => {
    axios.get('/api/menu')
      .then((res) => {
        const data: ApiItem[] = res.data.items || res.data;

        const filtered = data.filter((item) =>
          item.subcategories.some((sub) =>
            SUBCATEGORIES.some((cat) => sub.endsWith(`:${cat}`))
          )
        );

        const foodItems: FoodItem[] = filtered.map((item) => {
          const sub = item.subcategories.find((sc) =>
            SUBCATEGORIES.some((cat) => sc.endsWith(`:${cat}`))
          );

          const category = sub ? sub.split(':')[1] : 'Snacks';

          const { regular, large } = item.price;
          let formattedPrice = '';
          if (regular && large) formattedPrice = `₱${regular}/${large}`;
          else if (regular) formattedPrice = `₱${regular}`;
          else if (large) formattedPrice = `₱${large}`;

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category: category as FoodItem['category'],
            image: `/storage/${item.image_path}`,
            price: formattedPrice,
            rawPrice: item.price,
          };
        });

        setItems(foodItems);
      })
      .catch(console.error);
  }, []);

  const filtered = items.filter((item) => {
    const byCat = activeTab === 'All' || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  /* 🛒 ADD TO CART (COPIED LOGIC FROM CoffeeItems) */
  const handleAddToCart = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token || !selectedItem) {
      alert('Please log in to add items to cart.');
      return;
    }

    const price =
      selectedSize === 'large'
        ? selectedItem.rawPrice.large
        : selectedItem.rawPrice.regular;

    try {
      await axios.post(
        '/api/cart/add',
        {
          product_id: selectedItem.id,
          product_name: selectedItem.name,
          size: selectedSize || null,
          quantity,
          instructions: selectedExtra || selectedFlavor || '',
          price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Item added to cart!');
      setSelectedItem(null);
      setQuantity(1);
      setSelectedFlavor('');
      setSelectedExtra('');
      setSelectedSize('');
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart.');
    }
  };

  const getOptionsFor = (item: FoodItem) => {
    const map: Record<string, { flavors?: string[]; extras?: string[] }> = {
      Fries: { flavors: ['Cheese', 'BBQ', 'Sour Cream'] },
      'Cheese Sticks': { extras: ['10 pcs', '15 pcs'] },
      'Hash Brown': { extras: ['2 pcs', '3 pcs'] },
    };
    return map[item.name] || {};
  };

  return (
    <div className="px-6 pt-10 pb-16">
      {/* Tabs & Search */}
      <div className="flex justify-between items-center mb-10 gap-4">
        <div className="flex flex-wrap gap-3">
          {categories.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-full border ${
                activeTab === t
                  ? 'bg-[#8CB662] text-white'
                  : 'border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-2.5" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food..."
            className="w-full pl-10 pr-4 py-2 rounded-full border"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="cursor-pointer bg-white rounded-xl shadow"
          >
            <div className="bg-[#E1E1E1] p-4 flex justify-center">
              <img src={item.image} className="w-60 h-60 object-contain" />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm">{item.description}</p>
              <div className="text-right text-[#76B13A] font-bold">{item.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white max-w-4xl w-full p-8 rounded relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4">
              <X />
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>

            {/* Quantity */}
            <div className="flex gap-2 mb-4">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>

            {/* Add to Cart */}
            {isLoggedIn ? (
              <button
                onClick={handleAddToCart}
                className="border px-6 py-2 rounded hover:bg-[#8CB662] hover:text-white"
              >
                Add to Cart
              </button>
            ) : (
              <div className="text-red-500 font-semibold">Please log in to order.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;
