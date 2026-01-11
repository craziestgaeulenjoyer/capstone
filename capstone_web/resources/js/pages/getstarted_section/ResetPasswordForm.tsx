import React, { useState } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

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
    <p className="mt-12 text-[#FAF9F6] font-serif italic tracking-[0.2em] text-sm uppercase">Securing Account...</p>
  </motion.div>
);

const ResetPasswordForm = () => {
  const email = localStorage.getItem("reset_email") || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      await axios.post('/api/customer/reset-password', {
        email,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      
      setShowSuccess(true);
      localStorage.removeItem('reset_email'); 
      
      setTimeout(() => {
        window.location.href = "/signincard"; 
      }, 2500);
      
    } catch (error: any) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else if (error.response?.data?.message) setErrors({ general: error.response.data.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {processing && <CoffeeLoader />}
      </AnimatePresence>

      <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-8 relative overflow-hidden font-sans text-[#3d230d]">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
        
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 md:w-96 md:h-96 bg-[#C5A059]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 md:w-96 md:h-96 bg-[#4A5D45]/20 blur-[100px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
        >
          <div className="px-6 py-10 md:px-14 md:py-12">
            
            <div className="flex justify-between items-center mb-10">
              <button 
                type="button"
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45] transition-all"
              >
                <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all shadow-sm">
                  <FaArrowLeft className="h-3 w-3" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Abort</span>
              </button>
              <img src="/images/MiAmore2.png" alt="Logo" className="h-7 md:h-8 w-auto brightness-0 opacity-60" />
            </div>

            {showSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-serif italic mb-2">Success!</h2>
                <p className="text-[#4A5D45]/60 text-xs uppercase tracking-widest font-bold">Your password has been updated. Redirecting to login...</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-4">
                    <FaLock size={24} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-2">New Identity</h2>
                  <p className="text-[#4A5D45]/60 text-[10px] md:text-[11px] leading-relaxed uppercase tracking-[0.2em] font-medium">
                    Create a secure password for <span className="text-[#3d230d] font-bold lowercase tracking-normal text-xs">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45]/50 block mb-2 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4A5D45]/30 group-focus-within:text-[#C5A059] transition-colors">
                        <FaLock size={14} />
                      </span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#4A5D45]/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-[#3d230d] focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-sm"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-[9px] mt-2 font-bold italic uppercase tracking-wider">{errors.password}</p>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45]/50 block mb-2 ml-1">
                      Repeat Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4A5D45]/30 group-focus-within:text-[#C5A059] transition-colors">
                        <FaLock size={14} />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#4A5D45]/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-[#3d230d] focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-sm"
                      />
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-red-400 text-[9px] mt-2 font-bold italic uppercase tracking-wider">{errors.password_confirmation}</p>
                    )}
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-[10px] text-center font-bold uppercase border border-red-100">
                      {errors.general}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processing || !newPassword}
                    className="w-full bg-[#4A5D45] text-[#FAF9F6] font-bold py-5 rounded-2xl shadow-xl hover:bg-[#3d4b38] hover:shadow-[0_10px_20px_rgba(74,93,69,0.3)] transition-all duration-300 active:scale-95 text-[12px] uppercase tracking-[0.3em] font-serif disabled:opacity-50"
                  >
                    {processing ? "Updating Vault..." : "Update Password"}
                  </button>
                </form>
              </>
            )}

            <p className="text-center text-[9px] text-[#4A5D45]/40 mt-12 uppercase tracking-[0.4em] font-medium leading-relaxed">
              Mi Amore Café &bull; Privacy First Policy
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default ResetPasswordForm;