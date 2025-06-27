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
       
        <button
          onClick={() => console.log('Back clicked')}
          className="absolute top-4 left-4 text-cyan-600 hover:text-cyan-800 text-sm font-medium"
        >
          ← Back
        </button>

   
        <div className="absolute top-4 right-4 text-green-600 text-2xl font-bold">m.</div>

      
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 mt-8">Reset Password</h2>

      
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
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-green-600 focus:outline-none"
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
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-green-600 focus:outline-none"
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
            className="block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            Reset Password
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;
