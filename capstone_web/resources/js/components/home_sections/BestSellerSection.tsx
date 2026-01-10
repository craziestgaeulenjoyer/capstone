import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar, FaPlus, FaMinus, FaShoppingBag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { X, ChevronDown } from 'lucide-react';

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

type Category =
  | 'Lemonade & Fruit Juice' | 'Milk Tea' | 'Snacks' | 'Coffee'
  | 'Platters' | 'Specialty Coffee' | 'Premium Matcha'
  | 'Quesadillas & Corndogs' | 'Croffles';

const categories: Category[] = [
  'Lemonade & Fruit Juice', 'Milk Tea', 'Snacks', 'Coffee', 
  'Platters', 'Specialty Coffee', 'Premium Matcha', 'Quesadillas & Corndogs', 'Croffles',
];

const categoryOptions: Record<string, { flavors?: string[]; addOns?: string[]; extras?: string[] }> = {
  'Lemonade & Fruit Juice': { addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Strawberry Popping Bobba'] },
  'Milk Tea': { addOns: ['Pearls', 'Nata', 'Coffee Jelly', 'Crushed Oreo', 'Cream Cheese', 'Cheesecake', 'Strawberry Popping Bobba'] },
  'Coffee': { addOns: ['Extra Espresso Shot'] },
  'Specialty Coffee': { flavors: ['Hot', 'Iced'], addOns: ['Oat Milk', 'Extra Espresso Shot'] },
  'Premium Matcha': { addOns: ['Oat Milk'] },
  'Snacks': { flavors: ['Cheese', 'Sour & Cream', 'BBQ', 'Butter Cheese', 'Honey Butter'] },
  'Quesadillas & Corndogs': { addOns: ['Extra Garlic Sauce'] },
  'Croffles': {},
  'Platters': {},
};

const productData: Product[] = [
  { id: 1, title: 'Classic Lemonade', description: 'Timeless balance of tart lemon and sweetness.', category: 'Lemonade & Fruit Juice', image: '/images/ClassicLemonade.png', price: '₱60/70' },
  { id: 2, title: 'Strawberry Lemonade', description: 'Zesty lemonade infused with sweet, ripe strawberry juice.', category: 'Lemonade & Fruit Juice', image: '/images/StrawberryLemonade.png', price: '₱70/80' },
  { id: 3, title: 'Watermelon Popping Bobba', description: 'Refreshing watermelon juice with fun strawberry popping bobba.', category: 'Lemonade & Fruit Juice', image: '/images/PoppingBobba.png', price: '₱100' },
  { id: 4, title: 'Peach Iced Tea', description: 'Premium brewed tea infused with sweet peach essence.', category: 'Lemonade & Fruit Juice', image: '/images/PeachIcedTea.png', price: '₱100' },
  { id: 5, title: 'Okinawa', description: 'Roasted brown sugar flavor with our signature milk tea.', category: 'Milk Tea', image: '/images/Okinawa.png', price: '₱90/100' },
  { id: 6, title: 'Wintermelon', description: 'The crowd favorite sweet and refreshing wintermelon taste.', category: 'Milk Tea', image: '/images/Wintermelon.png', price: '₱90/100' },
  { id: 7, title: 'Oreo Milk Tea', description: 'Classic milk tea topped with crunchy Oreo bits.', category: 'Milk Tea', image: '/images/Oreo.png', price: '₱90/100' },
  { id: 8, title: 'Oreo Cheesecake Overload', description: 'Creamy cheesecake walling with heavy Oreo crumbs.', category: 'Milk Tea', image: '/images/OreoCheesecakeOverload.png', price: '₱140' },
  { id: 9, title: 'Sea Salt Honey', description: 'A perfect balance of sweet honey and savory sea salt foam.', category: 'Specialty Coffee', image: '/images/SeaSaltHoney.png', price: '₱170' },
  { id: 10, title: 'White Chocolate Mocha', description: 'Rich white chocolate melted into smooth espresso.', category: 'Specialty Coffee', image: '/images/WhiteChocolateMocha.png', price: '₱180' },
  { id: 11, title: 'Dulce De Leche', description: 'Caramelized milk sweetness with bold espresso.', category: 'Specialty Coffee', image: '/images/DulceDeLeche.png', price: '₱180' },
  { id: 12, title: 'Pure Matcha Oat Latte', description: 'Premium grade matcha whisked with creamy oat milk.', category: 'Premium Matcha', image: '/images/PureMatchaOatLatte.png', price: '₱120' },
  { id: 13, title: 'Specialty Matcha', description: 'Ask our barista for our current matcha special.', category: 'Premium Matcha', image: '/images/SpecialtyMatcha.png', price: '₱250' },
  { id: 14, title: 'Iced Snow Coffee', description: 'Icy, frosty coffee blend with a creamy snow-like finish.', category: 'Coffee', image: '/images/IceSnowCoffee.png', price: '₱120' },
  { id: 15, title: 'Fries', description: 'Golden crispy fries available in various flavors.', category: 'Snacks', image: '/images/Fries.png', price: '₱70/90' },
  { id: 16, title: 'Cheese Sticks', description: '15 pieces of crispy, golden cheese-filled sticks.', category: 'Snacks', image: '/images/CheeseSticks.png', price: '₱80' },
  { id: 17, title: 'Beef Quesadillas', description: 'Cheesy tortilla filled with savory seasoned beef.', category: 'Quesadillas & Corndogs', image: '/images/BeefQuesadilla.png', price: '₱130' },
  { id: 18, title: 'Cheesy Corndog', description: 'Korean-style corndog with a gooey cheese center.', category: 'Quesadillas & Corndogs', image: '/images/CheesyCorndogs.png', price: '₱135' },
  { id: 19, title: 'Platter #1', description: 'Fries, 5pcs cheese sticks, 1pc hash brown.', category: 'Platters', image: '/images/Platter1.png', price: '₱120' },
  { id: 20, title: 'Platter #3', description: 'Fries, 10pcs cheese sticks, 2pc hash brown, 3pc nuggets.', category: 'Platters', image: '/images/Platter3.png', price: '₱210' },
  { id: 21, title: 'Whipped Cream Croffle', description: 'Croffle topped with airy whipped cream and syrup.', category: 'Croffles', image: '/images/WhipppedCroffle.png', price: '₱120' },
  { id: 22, title: 'Biscoff Croffle', description: 'Croffle drizzled with Biscoff spread and cookie crumbs.', category: 'Croffles', image: '/images/BiscoffCroffle.png', price: '₱120' },
];

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<Category>('Lemonade & Fruit Juice');
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('16oz');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedAddOn, setSelectedAddOn] = useState('');

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="bg-[#B4D9DD] py-16 md:py-32 px-4 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/p6.png')` }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12 md:mb-16">
          <img src="/images/MiAmore2.png" alt="Logo" className="mx-auto w-20 md:w-28 mb-4 drop-shadow-md" />
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C2E0A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            The <span className="italic text-white drop-shadow-sm">Masterpieces</span>
          </h2>
          
          <div className="relative mt-8">
            <button onClick={() => scrollCategories('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-md md:hidden text-[#5C2E0A]"><FaChevronLeft size={10} /></button>
            <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar md:flex-wrap justify-start md:justify-center gap-2 pb-4 px-10 md:px-0 scroll-smooth">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${cat === activeCategory ? 'bg-[#5C2E0A] text-white shadow-lg' : 'bg-white/80 text-[#5C2E0A] hover:bg-white'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={() => scrollCategories('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-md md:hidden text-[#5C2E0A]"><FaChevronRight size={10} /></button>
          </div>
        </motion.div>

        <div className="relative">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-10">
            <AnimatePresence mode="wait">
              {productData.filter(p => p.category === activeCategory).map((item) => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  onClick={() => {setSelectedItem(item); setQuantity(1); setSelectedFlavor(''); setSelectedAddOn('');}}
                  className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center group cursor-pointer bg-white/90 p-4 rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 border border-white/40"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-[1.5rem] bg-[#F1F0E8]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-[#8CB662] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">{item.price}</div>
                  </div>
                  <h3 className="text-lg font-bold text-[#5C2E0A] truncate px-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                  <div className="flex gap-1 px-2 mb-2">{[...Array(5)].map((_, i) => <FaStar key={i} className="text-[#D4AF37] text-[10px]" />)}</div>
                  <p className="text-[#5C2E0A]/60 text-[11px] italic px-2 line-clamp-2 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-1.5 md:hidden -mt-4">
             {productData.filter(p => p.category === activeCategory).map((_, i) => (
               <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#5C2E0A]/20" />
             ))}
          </div>
        </div>
      </div>

      {/* MODAL SECTION */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#203a3d]/70 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} 
              className="bg-[#FAF9F6] w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
              
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-20 p-2 bg-[#B4D9DD]/40 hover:bg-[#B4D9DD] rounded-full text-[#5C2E0A] transition-colors"><X size={20} /></button>

              <div className="w-full md:w-5/12 bg-[#F1F0E8] flex items-center justify-center p-12 relative">
                <div className="absolute -bottom-10 -left-10 text-[#5C2E0A]/5 font-black text-9xl select-none italic">Mi</div>
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-float" />
              </div>

              <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col overflow-y-auto no-scrollbar">
                <div className="mb-6">
                  <span className="text-[#8CB662] font-bold text-[10px] tracking-[0.3em] uppercase mb-2 block">{selectedItem.category}</span>
                  <h2 className="text-3xl font-bold text-[#5C2E0A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedItem.title}</h2>
                  <p className="text-[#5C2E0A]/50 text-xs italic leading-relaxed">{selectedItem.description}</p>
                </div>

                <div className="flex items-center justify-between border-y border-[#5C2E0A]/10 py-6 mb-8">
                  <div><p className="text-[10px] font-bold text-[#5C2E0A]/40 uppercase mb-1">Unit Price</p><p className="text-3xl font-black text-[#5C2E0A]">{selectedItem.price}</p></div>
                  <div className="flex items-center bg-[#B4D9DD]/20 rounded-xl p-1 border border-[#B4D9DD]/40">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-[#5C2E0A] shadow-sm"><FaMinus size={10}/></button>
                    <span className="w-10 text-center font-bold text-[#5C2E0A]">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-[#5C2E0A] shadow-sm"><FaPlus size={10}/></button>
                  </div>
                </div>

                <div className="space-y-5 flex-grow">
                  {['Lemonade & Fruit Juice', 'Milk Tea', 'Snacks'].includes(selectedItem.category) && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-[10px] font-bold text-[#5C2E0A]/40 uppercase tracking-widest mb-3">Choose Serving Size</p>
                      <div className="flex gap-3">
                        {(selectedItem.category === 'Snacks' ? ['Regular', 'Large'] : ['16oz', '22oz']).map(size => (
                          <button key={size} onClick={() => setSelectedSize(size)}
                            className={`flex-1 py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all ${selectedSize === size ? 'bg-[#5C2E0A] text-white shadow-lg' : 'bg-white text-[#5C2E0A] border border-[#5C2E0A]/10'}`}>{size}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(() => {
                    const opts = categoryOptions[selectedItem.category];
                    if (!opts) return null;
                    return (
                      <div className="grid grid-cols-1 gap-4">
                        {opts.flavors && (
                          <div className="relative">
                            <label className="text-[10px] font-bold text-[#5C2E0A]/40 uppercase tracking-widest mb-2 block">Flavors / Style</label>
                            <div className="relative">
                              <select value={selectedFlavor} onChange={e => setSelectedFlavor(e.target.value)} className="w-full bg-white border border-[#5C2E0A]/10 rounded-xl py-3 px-4 text-xs font-medium text-[#5C2E0A] appearance-none focus:outline-none focus:ring-2 focus:ring-[#8CB662]/30">
                                <option value="">Select option</option>
                                {opts.flavors.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-3.5 text-[#5C2E0A]/40 pointer-events-none" size={14} />
                            </div>
                          </div>
                        )}
                        {opts.addOns && (
                          <div className="relative">
                            <label className="text-[10px] font-bold text-[#5C2E0A]/40 uppercase tracking-widest mb-2 block">Premium Add-ons</label>
                            <div className="relative">
                              <select value={selectedAddOn} onChange={e => setSelectedAddOn(e.target.value)} className="w-full bg-white border border-[#5C2E0A]/10 rounded-xl py-3 px-4 text-xs font-medium text-[#5C2E0A] appearance-none focus:outline-none focus:ring-2 focus:ring-[#8CB662]/30">
                                <option value="">No add-ons</option>
                                {opts.addOns.map(a => <option key={a} value={a}>{a}</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-3.5 text-[#5C2E0A]/40 pointer-events-none" size={14} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="mt-10">
                  <button className="w-full bg-[#5C2E0A] text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#3d1f07] transition-all shadow-xl shadow-[#5C2E0A]/20 active:scale-95">
                    <FaShoppingBag size={14}/> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
      `}</style>
    </section>
  );
};

export default BestSellerSection;