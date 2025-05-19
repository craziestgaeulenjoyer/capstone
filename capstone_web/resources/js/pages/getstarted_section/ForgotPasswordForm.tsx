import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

  const ForgotPasswordForm = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
        <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
  
          {/* Back Button */}
          <button
            onClick={() => console.log('Back clicked')}
            className="absolute top-4 left-4 text-cyan-600 hover:text-cyan-800 font-semibold text-sm flex items-center gap-1 transition"
          >
            <span className="text-lg select-none">←</span>
            <span className="hidden sm:inline">Back</span>
          </button>
  
          {/* Logo */}
          <div className="absolute top-4 right-4 text-green-500 text-xl font-bold">m.</div>
  
          {/* Image Section */}
          <div className="mb-6 mt-12 flex justify-center">
            <img
              src="/images/Forgot password-bro.png" // Replace with your actual image path or URL
              alt="Forgot Password"
              className="w-40 h-auto object-contain"
            />
          </div>
  
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Forgot password
          </h2>
  
          {/* Description */}
          <p className="text-gray-600 mb-6 text-sm text-center px-2">
            Enter your email for the verification process. We'll send a 4-digit code to your inbox.
          </p>
  
          {/* Email Form */}
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
  
            {/* Continue Button */}
            <Link
            href={route('VerificationCode')} // Replace with your actual route name
            className="w-full block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Continue
          </Link>
          </form>
        </div>
      </div>
    );
  };
  
  export default ForgotPasswordForm;
  