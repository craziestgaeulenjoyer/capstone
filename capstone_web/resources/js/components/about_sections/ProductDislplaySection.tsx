import React from 'react';
import { motion, Variants } from 'framer-motion'; 

const ProductDisplaySection: React.FC = () => {
    const products = [
        {
            id: 1,
            title: "Hearty Platters",
            desc: "Perfect for sharing, our platters are loaded with a variety of savory bites and crispy favorites crafted for the soul.",
            img: "/images/HeartyPlatter.png",
            bgColor: "bg-[#5C2E0A]",
            accentColor: "border-[#E0A478]",
            textColor: "text-[#FAF9F6]"
        },
        {
            id: 2,
            title: "Irresistible Croffles",
            desc: "A buttery fusion of croissant flakiness and waffle crispiness, golden-baked to perfection for an artisan treat.",
            img: "/images/IrresistibleCroffles.png",
            bgColor: "bg-[#8CB662]",
            accentColor: "border-[#B8D892]",
            textColor: "text-[#FAF9F6]"
        },
        {
            id: 3,
            title: "Crispy & Baked",
            desc: "From golden, seasoned fries to soft, warm breads, we serve the perfect combination of crunch and comfort.",
            img: "/images/CrispyFries.png",
            bgColor: "bg-[#8CC0BE]",
            accentColor: "border-[#AECFCF]",
            textColor: "text-[#2b1c10]"
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const cardVariants: Variants = {
        hidden: { y: 40, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                duration: 0.8, 
                ease: "easeOut" 
            }
        }
    };

    return (
        <section className="relative py-40 px-6 bg-[#FAF9F6] overflow-visible">
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />

            <motion.div
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        variants={cardVariants}
                        whileHover={{ y: -15 }}
                        className={`${product.bgColor} ${product.textColor} p-8 lg:p-10 rounded-[2rem] shadow-2xl flex flex-col items-center text-center relative group transition-all duration-500`}
                    >
                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                            <div 
                                className="absolute inset-0 opacity-[0.15] mix-blend-multiply"
                                style={{ 
                                    backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
                                }}
                            />
                            <div className="absolute inset-0 border-[10px] border-black/5 rounded-[2rem]" />
                        </div>

                        <div className="absolute -top-16 lg:-top-20 flex justify-center z-30">
                            <div className="relative">
                                <motion.img
                                    src={product.img}
                                    alt={product.title}
                                    className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-[6px] ${product.accentColor} shadow-2xl relative z-10`}
                                />
                                <div className="absolute inset-0 rounded-full border border-white/30 scale-125 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>

                        <div className="mt-20 lg:mt-24 relative z-10">
                            <h3 
                                className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {product.title}
                            </h3>
                            
                            <div className="w-12 h-[1px] bg-current opacity-30 mx-auto mb-6" />

                            <p 
                                className="text-sm lg:text-[15px] leading-relaxed opacity-90 font-light"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                {product.desc}
                            </p>
                        </div>

                        <div className="mt-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                             <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Mi Amore Artisan</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export default ProductDisplaySection;