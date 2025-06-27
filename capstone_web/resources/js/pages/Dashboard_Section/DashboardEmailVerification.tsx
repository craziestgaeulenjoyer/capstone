import React from 'react';
import { Link } from '@inertiajs/react'; 
function DashboardEmailVerification() {
 
  const userEmail = "johndoe@gmail.com"; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-xl w-full p-8 text-center flex flex-col items-center">
       
        <div className="self-start mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700"> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

       
        <div className="mb-8">
          <img src="/images/Emails-amico.png" alt="Email Verification Illustration" className="max-w-full h-[300px]" />
        
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verify your email address</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You've entered <span className="font-medium text-green-700">{userEmail}</span> as the email address for your account.
          <br />
          Please verify the email address by clicking button below
        </p>

       
       <Link
        href="/your-verification-route" 
        className="block w-full" 
      >
        <button
          type="button"
          className="px-8 py-3 bg-white text-[#4A6030] rounded-full
                          border border-[#8CB662] shadow-sm font-bold
                          hover:bg-[#8CB662] hover:text-white hover:shadow-md
                          focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:ring-opacity-75
                          transition duration-300 ease-in-out transform hover:scale-105"
        >
          Verify your email
        </button>
      </Link>


      </div>
    </div>
  );
}

export default DashboardEmailVerification;