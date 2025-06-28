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
      
       <Link href="/" className="absolute top-6 left-6 p-2 rounded-full text-gray-500 hover:text-[#8CB662] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8CB662] transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

    
          <img
          src="/images/MiAmore2.png" 
          alt="Mi Amore Cafe Logo (Small)"
          className="absolute top-6 right-6 h-8 w-auto object-contain hover:scale-110 transition-transform duration-300 z-10"
        />

      
       <h2 className="text-2xl font-semibold text-[#8CB662] mb-2 mt-8">Enter 4-Digit Code</h2>

      
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter the 4-digit code that we sent to your email.
        </p>

      
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

       
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the code?{" "}
          <button
            onClick={() => console.log('Resend clicked')}
            className="text-red-500 font-medium hover:underline transition"
          >
            Resend
          </button>
        </p>

     
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full"
        >
         <Link
          href='resetpasswordform' 
          className="w-full block text-center py-3 bg-white text-[#4A6030] border border-[#8CB662] font-bold rounded-xl shadow-sm
                    hover:bg-[#8CB662] hover:text-white hover:shadow-md
                    transition transform hover:scale-105"
        >
          Continue
        </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationCode;