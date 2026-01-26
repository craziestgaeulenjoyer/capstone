import React, { useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axiosClient from '@/axiosClient';

interface AuthUser {
  id: number;
  name: string; 
  email: string;
  role?: 'admin' | 'super_admin';
}

type CustomPageProps = {
  auth?: {
    user?: AuthUser;
  };
};

function DashboardEmailVerification() {
  const { props } = usePage<CustomPageProps>();
  const user = props?.auth?.user;
  const email = user?.email || '';
  const role = user?.role; // 'admin' or 'super_admin'

  // Automatically send verification email
  useEffect(() => {
    const sendVerification = async () => {
      if (!email) return;
      try {
        const endpoint =
          role === 'super_admin'
            ? '/superadmin/email/resend'
            : '/admin/email/resend';
        await axiosClient.post(endpoint, { email });
        console.log('Verification email sent automatically.');
      } catch (err) {
        console.error('Failed to send verification email:', err);
      }
    };

    sendVerification();

    const listener = (event: MessageEvent) => {
      if (event.data?.type === 'EMAIL_VERIFIED') {
        console.log('Email verified message received');
        if (event.data.role) {
          sessionStorage.setItem("dashboard_role", event.data.role);
        }
        if (event.data.role === 'super_admin') {
          router.visit('/superadmin');
        } else {
          router.visit('/admin');
        }
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [email, role]);

  const handleResend = async () => {
    if (!email) {
      alert('No email found for the logged-in user.');
      return;
    }

    try {
      const endpoint =
        role === 'super_admin'
          ? '/api/superadmin/email/resend'
          : '/api/admin/email/resend';

      await axiosClient.post(endpoint, { email });
      alert('Verification email resent!');
    } catch {
      alert('Failed to resend email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-xl w-full p-8 text-center flex flex-col items-center">
        <div className="self-start mb-8">
          <Link href="/" className="text-[#8CB662] hover:text-[#b5f377]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>

        <img
          src="/images/Emails-amico.png"
          alt="Email Verification Illustration"
          className="max-w-full h-[200px]"
        />

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Verify your email address
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You've entered{' '}
          <span className="font-medium text-[#619e23]">{email}</span>.
          <br />
          Please verify your email by clicking the link sent to your inbox.
        </p>

        <button
          onClick={handleResend}
          className="px-8 py-3 bg-white text-[#8CB662] rounded-full border border-[#8CB662] shadow-sm font-bold
                    hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:ring-opacity-75
                    transition duration-300 ease-in-out transform hover:scale-105"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
}

export default DashboardEmailVerification;
