import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { QrCode, Banknote, RotateCcw } from "lucide-react";
import axios from "axios";

export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState("QR Pay");
  const [activeButton, setActiveButton] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nameError, setNameError] = useState(false);
  
  const goBack = () => {
  router.visit("/kioskmenu", {
    preserveState: true,
    preserveScroll: true,
  });
};


  // Color Palette update
  const brandGreen = "#8CB662";
  const brandBrown = "#3D2317";

  useEffect(() => {
  const savedName = localStorage.getItem("customer_name");
}, []);


  useEffect(() => {
  axios.get("/kiosk/cart").then(res => {
    setCartItems(res.data);

    const total = res.data.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalPrice(total);
  });
}, []);


 const handleButtonClick = async (button) => {
  setActiveButton(button);

  if (button === "Restart") {
    // ✅ Clear backend session
    await axios.delete("/kiosk/cart/clear");

    // ✅ Clear browser storage
    localStorage.removeItem("customer_name");
    localStorage.removeItem("payment_method");
    localStorage.removeItem("kiosk_cart_items");

    // ✅ Clear React state
    setCustomerName("");
    setCartItems([]);
    setTotalPrice(0);

    // ✅ Navigate ONCE
    router.visit("/kioskmenu");
    return;
  }

  if (button === "Checkout") {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }

    localStorage.setItem("customer_name", customerName);
    localStorage.setItem("payment_method", paymentMethod);

    router.visit(
      paymentMethod === "QR Pay" ? "/qrcode" : "/ordernumber"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center p-4 md:p-10 relative overflow-hidden">
      
      {/* 1. PREMIUM BACKGROUND DESIGN */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
      
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[100px] z-0 opacity-10" 
           style={{ backgroundColor: brandGreen }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] z-0 opacity-10" 
           style={{ backgroundColor: brandBrown }} />

      {/* 2. HEADER */}
      <header className="w-full max-w-6xl flex items-center justify-between z-20 mb-10">
        <button 
          onClick={goBack} 
          className="flex items-center font-black text-lg md:text-xl transition-all hover:scale-105 active:scale-95"
          style={{ color: brandBrown }}
        >
          <IoIosArrowBack className="mr-2 text-2xl" /> BACK
        </button>
        <img src="/images/MiAmoreWelcome.png" alt="Mi Amore Logo" className="w-24 md:w-36 drop-shadow-sm" />
        <div className="w-24 md:w-36 hidden md:block" /> 
      </header>

      {/* 3. MAIN CONTENT - TWO COLUMN ON TABLET/LAPTOP */}
      <div className="z-20 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-10">
        
        {/* LEFT COLUMN: SELECTION */}
        <div className="flex flex-col space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter" style={{ color: brandBrown }}>
              Payment <br/><span style={{ color: brandGreen }}>Selection</span>
            </h1>
            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Choose your preferred method</p>
          </div>

          {/* LARGE PAYMENT BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* QR PAY */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPaymentMethod("QR Pay")}
              className={`flex flex-col items-center justify-center p-8 md:p-12 rounded-[40px] border-4 transition-all shadow-xl ${
                paymentMethod === "QR Pay" ? "border-transparent" : "bg-white"
              }`}
              style={{ 
                backgroundColor: paymentMethod === "QR Pay" ? brandBrown : "white",
                borderColor: paymentMethod === "QR Pay" ? brandGreen : "#eee"
              }}
            >
              <QrCode size={60} color={paymentMethod === "QR Pay" ? brandGreen : brandBrown} strokeWidth={1.5} />
              <span className="mt-4 text-xl font-bold uppercase tracking-widest" 
                    style={{ color: paymentMethod === "QR Pay" ? "white" : brandBrown }}>
                QR Pay
              </span>
            </motion.button>

            {/* CASH */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPaymentMethod("Cash")}
              className={`flex flex-col items-center justify-center p-8 md:p-12 rounded-[40px] border-4 transition-all shadow-xl ${
                paymentMethod === "Cash" ? "border-transparent" : "bg-white"
              }`}
              style={{ 
                backgroundColor: paymentMethod === "Cash" ? brandBrown : "white",
                borderColor: paymentMethod === "Cash" ? brandGreen : "#eee"
              }}
            >
              <Banknote size={60} color={paymentMethod === "Cash" ? brandGreen : brandBrown} strokeWidth={1.5} />
              <span className="mt-4 text-xl font-bold uppercase tracking-widest"
                    style={{ color: paymentMethod === "Cash" ? "white" : brandBrown }}>
                Cash
              </span>
              <span className="text-[10px] font-bold uppercase opacity-60" style={{ color: paymentMethod === "Cash" ? brandGreen : brandBrown }}>
                Pay at Counter
              </span>
            </motion.button>
          </div>

          {/* NAME INPUT  */}
          <div className="bg-white p-8 rounded-[35px] shadow-lg border border-gray-100">
            <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: brandBrown }}>
              Customer Name / Nickname
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => { setCustomerName(e.target.value); if (nameError) setNameError(false); }}
              placeholder="Enter your name "
              className="w-full bg-[#F9F9F7] border-2 rounded-2xl px-6 py-5 text-2xl font-bold focus:outline-none transition-all"
              style={{ borderColor: nameError ? "#ef4444" : brandGreen + "40" }}
            />
            {nameError && <p className="text-red-500 font-bold text-xs mt-3 uppercase">Please enter your name to proceed</p>}
          </div>
        </div>

        {/* RIGHT COLUMN: RECEIPT SUMMARY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[50px] shadow-2xl p-8 md:p-12 relative border border-gray-100"
        >
          {/* Receipt Decor */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#FDFCF8] rounded-full border-b border-gray-100" />
          
          <h3 className="text-2xl font-black italic uppercase mb-8 border-b-4 border-double pb-4" style={{ color: brandBrown, borderColor: brandGreen + "30" }}>
            Order Summary
          </h3>

          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-dashed border-gray-100 pb-4">
                <div className="flex flex-col">
                  <span className="text-xl font-black italic" style={{ color: brandBrown }}>{item.quantity}x {item.name}</span>
                 <span
  className="text-xs font-bold uppercase tracking-widest opacity-60"
  style={{ color: brandGreen }}
>
  {item.details?.size ? item.details.size : ""}
  {item.details?.temp ? ` | ${item.details.temp}` : ""}
  {item.details?.addOns?.length > 0
    ? ` | ${item.details.addOns.map(a => a.name).join(", ")}`
    : ""}
</span>

                </div>
                <span className="text-xl font-black" style={{ color: brandBrown }}>₱{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* TOTAL SECTION */}
          <div className="mt-10 p-6 rounded-3xl flex justify-between items-center" style={{ backgroundColor: brandBrown }}>
            <span className="text-white text-xl font-black italic uppercase tracking-widest">Total</span>
            <span className="text-4xl md:text-5xl font-black" style={{ color: brandGreen }}>
              ₱{totalPrice.toFixed(2)}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => handleButtonClick("Restart")}
              className="flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-gray-50 border-2"
              style={{ color: brandBrown + "70", borderColor: brandBrown + "20" }}
            >
              <RotateCcw size={18} /> Restart
            </button>
            <button
              onClick={() => handleButtonClick("Checkout")}
              className="py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: brandBrown }}
            >
              Checkout
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-4 md:inset-8 border-2 opacity-10 pointer-events-none rounded-[40px]" style={{ borderColor: brandBrown }} />
    </div>
  );
}