import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');`}
      </style>

      <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4 py-8">
        <motion.div
          className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-1/2 px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="text-[#8CB662] hover:text-[#5b9e4b]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <img src="/images/MiAmore2.png" alt="logo" className="h-15 object-contain" />
            </div>

            <h2 className="text-3xl font-bold text-[#8CB662] ">Create Account</h2>
            <p className="text-sm text-gray-500 mb-6">New here? Sign up and start your Mi Amore journey!</p>

            <form>
              <div className="mb-4 flex gap-4">
                <div className="w-full">
                  <label className="block text-sm text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
                <span
                  className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
                <span
                  className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <Link
                href={route('AccountVerification')}
                className="w-full block bg-[#8CB662] hover:bg-[#7aa44f] text-white font-bold py-2 rounded-md text-center transition duration-200"
              >
                SIGN UP
              </Link>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-800">OR</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center  text-gray-700  justify-center w-full border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition">
                <FcGoogle className="text-xl mr-2" /> Log in with Google
              </button>
              <button className="flex items-center  text-gray-700 justify-center w-full border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition">
                <FaFacebookF className="text-blue-600 text-lg mr-2" /> Sign in with Facebook
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link href="/signincard" className="text-[#4a8310] hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>

          <div className="w-full md:w-1/2 bg-[#8CB662] flex flex-col justify-center items-center text-center px-8 py-10">
            <p
              className="text-white text-2xl font-medium leading-relaxed mb-6"
              style={{ fontFamily: "'Indie Flower', cursive" }}
            >
              Discover the taste of love at Mi Amore Café<br />
              where every sip tells a story.
            </p>
            <img
              src="images/Coffee shop-bro.png"
              alt="Cafe Illustration"
              className="w-full max-w-sm object-contain"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SignUpForm;


