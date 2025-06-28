import React from "react";
import { Link } from '@inertiajs/react';

const MiAmoreWelcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl transition-transform duration-300 ease-in-out">
        
       
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
         
          <div>
             <div className="flex items-center mb-8">
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-10 w-10 mr-3" />
          </div>
            <h2 className="text-2xl font-semibold text-[#8cb662] mb-2">Get Started</h2>
            <p className="text-sm text-gray-600 mb-6">Sign up to join or log in to continue.</p>
          </div>

          
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

         
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
          <Link
            href={route('SignInCard')}
            className="bg-white text-green-600 font-semibold py-1.5 px-3 rounded-lg border border-[#8CB662] hover:bg-[#8CB662] hover:text-white transition transform hover:scale-105 text-center"
          >
            Sign In
          </Link>

          <Link
            href={route('SignUpForm')}
            className="bg-white text-green-600 font-semibold py-1.5 px-3 rounded-lg border border-[#8CB662] hover:bg-[#8CB662] hover:text-white transition transform hover:scale-105 text-center ml-0 sm:ml-2"
          >
            Sign Up
          </Link>
        </div>
                </div>

        
        <div className="bg-[#8CB662] text-white p-8 md:w-1/2 flex flex-col justify-center items-center text-center">
         <div className="bg-white rounded-full shadow-md flex items-center justify-center w-40 h-40">
          <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-full w-full object-contain p-2" />
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
