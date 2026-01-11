import React, { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react"; 
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

interface Props {
  email?: string; 
  success?: string;
  error?: string;
}

interface PageProps {
  [key: string]: any;
  ziggy?: {
    location: string;
    url: string;
  };
}

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
    <p className="mt-12 text-[#FAF9F6] font-serif italic tracking-[0.2em] text-sm uppercase">Verifying Code...</p>
  </motion.div>
);

const VerificationEmail: React.FC<Props> = ({ email = "", success, error }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: email || "", 
    otp_code: "", 
  });

  const { props } = usePage<PageProps>();

  const [otpExpiry, setOtpExpiry] = useState<number>(5 * 60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(10);

  const maskEmail = (userEmail: string) => {
    if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
        return userEmail || "your email";
    }

    try {
      const [name, domain] = userEmail.split("@");
      if (name.length <= 4) return userEmail;
      return `${name.substring(0, 2)}*******${name.slice(-3)}@${domain}`;
    } catch (e) {
      return userEmail;
    }
  };

  useEffect(() => {
    if (otpExpiry <= 0) return;
    const timer = setInterval(() => setOtpExpiry((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [otpExpiry]);

  useEffect(() => {
    if (resendTimer <= 0) {
      setResendDisabled(false);
      return;
    }
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("customer.signup.verify"));
  };

  const handleResend = () => {
    setResendDisabled(true);
    setResendTimer(30); 
    setOtpExpiry(5 * 60);
    setData("otp_code", "");
    post(route("customer.signup.resend"));
  };

  return (
    <>
      <AnimatePresence>
        {processing && <CoffeeLoader />}
      </AnimatePresence>

      <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-12 relative overflow-hidden font-sans text-[#3d230d]">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
        
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#4A5D45]/20 blur-[120px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
        >
          <div className="px-8 py-10 md:px-12">
            
            <div className="flex justify-between items-center mb-10">
              <button 
                type="button"
                onClick={() => router.visit(route('SignUpForm'))} 
                className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45] transition-all"
              >
                <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all shadow-sm">
                  <FaArrowLeft className="h-3 w-3" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Go Back</span>
              </button>
              <img src="/images/MiAmore2.png" alt="Logo" className="h-8 w-auto brightness-0 opacity-60" />
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-4">
                <FaShieldAlt size={28} />
              </div>
              <h2 className="text-3xl font-serif italic mb-2">Verify Email</h2>
              <p className="text-[#4A5D45]/60 text-[11px] leading-relaxed uppercase tracking-[0.2em] font-medium">
                Sent to: <span className="text-[#3d230d] font-bold lowercase tracking-normal text-xs">
                    {email ? maskEmail(email) : "registered email address"}
                </span>
              </p>
            </div>

            {(success || error) && (
                <div className={`mb-6 p-3 rounded-xl text-xs text-center font-bold ${error ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {error || success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45]/40 block text-center mb-4">
                  Enter 6-Digit Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={data.otp_code}
                  onChange={(e) => setData("otp_code", e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-white border border-[#4A5D45]/10 rounded-2xl px-5 py-5 text-center text-4xl tracking-[15px] font-black text-[#3d230d] placeholder-[#4A5D45]/10 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-inner"
                />
                {errors.otp_code && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] mt-2 text-center font-bold italic">
                    {errors.otp_code}
                  </motion.p>
                )}
              </div>

              <div className="bg-[#4A5D45]/5 rounded-2xl p-4 text-center">
                <p className="text-[11px] text-[#4A5D45]/70 uppercase tracking-widest font-bold mb-1">
                  Code expires in: <span className="text-[#C5A059] font-black">
                    {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
                  </span>
                </p>
                <div className="h-[1px] w-12 bg-[#4A5D45]/10 mx-auto my-2" />
                <button
                  type="button"
                  disabled={resendDisabled}
                  onClick={handleResend}
                  className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                    resendDisabled 
                    ? "text-[#4A5D45]/30 cursor-not-allowed" 
                    : "text-[#C5A059] hover:text-[#3d230d] underline underline-offset-4"
                  }`}
                >
                  {resendDisabled ? `Resend available in ${resendTimer}s` : "Resend Security Code"}
                </button>
              </div>

              <button
                type="submit"
                disabled={processing || data.otp_code.length < 6}
                className="w-full bg-[#4A5D45] text-[#FAF9F6] font-bold py-5 rounded-2xl shadow-xl hover:bg-[#3d4b38] hover:shadow-[0_10px_20px_rgba(74,93,69,0.3)] transition-all duration-300 active:scale-95 text-[12px] uppercase tracking-[0.3em] disabled:opacity-50 disabled:active:scale-100 font-serif"
              >
                {processing ? "Authenticating..." : "Confirm Verification"}
              </button>
            </form>

            <p className="text-center text-[9px] text-[#4A5D45]/40 mt-10 uppercase tracking-[0.4em] font-medium leading-relaxed">
              Mi Amore Café &bull; Safe & Secure Session
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default VerificationEmail;