import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const ForgotPasswordForm = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 px-4">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">

      
        <div className="absolute top-8 left-4">
          <Link href="/" className="text-[#8CB662] hover:text-[#79a052]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

      
        <div className="absolute top-4 right-8">
          <img
            src="/images/MiAmore2.png" 
            alt="Logo"
            className="h-15 w-auto  object-contain"
          />
        </div>

        <div className="mb-6 mt-12 flex justify-center">
          <img
            src="/images/Forgot password-bro.png"
            alt="Forgot Password"
            className="w-45 h-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-[#8CB662] mb-2 text-center">
          Forgot password
        </h2>

        <p className="text-gray-600 mb-6 text-sm text-center px-2">
          Enter your email for the verification process. We'll send a 4-digit code to your inbox.
        </p>

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
              className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8CB662]"
            />
          </div>


          <Link
            href={route('VerificationCode')}
            className="w-full block text-center bg-white text-[#4A6030] border-2 border-[#8CB662] font-bold py-2.5 rounded-lg
                       transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#8CB662]
                       hover:bg-[#8CB662] hover:text-white hover:shadow-md" 
          >
            Continue
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;