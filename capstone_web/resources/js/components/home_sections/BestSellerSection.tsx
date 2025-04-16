import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const products = [
  {
    title: 'Milktea',
    description: 'Creamy and refreshing, our signature milktea is brewed to satisfy your sweet cravings with every sip.',
    price: '₱80/90',
    image: '/images/milktea.jpg',
  },
  {
    title: 'Platters',
    description: 'A delicious mix of crispy and savory bites—perfect for sharing or enjoying all to yourself.',
    price: '₱170',
    image: '/images/platters.jpg',
  },
  {
    title: 'Fruit Juices',
    description: 'Bursting with flavor, our fruit juices are made from fresh ingredients for a naturally sweet experience.',
    price: '₱45/55',
    image: '/images/fruit-juices.jpg',
  },
  {
    title: 'Croffles',
    description: 'Crispy waffle-croissant topped with sweet drizzles and a cookie crunch—pure dessert bliss.',
    price: '₱150',
    image: '/images/croffles.jpg',
  },
];

const BestSellerSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section ref={ref} className="bg-[#B4D9DD] py-14 px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <img src="/images/MiAmore2.png" alt="Mi Amore Logo" className="mx-auto w-14 mb-2" />
        <h2 className="text-xl font-extrabold text-[#76B13A] tracking-wide">
          OUR BEST SELLER
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {products.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-sm shadow-lg overflow-hidden flex flex-col justify-between"
          >
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-extrabold text-lg text-[#9D7353]">{item.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{item.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[#76B13A] font-semibold">{item.price}</span>
                <button className="bg-[#9D7353] text-white px-4 py-1 text-sm font-semibold hover:bg-[#dba37d] transition-all rounded-xl">
                  ORDER NOW
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestSellerSection;
