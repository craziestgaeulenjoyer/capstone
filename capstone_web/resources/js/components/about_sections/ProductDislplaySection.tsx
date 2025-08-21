import React from 'react';
import { motion } from 'framer-motion';

function ProductDisplaySection() {
    return (
        <section className="py-12">
            <motion.div
                className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.3,
                        },
                    },
                }}
            >
                <motion.div
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                        hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
                    }}
                    whileHover="hover"
                    className="bg-[#E0A478] p-6 shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
                >
                    <div className="absolute -top-12">
                        <img
                            src="/images/img8.png"
                            alt="Hearty Platters"
                            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 mt-4">
                        Hearty Platters
                    </h3>
                    <p className="text-white mb-4">
                        Perfect for sharing, our platters are loaded with a variety of delicious
                        bites, from savory snacks to crispy favorites. Whether you're dining
                        solo or with friends, every bite is a treat to enjoy.
                    </p>
                    <button
                        className="text-white px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer"
                    >
                        See more
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                        hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
                    }}
                    whileHover="hover"
                    className="bg-[#8CB662] p-6  shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
                >
                    <div className="absolute -top-12">
                        <img
                            src="/images/img5.jpg"
                            alt="Irresistible Croffles"
                            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 mt-4">
                        Irresistible Croffles
                    </h3>
                    <p className="text-white mb-4">
                        A delightful fusion of croissant flakiness and waffle crispiness, our
                        croffles are golden, buttery, and simply irresistible. Enjoy them plain
                        or with your favorite toppings!
                    </p>
                    <button className="text-white px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer">
                        See more
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                        hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
                    }}
                    whileHover="hover"
                    className="bg-[#8CC0BE] p-6 shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
                >
                    <div className="absolute -top-12">
                        <img
                            src="/images/img9.jpg"
                            alt="Crispy Fries & Freshly Baked Breads"
                            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 mt-4">
                        Crispy Fries & Freshly Baked Breads
                    </h3>
                    <p className="text-white mb-4">
                        From golden, crispy fries to soft, warm bread, we serve the perfect
                        combination of crunch and comfort. Enjoy them as a snack, side, or
                        paired with your favorite drink!
                    </p>
                    <button className="text-white px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer">
                        See more
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default ProductDisplaySection;