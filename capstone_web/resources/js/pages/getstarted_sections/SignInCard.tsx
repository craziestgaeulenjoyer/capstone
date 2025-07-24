import { Link } from "@inertiajs/react";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from "react";
import React from "react";

const SignInCard = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');`}
      </style>

      <section className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-10">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="w-full md:w-1/2 px-8 py-10 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="text-[#88c947] hover:text-[#5b9e4b] md:pr-72 transition-colors">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8CB662]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              <img
                src="/images/MiAmore2.png"
                alt="Mi Amore Cafe Logo"
                className="h-15 w-auto object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#8CB662] mb-1">Login</h2>
            <p className="text-sm text-gray-600 mb-6">
              Welcome back! Sign in to savor the moments.
            </p>

            <div className="mb-4">
              <label className="text-sm block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full rounded-md border border-gray-400 px-4 py-2 focus:border-[#a1ec56] focus:ring-2 focus:ring-[#DFF1D6] outline-none transition"
              />
            </div>

            <div className="mb-2">
              <label className="text-sm block mb-1 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full rounded-md border border-gray-400 px-4 py-2 pr-10 focus:border-[#a1ec56] focus:ring-2 focus:ring-[#DFF1D6] outline-none transition"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox text-[#8CB662]" />
                Remember me
              </label>
              <Link href="/forgotpasswordform" className="text-[#4a8310] hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="button"
              className="w-full bg-[#8CB662] text-white font-bold py-2 rounded-full hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              SIGN IN
            </button>

            <div className="text-center text-sm text-gray-500 my-5">OR</div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition"
              >
                <FcGoogle className="text-red-700" />
                <span className="truncate text-gray-800  ">Log in with Google</span>
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition"
              >
                <FaFacebookF className="text-blue-600" />
                <span className="truncate text-gray-800 ">Sign in with Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <Link href={route("SignUpForm")} className="text-[#4a8310] hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="w-full md:w-1/2 bg-[#8CB662] flex flex-col justify-center items-center text-center p-10">
            <p
              className="text-white text-2xl font-medium leading-relaxed mb-6"
              style={{ fontFamily: "'Indie Flower', cursive" }}
            >
              Fall in love with every flavor<br />
              experience Mi Amore Café today!
            </p>
            <img
              src="/images/Coffee shop-amico.png"
              alt="Cafe Illustration"
              className="w-full max-w-md object-contain "
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignInCard;



