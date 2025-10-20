import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar } from 'react-icons/fa';
import { X } from 'lucide-react';

type Product = {
  title: string;
  description: string;
  price: string;
  image: string;
};

type Category =
  | 'Lemonade & Fruit Juice'
  | 'Milk Tea'
  | 'Snacks'
  | 'Coffee'
  | 'Platters';

const categories: Category[] = [
  'Lemonade & Fruit Juice',
  'Milk Tea',
  'Snacks',
  'Coffee',
  'Platters',
];

const productData: Record<Category, Product[]> = {
  'Lemonade & Fruit Juice': [
    {
      title: 'Cucumber Lemonade',
      description:
        'Cool, crisp, and refreshing—a zesty blend of lemon and fresh cucumber for the ultimate chill.',
      price: '₱60',
      image: '/images/CucumberLemonade.png',
    },
    {
      title: 'Watermelon with Strawberry Popping Bobba',
      description:
        'Juicy watermelon meets a burst of strawberry bobba—sweet, fun, and flavor-packed in every sip!',
      price: '₱70',
      image: '/images/WatermelonStrawberryBoba.png',
    },
    {
      title: 'Classic Lemonade',
      description:
        'Timelessly tangy and perfectly sweet—the all-time favorite that never goes out of style.',
      price: '₱55',
      image: '/images/ClassicLemonade.png',
    },
    {
      title: 'Charcoal Lemonade',
      description:
        'Bold and detoxifying with a citrus twist—lemonade with a striking black finish and a clean, refreshing taste.',
      price: '₱50',
      image: '/images/CharcoalLemonade.png',
    },
  ],
  'Milk Tea': [
      {
      title: 'Okinawa',
      description:
        'A creamy brown sugar milk tea blend with rich roasted caramel notes and soft pearls.',
      price: '₱80/90',
      image: '/images/Okinawa.png',
    },
    {
      title: 'Wintermelon',
      description:
        'Delicately sweet with a mellow finish—this milk tea classic is both calming and satisfying.',
      price: '₱80/90',
      image: '/images/Wintermelon.png',
    },
    {
      title: 'Oreo',
      description:
        'Crushed Oreo cookies blended into smooth milk tea—crunchy, creamy, and crave-worthy.',
      price: '₱80/90',
      image: '/images/Oreo.png',
    },
    {
      title: 'Bobbatella',
      description:
        'Nutella meets bobba in this indulgent fusion of chocolatey richness and chewy delight.',
      price: '₱110',
      image: '/images/Bobbatella.png',
    },
  ],
  'Snacks': [
     {
    title: 'Fries',
    description:
      'Golden, crispy, and lightly salted—our fries are the perfect companion to any drink.',
    price: '₱45',
    image: '/images/Fries.png',
  },
  {
    title: 'Cheese Sticks',
    description:
      'Crunchy on the outside, melty cheese on the inside—served with a savory dip for extra delight.',
    price: '₱50',
    image: '/images/CheeseSticks.png',
  },
  ],
  'Coffee': [
    {
    title: 'Ice Snow Coffee',
    description:
      'A chill twist on your classic brew—smooth iced coffee topped with a snowy layer of cream.',
    price: '₱85',
    image: '/images/IceSnowCoffee.png',
  },
  ],
  'Platters': [
     {
    title: 'Platter #2',
    description:
      'A savory combo of Fries, 10 pcs Cheese Sticks, and 2 pcs Hash Browns—perfect for sharing or solo cravings.',
    price: '₱140',
    image: '/images/Platter2.png',
  },
  {
    title: 'Platter #3',
    description:
      'Enjoy Fries, 10 pcs Cheese Sticks, 2 pcs Hash Browns, and 3 pcs Chicken Nuggets—a hearty and tasty mix!',
    price: '₱170',
    image: '/images/Platter3.png',
  },
  ],
};

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });
  const [activeCategory, setActiveCategory] = useState<Category>('Lemonade & Fruit Juice');

  // Modal states
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Option states (per modal open)
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedAddOn, setSelectedAddOn] = useState<string>('');
  const [selectedExtra, setSelectedExtra] = useState<string>('');

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const isFoodCategory = (cat: Category | null) => cat === 'Snacks' || cat === 'Platters';
  const isDrinkCategory = (cat: Category | null) =>
    cat === 'Lemonade & Fruit Juice' || cat === 'Milk Tea' || cat === 'Coffee';

  // Category-specific option sets shown IN THE MODAL
  const drinkOptions = {
    flavors: ['No Syrup', 'Vanilla Syrup', 'Caramel Syrup', 'Hazelnut Syrup'],
    addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Crushed Oreo', 'Cream Cheese', 'Cheesecake', 'Strawberry Popping Bobba'],
    extras: ['Ice', 'Extra Milk', 'Extra Matcha Shot', 'Extra Coffee Shot'],
  };

  const snackOptions = {
    flavors: ['Original', 'Cheese', 'BBQ', 'Sour Cream', 'Garlic Parmesan', 'Spicy'],
    addOns: ['Cheese Dip', 'Ketchup', 'Mayo', 'Honey Mustard'],
    extras: ['Extra Cheese', 'Extra Sauce', 'Large Upgrade'],
  };

  const platterOptions = {
    flavors: ['Original', 'Spicy', 'Garlic Parmesan', 'Honey BBQ'],
    addOns: ['Cheese Dip', 'Ketchup', 'Mayo', 'Honey Mustard'],
    extras: ['Extra Cheese', 'Extra Sauce', 'Upgrade to Party Size'],
  };

  const getOptionsFor = (cat: Category | null) => {
    if (cat === 'Snacks') return snackOptions;
    if (cat === 'Platters') return platterOptions;
    return drinkOptions;
  };  

