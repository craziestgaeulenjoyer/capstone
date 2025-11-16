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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center font-inter">
      <Head title="Email Verified" />
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md">
        <h1 className="text-2xl font-bold text-[#8CB662] mb-4">
          ✅ Verification Successful!
        </h1>
        <p className="text-gray-700 mb-4">
          Your email has been verified successfully.
        </p>
        <p className="text-gray-500 italic">
          This window will close automatically in a few seconds.
        </p>
      </div>
    </div>
  );
}
