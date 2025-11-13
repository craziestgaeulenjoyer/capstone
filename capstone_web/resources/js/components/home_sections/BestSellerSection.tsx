import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar } from 'react-icons/fa';
import { X } from 'lucide-react';

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

type Category =
  | 'Lemonade & Fruit Juice'
  | 'Milk Tea'
  | 'Snacks'
  | 'Coffee'
  | 'Platters'
  | 'Specialty Coffee'
  | 'Premium Matcha'
  | 'Quesadillas & Corndogs'
  | 'Croffles';

const categories: Category[] = [
  'Lemonade & Fruit Juice',
  'Milk Tea',
  'Snacks',
  'Coffee',
  'Platters',
  'Specialty Coffee',
  'Premium Matcha',
  'Quesadillas & Corndogs',
  'Croffles',
];

// Sample product data
const productData: Product[] = [
  { id: 1, title: 'Iced Snow Coffee', description: 'A unique, frosty iced coffee layered for an extra cold and creamy treat.', category: 'Coffee', image: 'images/IceSnowCoffee.png', price: '₱120' },
  { id: 2, title: 'Sea Salt Honey', description: 'A perfect balance of sweet honey, robust coffee, and a delicate hint of sea salt.', category: 'Specialty Coffee', image: '/images/SeaSaltHoney.png', price: '₱170' },
  { id: 3, title: 'White Chocolate Mocha', description: 'Rich, creamy white chocolate is melted into smooth espresso and finished with steamed milk.', category: 'Specialty Coffee', image: '/images/WhiteChocolateMocha.png', price: '₱180' },
  { id: 4, title: 'Dulce De Leche', description: 'Luxuriously sweet and comforting, featuring espresso infused with rich, caramelized milk goodness.', category: 'Specialty Coffee', image: '/images/DulceDeLeche.png', price: '₱180' },
  { id: 5, title: 'Classic Lemonade', description: 'Perfectly refreshing that timeless balance of tart lemon and sweetness.', category: 'Lemonade & Fruit Juice', image: 'images/ClassicLemonade.png', price: '₱60/70' },
  { id: 6, title: 'Strawberry Lemonade', description: 'Zesty, crisp lemonade infused with sweet, ripe strawberry juice.', category: 'Lemonade & Fruit Juice', image: 'images/StrawberryLemonade.png', price: '₱70/80' },
  { id: 7, title: 'Watermelon with Strawberry Popping Bobba', description: 'Juicy watermelon juice with bursts of strawberry boba.', category: 'Lemonade & Fruit Juice', image: '/images/PoppingBobba.png', price: '₱100' },
  { id: 8, title: 'Peach Iced Tea', description: 'Sweet, refreshing peach flavor perfectly blended with crisp iced tea.', category: 'Lemonade & Fruit Juice', image: '/images/PeachIcedTea.png', price: '₱100' },
  { id: 9, title: 'Okinawa', description: 'Brown sugar and caramel notes meet classic milk tea for a deeply caramelized, signature flavor.', category: 'Milk Tea', image: '/images/Okinawa.png', price: '₱90/100' },
  { id: 10, title: 'Oreo Cheesecake Overload', description: 'An indulgent milk tea layered with creamy cheesecake flavor and crunchy Oreo crumbs.', category: 'Milk Tea', image: '/images/OreoCheesecakeOverload.png', price: '₱140' },
  { id: 11, title: 'Wintermelon', description: 'Refreshing, sweet, and unique milk tea with the mellow taste of wintermelon.', category: 'Milk Tea', image: '/images/Wintermelon.png', price: '₱90/100' },
  { id: 12, title: 'Oreo', description: 'Creamy milk tea blended with crushed Oreo cookies and chewy boba.', category: 'Milk Tea', image: '/images/Oreo.png', price: '₱90/100' },
  { id: 13, title: 'Pure Matcha Oat Latte', description: 'A truly authentic and vibrant experience. Premium matcha is perfectly blended with creamy milk.', category: 'Premium Matcha', image: '/images/PureMatchaOatLatte.png', price: '₱160' },
  { id: 14, title: 'Specialty Matcha', description: 'Our exclusive, high-quality matcha blend, perfectly whisked for an unparalleled, authentic taste.', category: 'Premium Matcha', image: '/images/SpecialtyMatcha.png', price: '₱250' },
  { id: 15, title: 'Fries', description: 'Perfectly golden and crispy French fries, great for sharing.', category: 'Snacks', image: 'images/Fries.png', price: '₱70/90' },
  { id: 16, title: 'Cheese Sticks', description: 'Deep-fried, gooey cheese sticks with a savory, crispy coating.', category: 'Snacks', image: 'images/CheeseSticks.png', price: '₱60/80' },
  { id: 17, title: 'Cheesy Corndogs', description: 'Classic corndogs with a blend of savory hotdog and gooey, melted cheese.', category: 'Quesadillas & Corndogs', image: '/images/CheesyCorndogs.png', price: '₱135' },
  { id: 18, title: 'Beef Quesadilla', description: 'Grilled tortilla filled with seasoned beef and cheese.', category: 'Quesadillas & Corndogs', image: 'images/BeefQuesadilla.png', price: '₱130' },
  { id: 19, title: 'Platter #3', description: 'The ultimate combo: Fries, 10 Cheese Sticks, 2 Hash Browns, and 3 Chicken Nuggets.', category: 'Platters', image: 'images/Platter3.png', price: '₱250' },
  { id: 21, title: 'Biscoff Croffle', description: 'Croffle slathered with rich Biscoff spread and crunchy cookie crumbs.', category: 'Croffles', image: '/images/BiscoffCroffle.png', price: '₱160' },
  { id: 22, title: 'Croffle with Whipped Cream & Syrup', description: 'Flaky croffle topped with fluffy whipped cream and sweet syrup.', category: 'Croffles', image: '/images/WhipppedCroffle.png', price: '₱120' },
];

// Category options
const categoryOptions: Record<Category, { flavors?: string[]; addOns?: string[]; extras?: string[] }> = {
  'Lemonade & Fruit Juice': { addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Strawberry Popping Bobba'] },
  'Milk Tea': { addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Crushed Oreo', 'Cream Cheese', 'Cheesecake', 'Extra Matcha Shot'] },
  'Coffee': { addOns: ['Extra Matcha Shot', 'Extra Coffee Shot'] },
  'Specialty Coffee': { flavors: ['Hot', 'Cold'] , addOns: ['Oat Milk', 'Extra Espresso Shot'] },
  'Premium Matcha': { flavors: ['Hot', 'Cold'] },
  'Croffles': {},
  'Snacks': { flavors: ['Cheese', 'Sour & Cream', 'BBQ', 'Butter Cheese', 'Honey Butter'], extras: ['10 pcs', '15 pcs'] },
  'Quesadillas & Corndogs': { addOns: ['Extra Garlic Sauce'] },
  'Platters': {},
};

// Drinks helper
const isDrinkCategory = (cat: Category | null) =>
  ['Lemonade & Fruit Juice', 'Milk Tea', 'Coffee', 'Specialty Coffee', 'Premium Matcha'].includes(cat || '');

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [activeCategory, setActiveCategory] = useState<Category>('Lemonade & Fruit Juice');

  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('16oz');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedAddOn, setSelectedAddOn] = useState<string>('');
  const [selectedExtra, setSelectedExtra] = useState<string>('');

  const handleIncrease = () => setQuantity(q => q + 1);
  const handleDecrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const openModal = (item: Product, cat: Category) => {
    setSelectedItem(item);
    setSelectedCategory(cat);
    setQuantity(1);
    setSelectedSize('16oz');
    setSelectedFlavor('');
    setSelectedAddOn('');
    setSelectedExtra('');
  };

  const getOptionsFor = (cat: Category) => categoryOptions[cat] || {};

  return (
    <section ref={ref} className="bg-[#B4D9DD] py-16 px-6">
      {/* Header */}
      <motion.div variants={headerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-6">
        <img src="/images/MiAmore2.png" alt="Mi Amore Logo" className="mx-auto w-30 md:w-30 mb-1" />
        <h2 className="text-2xl text-[#9D7353] italic font-semibold">Our Most-Loved Sips & Bites</h2>
        <div className="w-20 h-1 bg-[#65B741] mx-auto mt-2 mb-4 rounded-full"></div>
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {categories.map((cat: Category) => (
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
          {productData
            .filter(p => p.category === activeCategory)
            .map((item: Product) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                layout
                onClick={() => openModal(item, item.category as Category)}
                className="bg-white rounded-md shadow-md overflow-hidden flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="bg-[#E1E1E1] p-4 flex justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-55 object-contain rounded-md" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[17px] text-[#202020] mb-1">{item.title}</h3>
                  <div className="flex mb-2">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} className="text-yellow-400 text-xs mr-1" />)}</div>
                  <p className="text-sm text-gray-900 italic mb-3 leading-snug text-justify">{item.description}</p>
                  <p className="text-[#55A630] font-bold text-lg">{item.price}</p>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-full max-w-4xl rounded p-10 relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-[350px] h-[350px] object-contain border-[12px] border-[#E1E1E1] rounded bg-[#E1E1E1]"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
                <div className="text-[#65B741] font-bold text-lg mb-2">{selectedItem.price}</div>
                <p className="text-sm text-gray-700 mb-4">{selectedItem.description}</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-base block font-semibold">Quantity</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <button onClick={handleDecrease} className="px-2 border rounded hover:bg-[#8CB662] hover:text-white transition">-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease} className="px-2 border rounded hover:bg-[#8CB662] hover:text-white transition">+</button>
                  </div>
                </div>

                {/* Size for drinks */}
                {isDrinkCategory(selectedCategory) && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold mb-1">Size options</label>
                    <div className="h-[2px] w-full bg-[#8CB662] my-1" />
                    <div className="flex space-x-2 mt-4">
                      {['16oz', '22oz'].map(size => (
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

                {/* Category-specific options */}
                {selectedCategory && (() => {
                  const opts = getOptionsFor(selectedCategory);
                  return (
                    <>
                      {opts.flavors && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1">Options</label>
                          <select value={selectedFlavor} onChange={e => setSelectedFlavor(e.target.value)} className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm">
                            <option value="">Select a options</option>
                            {opts.flavors.map((f: string) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      )}

                      {opts.addOns && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold block mb-1">Add-ons</label>
                          <select value={selectedAddOn} onChange={e => setSelectedAddOn(e.target.value)} className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm">
                            <option value="">Select an add-on</option>
                            {opts.addOns.map((a: string) => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </div>
                      )}

                      {opts.extras && (
                        <div className="mb-8">
                          <label className="text-sm font-semibold block mb-1">Extras</label>
                          <select value={selectedExtra} onChange={e => setSelectedExtra(e.target.value)} className="w-full border border-[#8CB662] rounded px-2 py-1 text-sm">
                            <option value="">Select an extra</option>
                            {opts.extras.map((x: string) => <option key={x} value={x}>{x}</option>)}
                          </select>
                        </div>
                      )}
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