// Animations
const containerVariants: Variants = { 
  hidden: {}, 
  visible: { 
    transition: { staggerChildren: 0.2 } 
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: ['easeInOut'] } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: 0.3, ease: ['easeInOut'] } 
  },
};

  const openModal = (item: Product, cat: Category) => {
    setSelectedItem(item);
    setSelectedCategory(cat);
    setQuantity(1);
    setSelectedSize(null);
    setSelectedFlavor('');
    setSelectedAddOn('');
    setSelectedExtra('');
  };

  return (
    <section ref={ref} className="bg-[#B4D9DD] py-16 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <img src="/images/MiAmore2.png" alt="Mi Amore Logo" className="mx-auto w-20 md:w-30 mb-1" />
        <h2 className="text-2xl text-[#9D7353] italic font-semibold">Our Most-Loved Sips & Bites</h2>
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 text-sm rounded-full shadow-md transition-all duration-200 font-medium focus:outline-none ${
                cat === activeCategory
                  ? 'bg-[#76B13A] text-white'
                  : 'bg-white text-[#76B13A] border border-[#76B13A] hover:bg-[#76B13A] hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <AnimatePresence>
          {productData[activeCategory].map((item: Product, index: number) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onClick={() => openModal(item, activeCategory)}
              className="bg-white rounded-md shadow-md overflow-hidden flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="bg-[#E1E1E1] p-4 flex justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-contain rounded-md"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[15px] text-[#4F4F4F] mb-1">{item.title}</h3>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xs mr-1" />
                    ))}
                </div>
                <p className="text-sm text-gray-800 italic mb-3 leading-snug text-justify">
                  {item.description}
                </p>
                <p className="text-[#55A630] font-bold text-sm">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

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
                alt={selectedItem.title}
                className="w-[300px] h-[300px] object-contain border-[12px] border-[#E1E1E1] rounded bg-[#E1E1E1]"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
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

                {/* Size (drinks only) */}
                {isDrinkCategory(selectedCategory) && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold mb-1">Size options</label>
                    <div className="h-[2px] w-full bg-[#8CB662] my-1" />
                    <div className="flex space-x-2 mt-4">
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-[95px] h-[25px] border px-3 py-1 rounded-full text-xs shadow-md transition-colors ${
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
                )}

                {/* Options (category-specific) */}
                {(() => {
                  const { flavors, addOns, extras } = getOptionsFor(selectedCategory);
                  return (
                    <>
                      {/* Flavors */}
                      <div className="mb-4">
                        <label className="text-sm font-semibold mb-1">Flavors</label>
                        <div className="h-[2px] w-full bg-[#8CB662] my-2" />
                        <select
                          value={selectedFlavor}
                          onChange={(e) => setSelectedFlavor(e.target.value)}
                          className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs"
                        >
                          <option value="" disabled>
                            Select a flavor
                          </option>
                          {flavors.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Add-ons */}
                      <div className="mb-4">
                        <label className="text-xs block font-semibold mb-1">Add-ons</label>
                        <select
                          value={selectedAddOn}
                          onChange={(e) => setSelectedAddOn(e.target.value)}
                          className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs"
                        >
                          <option value="" disabled>
                            Select an add-on
                          </option>
                          {addOns.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Extras */}
                      <div className="mb-8">
                        <label className="text-xs block font-semibold mb-1">Extras</label>
                        <select
                          value={selectedExtra}
                          onChange={(e) => setSelectedExtra(e.target.value)}
                          className="w-[300px] border border-[#8CB662] rounded px-2 py-1 text-xs"
                        >
                          <option value="" disabled>
                            Select an extra
                          </option>
                          {extras.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  );
                })()}

                {/* Buttons */}
                <div className="flex gap-6">
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
    </section>
  );
};

export default BestSellerSection;