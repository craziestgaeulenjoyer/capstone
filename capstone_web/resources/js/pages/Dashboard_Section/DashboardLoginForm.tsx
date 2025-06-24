import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
       
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8"> 
           
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
        
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-10 w-10" /> 
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">Login to continue</h2> 
          <p className="text-gray-600 text-lg mb-10 leading-relaxed"> 
            Enter your credentials to manage and monitor Mi Amore Café operations.
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:border-transparent" 
                placeholder="example@gmail.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:border-transparent pr-10" 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.772 7.173A3.5 3.5 0 0012 15a3.5 3.5 0 00-3.5 3.5c0 1.282.684 2.404 1.705 3.018M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 text-[#8CB662] focus:ring-[#8CB662] border-gray-300 rounded" 
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                  Remember me?
                </label>
              </div>
              <Link href="/forgot-password" className="text-[#8CB662] hover:underline"> {/* Link color updated */}
                Forgot password?
              </Link>
            </div>

         
            <Link href="/dashboard" className="w-full">
              <button
                type="button"
                className="w-full px-8 py-3 bg-white text-[#4A6030] rounded-full
                           border border-[#8CB662] shadow-sm
                           hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2
                           focus:ring-[#8CB662] focus:ring-opacity-75 transition duration-300 ease-in-out
                           transform hover:scale-105"
              >
                Login
              </button>
            </Link>
          </form>
        </div>

       
        <div className="w-1/2 bg-[#8CB662] p-10 flex flex-col items-center justify-center text-white text-center rounded-r-xl">
          <div className="mb-8">
            <img src="/images/Computer login-bro.png" alt="Login Illustration" className="max-w-full h-auto drop-shadow-lg" /> {/* Illustration src updated, added shadow */}
          </div>
         
          <h1 className="text-4xl font-extrabold mb-3 leading-tight">Welcome to Mi Amore Café</h1>
          <p className="text-2xl font-light opacity-90">Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;