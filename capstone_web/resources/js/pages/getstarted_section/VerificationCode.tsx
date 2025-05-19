import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const VerificationCode = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center"
      >
        {/* Back Button */}
        <button
          onClick={() => console.log('Back clicked')}
          className="absolute top-4 left-4 text-cyan-600 hover:text-cyan-800 font-medium text-sm transition"
        >
          ← Back
        </button>

        {/* Logo (Top Right) */}
        <div className="absolute top-4 right-4 text-green-600 text-2xl font-bold">m.</div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 mt-8">Enter 4-Digit Code</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter the 4-digit code that we sent to your email.
        </p>

        {/* Input Fields */}
        <motion.div
          className="flex space-x-3 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              ref={inputRefs[i]}
              className="w-14 h-14 rounded-lg border border-gray-300 text-center text-xl font-mono focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          ))}
        </motion.div>

        {/* Resend Message */}
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the code?{" "}
          <button
            onClick={() => console.log('Resend clicked')}
            className="text-red-500 font-medium hover:underline transition"
          >
            Resend
          </button>
        </p>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full"
        >
          <Link
            href='resetpasswordform'
            className="w-full block text-center py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition transform hover:scale-105"
          >
            Continue
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationCode;