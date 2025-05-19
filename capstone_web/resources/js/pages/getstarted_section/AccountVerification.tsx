import React, { useRef } from 'react';

const VerificationCodeInputUI = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleBack = () => {
    // Add back button logic here 
    console.log('Back button clicked');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <section className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center w-full max-w-md relative">
        
        {/* Back Button using Unicode Arrow */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center space-x-1 text-gray-600 hover:text-gray-900 focus:outline-none text-xl font-semibold"
          aria-label="Go back"
        >
          <span className="select-none">←</span>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Image Section */}
        <div className="w-40 h-28 mb-6 mx-auto">
          <img
            src="/images/Two Factor Authentication-bro.png" // Replace with your image path or URL
            alt="Verification Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title and Instructions */}
        <div className="text-center mb-6 px-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Verification</h2>
          <p className="text-gray-600 text-sm">
            Please enter the code we sent to{' '}
            <span className="font-medium text-gray-900">jo*****123@gmail.com</span>
          </p>
        </div>

        {/* Code Input Fields */}
        <div className="flex space-x-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
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

        {/* Resend Text */}
        <p className="text-gray-600 text-sm mb-6">
          Didn't receive a code?{' '}
          <button
            className="text-indigo-600 font-semibold hover:underline focus:outline-none"
            type="button"
          >
            Resend
          </button>
        </p>

        {/* Verify Button */}
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
          type="submit"
        >
          Verify
        </button>
      </section>
    </div>
  );
};

export default VerificationCodeInputUI;