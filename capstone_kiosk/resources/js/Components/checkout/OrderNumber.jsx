import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function OrderNumber() {
   const [language, setLanguage] = useState("EN");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const goBack = () => window.history.back();

  const languages = ["EN", "KR", "JP", "CN", "PH"];

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  // Generate random order number when component mounts
  useEffect(() => {
    const randomOrder = Math.floor(100 + Math.random() * 900); // 3-digit number
    setOrderNumber(randomOrder);
  }, []);


    // Load cart, customer info, and generate order number on mount
  useEffect(() => {
    // Load cart items
    const storedCart = JSON.parse(localStorage.getItem("kiosk_cart_items") || "[]");
    setCartItems(storedCart);

    // Calculate total
    const total = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);

    // Load customer info and payment method
    const storedName = localStorage.getItem("customer_name") || "";
    const storedPayment = localStorage.getItem("payment_method") || "";
    setCustomerName(storedName);
    setPaymentMethod(storedPayment);

    // Generate random 3-digit order number
    const randomOrder = Math.floor(100 + Math.random() * 900);
    setOrderNumber(randomOrder);
  }, []);

  // Handle DONE button click
  const handleDoneClick = async () => {
    try {
      // Store info in localStorage
      localStorage.setItem("order_number", orderNumber);
      localStorage.setItem("total_price", totalPrice);
      localStorage.setItem("cart_items", JSON.stringify(cartItems));

      // Send order to backend
      await axios.post("/kioskorders", {
        orderNumber,
        customerName,
        paymentMethod,
        totalPrice,
        cartItems,
      });

      console.log("Kiosk order saved successfully!");
      alert(`Order ${orderNumber} saved successfully!`);
      
      // Clear all kiosk-related localStorage items
    localStorage.removeItem("kiosk_cart_items");
    localStorage.removeItem("customer_name");
    localStorage.removeItem("payment_method");
    localStorage.removeItem("order_number");
    localStorage.removeItem("total_price");

     // Redirect to home page
    window.location.href = "/bubble-welcome";
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-800 p-6 font-quicksand relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-2 relative">
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
      <div className="flex justify-center mb-4 mt-[-40px]">
        <img
          src="/images/MiAmoreWelcome.png"
          alt="Logo"
          className="w-[80px] sm:w-[90px] md:w-[100px] object-contain"
        />
      </div>

      {/* Check icon / Checkout Successfully */}
      <div className="flex justify-center mb-6">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            borderWidth: 8,
            borderStyle: "solid",
            borderColor: "#8CB662",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            fill="none"
            stroke="#8CB662"
            strokeWidth="6"
            strokeLinecap="square"
            strokeLinejoin="square"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center mb-6 relative z-20">
        <h2 className="text-lg font-bold mb-1">Order Successful!</h2>
        <p className="text-sm text-gray-600 mb-4">
          You can pick up order from the cash register
        </p>

        {/* Order Number Box */}
        <div
          className="rounded-md py-3 px-6 inline-block shadow-sm border border-gray-200"
          style={{ backgroundColor: "rgba(118, 177, 58, 0.2)" }} // 20% opacity of #76B13A
        >
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Your order number
          </p>
          <p className="text-2xl font-bold text-[#76B13A]">{orderNumber}</p>
        </div>
      </div>

      {/* --- Decorative Bottom Half-Circle with Button --- */}
      <div
        className="absolute bottom-[-220px] left-1/2 transform -translate-x-1/2
               w-full h-[310px] bg-[#8CB662] rounded-t-[90%] flex justify-center items-start pt-6 z-10"
      >
         <button
          onClick={handleDoneClick}
          className="bg-white text-[#76B13A] py-2 px-6 rounded-xl font-semibold
               transition-all hover:brightness-110 shadow-md"
        >
          DONE
        </button>
      </div>
    </div>
  );
}
