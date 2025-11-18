import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

function PrivacyPolicy() {
  const bubbles = Array.from({ length: 22 }).map((_, i) => ({
    size: Math.floor(Math.random() * 120) + 60,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div className="relative min-h-screen font-poppins overflow-hidden bg-gradient-to-br from-[#dff5d1] via-[#e8ffe0] to-[#d4f0c9]">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#bde5ac] opacity-60 blur-[3px] shadow-md"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            boxShadow: "0 0 25px #a5d594",
          }}
          animate={{
            y: [-20, 25, -20],
            x: [-10, 10, -10],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: b.duration,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="flex justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-gradient-to-br from-white to-[#f3ffea] shadow-2xl rounded-3xl relative z-10 overflow-hidden border border-[#dcefd2]">
          
          <header className="flex flex-col items-center px-6 py-6 border-b border-gray-200 bg-[#f2ffe8]">
            <motion.img
              src="/images/MiAmore2.png"
              alt="Mi Amore Logo"
              className="w-14 h-14 rounded-full shadow-md"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.h1
              className="text-2xl font-bold mt-3 text-[#8e674a]"
              style={{ fontFamily: "'Kalam', cursive" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Mi Amore Café
            </motion.h1>
          </header>

          <section className="bg-[#e1f7d8] px-6 py-12 text-center border-b border-[#cfeac6]">
            <motion.h2
              className="text-4xl font-bold text-[#5e8e3e] tracking-wide"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Privacy Policy
            </motion.h2>
            <p className="text-sm text-gray-600 mt-2">Last Updated: November 2025</p>

            <Link
              href="/termsandcondition"
              className="mt-6 inline-block px-6 py-3 bg-[#6ca856] text-white font-semibold rounded-full shadow-md hover:bg-[#5a9c42] transition"
            >
              View Terms & Conditions
            </Link>
          </section>

          <div className="px-6 py-10 space-y-6 text-gray-700">
            <motion.div
              className="bg-[#f2ffe7] p-6 rounded-xl shadow-md border border-[#d2e8c8]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <p>
                At Mi Amore Café, your privacy is our priority. This Privacy Policy
                explains how we collect, use, and protect your information when you visit
                our café, browse our website, or place an online order.
              </p>
            </motion.div>

            {[
              {
                title: "Information We Collect",
                sections: [
                  { subtitle: "Personal Information", items: ["Name, phone number, and email address", "Order details and preferences", "Payment information (processed securely)", "Feedback or inquiries you send us"] },
                  { subtitle: "Non-Personal Information", items: ["Browser and device details", "Traffic patterns", "Website activity and cookies"] },
                ],
              },
              {
                title: "How We Use Your Information",
                sections: [{ subtitle: "", items: ["Process orders and bookings", "Improve café services and menu quality", "Send updates or promotions (with consent)", "Enhance website performance and security"] }],
              },
              {
                title: "How We Protect Your Data",
                sections: [{ subtitle: "", items: ["Secure payment processors", "Encrypted data transmission", "Restricted access to sensitive information"] }],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                className="bg-[#f4ffef] p-6 rounded-xl shadow-md border border-[#d3e8c9]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: idx * 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <h3 className="text-2xl font-semibold text-[#6ca856] mb-3">{section.title}</h3>
                {section.sections.map((sub, i) => (
                  <div key={i}>
                    {sub.subtitle && <h4 className="font-semibold text-lg mt-2 text-[#517a3c]">{sub.subtitle}</h4>}
                    <ul className="list-disc ml-6 mt-1 space-y-1">
                      {sub.items.map((item, j) => (
                        <li key={j}>{item}</li>
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



