import React from "react";

const MiAmoreWelcome = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-11/12 max-w-2xl">
            {/* Left Section (Get Started) */}
            <div className="p-8 w-1/2 flex flex-col justify-between">
              <div>
                {/* Logo */}
                <div className="text-green-500 text-3xl font-bold mb-4">m.</div>
                {/* Get Started Text */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">GET STARTED</h2>
                <p className="text-sm text-gray-600 mb-6">Sign up to join or log in to continue.</p>
              </div>
    
              {/* Image Placeholder */}
              <div className="relative rounded-md overflow-hidden shadow-sm mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-white opacity-70"></div>
                <div className="relative p-4 flex justify-center items-center">
                  <img src={""} alt="MI Amore Product" className="h-32 w-32 object-contain rounded-md shadow-inner" />
                  {/* Mint Leaves Images */}
                  <div className="absolute top-0 right-4 transform rotate-12">
                    <img src={""} alt="Mint Leaf" className="w-8 h-8 text-green-300" />
                  </div>
                  <div className="absolute bottom-2 left-2 transform -rotate-6">
                    <img src={""} alt="Mint Leaf" className="w-6 h-6 text-green-200" />
                  </div>
                </div>
              </div>
    
              {/* Buttons */}
              <div className="flex gap-4">
                <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  Sign In
                </button>
                <button className="bg-white hover:bg-gray-100 text-green-500 font-semibold py-3 px-6 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Sign Up
                </button>
              </div>
            </div>
    
            {/* Right Section (Welcome) */}
            <div className="bg-green-400 text-white p-8 w-1/2 flex flex-col justify-center items-center">
              {/* Circular Logo */}
              <div className="bg-white rounded-full p-6 mb-6 shadow-md">
                <div className="text-green-400 text-5xl font-bold relative">
                  m.
                  <span className="absolute bottom-0 right-0 text-xs">+</span>
                </div>
                <div className="text-green-400 text-xs font-semibold text-center">MY AMORE</div>
              </div>
              {/* Welcome Text */}
              <h2 className="text-3xl font-bold text-center mb-4">WELCOME</h2>
              <p className="text-sm text-center opacity-80">
                to MI Amore Café, your cozy corner for coffee and comfort!
              </p>
            </div>
          </div>
        </div>
      );
    }

export default MiAmoreWelcome;
