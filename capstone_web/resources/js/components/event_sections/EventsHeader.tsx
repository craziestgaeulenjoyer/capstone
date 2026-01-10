import React from "react";
import { motion } from "framer-motion";
import { GiBigDiamondRing, GiPartyFlags } from "react-icons/gi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const EventsHeader: React.FC = () => {
  const eventTypes = [
    {
      icon: <GiBigDiamondRing size={32} />,
      title: "Weddings",
      desc: "Make your special day more heartfelt with our premium coffee bars and elegant artisan platters.",
      package: "Amour Wedding Bundles"
    },
    {
      icon: <GiPartyFlags size={32} />,
      title: "Birthdays",
      desc: "Celebrate another beautiful year with sweet treats and handcrafted brews that everyone will love.",
      package: "Celebration Platters"
    },
    {
      icon: <HiOutlineOfficeBuilding size={32} />,
      title: "Corporate Events",
      desc: "Elevate your business meetings or office pop-ups with professional barista service and savory bites.",
      package: "Executive Coffee Break"
    }
  ];

  return (
    <section className="relative z-0 py-24 px-6 bg-[#faf7f2] overflow-hidden">
      
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply z-[-10]"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-7xl mx-auto relative z-20">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 rounded-full border border-[#5C2E0A]/20 text-[#5C2E0A]/60 text-[10px] tracking-[0.3em] uppercase font-bold mb-6"
          >
            Memorable Moments
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E0A] leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Celebrate Life with <br />
            <span className="italic text-[#8CB662]">Mi Amore Artisan Packages.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-[#5C2E0A]/70 max-w-2xl mx-auto leading-relaxed"
          >
            From intimate gatherings to grand celebrations, we bring the Mi Amore experience to your venue. Choose from our curated menu packages designed to make every occasion truly unforgettable.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {eventTypes.map((event, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] bg-white border border-[#5C2E0A]/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-[#8CB662]/10 rounded-3xl flex items-center justify-center text-[#8CB662] mb-8 group-hover:bg-[#8CB662] group-hover:text-white transition-colors duration-500">
                {event.icon}
              </div>

              <h4 className="text-2xl font-bold text-[#5C2E0A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {event.title}
              </h4>
              
              <p className="text-[#5C2E0A]/60 text-sm leading-relaxed mb-8 flex-grow">
                {event.desc}
              </p>

              <div className="pt-6 border-t border-[#5C2E0A]/10 w-full">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#8CB662] block mb-1">Available Package</span>
                <span className="text-[#5C2E0A] font-semibold italic text-sm">{event.package}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#5C2E0A]/50 text-sm italic mb-4">Want something custom?</p>
          <button className="text-[#5C2E0A] font-bold underline underline-offset-8 hover:text-[#8CB662] transition-colors">
            Inquire for Custom Menu
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsHeader;