import React from "react";
import { Link } from "@inertiajs/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";


const SignInCard = () => {
 

 return (
  
    <section className="min-h-screen from-green-100 to-white flex items-center justify-center px-4 py-12">
     
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">

      
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          
          
          <div className="flex justify-between items-center mb-6">
          
            <Link href="/" className="text-gray-500 hover:text-[#8CB662] transition-colors">
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8CB662]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
           
            <img
              src="/images/MiAmore2.png" 
              alt="Mi Amore Cafe Logo"
              className="h-8 w-auto object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>

         
          <h2 className="text-3xl font-bold text-[#8CB662] mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign in to savor the moments at{" "}
            <span className="text-green-600 font-medium">Mi Amore Café</span>.
          </p>

        
          <div className="mb-4">
            <label className="text-sm block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />
          </div>

         
          <div className="mb-4">
            <label className="text-sm block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />
          </div>

         
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer mb-3 sm:mb-0">
              <input
                type="checkbox"
                className="form-checkbox text-green-600 focus:ring-green-400"
              />
              Remember me
            </label>

          
            <Link
              href="forgotpasswordform" 
              className="text-green-600 hover:text-green-800 transition"
            >
              Forgot password?
            </Link>
          </div>
          
      
          <Link
            href={route('dashboard')} 
            className="block w-full text-center"
          >
            <button
              type="button" 
              className="w-full bg-white text-[#4A6030] border border-[#8CB662] py-2 rounded-full font-bold shadow-sm
              hover:bg-[#8CB662] hover:text-white hover:shadow-md
              transition-all duration-300 transform hover:scale-[1.02]"
            >
              SIGN IN
            </button>
          </Link>

         
          <div className="my-6 text-center text-gray-400 text-sm">or sign in with</div>

       
          <div className="flex flex-col sm:flex-row gap-4">
          
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md
                         hover:bg-gray-50 hover:border-[#8CB662] hover:text-[#4A6030] transition"
            >
              <FaGoogle className="text-red-500" /> Google
            </button>
           
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md
                         hover:bg-gray-50 hover:border-[#8CB662] hover:text-[#4A6030] transition"
            >
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
          </div>

         
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
           
            <Link
              href={route('SignUpForm')} 
              className="font-medium"
            >
              <button
                type="button"
                className="text-green-600 hover:text-green-800 transition py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" // Styling for the button
              >
                Sign Up
              </button>
            </Link>
          </p>
        </div>

       
        <div className="w-full md:w-1/2 bg-[#8CB662]/10 flex flex-col items-center justify-center p-8 md:p-12 text-center font-['Inter']">
  <p className="text-[#4A6030] text-2xl md:text-3xl font-extrabold mb-8 px-6 leading-normal tracking-wide drop-shadow-sm">
    Fall in love with every flavor — <br />
    experience <span className="text-[#8CB662]">Mi Amore Café</span> today!
  </p>
  <div className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 w-full max-w-xs sm:max-w-sm md:max-w-full">
 
    <div className="absolute inset-0 bg-gradient-to-t from-[#8CB662]/30 to-transparent"></div>
    <img
      src="/images/Coffee shop-amico.png" 
      alt="Cafe Illustration"
      className="w-full h-auto object-cover"
    />
  </div>
</div>
      </div>
    </section>
  );
};

export default SignInCard;


