import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar } from 'react-icons/fa';

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
      image: '/images/cucumber.jpg',
    },
    {
      title: 'Watermelon with Strawberry Popping Bobba',
      description:
        'Juicy watermelon meets a burst of strawberry bobba—sweet, fun, and flavor-packed in every sip!',
      price: '₱70',
      image: '/images/watermelon-bobba.jpg',
    },
    {
      title: 'Classic Lemonade',
      description:
        'Timelessly tangy and perfectly sweet—the all-time favorite that never goes out of style.',
      price: '₱55',
      image: '/images/classic-lemonade.jpg',
    },
    {
      title: 'Charcoal Lemonade',
      description:
        'Bold and detoxifying with a citrus twist—lemonade with a striking black finish and a clean, refreshing taste.',
      price: '₱50',
      image: '/images/charcoal.jpg',
    },
  ],
  'Milk Tea': [],
  'Snacks': [],
  'Coffee': [],
  'Platters': [],
};

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });
  const [activeCategory, setActiveCategory] = useState<Category>('Lemonade & Fruit Juice');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <section ref={ref} className="bg-[#B4D9DD] py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <img
          src="/images/MiAmore2.png"
          alt="Mi Amore Logo"
          className="mx-auto w-20 md:w-24 mb-1"
        />
        <h2 className="text-xl text-[#9D7353] italic font-semibold">
          Our Most-Loved Sips & Bites
        </h2>
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
              className="bg-white rounded-md shadow-md overflow-hidden flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
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
    </section>
  );
};

export default BestSellerSection;




