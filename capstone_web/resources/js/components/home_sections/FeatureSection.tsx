import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GiCoffeeBeans, GiTruck, GiSwipeCard } from 'react-icons/gi';

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref} className="relative bg-[#CBE9F3] pt-10 pb-60 px-4 sm:px-6 lg:px-24 overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-left max-w-3xl ml-0 sm:ml-8 mb-36 z-10 relative"
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-snug">
          Discover. Delight. <span className="text-[#6FC14B]">Mi Amore</span>
        </h2>
        <p className="mt-4 text-gray-700 text-md sm:text-lg">
          Experience the perfect blend of coffee, cuisine, and unforgettable moments at Mi Amore Café.
        </p>
      </motion.div>

      <div className="bg-white h-56 w-full absolute bottom-0 left-0 z-0" />

      <motion.div
        className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 absolute left-1/2 transform -translate-x-1/2 -translate-y-[35%] z-20"
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {[{
          icon: <GiCoffeeBeans className="text-[#6FC14B] text-4xl" />, 
          text: "Crafted with care, our coffee and food are made to comfort. From bold brews to fresh bites, there's love in every sip and every plate."
        }, {
          icon: <GiTruck className="text-[#6FC14B] text-4xl" />, 
          text: "Bringing amore to your doorstep! Order your favorites and enjoy fast, reliable delivery perfect for cozy mornings or busy afternoons."
        }, {
          icon: <GiSwipeCard className="text-[#6FC14B] text-4xl" />, 
          text: "Sip, earn, repeat. Collect points with every visit and get rewarded for loving Mi Amore as much as we love serving you."
        }].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-[#D29368] w-[300px] md:w-[380px] text-center px-6 py-8 rounded-2xl shadow-2xl hover:-translate-y-3 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-md mb-6">
              {card.icon}
            </div>
            <p className="text-sm text-black">
              {card.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;



















