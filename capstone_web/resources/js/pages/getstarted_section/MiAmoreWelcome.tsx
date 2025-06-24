import React from "react";
import { Link } from '@inertiajs/react';

const MiAmoreWelcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl transition-transform duration-300 ease-in-out">
        
        {/* Left Section */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="text-green-500 text-4xl font-bold mb-4">m.</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Get Started</h2>
            <p className="text-sm text-gray-600 mb-6">Sign up to join or log in to continue.</p>
          </div>

          {/* Image */}
           <div
              className="relative w-72 h-72 bg-[#EFF5EE] overflow-hidden flex items-center justify-center
                         rounded-tl-[100px] rounded-br-[100px] shadow-lg ml-10"
            >
              <img
                src="/images/img2.jpg"
                alt="Product with Leaves"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
  <Link
    href={route('SignInCard')}
    className="bg-white text-green-600 font-semibold py-3 px-6 rounded-full border border-[#8CB662] hover:bg-[#8CB662] hover:text-white transition transform hover:scale-105 text-center"
  >
    Sign In
  </Link>

  <Link
    href={route('SignUpForm')}
    className="bg-white text-green-600 font-semibold py-3 px-6 rounded-full border border-green-500 hover:bg-[#8CB662] hover:text-white transition transform hover:scale-105 text-center ml-0 sm:ml-4"
  >
    Sign Up
  </Link>
</div>
        </div>

        {/* Right Section */}
        <div className="bg-[#8CB662] text-white p-8 md:w-1/2 flex flex-col justify-center items-center text-center">
          <div className="bg-white rounded-full p-6 mb-6 shadow-md">
            <div className="text-green-500 text-5xl font-bold relative">
              m.
              <span className="absolute bottom-0 right-10 text-xs">+</span>
            </div>
            <div className="text-green-500 text-xs font-semibold">Mi Amore</div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Welcome</h2>
          <p className="text-sm opacity-90">
            to Mi Amore Café, your cozy corner for coffee and comfort!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiAmoreWelcome;
