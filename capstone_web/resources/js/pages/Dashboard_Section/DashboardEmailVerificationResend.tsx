import React, { useState } from 'react';
import axiosClient from '../../axiosClient';
import { Link, usePage } from '@inertiajs/react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

type CustomPageProps = Record<string, any> & {
  auth?: {
    user?: AuthUser;
  };
};

function DashboardEmailVerificationResend() {
  const { props } = usePage<CustomPageProps>();
  const user = props?.auth?.user as AuthUser | undefined;
  const email = user?.email || '';
  const role = user?.role || '';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleResend = async () => {
    if (!email) {
      setMessage('No email found for the logged-in user.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setStatus('');

    try {
      const endpoint = role === 'super_admin' ? '/superadmin/email/resend' : '/admin/email/resend';
      const response = await axiosClient.post(`/api${endpoint}`, { email });

      setMessage(response.data.message || 'Verification email resent successfully!');
      setStatus('success');
    } catch (err: any) {
      console.error('Error resending verification email:', err);

      const msg =
        err?.response?.data?.message ||
        'Failed to resend verification email. Please try again.';
      setMessage(msg);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-xl w-full p-6 sm:p-10 text-center flex flex-col items-center">
        
        {/* Back Button - Responsive alignment */}
        <div className="self-start mb-6 sm:mb-8">
          <Link href="/" className="text-[#8CB662] hover:text-[#b3f075] transition-colors inline-block p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* Illustration - Responsive sizing */}
        <div className="mb-4 sm:mb-6">
          <img 
            src="/images/Emails-amico.png" 
            alt="Email Verification" 
            className="w-full max-w-[180px] sm:max-w-[240px] h-auto drop-shadow-lg" 
          />
        </div>

        {/* Title & Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
          Please verify your email address
        </h2>
        <p className="text-gray-600 text-sm sm:text-md mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
          You're almost there! We sent an email to <br className="block sm:hidden" />
          <span className="font-bold text-[#6eb12c] break-all">{email || 'your email'}</span>.
          <br className="hidden sm:block" />
          <span className="block mt-2">Please check your inbox (and spam folder!) for the verification link.</span>
        </p>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={loading}
          className={`w-full sm:max-w-[280px] px-8 py-3.5 rounded-full border border-[#8CB662] font-bold shadow-sm transition-all duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:ring-opacity-75 ${
            loading 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'bg-white text-[#8CB662] hover:bg-[#8CB662] hover:text-white hover:shadow-md'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resending...
            </span>
          ) : 'Resend email'}
        </button>

        {message && (
          <div className={`mt-6 p-3 rounded-lg w-full text-sm font-medium ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-100' 
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardEmailVerificationResend;