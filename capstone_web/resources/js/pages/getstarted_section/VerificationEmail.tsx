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
    email,
    otp_code: "",
  });

  const [otpExpiry, setOtpExpiry] = useState<number>(5 * 60); // 5 mins
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(10);

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry <= 0) return;
    const timer = setInterval(() => setOtpExpiry((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Resend button cooldown
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

    post(route("customer.signup.resend"), {
      onSuccess: () => {
        alert("A new OTP has been sent to your email!");
      },
      onError: () => {
        alert("Failed to resend OTP. Please try again.");
      },
    });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F5F7FA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-center text-[#1B3C2A] mb-2">
          Verify Your Email
        </h1>

        <p className="text-center text-gray-600 mb-6">
          We sent a One-Time Password (OTP) to your email: <br />
          <span className="font-semibold">{email}</span>
        </p>

        {success && (
          <p className="text-green-600 text-center mb-2 font-medium">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-2 font-medium">{error}</p>
        )}

        {/* OTP INPUT */}
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-medium mb-2">
            Enter OTP Code
          </label>

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            maxLength={6}
            value={data.otp_code}
            onChange={(e) => setData("otp_code", e.target.value)}
            className="w-full text-center text-2xl tracking-widest font-bold border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#8CB662] outline-none"
            required
          />

          {errors.otp_code && (
            <p className="text-red-500 text-sm mt-1">{errors.otp_code}</p>
          )}

          <button
            type="submit"
            disabled={processing}
            className={`mt-6 w-full py-3 rounded-lg text-white text-lg font-semibold transition ${
              processing
                ? "bg-gray-400"
                : "bg-[#8CB662] hover:bg-[#7aa85a] shadow-md"
            }`}
          >
            {processing ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* TIMER + RESEND */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">
            OTP expires in:{" "}
            <span className="font-semibold">{formatTime(otpExpiry)}</span>
          </p>

          <button
            disabled={resendDisabled}
            onClick={handleResend}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              resendDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
            }`}
          >
            {resendDisabled
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationEmail;
