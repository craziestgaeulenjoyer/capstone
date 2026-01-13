import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Utensils, MoveRight } from 'lucide-react';

// --- TYPES ---
type Product = { id: number; title: string; description: string; price: string; image: string; category: string; };

// --- DATA ---
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

const categories = Array.from(new Set(productData.map(item => item.category)));

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeTab, setActiveTab] = useState(categories[0]);
  
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (cat: string) => {
    setActiveTab(cat);
    const element = tabRefs.current[cat];
    const container = containerRef.current;
    
    if (element && container) {
      const containerWidth = container.offsetWidth;
      const elementOffset = element.offsetLeft;
      const elementWidth = element.offsetWidth;
      const scrollPosition = elementOffset - (containerWidth / 2) + (elementWidth / 2);
      
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="bg-[#FCFAF7] py-12 lg:py-24 px-4 relative overflow-hidden min-h-screen">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 opacity-[0.3] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }}></div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          className="text-center mb-10 lg:mb-16"
        >
          <div className="flex justify-center mb-4">
            <span className="h-[1px] w-8 lg:w-16 bg-[#8CB662]/30 self-center"></span>
            <img src="/images/MiAmore2.png" alt="Logo" className="w-12 lg:w-16 mx-4 sepia-[.5] hue-rotate-[60deg] saturate-[.8]" />
            <span className="h-[1px] w-8 lg:w-16 bg-[#8CB662]/30 self-center"></span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#2C1810] tracking-tight mb-4" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
            The <span className="italic font-light text-[#8CB662]">Artisan</span> Collection
          </h2>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="relative max-w-6xl mx-auto mb-10">
          <div className="flex lg:hidden justify-between items-center mb-3 px-4">
             <span className="text-[9px] font-black text-[#8CB662] uppercase tracking-[0.2em]">Select Category</span>
             <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-1.5 text-[#2C1810]/40"
              >
                <span className="text-[9px] font-bold uppercase tracking-widest">Swipe</span>
                <MoveRight size={12} />
              </motion.div>
          </div>

          <div 
            ref={containerRef}
            className="flex overflow-x-auto no-scrollbar gap-2 lg:gap-3 px-4 lg:px-2 py-4 scroll-smooth flex-nowrap lg:flex-wrap lg:justify-center w-full touch-pan-x"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                ref={(el) => { tabRefs.current[cat] = el; }}
                onClick={() => handleTabClick(cat)}
                className={`whitespace-nowrap px-7 py-3 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 border
                ${activeTab === cat 
                  ? 'bg-[#8CB662] text-white border-[#8CB662] shadow-xl shadow-[#8CB662]/30 scale-105' 
                  : 'bg-white/70 text-[#2C1810]/60 border-[#2C1810]/5 hover:border-[#8CB662]/30 hover:bg-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / Swipe Section */}
        <div className="px-2 lg:px-4">
          <motion.div 
            layout 
            className="
              /* Mobile & Tablet: Swipe Layout */
              flex overflow-x-auto pb-10 gap-5 snap-x snap-mandatory no-scrollbar
              /* Laptop & Desktop: 4 Columns Grid */
              lg:grid lg:grid-cols-4 lg:gap-6 xl:gap-8 lg:overflow-visible lg:pb-0
            "
          >
            <AnimatePresence mode="popLayout">
              {productData.filter(p => p.category === activeTab).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="
                    /* Swipe Settings */
                    min-w-[85vw] sm:min-w-[45vw] md:min-w-[40vw] snap-center 
                    /* Grid Settings for Laptop */
                    lg:min-w-full group
                  "
                >
                  <div className="bg-white p-5 lg:p-6 rounded-[2.5rem] shadow-[0_15px_40px_-20px_rgba(0,0,0,0.08)] border border-[#3d1f07]/5 hover:border-[#8CB662]/20 transition-all duration-500 h-full flex flex-col">
                    
                    {/* Image */}
                    <div className="relative aspect-square mb-6 overflow-hidden rounded-[2rem] bg-[#F8F9F5]">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-[#8CB662]/10">
                        <Sparkles size={10} className="text-[#8CB662]" />
                        <span className="text-[8px] font-black uppercase text-[#2C1810]">Best Seller</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-grow px-2">
                      <h3 className="text-xl lg:text-xl xl:text-2xl font-serif text-[#2C1810] mb-2 font-bold leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[#2C1810]/50 text-xs lg:text-[13px] leading-relaxed mb-6 font-medium italic line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="mt-auto pt-5 border-t border-[#F0F2ED] flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase font-bold text-[#8CB662] mb-1">Price</span>
                          <span className="text-xl lg:text-xl xl:text-2xl font-serif font-black text-[#2C1810]">{item.price}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#FCFAF7] border border-[#8CB662]/20 flex items-center justify-center text-[#8CB662] group-hover:bg-[#8CB662] group-hover:text-white transition-all duration-500 shadow-sm">
                          <Utensils size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300..900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
      `}</style>
    </section>
  );
};

export default BestSellerSection;