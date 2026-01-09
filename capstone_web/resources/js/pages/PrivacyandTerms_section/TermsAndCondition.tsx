import React from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "@inertiajs/react";

const TermsAndConditions: React.FC = () => {
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
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-[#8CB662]/10 rounded-full blur-3xl z-0" 
      />
      <motion.div 
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-0 w-80 h-80 bg-[#3d230d]/5 rounded-full blur-3xl z-0" 
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
        <div className="bg-white shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-[#3d230d]/5 overflow-hidden rounded-sm">
          
          <header className="relative flex flex-col items-center px-6 py-16 border-b border-[#3d230d]/5 bg-[#FAF9F6]">
            <motion.div variants={cardVariants} className="mb-6">
               <img src="/images/MiAmore2.png" alt="Logo" className="w-20 h-20 rounded-full border border-[#8CB662]/20 p-1 bg-white" />
            </motion.div>
            
            <motion.div variants={cardVariants} className="text-center">
              <h1 className="text-[#3d230d] text-4xl md:text-6xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Terms & Conditions
              </h1>
              <p className="text-[#3d230d]/40 text-[10px] uppercase tracking-[0.5em] font-bold">
                Effective November 2025
              </p>
            </motion.div>

            <motion.div variants={cardVariants} className="mt-10">
              <Link
                href="/privacypolicy"
                className="group relative inline-flex items-center gap-3 text-[#3d230d] text-[10px] font-bold uppercase tracking-[0.3em] hover:text-[#8CB662] transition-colors"
              >
                View Privacy Policy
                <span className="w-6 h-[1px] bg-[#3d230d] group-hover:bg-[#8CB662] group-hover:w-10 transition-all" />
              </Link>
            </motion.div>
          </header>

          <div className="px-8 md:px-20 py-16 space-y-20">
            
            <motion.p variants={cardVariants} className="text-[#3d230d]/60 text-center max-w-2xl mx-auto leading-relaxed italic font-serif text-lg">
              "By entering our café or using our digital services, you agree to walk this journey with us under these shared values and guidelines."
            </motion.p>

            {[
              { 
                title: "Use of Services", 
                items: ["Provide accurate information when placing an order", "No fraudulent or harmful digital activity", "Respect café policies while dining in", "Adherence to local regulatory laws"] 
              },
              { 
                title: "Orders & Payments", 
                items: ["Payments via approved secure methods only", "Prepare for price adjustments without notice", "Preparation starts immediately; no cancellations", "Delivery times are estimates based on traffic"] 
              },
              { 
                title: "Refund Policy", 
                items: ["Refunds only for incorrect or defective items", "Proof of purchase is mandatory", "Promotional items are final sale", "24-hour window for support concerns"] 
              },
              { 
                title: "Guest Conduct", 
                items: ["Mutual respect for staff and fellow guests", "No disruptive behavior within the premises", "Responsible use of complimentary Wi-Fi", "Maintain cleanliness in shared spaces"] 
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-t border-[#3d230d]/5 pt-10"
              >
                <div className="md:col-span-1">
                  <h3 className="text-[#3d230d] text-xl md:text-2xl font-normal sticky top-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {section.title}
                  </h3>
                  <div className="h-1 w-8 bg-[#8CB662] mt-2 opacity-30 group-hover:opacity-100 group-hover:w-12 transition-all duration-500" />
                </div>

                <div className="md:col-span-2">
                  <ul className="space-y-5">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-4 text-sm text-[#3d230d]/70 leading-relaxed hover:text-[#3d230d] transition-colors">
                        <span className="mt-2 text-[#8CB662] text-[8px]">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            <motion.div 
              variants={cardVariants}
              className="pt-20 flex flex-col items-center"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.svg 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-full"
                  viewBox="0 0 100 100"
                >
                  <path id="termsCircle" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                  <text className="text-[7.5px] uppercase tracking-[0.25em] fill-[#3d230d]/20 font-bold">
                    <textPath xlinkHref="#termsCircle">
                      • MI AMORE CAFE • TERMS OF SERVICE • EST 2019 •
                    </textPath>
                  </text>
                </motion.svg>
                <div className="w-1 h-12 bg-[#8CB662]/20 rounded-full" />
              </div>
              
              <p className="mt-8 text-[#3d230d]/30 text-[9px] uppercase tracking-[0.6em]">
                Authenticity & Integrity
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TermsAndConditions;