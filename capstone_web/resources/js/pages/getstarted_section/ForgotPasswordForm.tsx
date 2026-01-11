import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const CoffeeLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#8A9A84]/95 backdrop-blur-md"
  >
    <div className="relative scale-125">
      <div className="flex gap-2 mb-2 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div key={i}
            animate={{ y: [0, -20], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
            className="w-1.5 h-6 bg-[#FAF9F6] rounded-full blur-[1px]" 
          />
        ))}
      </div>
      <div className="relative w-20 h-16 bg-[#FAF9F6] rounded-b-2xl border-t-4 border-[#C5A059] shadow-xl">
        <div className="absolute -right-4 top-2 w-6 h-8 border-4 border-[#FAF9F6] rounded-r-full" />
      </div>
    </div>
    <p className="mt-12 text-[#FAF9F6] font-serif italic tracking-[0.2em] text-sm uppercase">Sending Code...</p>
  </motion.div>
);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
        setErrors({ general: "Please enter your email address." });
        return;
    }
    
    setProcessing(true);
    setErrors({});
    try {
      await axios.post('/api/customer/forgot-password', { email });
      localStorage.setItem('reset_email', email);
      
      setTimeout(() => {
        window.location.href = '/verificationcode';
      }, 1000);
    } catch (err: any) {
      setErrors(err.response?.data || { general: "Failed to send code. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {processing && <CoffeeLoader />}
      </AnimatePresence>

      <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#4A5D45]/20 blur-[120px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
        >
          <div className="px-8 py-12 md:px-14">
            
            <div className="flex justify-between items-center mb-14">
              <button 
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45] transition-all"
              >
                <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all">
                  <FaArrowLeft className="h-3 w-3" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Return</span>
              </button>
              <img src="/images/MiAmore2.png" alt="Logo" className="h-8 w-auto brightness-0 opacity-60" />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-[#3d230d] text-4xl font-serif italic mb-4">Forgot Password?</h2>
              <p className="text-[#4A5D45]/60 text-[11px] leading-relaxed uppercase tracking-[0.2em] font-medium px-4">
                No worries, it happens. Enter your email below to receive your <span className="text-[#C5A059] font-black">6-digit security code</span>.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4A5D45]/30">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#4A5D45]/10 rounded-xl pl-12 pr-5 py-4 text-sm text-[#3d230d] placeholder-[#4A5D45]/30 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-sm"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                {(errors.email || errors.general) && (
                  <p className="text-red-400 text-[10px] mt-2 ml-1 font-bold italic uppercase tracking-tighter">
                    {errors.email || errors.general}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                disabled={processing}
                className="w-full bg-[#4A5D45] text-[#FAF9F6] font-bold py-5 rounded-2xl shadow-xl hover:bg-[#3d4b38] hover:shadow-[0_10px_20px_rgba(74,93,69,0.3)] transition-all duration-300 active:scale-95 text-[12px] uppercase tracking-[0.3em] font-serif"
              >
                {processing ? "Brewing Link..." : "Send Verification"}
              </button>
            </div>

            <p className="text-center text-[9px] text-[#4A5D45]/40 mt-14 uppercase tracking-[0.3em] font-medium">
              Member Security Protocol &bull; Mi Amore Café
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default ForgotPasswordForm;