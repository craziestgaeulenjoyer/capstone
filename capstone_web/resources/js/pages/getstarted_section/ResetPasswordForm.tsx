import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const ResetPasswordForm = () => {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const toggleNewPasswordVisibility = () => setNewPasswordVisible(!newPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col"
      >
      
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700"> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

       
        <div className="absolute top-8 right-8">
          <img
            src="/images/MiAmore2.png" 
            alt="Logo"
            className="h-8 w-auto object-contain" 
          />
        </div>

   
        <h2 className="text-2xl font-semibold text-[#8CB662] mb-2 mt-8">Reset Password</h2>

        <p className="text-gray-600 text-sm mb-6">
          Set a new password for your account to regain access and enjoy all features.
        </p>

 
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-gray-700 text-sm font-medium mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={newPasswordVisible ? 'text' : 'password'}
              id="new-password"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8CB662] transition" 
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#4A6030] hover:text-[#8CB662] focus:outline-none" 
            >
              {newPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

       
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirm-password"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8CB662] transition"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#4A6030] hover:text-[#8CB662] focus:outline-none"
            >
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href='NextPage' 
            className="block text-center bg-white text-[#4A6030] border border-[#8CB662] shadow-sm font-bold py-3 rounded-lg
                       transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#8CB662]
                       hover:bg-[#8CB662] hover:text-white hover:shadow-md"
          >
            Reset Password
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;