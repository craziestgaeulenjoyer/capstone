import React, { useRef } from 'react';
import { Link } from '@inertiajs/react'; 

const VerificationCodeInputUI = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
      <section className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center w-full max-w-md relative">

        
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-[#8CB662] hover:text-[#baf87b]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        <div className="w-40 h-40 mb-6 mx-auto">
          <img
            src="/images/Two Factor Authentication-bro.png"
            alt="Verification Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center mb-6 px-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Verification</h2>
          <p className="text-gray-600 text-sm">
            Please enter the code we sent to{' '}
            <span className="font-medium text-gray-900">jo*****123@gmail.com</span>
          </p>
        </div>

        <div className="flex space-x-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-14 h-14 rounded-lg border border-gray-300 text-center text-2xl font-mono text-gray-800
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              ref={inputRefs[i]}
            />
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Didn't receive a code?{' '}
          <button
            className="text-red-500 font-semibold hover:underline focus:outline-none"
            type="button"
          >
            Resend
          </button>
        </p>

        <button
          className="bg-white text-[#8CB662] rounded-full
                     border-1 border-[#8CB662] shadow-sm font-bold py-3 px-10
                     hover:bg-[#8CB662] hover:text-white hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:ring-opacity-75
                     transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          Verify
        </button>
      </section>
    </div>
  );
};

export default VerificationCodeInputUI;