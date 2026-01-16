import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CheckCircle } from "lucide-react"; 
import { usePage } from "@inertiajs/react";

export default function OrderNumber() {
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const goBack = () => window.history.back();

  // Color Palette
  const colors = {
    sage: "#8CB662",
    brown: "#3D2317",
    cream: "#FDFCF8",
    sageLight: "#E9F0DE",
  };
const { props } = usePage();



useEffect(() => {
  const name = localStorage.getItem("customer_name");
  const method = localStorage.getItem("payment_method");

  console.log("📦 Loaded from storage:", name, method);

  if (name) setCustomerName(name);
  if (method) setPaymentMethod(method);
}, []);


 useEffect(() => {
  if (!customerName || !paymentMethod) {
    console.warn("⏳ Waiting for customerName & paymentMethod...");
    return;
  }

  console.log("🚀 Creating order with:", customerName, paymentMethod);

  axios.get("/kiosk/cart")
    .then(cartRes => {
      console.log("🛒 Cart loaded", cartRes.data);

      const cart = cartRes.data;
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      console.log("💰 Total computed:", total);

      axios.post("/kioskorder", {
        customerName,
        paymentMethod,
        totalPrice: total,
        cartItems: cart
      })
      .then(res => {
        console.log("✅ Order saved successfully", res.data);
        setOrderNumber(res.data.orderNumber);
      })
      .catch(err => {
        console.error("❌ Order save failed", err.response?.data || err);
      });
    })
    .catch(err => {
      console.error("❌ Failed to load cart", err);
    });
}, [customerName, paymentMethod]);



  const handleDoneClick = () => {
 axios.delete("/kiosk/cart/clear").then(() => {
  window.location.href = "/bubble-welcome";
});

  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden">
      
      {/* 1. BACKGROUND  */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}></div>

      {/* 2. HEADER */}
      <div className="w-full max-w-4xl flex items-center justify-between z-20">
        <button
          onClick={goBack}
          className="flex items-center text-[#3D2317] font-bold text-sm md:text-lg hover:opacity-70 transition group"
        >
          <IoIosArrowBack className="mr-1 group-hover:-translate-x-1 transition-transform" /> BACK
        </button>
        <img src="/images/MiAmoreWelcome.png" alt="Logo" className="w-16 md:w-24 object-contain" />
      </div>

      {/* 3. MAIN CONTENT CARD  */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-20 w-full max-w-[320px] md:max-w-[450px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col items-center border border-[#3D2317]/5"
      >
        {/* Success Header */}
        <div className="w-full bg-[#8CB662] p-8 flex flex-col items-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle size={64} strokeWidth={1.5} />
          </motion.div>
          <h2 className="mt-4 text-xl md:text-2xl font-black italic tracking-tighter uppercase">Order Successful!</h2>
        </div>

        {/* Order Details */}
        <div className="p-8 md:p-12 flex flex-col items-center text-center w-full bg-white relative">
       
          <div className="absolute top-0 -left-3 w-6 h-6 bg-[#FDFCF8] rounded-full border-r border-[#3D2317]/5" />
          <div className="absolute top-0 -right-3 w-6 h-6 bg-[#FDFCF8] rounded-full border-l border-[#3D2317]/5" />

          <p className="text-[#3D2317]/50 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-2">
            Ticket Confirmation
          </p>
          
          <div className="space-y-1 mb-8">
            <p className="text-[#3D2317] text-sm md:text-base opacity-60">Your order number is</p>
            <motion.h1 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl md:text-8xl font-black italic text-[#3D2317] tracking-tighter"
            >
              {orderNumber}
            </motion.h1>
          </div>

          <div className="w-full border-t border-dashed border-gray-200 py-6 space-y-2">
            <p className="text-gray-600 text-xs md:text-sm italic">
              Please head to the counter for payment <br/> and to pick up your drinks.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 opacity-40">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Mi Amore Cafe</p>
            <p className="text-[8px] uppercase tracking-[0.2em]">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>

      {/* 4. FOOTER ACTION */}
      <div className="z-20 w-full max-w-md flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDoneClick}
          className="bg-[#3D2317] text-[#FDFCF8] w-full md:w-64 py-4 md:py-5 rounded-full font-black text-sm md:text-lg tracking-[0.5em] uppercase shadow-xl border-2 border-[#7C8B7C] transition-all"
        >
          DONE
        </motion.button>
        
        <p className="text-[#3D2317]/40 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-center">
          Tap done to return to home screen
        </p>
      </div>

      <div
        className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2
                   w-[120%] h-[300px] bg-[#8CB662] opacity-[0.07] rounded-t-[100%] z-10 pointer-events-none"
      />
    </div>
  );
}