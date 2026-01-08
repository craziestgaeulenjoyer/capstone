import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const VerificationCode = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [code, setCode] = useState(["", "", "", ""]);
  const email = localStorage.getItem("reset_email");

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (!email) return alert("Email not found.");
    try {
      await axios.post("/api/customer/verify-code", { email, otp_code: code.join("") });
      window.location.href = "/resetpasswordform";
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP code");
    }
  };

  const handleResend = async () => {
    if (!email) return alert("Email not found.");
    try {
      await axios.post("/api/customer/resend-code", { email });
      alert("A new code has been sent to your email.");
    } catch {
      alert("Failed to resend code");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center"
      > <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-500 hover:text-gray-700 text-sm"
  >
    ← Back
  </button>
</div>
        <h2 className="text-2xl font-semibold text-[#8CB662] mb-3 mt-4">Enter 4-Digit Code</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter the verification code we sent to your email.
        </p>
        
        <div className="flex space-x-4 mb-5">
          {code.map((_, i) => (
            <input
              key={i}
              maxLength={1}
              ref={inputRefs[i]}
              value={code[i]}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-14 h-14 rounded-lg border text-center text-xl font-mono"
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Didn’t receive the code?{" "}
          <button onClick={handleResend} className="text-red-500 font-medium hover:underline">Resend</button>
        </p>
        <button
          onClick={handleVerifyCode}
          className="w-full py-3 bg-white text-[#8CB662] border border-[#8CB662] rounded-xl hover:bg-[#8CB662] hover:text-white"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationCode;
