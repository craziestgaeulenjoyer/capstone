import React, { useRef } from 'react';

const VerificationCodeInputUI = () => {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleBack = () => {
    // Add your back button logic here (e.g., navigate to the previous page)
    console.log('Back button clicked');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <section className="bg-white p-15 rounded shadow-md flex flex-col items-center w-full max-w-md">
        {/* Simple Back Button */}
        <button onClick={handleBack} className=" top-4 left-4 focus:outline-none text-gray-500">
          Back
        </button>

        {/* Blank Image Section */}
        <div className="w-32 h-20 mb-4" />

        <div className="text-center">
          <h2 className="text-xl font-semibold">Verification</h2>
          <p className="text-gray-600 text-sm">
            Please enter the code we sent to <span className="font-medium">jo*****123@gmail.com</span>
          </p>
        </div>
        <div className="flex space-x-2">
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
        <p className="text-gray-600 text-sm">
          If you don't receive a code! <button className="text-red-500 hover:underline focus:outline-none">Resend</button>
        </p>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          Verify
        </button>
      </section>
    </div>
  );
};

export default VerificationCodeInputUI;