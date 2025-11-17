import React from "react";
import { GiCoffeeCup } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

function PrivacyPolicy() {
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
          <header className="flex flex-col items-center px-6 py-4 border-b border-gray-300">
            <motion.div
              className="text-xl font-semibold flex items-center gap-2"
              initial={{ y: -10 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <img
                src=""
                alt="Mi Amore Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              Mi Amore Cafeteria
            </motion.div>
          </header>

          {/* TITLE */}
          <section className="bg-[#E6F2D9] px-6 py-12 text-center">
            <motion.h1
              className="text-4xl font-bold text-[#556B2F] flex items-center justify-center gap-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <FaLeaf /> Privacy Policy
            </motion.h1>
            <p className="text-sm text-gray-500 mt-2">Last Updated: November 2025</p>
          </section>

          {/* CONTENT */}
          <div className="px-6 py-10 space-y-6 text-gray-700">

            <motion.div
              className="bg-[#F7FFF1] p-6 rounded-xl shadow-md border border-gray-200"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              whileHover={{ y: -8, boxShadow: "0 12px 25px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }}
            >
              <p>
                At Mi Amore Cafeteria ("we", "our", or "us"), your privacy matters to us.
                This Privacy Policy explains how we collect, use, and safeguard your
                information when you visit our café, browse our website, or place orders
                online.
              </p>
            </motion.div>

            {/* Sections */}
            {[
              {
                title: "Information We Collect",
                icon: <GiCoffeeCup />,
                sections: [
                  {
                    subtitle: "Personal Information",
                    items: [
                      "Name, phone number, and email address",
                      "Order details and preferences",
                      "Payment information (handled securely by third-party processors)",
                      "Feedback or inquiries you send us",
                    ],
                  },
                  {
                    subtitle: "Non-Personal Information",
                    items: [
                      "Device and browser type",
                      "Website usage and traffic patterns",
                      "Cookies used to enhance your browsing experience",
                    ],
                  },
                  {
                    subtitle: "Information from Third Parties",
                    items: [
                      "Delivery partners (for online orders)",
                      "Online payment gateways",
                      "Social media platforms when you interact with us",
                    ],
                  },
                ],
              },
              {
                title: "How We Use Your Information",
                icon: <GiCoffeeCup />,
                sections: [
                  {
                    subtitle: "",
                    items: [
                      "Process and fulfill your café or online orders",
                      "Improve our menu, services, and customer experience",
                      "Send promotions, updates, or marketing messages (with your consent)",
                      "Enhance website performance and security",
                    ],
                  },
                ],
              },
              {
                title: "How We Protect Your Data",
                icon: <GiCoffeeCup />,
                sections: [
                  {
                    subtitle: "",
                    items: [
                      "Secure payment processing through trusted providers",
                      "Encrypted data handling and storage",
                      "Restricted access to customer information",
                    ],
                  },
                ],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                className="bg-[#F7FFF1] p-6 rounded-xl shadow-md border border-gray-200"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.4 + idx * 0.3, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: "0 12px 25px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }}
              >
                <h2 className="text-2xl font-semibold text-[#6B8E23] flex items-center gap-2 mb-3">
                  {section.icon} {section.title}
                </h2>
                {section.sections.map((sub, subIdx) => (
                  <div key={subIdx} className="mt-2">
                    {sub.subtitle && <h3 className="font-semibold text-lg">{sub.subtitle}</h3>}
                    <ul className="list-disc ml-6 mt-1">
                      {sub.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
