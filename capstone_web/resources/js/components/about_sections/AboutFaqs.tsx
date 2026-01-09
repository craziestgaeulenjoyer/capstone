import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BsArrowUpRight, BsX } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
    { 
        question: "How do I use the self-service ordering?", 
        answer: "Our in-store ordering systems are designed for speed! Simply browse our visual menu, customize your order, and pay via QR or card. It's the fastest way to get your Mi Amore fix during peak hours." 
    },
    { 
        question: "Can I book Mi Amore for private Events?", 
        answer: "Yes! We host everything from intimate birthdays to corporate coffee pop-ups. Our team provides dedicated baristas and a curated menu to make your event truly heartfelt and memorable." 
    },
    { 
        question: "What are the perks of the Mobile App?", 
        answer: "The Mi Amore app allows you to order ahead, skip the line, and earn 'Amore Points' for every purchase. You'll also get exclusive access to seasonal blends and artisan discounts not available in-store." 
    },
    { 
        question: "How do I redeem my loyalty rewards?", 
        answer: "Rewards are automatically tracked in your account. Whether you order via App or Website, your points sync instantly. Just select 'Redeem' at checkout to enjoy your free treats!" 
    },
    { 
        question: "Is delivery available for large orders?", 
        answer: "Absolutely. For bulk orders or office catering, you can schedule a delivery through our app. We ensure your hearty platters and brews arrive fresh and perfectly packed." 
    },
];

const AboutFaqs: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="relative py-24 px-6 bg-[#8CC0BE] overflow-hidden">
            <div 
                className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                <motion.div 
                    className="order-2 lg:order-1 space-y-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    {faqData.map((faq, index) => (
                        <motion.div key={index} variants={itemVariants} className="relative group">
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className={`w-full text-left p-5 md:p-6 rounded-2xl transition-all duration-300 flex justify-between items-center z-10 relative
                                    ${activeIndex === index 
                                        ? "bg-[#FAF9F6] text-[#5C2E0A] shadow-xl" 
                                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}`}
                            >
                                <span className="font-bold text-sm md:text-base tracking-tight leading-tight pr-4">
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 
                                    ${activeIndex === index ? "bg-[#8CB662] text-white rotate-180" : "bg-white/20 text-white"}`}>
                                    {activeIndex === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
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
                </motion.div>

                <motion.div 
                    className="order-1 lg:order-2 text-white relative z-10"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-[10px] tracking-[0.3em] uppercase font-bold mb-6">
                        Customer Support
                    </div>
                    
                    <h2 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Got Questions? <br />
                        <span className="italic text-[#FAF9F6]/70 text-3xl md:text-4xl lg:text-5xl">We've got answers.</span>
                    </h2>

                    <p 
                        className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        From convenient ordering systems to the Mi Amore Mobile App, we’ve modernized the artisan experience to make every visit smooth, heartfelt, and sweet.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="group px-8 py-4 bg-[#5C2E0A] text-white font-bold rounded-full flex items-center gap-3 hover:bg-[#3d1f07] transition-all shadow-lg hover:shadow-2xl">
                            Contact Us 
                            <BsArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-4 border border-white/40 text-white font-bold rounded-full hover:bg-white hover:text-[#8CC0BE] transition-all"
                        >
                            View All Topics
                        </button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#5C2E0A]/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-[2rem] overflow-hidden shadow-2xl p-8 md:p-12"
                        >
                            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply"
                                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
                            
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-[#5C2E0A] hover:rotate-90 transition-transform duration-300"
                            >
                                <BsX size={32} />
                            </button>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-[#5C2E0A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Explore All Topics
                                </h3>
                                <div className="w-16 h-[2px] bg-[#8CB662] mb-8" />
                                
                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                    <div className="group">
                                        <h4 className="font-bold text-[#5C2E0A] uppercase tracking-widest text-xs mb-2">Our Artisan Standards</h4>
                                        <p className="text-sm text-[#5C2E0A]/70 leading-relaxed">Learn about how we source our coffee beans and ensure freshness in every cup we serve.</p>
                                    </div>
                                    <div className="group">
                                        <h4 className="font-bold text-[#5C2E0A] uppercase tracking-widest text-xs mb-2">Health & Safety</h4>
                                        <p className="text-sm text-[#5C2E0A]/70 leading-relaxed">Our commitment to cleanliness and your well-being within our cafe premises.</p>
                                    </div>
                                    <div className="group">
                                        <h4 className="font-bold text-[#5C2E0A] uppercase tracking-widest text-xs mb-2">Sustainability</h4>
                                        <p className="text-sm text-[#5C2E0A]/70 leading-relaxed">How Mi Amore gives back through eco-friendly packaging and waste reduction.</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-10 w-full py-4 bg-[#8CB662] text-white font-bold rounded-xl hover:bg-[#7aa352] transition-colors"
                                >
                                    Close Explorer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none rotate-12">
                <svg width="400" height="400" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5 13C17.12 13 16 14.12 16 15.5C16 16.88 17.12 18 18.5 18C19.88 18 21 16.88 21 15.5C21 14.12 19.88 13 18.5 13ZM18.5 17C17.67 17 17 16.33 17 15.5C17 14.67 17.67 14 18.5 14C19.33 14 20 14.67 20 15.5C20 16.33 19.33 17 18.5 17ZM15 6C15 3.79 13.21 2 11 2C8.79 2 7 3.79 7 6V11C7 13.21 8.79 15 11 15C13.21 15 15 13.21 15 11V6ZM13 11C13 12.1 12.1 13 11 13C9.9 13 9 12.1 9 11V6C9 4.9 9.9 4 11 4C12.1 4 13 4.9 13 6V11ZM3 13C1.62 13 0.5 14.12 0.5 15.5C0.5 16.88 1.62 18 3 18C4.38 18 5.5 16.88 5.5 15.5C5.5 14.12 4.38 13 3 13ZM3 17C2.17 17 1.5 16.33 1.5 15.5C1.5 14.67 2.17 14 3 14C3.83 14 4.5 14.67 4.5 15.5C4.5 16.33 3.83 17 3 17Z"/>
                </svg>
            </div>
        </section>
    );
};

export default AboutFaqs;