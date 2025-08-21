import React from "react";
import { Link } from '@inertiajs/react';

const MiAmoreWelcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2">
      <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-3xl">

        {/* LEFT SIDE */}
        <div className="md:w-[48%] px-8 py-10 flex flex-col justify-between">

          {/* Header and Text */}
          <div>
            <img src="/images/MiAmore2.png" alt="Mi Amore Logo" className="h-15 w-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#8CB662] mb-1">GET STARTED</h2>
            <p className="text-sm text-[#4A4A4A] mb-5">Sign up to join or log in to continue.</p>
          </div>

          {/* Cup Image */}
          <div className="relative w-full flex justify-center mb-6">
            <div className="w-60 h-60 bg-[#EFF5EE] rounded-tl-[60px] rounded-br-[60px] shadow-md overflow-hidden">
              <img
                src="/images/img2.jpg"
                alt="Mi Amore Cup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              href={route('SignInCard')}
              className="bg-[#8CB662] text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-transform transform hover:scale-105 duration-300"
            >
              Sign In
            </Link>
            <Link
              href={route('SignUpForm')}
              className="bg-white border border-[#8CB662] text-[#8CB662] font-semibold py-2 px-6 rounded-full hover:bg-[#8CB662] hover:text-white transition-transform transform hover:scale-105 duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#8CB662] text-white md:w-[52%] px-6 py-10 flex flex-col justify-center items-center text-center">
          <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center shadow-lg mb-4">
            <img src="/images/MiAmore2.png" alt="Mi Amore Logo" className="w-30 h-30 object-contain" />
          </div>
          <h2 className="text-3xl font-bold mb-1 tracking-wide">W E L C O M E</h2>
          <p
              className="text-white text-lg font-medium leading-relaxed mb-6"
              style={{ fontFamily: "'Indie Flower', cursive" }}
            >
            to Mi Amore Café your cozy corner for coffee and comfort!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiAmoreWelcome;
