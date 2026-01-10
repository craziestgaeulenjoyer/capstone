import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Music2, 
  Quote
} from 'lucide-react';

const WelcomeSection: React.FC = () => {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Poppins:wght@300;400&display=swap" rel="stylesheet" />

      <section className="relative py-28 px-6 sm:px-12 lg:px-32 bg-[#FAF9F6] overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />

        <div className="max-w-4xl mx-auto relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-[1px] w-8 bg-[#88B04B]/40" />
            <span className="text-[#88B04B] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
              Established 2019
            </span>
            <div className="h-[1px] w-8 bg-[#88B04B]/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-[38px] md:text-[54px] lg:text-[64px] text-[#2b1c10] leading-[1.1] mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Heart of <br />
              <span className="italic text-[#5C2E0A]">Mi Amore Cafe</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-[#88B04B]/30 flex justify-center"
          >
            <Quote size={40} fill="currentColor" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-6"
          >
            <p 
              className="text-[#4a4a4a] text-[16px] md:text-[19px] leading-[1.8] font-light italic"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Mi Amore Cafe was born from a simple dream: to create a space where premium flavors 
              meet genuine human connection. Every blend tells a story of passion, and every cup 
              is a testament to our craftsmanship.
            </p>
            <p 
              className="text-[#5a5a5a] text-[14px] md:text-[15px] max-w-2xl mx-auto leading-relaxed opacity-80"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              From our signature hand-poured coffee to our refreshing artisanal teas, we ensure 
              that every visit feels like coming home. We believe that the best moments are 
              shared over a perfect brew.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-12 border-t border-[#5C2E0A]/5 flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#5C2E0A]/40 font-bold mb-8">
              Stay Connected
            </span>
            <div className="flex gap-6">
              {[ 
                { icon: <Facebook size={18} strokeWidth={2} />, link: "facebook" },
                { icon: <Instagram size={18} strokeWidth={2} />, link: "instagram" },
                { icon: <Music2 size={18} strokeWidth={2} />, link: "tiktok" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={`https://${social.link}.com/miamorecafe`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, backgroundColor: "#5C2E0A", color: "#ffffff" }}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-[#5C2E0A]/10 text-[#5C2E0A] transition-all duration-300 shadow-sm bg-white"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}

export default WelcomeSection;