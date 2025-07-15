
import React from 'react';
import { motion } from 'framer-motion';



interface FaqItem {
    question: string;
    answer: string;
}


interface InfoFaqsProps {
    faqData2: FaqItem[]; 
    openFaqs2: boolean[]; 
    toggleFaq2: (index: number) => void;
}


function InfoFaqs({ faqData2, openFaqs2, toggleFaq2 }: InfoFaqsProps) {
    const faqAnswerVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.8, staggerChildren: 0.1 },
                },
            }}
            className="space-y-4"
        >
            {faqData2.map((faq, index) => (
                <motion.div
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="bg-white p-4 rounded-lg shadow-md"
                >
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleFaq2(index)}
                    >
                        <p className="text-gray-700 font-medium">
                            {index + 1}. {faq.question}
                        </p>
                        <button
                            className={`focus:outline-none h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                index % 2 === 0 ? "bg-[#44B2E4]" : "bg-[#8CB874]"
                            }`}
                        >
                            {openFaqs2[index] ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    <motion.div
                        initial="hidden"
                        animate={openFaqs2[index] ? "visible" : "hidden"}
                        variants={faqAnswerVariants}
                        className="overflow-hidden"
                    >
                        <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default InfoFaqs;