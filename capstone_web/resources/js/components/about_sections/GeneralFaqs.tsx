import React from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa";

interface GeneralFaqsProps {
    faqData1: { question: string; answer: string }[];
    openFaqs1: boolean[];
    toggleFaq1: (index: number) => void;
}

const GeneralFaqs: React.FC<GeneralFaqsProps> = ({ faqData1, openFaqs1, toggleFaq1 }) => {
    return (
        <section className="relative py-24 px-6 bg-[#8CB662] overflow-hidden">
            <div 
                className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                <motion.div 
                    className="text-white relative z-10"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-[10px] tracking-[0.3em] uppercase font-bold mb-6">
                        About Mi Amore
                    </div>
                    
                    <h2 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        General <span className="italic text-[#FAF9F6]/70">Questions.</span>
                    </h2>

                    <p 
                        className="text-lg text-white/90 mb-10 max-w-lg leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Get to know more about Mi Amore Café—what we offer, where we are, and what makes our artisan experience special.
                    </p>

                    <Link
                        href="/contact"
                        className="group inline-flex items-center px-8 py-4 bg-[#5C2E0A] text-white font-bold rounded-full gap-3 hover:bg-[#3d1f07] transition-all shadow-lg hover:shadow-2xl"
                    >
                        Contact Us 
                        <BsArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                    </Link>
                </motion.div>

                <div className="space-y-4 relative z-10">
                    {faqData1.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <button
                                onClick={() => toggleFaq1(index)}
                                className={`w-full text-left p-5 md:p-6 rounded-2xl transition-all duration-300 flex justify-between items-center
                                    ${openFaqs1[index] 
                                        ? "bg-[#FAF9F6] text-[#5C2E0A] shadow-xl" 
                                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}`}
                            >
                                <span className="font-bold text-sm md:text-base tracking-tight leading-tight pr-4">
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 
                                    ${openFaqs1[index] ? "bg-[#8CC0BE] text-white rotate-180" : "bg-white/20 text-white"}`}>
                                    {openFaqs1[index] ? <FaMinus size={12} /> : <FaPlus size={12} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openFaqs1[index] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 text-[#5C2E0A]/80 text-sm md:text-base leading-relaxed bg-[#FAF9F6]/90 rounded-b-2xl -mt-4 pt-8">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="absolute -top-24 -left-24 opacity-5 pointer-events-none">
                <svg width="500" height="500" viewBox="0 0 24 24" fill="white">
                    <path d="M17,8C15.35,8 14,9.35 14,11V13H15V11C15,9.9 15.9,9 17,9C18.1,9 19,9.9 19,11V13H20V11C20,9.35 18.65,8 17,8M3,2V22H21V2H3M19,20H5V4H19V20M11,6C8.79,6 7,7.79 7,10V14C7,16.21 8.79,18 11,18C13.21,18 15,16.21 15,14V10C15,7.79 13.21,6 11,6M13,14C13,15.1 12.1,16 11,16C9.9,16 9,15.1 9,14V10C9,8.9 9.9,8 11,8C12.1,8 13,8.9 13,10V14Z"/>
                </svg>
            </div>
        </section>
    );
};

export default GeneralFaqs;