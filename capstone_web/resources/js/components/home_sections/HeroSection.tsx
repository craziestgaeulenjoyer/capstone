import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTiktok, FaArrowDown } from "react-icons/fa";

const HeroSection: React.FC = () => {
  const playClickSound = () => {
    const audio = new Audio("/images/mixkit-cool-interface-click-tone-2568.wav");
    audio.volume = 0.5;
    audio.play().catch(() => {}); 
  };

  const scrollToNextSection = () => {
    playClickSound();
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <section className="relative w-full min-h-[95vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 bg-[#FAF9F6] overflow-hidden pt-28 md:pt-0">
        
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="hidden lg:flex flex-col items-center absolute left-8 bottom-12 space-y-6 z-20"
        >
          <div className="h-20 w-[1px] bg-[#5C2E0A]/20" />
          <a href="https://www.instagram.com/miamore.cml" target="_blank" rel="noopener noreferrer" onMouseEnter={playClickSound} className="text-[#5C2E0A]/40 hover:text-[#8CB662] transition-all hover:-translate-y-1"><FaInstagram size={20} /></a>
          <a href="https://www.facebook.com/MiAmore.CML" target="_blank" rel="noopener noreferrer" onMouseEnter={playClickSound} className="text-[#5C2E0A]/40 hover:text-[#8CB662] transition-all hover:-translate-y-1"><FaFacebookF size={18} /></a>
          <a href="#" onMouseEnter={playClickSound} className="text-[#5C2E0A]/40 hover:text-[#8CB662] transition-all hover:-translate-y-1"><FaTiktok size={18} /></a>
          <span className="text-[#5C2E0A]/40 text-[10px] uppercase tracking-[0.4em] font-bold vertical-text rotate-180 mb-4">Follow Mi Amore</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 w-full md:w-1/2 flex flex-col items-start order-2 md:order-1 pb-16 md:pb-0"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-[1.5px] bg-[#8CB662]" />
            <span className="text-[#8CB662] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
              Est. 2019 • Mi Amore Cafe
            </span>
          </div>

          <h1 className="text-[#3d230d] leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="block text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[78px] font-normal text-[#5C2E0A]">
              Brewed with <span className="italic font-medium text-[#8CB662]">love</span>,
            </span>
            <span className="block text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[74px] font-normal">
              served with care.
            </span>
          </h1>

          <p className="text-[#5C2E0A]/70 mb-10 max-w-md text-[16px] lg:text-[18px] leading-relaxed font-normal italic" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Experience the finest handcrafted blends made for your soul in every cup we serve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/menu" onClick={playClickSound}>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#3d1f07" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-[#5C2E0A] text-[#FAF9F6] px-10 py-4 rounded-full text-[12px] font-bold shadow-2xl transition-all uppercase tracking-[0.2em]"
              >
                Order Now
              </motion.button>
            </Link>

            <Link href="/about-us" onClick={playClickSound}>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#5C2E0A", color: "#FAF9F6" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto border-2 border-[#5C2E0A]/30 text-[#5C2E0A] px-10 py-4 rounded-full text-[12px] font-bold transition-all uppercase tracking-[0.2em]"
              >
                About Us
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <div className="relative w-full md:w-1/2 flex justify-center items-center order-1 md:order-2 mb-12 md:mb-0">
          <div className="absolute w-64 h-64 md:w-[450px] md:h-[450px] bg-[#8CB662]/10 blur-[120px] rounded-full" />
          
          <motion.img
            src="/images/LAYOUT .png"
            alt="Mi Amore Signature"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-[85%] sm:w-[70%] md:w-[100%] max-w-[600px] object-contain drop-shadow-[0_45px_55px_rgba(0,0,0,0.12)]"
          />

          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -right-4 top-0 hidden xl:block z-20"
          >
            <div className="w-32 h-32 border-[0.5px] border-[#5C2E0A]/20 rounded-full flex items-center justify-center bg-[#FAF9F6]/60 backdrop-blur-md shadow-sm">
                <p className="text-[9px] font-bold text-[#5C2E0A] text-center uppercase tracking-[0.2em] leading-tight">
                    Premium<br/>Quality<br/>• 2019 •
                </p>
            </div>
          </motion.div>
        </div>

        <motion.button 
          onClick={scrollToNextSection}
          whileHover={{ y: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30 group outline-none"
        >
          <span className="text-[9px] uppercase tracking-[0.5em] text-[#5C2E0A] font-black group-hover:text-[#8CB662] transition-colors">
            Scroll
          </span>
          <div className="p-2 rounded-full border border-[#5C2E0A]/10 group-hover:border-[#8CB662]/30 transition-colors">
            <FaArrowDown size={10} className="text-[#5C2E0A] group-hover:text-[#8CB662]" />
          </div>
        </motion.button>

        <div className="flex lg:hidden justify-center gap-10 w-full absolute bottom-8 opacity-40">
           <a href="#" onClick={playClickSound}><FaInstagram size={20} /></a>
           <a href="#" onClick={playClickSound}><FaFacebookF size={20} /></a>
           <a href="#" onClick={playClickSound}><FaTiktok size={20} /></a>
        </div>

      </section>

      <style>{`
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
      `}</style>
    </>
  );
};

export default HeroSection;