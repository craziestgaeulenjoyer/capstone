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
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-xl w-full p-10 text-center flex flex-col items-center">
        {/* Back Button */}
        <div className="self-start mb-8">
          <Link href="/" className="text-[#8CB662] hover:text-[#b3f075]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* Illustration */}
        <div className="mb-1">
          <img src="/images/Emails-amico.png" alt="Email Verification Illustration" className="max-w-full h-[200px] drop-shadow-lg" />
        </div>

        {/* Title & Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Please verify your email address</h2>
        <p className="text-gray-600 text-md mb-8 leading-relaxed">
          You're almost there! We sent an email to <span className="font-medium text-[#6eb12c]">{email || 'your email'}</span>.
          <br />
          Please check your inbox (and spam folder!) for the verification link.
        </p>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={loading}
          className={`w-full max-w-[250px] px-8 py-3 rounded-full border border-[#8CB662] font-bold shadow-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:ring-opacity-75 ${
            loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-white text-[#8CB662] hover:bg-[#8CB662] hover:text-white'
          }`}
        >
          {loading ? 'Resending...' : 'Resend email'}
        </button>

        {/* Feedback Message */}
        {message && (
          <p className={`mt-5 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default DashboardEmailVerificationResend;
