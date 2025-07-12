
import React from 'react';
import { motion } from 'framer-motion';

function HeroSection() {
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="relative h-64 md:h-96 flex items-center justify-center overflow-hidden">
            <img
                src="/images/img13.jpg"
                alt="Mi Amore Cafe banner"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent rounded-b-lg z-10"></div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={staggerContainerVariants}
                className="relative z-20 text-white text-center"
            >
                <motion.div variants={fadeInVariants} className="bg-[#8bc662] rounded-full p-1 inline-flex items-center justify-center mb-4 shadow-lg">
                    <img
                        src="/images/Miamore3.png"
                        alt="Stylized m star logo"
                        className="w-40 h-40 object-contain"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

export default HeroSection;