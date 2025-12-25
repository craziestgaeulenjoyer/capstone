import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

interface Props {
  email: string;
  success?: string;
  error?: string;
}

const VerificationEmail: React.FC<Props> = ({ email, success, error }) => {
  const { data, setData, post, processing, errors } = useForm({
    email, // Keep existing email logic
    otp_code: "", // Keep existing string-based otp logic
  });

  const [otpExpiry, setOtpExpiry] = useState<number>(5 * 60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(10);

  // Helper to mask email like in the picture (e.g., jo****123@gmail.com)
  const maskEmail = (userEmail: string) => {
    const [name, domain] = userEmail.split("@");
    if (name.length <= 4) return userEmail;
    return `${name.substring(0, 2)}*******${name.slice(-3)}@${domain}`;
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
    setResendTimer(10);
    setOtpExpiry(5 * 60);
    setData("otp_code", "");
    post(route("customer.signup.resend"));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F2F4F7] px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-sm w-full max-w-[380px] p-8 relative overflow-hidden"
      >
        {/* Back Arrow */}
        <button 
          onClick={() => window.history.back()} 
          className="absolute top-6 left-6 text-[#8CB662] hover:opacity-70 transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Illustration Area */}
        <div className="flex justify-center mb-4 mt-6">
          <div className="w-40 h-40 flex items-center justify-center">
            <img 
              src="images/Emails-amico.png" 
              alt="Verification Illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-center text-[#1A1A1A] mb-2">
          Verification
        </h2>

        <p className="text-center text-gray-400 text-[14px] leading-relaxed mb-8">
          Please enter the code we sent to <br />
          <span className="text-gray-500 font-medium">
            {maskEmail(email)}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Unified Input */}
          <div className="flex flex-col items-center mb-6">
            <input
              type="text"
              maxLength={6}
              placeholder="••••••"
              value={data.otp_code}
              onChange={(e) => setData("otp_code", e.target.value)}
              className="w-full max-w-[240px] text-center text-3xl tracking-[12px] font-bold py-3 border-b-2 border-gray-100 focus:border-[#8CB662] outline-none transition-colors text-gray-700 placeholder:text-gray-200"
            />
            {errors.otp_code && (
              <p className="text-red-500 text-xs mt-2">{errors.otp_code}</p>
            )}
          </div>

          <div className="text-center mb-8">
            <p className="text-[13px] text-gray-500">
              If you don't receive a code!{" "}
              <button
                type="button"
                disabled={resendDisabled}
                onClick={handleResend}
                className={`font-semibold transition-colors ${
                  resendDisabled ? "text-gray-300 cursor-not-allowed" : "text-[#F06A6A] hover:underline cursor-pointer"
                }`}
              >
                Resend {resendDisabled && `(${resendTimer}s)`}
              </button>
            </p>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full py-4 rounded-[22px] text-white text-[18px] font-bold shadow-md transition-all active:scale-[0.98] ${
              processing ? "bg-gray-300" : "bg-[#8CB662] hover:bg-[#7da357] shadow-[#8CB662]/20"
            }`}
          >
            {processing ? "Verifying..." : "Verify"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerificationEmail;