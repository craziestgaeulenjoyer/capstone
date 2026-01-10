import React from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "@inertiajs/react";

const PrivacyPolicy: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] overflow-hidden py-12 md:py-24 px-4 sm:px-6">
      
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />

      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#8CB662]/10 rounded-full blur-3xl z-0" 
      />
      <motion.div 
        animate={{ y: [0, 50, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-72 h-72 bg-[#3d230d]/5 rounded-full blur-3xl z-0" 
      />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-10 left-6 md:left-12 z-50"
      >
        <Link
          href="/"
          className="group flex items-center gap-4 bg-white/90 backdrop-blur-md border border-[#3d230d]/10 p-2 pr-6 rounded-full shadow-2xl hover:bg-[#3d230d] transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full bg-[#8CB662] flex items-center justify-center text-white group-hover:rotate-[-12deg] transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3d230d] group-hover:text-white transition-colors">
            Back to Home
          </span>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto"
      >
        <div className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#3d230d]/10 overflow-hidden rounded-sm">
          
          <header className="relative flex flex-col items-center px-6 py-16 border-b border-[#3d230d]/5 bg-[#FAF9F6]">
            <motion.div variants={cardVariants} className="mb-6">
               <img src="/images/MiAmore2.png" alt="Logo" className="w-20 h-20 rounded-full border-2 border-[#8CB662]/20 p-1 bg-white shadow-sm" />
            </motion.div>
            
            <motion.div variants={cardVariants} className="text-center">
              <h1 className="text-[#3d230d] text-4xl md:text-6xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Privacy Policy
              </h1>
              <div className="flex items-center justify-center gap-4 text-[#3d230d]/40 text-[10px] uppercase tracking-[0.4em] font-bold">
                <div className="h-[1px] w-8 bg-[#8CB662]" />
                Last Updated: Nov 2025
                <div className="h-[1px] w-8 bg-[#8CB662]" />
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="mt-10">
              <Link
                href="/termsandcondition"
                className="group relative inline-flex items-center gap-3 text-[#3d230d] text-xs font-bold uppercase tracking-widest hover:text-[#8CB662] transition-colors"
              >
                View Terms & Conditions
                <span className="w-8 h-[1px] bg-[#3d230d] group-hover:bg-[#8CB662] group-hover:w-12 transition-all" />
              </Link>
            </motion.div>
          </header>

          <div className="px-8 md:px-20 py-16 space-y-16">
            
            <motion.div variants={cardVariants}>
              <p className="text-[#3d230d]/70 text-lg md:text-xl leading-relaxed italic font-light font-serif text-center md:text-left">
                "At Mi Amore Café, we value the trust you place in us. This policy reflects our commitment to protecting your personal journey with us."
              </p>
            </motion.div>

            {[
              {
                title: "Information We Collect",
                icon: "01",
                content: [
                  { subtitle: "Personal Details", items: ["Full name and contact information", "Reservation and order history", "Secure payment data"] },
                  { subtitle: "Digital Footprint", items: ["Device and browser metadata", "Interaction patterns on our site"] },
                ],
              },
              {
                title: "How We Use Data",
                icon: "02",
                content: [{ subtitle: "", items: ["Fulfilling your coffee and event bookings", "Personalizing your café experience", "Maintaining security and preventing fraud"] }],
              },
              {
                title: "Your Protection",
                icon: "03",
                content: [{ subtitle: "", items: ["End-to-end data encryption", "Strict access controls for our team", "Compliant third-party processing"] }],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group border-l-[1px] border-[#3d230d]/10 pl-8 md:pl-12 relative"
              >
                <span className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-[#8CB662] rounded-full shadow-[0_0_10px_rgba(140,182,98,0.5)]" />
                <span className="text-[10px] text-[#8CB662] font-bold tracking-widest uppercase mb-2 block">{section.icon}</span>
                
                <h3 className="text-[#3d230d] text-2xl md:text-3xl font-normal mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {section.content.map((sub, i) => (
                    <div key={i} className="space-y-4">
                      {sub.subtitle && (
                        <h4 className="text-[#3d230d] text-[11px] uppercase tracking-widest font-extrabold opacity-40">
                          {sub.subtitle}
                        </h4>
                      )}
                      <ul className="space-y-4">
                        {sub.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-4 text-sm text-[#3d230d]/70 leading-relaxed group-hover:text-[#3d230d] transition-colors">
                            <span className="mt-2 w-1 h-1 bg-[#8CB662] rotate-45" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div 
              variants={cardVariants}
              className="pt-20 border-t border-[#3d230d]/5 flex flex-col items-center"
            >
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <motion.svg 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-full"
                  viewBox="0 0 100 100"
                >
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                  <text className="text-[8px] uppercase tracking-[0.2em] fill-[#3d230d]/30 font-bold">
                    <textPath xlinkHref="#circlePath">
                      • MI AMORE CAFE • SECURED & TRUSTED • PRIVACY 2024 •
                    </textPath>
                  </text>
                </motion.svg>
                <img src="/images/MiAmore2.png" className="w-12 h-12 rounded-full opacity-20 grayscale" alt="Seal" />
              </div>
              
              <p className="text-[#3d230d]/30 text-[9px] uppercase tracking-[0.5em] text-center">
                Crafting Privacy with Passion
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PrivacyPolicy;