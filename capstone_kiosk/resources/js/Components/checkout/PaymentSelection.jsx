import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState("QR Pay");
  const [language, setLanguage] = useState("EN");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const languages = ["EN", "KR", "JP", "CN", "PH"];

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Style logic for payment cards and buttons
  const getStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#8CB662" : "rgba(140, 182, 98, 0.52)",
    color: isSelected ? "white" : "#76B13A",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-800 p-6 font-quicksand relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 relative">
        <button className="flex items-center text-[#76B13A] font-medium text-sm">
          <IoIosArrowBack className="text-lg mr-1" /> Back
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
          className="w-[90px] sm:w-[100px]"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">
        Please select a payment type?
      </h2>

      {/* Payment Options */}
      <div className="flex space-x-4 mb-8">
        {/* QR Pay */}
        <div
          onClick={() => setPaymentMethod("QR Pay")}
          className={`cursor-pointer rounded-2xl p-6 w-36 h-36 flex flex-col items-center justify-center transition-all shadow-sm border hover:brightness-110 ${
            paymentMethod === "QR Pay" ? "shadow-lg" : ""
          }`}
          style={getStyle(paymentMethod === "QR Pay")}
        >
          <img
            src={
              paymentMethod === "QR Pay"
                ? "/images/QRwhite.png"
                : "/images/QRgreen.png"
            }
            alt="QR Pay Icon"
            className="w-14 h-14 mb-2 object-contain"
          />
          <p className="font-semibold text-center">QR Pay</p>
        </div>

        {/* Cash */}
        <div
          onClick={() => setPaymentMethod("Cash")}
          className={`cursor-pointer rounded-2xl p-6 w-36 h-36 flex flex-col items-center justify-center transition-all shadow-sm border hover:brightness-110 ${
            paymentMethod === "Cash" ? "shadow-lg" : ""
          }`}
          style={getStyle(paymentMethod === "Cash")}
        >
          <img
            src={
              paymentMethod === "Cash"
                ? "/images/Pesowhite.png"
                : "/images/Pesogreen.png"
            }
            alt="Cash Icon"
            className="w-14 h-14 mb-2 object-contain"
          />
          <p className="font-semibold text-center">Cash</p>
          <p className="text-xs opacity-75">(Pay at counter)</p>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full max-w-md">
        <h3 className="text-base font-bold mb-2 border-t pt-4">
          Order Summary
        </h3>

        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Payment Method:</span>
            <span>{paymentMethod}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>1x Vanilla Iced Coffee (Small)</span>
            <span>₱65.00</span>
          </div>

          <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
            <span>Total Price:</span>
            <span>₱65.00</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md flex justify-between mt-6">
        {/* Restart Menu */}
        <button
          onClick={() => handleButtonClick("Restart")}
          style={getStyle(activeButton === "Restart")}
          className="py-2 px-4 rounded-xl font-semibold transition-all hover:brightness-110"
        >
          Restart Menu
        </button>

        {/* Checkout */}
        <button
          onClick={() => handleButtonClick("Checkout")}
          style={getStyle(activeButton === "Checkout")}
          className="py-2 px-4 rounded-xl font-semibold transition-all hover:brightness-110"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
