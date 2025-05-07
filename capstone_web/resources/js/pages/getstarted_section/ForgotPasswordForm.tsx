import React, { useState } from 'react';

const ForgotPasswordForm = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-15 rounded shadow-md w-full max-w-md">
          {/* Back Button */}
          <button onClick={() => console.log('Back clicked')} className="absolute top-4 left-4 focus:outline-none text-cyan-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
  
          {/* Logo (Placeholder) */}
          <div className="absolute top-4 right-4 text-green-500 text-xl font-bold">m.</div>
  
          {/* Forgot Password Heading */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot password</h2>
  
          {/* Description */}
          <p className="text-gray-600 mb-4 text-sm">
            Enter your email for the verification process, we will send 4 digits code to your email
          </p>
  
          {/* Email Input Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="example@gmail.com"
              />
            </div>
  
            {/* Continue Button */}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ForgotPasswordForm  ;