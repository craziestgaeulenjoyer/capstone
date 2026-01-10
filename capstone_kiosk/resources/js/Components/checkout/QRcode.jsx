import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function QRcode() {
  const [language, setLanguage] = useState("EN");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ["EN", "KR", "JP", "CN", "PH"];

  const goBack = () => window.history.back();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-800 p-6 font-quicksand relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 relative">
        <button
          onClick={goBack}
          className="flex items-center text-[#76B13A] font-medium text-lg hover:opacity-80 transition"
        >
          <IoIosArrowBack className="mr-1 text-xl" /> Back
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-[#76B13A] font-semibold text-sm focus:outline-none"
          >
            {language} <IoIosArrowDown className="ml-1" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                {languages.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#E9F0DE] ${
                      language === lang
                        ? "bg-[#A4C879] text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {lang}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Logo"
          className="w-[80px] sm:w-[90px] md:w-[100px] object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-center">
        Read your QR code, <br />please.
      </h2>

      {/* QR Code Image */}
      <div className="flex justify-center">
        <img
          src="/images/InitialQRcode.png"
          alt="QR Code"
          className="w-[140px] sm:w-[160px] md:w-[180px] object-contain cursor-pointer"
        />
      </div>


      {/* Decorative Bottom Half-Circle */}
      <div
        className="absolute bottom-[-220px] left-1/2 transform -translate-x-1/2
                   w-[100%] h-[300px] bg-[#8CB662] rounded-t-[90%]"
      />
            {/* Button linking to Order Number page */}
      <a href="/ordernumber">
        <button className="mt-6 bg-[#76B13A] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-80 transition">
          Go to Order Number
        </button>
      </a>
    </div>
  );
}
