
import React from 'react';
import { motion } from 'framer-motion';

function QuoteSection() {
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

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section
            className="py-12 px-4 md:px-8 lg:px-16 bg-[#F0F6F5] flex flex-col md:flex-row items-center justify-center gap-8"
        >
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeInVariants}
                className="md:w-1/3 flex justify-center relative overflow-hidden"
            >
                <img
                    src="/images/img2.jpg"
                    alt="Mi Amore Cafe product cup with green leaves"
                    className="rounded-tl-[3rem] rounded-br-[3rem] shadow-lg w-auto h-auto max-w-full max-h-64 object-cover"
                />
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={staggerContainerVariants}
                className="md:w-2/3 text-center md:text-left pl-8 md:pl-16 pr-4 md:pr-8 py-8"
            >
                <motion.p variants={itemVariants} className="text-7xl text-[#8bc662] mb-4">“</motion.p>
                <motion.p variants={itemVariants} className="text-xl md:text-2xl italic text-gray-800 leading-relaxed">
                    At Mi Amore Cafe, every brew tells a story one of passion, freshness, and heartfelt moments.
                </motion.p>
                <motion.p variants={itemVariants} className="text-7xl text-[#8bc662] mt-4 text-right">”</motion.p>
            </motion.div>
        </section>
    );
}

export default QuoteSection;