
import React from 'react';
import { motion } from 'framer-motion';

function WelcomeSection() {
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        
        <section className="py-12 px-4 md:px-8 lg:px-16 text-center bg-white">
            <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeInVariants}
                className="text-3xl md:text-4xl font-bold text-[#8bc662] mb-4 flex items-center justify-center"
            >
                Welcome
                <img
                    src="/images/leaf-icon.png"
                    alt="Leaf icon"
                    className="top-0 right-100 h-30 w-auto z-0 opacity-80"
                />
            </motion.h2>
            <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeInVariants}
                className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed italic mb-8"
            >
                Established in 2019, Mi Amore Cafe was built on a passion for great flavors and warm
                connections. From our expertly brewed coffee and soothing teas to our freshly squeezed
                lemonade, every sip and bite is made with love. Whether you're here for a quick refreshment
                or a cozy gathering, Mi Amore is your go-to spot for quality drinks, delicious treats, and a
                welcoming ambiance.
            </motion.p>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeInVariants}
                className="flex justify-center items-center space-x-4 mt-6"
            >
                <a href="https://facebook.com/miamorecafe" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://placehold.co/40x40/8bc662/ffffff?text=f"
                        alt="Facebook"
                        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
                    />
                </a>
                <a href="https://instagram.com/miamorecafe" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://placehold.co/40x40/8bc662/ffffff?text=i"
                        alt="Instagram"
                        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
                    />
                </a>
                <a href="https://tiktok.com/@miamorecafe" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://placehold.co/40x40/8bc662/ffffff?text=t"
                        alt="TikTok"
                        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
                    />
                </a>
            </motion.div>
        </section>
    );
}

export default WelcomeSection;