import React, { useState, useEffect } from 'react';
import axiosClient from '../../axiosClient';
import { Link, router, usePage } from '@inertiajs/react';

interface CustomPageProps {
  role?: 'admin' | 'super_admin';
  [key: string]: any;
}

const DashboardLoginForm = () => {
  const { props } = usePage<CustomPageProps>();
  const roleFromPropsOrQuery =
    props.role ||
    (new URLSearchParams(window.location.search).get('role') as 'admin' | 'super_admin') ||
    'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for email verification from the verification tab
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EMAIL_VERIFIED') {
        const redirectPath = roleFromPropsOrQuery === 'super_admin' ? '/superadmin/' : '/admin/';
        router.visit(redirectPath);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [roleFromPropsOrQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const endpoint = roleFromPropsOrQuery === 'super_admin' ? '/superadmin/login' : '/admin/login';

        // Get CSRF cookie
        await axiosClient.get('/sanctum/csrf-cookie');

        const response = await axiosClient.post(endpoint, { email, password, remember: rememberMe });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        if (!response.data.verified) {
            // Redirect to email verification page
            router.visit(response.data.redirect); // e.g., '/dashboardemailverification'
        } else {
            // Redirect to proper dashboard
            const dashboardPath =
                roleFromPropsOrQuery === 'super_admin' ? '/superadmin/dashboard' : '/admin/dashboard';
            router.visit(dashboardPath);
        }

    } catch (err: any) {
        if (err.response?.status === 401) setError('Invalid credentials. Please try again.');
        else setError('Something went wrong. Please try again later.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* LEFT SECTION: Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboardgetstarted" className="text-[#8CB662] hover:text-[#b7f777]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-15 w-15" />
          </div>

          <h2 className="text-2xl font-bold text-[#8CB662]">Login to continue</h2>
          <p className="text-gray-600 text-md mb-10 leading-relaxed">
            Enter your credentials to manage and monitor Mi Amore Café operations.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:border-transparent bg-white"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#8CB662] focus:border-transparent pr-10 bg-white"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                  Remember me?
                </label>
              </div>
              <Link href="/forgot-password" className="text-[#8CB662] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-white text-[#8CB662] rounded-full border-1 border-[#8CB662] shadow-sm font-bold
                        hover:bg-[#8CB662] hover:text-white hover:shadow-md focus:outline-none focus:ring-2
                        focus:ring-[#8CB662] focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* RIGHT SECTION: Illustration */}
        <div className="w-1/2 bg-[#8CB662] p-10 flex flex-col items-center justify-center text-white text-center rounded-r-xl">
          <div className="mb-8">
            <img src="/images/Computer login-bro.png" alt="Login Illustration" className="max-w-full h-auto drop-shadow-lg" />
          </div>

          <h1 className="text-3xl font-bold mb-3 leading-tight">Welcome to Mi Amore Café</h1>
          <p className="text-2xl font-light italic opacity-90">Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoginForm;
