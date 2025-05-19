import React from "react";
import { Link } from "@inertiajs/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const SignInCard = () => {
  return (
    <section className="min-h-screen  from-green-100 to-white flex items-center justify-center px-4 py-12">
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">

        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-500 text-xl hover:text-green-600 transition-colors">&larr;</button>
            <div className="text-green-600 font-bold text-3xl hover:scale-110 transition-transform duration-300">mi.</div>
          </div>

          {/* Sign In Heading */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign in to savor the moments at{" "}
            <span className="text-green-600 font-medium">Mi Amore Café</span>.
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="text-sm block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="text-sm block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between text-sm">
  <label className="flex items-center gap-2 text-gray-600 cursor-pointer mb-3 sm:mb-0">
    <input
      type="checkbox"
      className="form-checkbox text-green-600 focus:ring-green-400"
    />
    Remember me
  </label>

  <a
    href="forgotpasswordform"
    className="text-green-600 hover:text-green-800 transition"
  >
    Forgot password?
  </a>
</div>

          {/* Sign In Link Button */}
          <Link
            href={route('dashboard')} // <-- Replace with your route name
            className="block text-center w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
          >
            SIGN IN
          </Link>

          {/* Divider */}
          <div className="my-6 text-center text-gray-400 text-sm">or sign in with</div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-red-50 hover:border-red-400 transition">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-blue-50 hover:border-blue-400 transition">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
          </div>

          {/* Sign Up Prompt */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              href={route('SignUpForm')} // <-- Replace with your route name
              className="text-green-600 font-medium hover:text-green-800 transition"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-green-50 flex flex-col items-center justify-center p-8 md:p-12">
          <p className="text-green-800 text-xl font-medium text-center mb-6 px-6 leading-relaxed">
            Fall in love with every flavor — <br />
            experience Mi Amore Café today!
          </p>
          <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-3/4">
            <img
              src="/images/Coffee shop-amico.png"
              alt="Cafe Illustration"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInCard;
