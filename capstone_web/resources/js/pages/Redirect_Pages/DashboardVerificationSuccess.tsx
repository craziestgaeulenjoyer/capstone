import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function DashboardVerificationSuccess() {
  useEffect(() => {
    // Notify the opener window (the login or verification tab)
    if (window.opener) {
      window.opener.postMessage({ type: 'EMAIL_VERIFIED' }, '*');
    }

    // Allow enough time for the opener to catch the event
    const timer = setTimeout(() => {
      window.close();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 font-inter">
      <Head title="Verification Successful" />
      
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center border border-gray-100 transition-all">
        
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-green-50 p-6">
            <svg 
              className="h-16 w-16 text-[#8CB662]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Verification Successful
        </h1>
        
        <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
          Your email address has been successfully verified. You now have full access to the Mi Amore Café Admin Portal.
        </p>

        {/* Closing Status Indicator */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 text-gray-400 text-sm font-medium bg-gray-50 px-5 py-2.5 rounded-full">
            <svg className="animate-spin h-4 w-4 text-[#8CB662]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Window closing automatically...</span>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <img src="/images/MiAmore2.png" alt="Mi Amore Cafe" className="h-10 opacity-60 grayscale hover:grayscale-0 transition-all" />
      </div>
    </div>
  );
}