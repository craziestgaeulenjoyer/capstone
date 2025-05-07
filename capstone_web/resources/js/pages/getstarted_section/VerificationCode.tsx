import React, { useRef } from 'react';

const VerificationCode = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        {/* Back Button */}
        <button onClick={() => console.log('Back clicked')} className="absolute top-4 left-4 focus:outline-none text-cyan-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Logo (Placeholder) */}
        <div className="absolute top-4 right-4 text-green-500 text-xl font-bold">m.</div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Enter 4 Digits Code</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter the 4 digits code that you received on your email.
        </p>

        {/* Code Input Fields */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 rounded border border-gray-300 text-center text-xl font-mono focus:ring-indigo-500 focus:border-indigo-500"
            ref={inputRefs[0]}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 rounded border border-gray-300 text-center text-xl font-mono focus:ring-indigo-500 focus:border-indigo-500"
            ref={inputRefs[1]}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 rounded border border-gray-300 text-center text-xl font-mono focus:ring-indigo-500 focus:border-indigo-500"
            ref={inputRefs[2]}
          />
          <input
            type="text"
            maxLength={1}
            className="w-12 h-12 rounded border border-gray-300 text-center text-xl font-mono focus:ring-indigo-500 focus:border-indigo-500"
            ref={inputRefs[3]}
          />
        </div>

        {/* Resend Link */}
        <p className="text-gray-600 text-sm mb-4">
          If you don't receive a code! <button className="text-red-500 focus:outline-none">Resend</button>
        </p>

        {/* Continue Button */}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={() => console.log('Continue clicked')}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default VerificationCode;