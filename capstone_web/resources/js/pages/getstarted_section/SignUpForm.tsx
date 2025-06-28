import React from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from "@inertiajs/react";

function SignUpForm() {
  return (
    <div className="flex justify-center items-center w-full h-[100vh] bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] px-4
">
      <motion.div
        className="backdrop-blur-md bg-white/90 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden w-full max-w-3xl flex flex-col md:flex-row"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
  
        <div className="md:w-2/3 w-full p-6">
         <h2 className="text-3xl font-bold text-[#8CB662] mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-4">Join us and start your MI Amore journey today.</p>
          <form>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="firstName" className="block text-gray-700 text-sm mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                required
                className="border border-gray-300 rounded-xl w-full py-2 px-3 focus:ring-2 focus:ring-[#8CB662] focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="block text-gray-700 text-sm mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                required
                className="border border-gray-300 rounded-xl w-full py-2 px-3 focus:ring-2 focus:ring-[#8CB662] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              className="border border-gray-300 rounded-xl w-full py-2 px-3 focus:ring-2 focus:ring-[#8CB662] focus:outline-none"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              required
              className="border border-gray-300 rounded-xl w-full py-2 px-3 focus:ring-2 focus:ring-[#8CB662] focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="border border-gray-300 rounded-xl w-full py-2 px-3 focus:ring-2 focus:ring-[#8CB662] focus:outline-none"
              placeholder="Confirm password"
            />
          </div>

                  <Link
          href={route('AccountVerification')} 
          className="w-full block text-center py-3 bg-[#8CB662] hover:bg-[#7da954] text-white font-semibold rounded-xl transition transform hover:scale-105"
        >
          Create Account
        </Link>
                </form>


          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-red-50 hover:border-red-400 transition">
              <FcGoogle className="text-red-500" /> Google
               </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-blue-50 hover:border-blue-400 transition">
              <FaFacebookF className="text-blue-600" /> Facebook
               </button>
          </div>
        </div>

        
        <motion.div
          className="bg-[#8CB662] text-white md:w-1/3 w-full flex flex-col justify-center items-center p-6 text-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Welcome to MI Amore Café
          </h3>
          <p className="text-sm leading-relaxed">
            Discover the taste of love where every sip tells a story.
            Join a community of coffee lovers just like you.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignUpForm;
