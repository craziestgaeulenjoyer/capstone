import React from "react";
import { GiCoffeeCup } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

function TermsAndConditions() {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };


  const floatingIcons = [
    { top: "5%", left: "5%", size: 35 },
    { top: "10%", left: "25%", size: 40 },
    { top: "15%", left: "50%", size: 30 },
    { top: "20%", left: "70%", size: 50 },
    { top: "30%", left: "10%", size: 45 },
    { top: "35%", left: "85%", size: 30 },
    { top: "40%", left: "40%", size: 50 },
    { top: "50%", left: "15%", size: 35 },
    { top: "55%", left: "75%", size: 40 },
    { top: "60%", left: "55%", size: 45 },
    { top: "70%", left: "5%", size: 30 },
    { top: "75%", left: "80%", size: 35 },
    { top: "80%", left: "25%", size: 40 },
    { top: "85%", left: "60%", size: 30 },
  ];

  return (
    <div className="relative min-h-screen bg-[#B8D892] font-poppins overflow-hidden">
      {/* Floating Coffee/Milk Tea Icons */}
      {floatingIcons.map((icon, idx) => (
        <motion.div
          key={idx}
          className="absolute text-[#6B8E23] opacity-50"
          style={{ top: icon.top, left: icon.left }}
          animate={{ y: [0, 15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5 + idx * 0.3, ease: "easeInOut" }}
        >
          <GiCoffeeCup size={icon.size} />
        </motion.div>
      ))}

      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden relative z-10">

          {/* HEADER */}
          <header className="flex flex-col items-center text-center px-6 py-6 border-b border-gray-300">
            <motion.div
              className="text-2xl font-semibold flex items-center gap-2"
              initial={{ y: -10 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#6B8E23]">
                <img
                  src=""
                  alt="Mi Amore Logo"
                  className="w-full h-full object-cover"
                />
              </span>
              <span>Mi Amore Cafeteria</span>
            </motion.div>
          </header>

          {/* TITLE */}
          <section className="bg-[#E6F2D9] px-6 py-12 text-center">
            <motion.h1
              className="text-4xl font-bold text-[#556B2F] flex items-center justify-center gap-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <FaLeaf /> Terms & Conditions
            </motion.h1>
            <p className="text-sm text-gray-500 mt-2">Last Updated: November 2025</p>
          </section>

          {/* CONTENT */}
          <div className="px-6 py-10 space-y-8 text-gray-700">
            <p className="leading-relaxed text-center">
              Welcome to Mi Amore Cafeteria! These Terms & Conditions outline the
              rules and guidelines for using our website, placing online orders, and
              enjoying our café services. By accessing our site or purchasing from
              us, you agree to follow these Terms.
            </p>

            <div className="space-y-6">
              {/* Section Cards */}
              {[
                {
                  title: "Use of Our Services",
                  items: [
                    "Provide accurate information when placing an order",
                    "Do not use our website for fraudulent or harmful activity",
                    "Respect café policies while dining in",
                    "Follow all applicable local laws",
                  ],
                },
                {
                  title: "Orders & Payments",
                  items: [
                    "Online orders must be paid using approved payment methods",
                    "Prices may change without prior notice",
                    "Orders cannot be canceled once prepared",
                    "Delivery times may vary based on location and traffic",
                  ],
                },
                {
                  title: "Cancellations & Refunds",
                  items: [
                    "Refunds are issued only for incorrect or defective items",
                    "Proof of purchase is required for refund requests",
                    "Promotional items may not qualify for refunds",
                    "Contact our support team within 24 hours for concerns",
                  ],
                },
                {
                  title: "Customer Conduct",
                  items: [
                    "Respect staff and other customers",
                    "No disruptive or harmful behavior inside the café",
                    "Do not misuse our Wi-Fi or equipment",
                    "Clean up after using shared spaces when possible",
                  ],
                },
              ].map((section, idx) => (
                <motion.div
                  key={idx}
                  className="bg-[#F7FFF1] p-6 rounded-2xl shadow-lg border border-gray-200"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1, delay: 0.3 + idx * 0.2, ease: "easeOut" }}
                  whileHover={{ y: -8, boxShadow: "0 12px 25px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }}
                >
                  <h2 className="text-2xl font-semibold text-[#6B8E23] mb-3 flex items-center gap-2">
                    <FaLeaf /> {section.title}
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              {/* Privacy */}
              <motion.div
                className="bg-[#F7FFF1] p-6 rounded-2xl shadow-lg border border-gray-200 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: "0 12px 25px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }}
              >
                <h2 className="text-2xl font-semibold text-[#6B8E23] flex items-center justify-center gap-2">
                  <GiCoffeeCup /> Privacy & Data Usage
                </h2>
                <p className="mt-2 text-gray-700">
                  We collect basic information needed to complete your orders and
                  improve your experience. For more details, please refer to our
                  Privacy Policy.
                </p>
              </motion.div>

              {/* Changes */}
              <motion.div
                className="bg-[#F7FFF1] p-6 rounded-2xl shadow-lg border border-gray-200 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: "0 12px 25px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }}
              >
                <h2 className="text-2xl font-semibold text-[#6B8E23] flex items-center justify-center gap-2">
                  <GiCoffeeCup /> Changes to These Terms
                </h2>
                <p className="mt-2 text-gray-700">
                  Mi Amore Cafeteria may update these Terms & Conditions at any
                  time. Continued use of our services means you accept the latest
                  version.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
