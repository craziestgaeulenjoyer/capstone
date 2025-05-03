import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const SignInCard = () => {
  return (
    <section className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="text-gray-500 text-xl hover:text-green-600 transition-colors">&larr;</button>
            <div className="text-green-600 font-bold text-2xl hover:scale-110 transition-transform">mi.</div>
          </div>

          {/* Sign In Heading */}
          <h2 className="text-2xl font-semibold text-blue-800 mb-1">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">
            Welcome back!{" "}
            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors">
              Sign in to savor the moments.
            </span>
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="text-sm block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="text-sm block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Forgot your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 hover:shadow-md transition-all duration-300">
            SIGN IN
          </button>

          {/* Divider */}
          <div className="mt-6 text-center text-gray-400 text-sm">or</div>

          {/* Social Buttons */}
          <div className="flex mt-4 gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
          </div>

          {/* Sign Up Prompt */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right Panel with Image */}
        <div className="w-full md:w-1/2 bg-green-50 flex flex-col items-center justify-center p-8">
          <p className="text-green-800 text-lg font-medium text-center mb-6 px-6 leading-relaxed">
            Fall in love with every flavor — <br /> experience Mi Amore Café today!
          </p>
          <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://i.ibb.co/CsBpWXV/cup-mint.png"
              alt="Cafe Illustration"
              className="rounded-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInCard;
