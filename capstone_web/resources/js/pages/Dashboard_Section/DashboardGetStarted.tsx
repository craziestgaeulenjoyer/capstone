import React from 'react';
import { Link } from '@inertiajs/react';

function DashboardGetStarted() {
  return (
   
    <div className="h-screen flex items-center justify-center bg-gray-200 p-6 font-inter">
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex items-center mb-8">
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-15 w-15 mr-3" />
          </div>

          <h2 className="text-2xl text-[#8cb662] font-bold mb-2">Admin Access</h2>
          <p className="text-gray-600 text-md mb-4 leading-relaxed">
            Login as Admin or Super Admin to manage the system.
          </p>

          <div className="mb-10 flex justify-center">
           
            <div
              className="relative w-60 h-60 bg-[#EFF5EE] overflow-hidden flex items-center justify-center
                         rounded-tl-[100px] rounded-br-[100px] shadow-2xl"
            >
              <img
                src="/images/img2.jpg"
                alt="Product with Leaves"
                className="absolute inset-0 w-60 h-60 object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-6">
           
           <Link
            href="/admin-login"
            className="block w-full max-w-[120px]"
          >
            <button
              type="button"
              className="w-full px-3 py-1.5 bg-white text-[#8CB662] rounded-full
                              border-2 border-[#8CB662] shadow-sm font-extrabold text-sm
                              hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2
                              focus:ring-[#8CB662] focus:ring-opacity-75 transition duration-300 ease-in-out
                              transform hover:scale-105"
            >
              Admin
            </button>
          </Link>

          <Link
            href="/super-admin-login"
            className="block w-full max-w-[120px]"
          >
            <button
              type="button"
              className="w-full px-3 py-1.5 bg-white text-[#8CB662] rounded-full
                              border-2 border-[#8CB662] shadow-sm font-extrabold text-sm
                              hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2
                              focus:ring-[#8CB662] focus:ring-opacity-75 transition duration-300 ease-in-out
                              transform hover:scale-105"
            >
              Super Admin
            </button>
          </Link>
          </div>
        </div>
      
        <div className="w-1/2 bg-[#8CB662] p-10 flex flex-col items-center justify-center text-white text-center rounded-r-xl">
          <div className="mb-8">
            <img src="/images/admin-amico.png" alt="Admin Portal Illustration" className="max-w-3xl h-72 drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold italic mb-2 leading-tight">Welcome to Mi Amore Café</h1>
          <p className="text-xl font-light italic opacity-90">Admin Portal</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardGetStarted;