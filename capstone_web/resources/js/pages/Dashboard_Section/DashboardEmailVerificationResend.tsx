import React from 'react';
import { Link } from '@inertiajs/react'; 

function DashboardEmailVerificationResend() {
  
  const userEmail = "johndoe@gmail.com"; 

  return (
   
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
   
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-xl w-full p-10 text-center flex flex-col items-center">
        {/* Back Button */}
        <div className="self-start mb-8"> 
          <Link href="/" className="text-gray-500 hover:text-gray-700"> 
            <svg xmlns="" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>


        <div className="mb-1"> 
          <img
            src="/images/Emails-amico.png" 
            alt="Email Verification Illustration"
            className="max-w-full h-[200px] drop-shadow-lg"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-5">Please verify your email address</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed"> 
          You're almost there! We sent an email to <span className="font-medium text-[#8CB662]">{userEmail}</span>. 
          <br />
          Please check your inbox (and spam folder!) for the verification link.
        </p>

       
       <Link
          href="/resend-email-route" 
          className="block w-full max-w-[250px]"
        >
          <button
            type="button"
           className="w-full px-8 py-3 bg-white text-[#4A6030] rounded-full
                     border border-[#8CB662] shadow-sm font-bold
                     hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2
                     focus:ring-[#8CB662] focus:ring-opacity-75 transition duration-300 ease-in-out
                     transform hover:scale-105">
            Resend email
          </button>
        </Link>

       
      
      </div>
    </div>
  );
}

export default DashboardEmailVerificationResend;