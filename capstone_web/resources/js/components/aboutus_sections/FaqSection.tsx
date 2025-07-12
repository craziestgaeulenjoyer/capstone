

import React from 'react';
import { motion } from 'framer-motion';
import GeneralFaqs from './Generalfaqs';
import InfoFaqs from './InfoFaqs';

interface FaqItem {
    question: string;
    answer: string;
}


interface FaqSectionProps {
    faqData1: FaqItem[]; 
    openFaqs1: boolean[]; 
    toggleFaq1: (index: number) => void; 
    faqData2: FaqItem[]; 
    openFaqs2: boolean[]; 
    toggleFaq2: (index: number) => void; 
}


function FaqSection({ faqData1, openFaqs1, toggleFaq1, faqData2, openFaqs2, toggleFaq2 }: FaqSectionProps) {
    return (
        <>
            <section className="bg-[#8CB874] pt-12 pb-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
                <img
                    src="/images/leaf-icon.png"
                    alt="Mint Leaf"
                    className="absolute top-0 right-100 h-40 w-auto z-0 opacity-80"
                />
                <div className="pt-10 relative z-10 max-w-6xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                        }}
                        className="text-3xl md:text-4xl font-bold text-white text-center mb-20 flex items-center justify-center gap-4"
                    >
                        Any questions <span className="text-[#365314]">We got you.</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={{
                                hidden: { opacity: 0, x: -50 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
                            }}
                            className="flex flex-col pr-8"
                        >
                            <p className="text-sm font-semibold text-[#365314] mb-2 uppercase">
                                About
                            </p>
                            <h3 className="text-3xl font-bold text-white mb-4">
                                General Questions
                            </h3>
                            <p className="text-white text-lg mb-8 leading-relaxed">
                                Get to know more about Mi Amore Café what we offer, where we are, and
                                what makes us special. Here are the basics you might be curious about
                                before your visit or order.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-[#8CB874] text-lg font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg flex items-center justify-center self-start"
                            >
                                Contact Us
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5 ml-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                    />
                                </svg>
                            </motion.button>
                        </motion.div>
                        <GeneralFaqs faqData1={faqData1} openFaqs1={openFaqs1} toggleFaq1={toggleFaq1} />
                    </div>
                </div>
            </section>

            <section className="bg-[#A7D7E0] py-12 px-4 md:px-8 lg:px-16 ">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
                    <InfoFaqs faqData2={faqData2} openFaqs2={openFaqs2} toggleFaq2={toggleFaq2} />
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, x: 50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
                        }}
                        className="flex flex-col justify-center pl-8"
                    >
                        <p className="text-sm font-semibold text-[#0C5460] mb-2 uppercase">
                            Information
                        </p>
                        <h3 className="text-3xl font-bold text-[#0C5460] mb-4">
                            Frequently Asked Questions (FAQs)
                        </h3>
                        <p className="text-[#0C5460] text-lg mb-8 leading-relaxed">
                            Here are answers to the most common questions we receive about ordering,
                            delivery, rewards, and more. We want your experience with Mi Amore Cafe
                            to be smooth and sweet.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#44B2E4] text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-[#3d9cd0] transition duration-300 shadow-lg flex items-center justify-center self-start"
                        >
                            Contact Us
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 ml-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                />
                            </svg>
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

export default FaqSection;