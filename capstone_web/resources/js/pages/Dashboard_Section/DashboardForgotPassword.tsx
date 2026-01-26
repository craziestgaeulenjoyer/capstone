import React, { useEffect, useState } from 'react';
import axiosClient from '@/axiosClient';
import { Link, router } from '@inertiajs/react';

type Step = 1 | 2 | 3;

const DashboardForgotPassword = () => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- STEP 1: SEND OTP ---------------- */
  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post('/forgot-password/send-otp', { email });
      setStep(2);
      setSuccess('A 6-digit verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2: VERIFY OTP ---------------- */
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axiosClient.post('/forgot-password/verify-otp', { email, otp });
      setStep(3);
      setSuccess('OTP verified! You can now set a new password.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 3: RESET PASSWORD ---------------- */
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      clearPasswordFields();
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post('/forgot-password/reset', {
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccess('Password reset successfully! Redirecting to login...');
      clearPasswordFields();

      setTimeout(() => router.visit('/dashboardloginform'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed.');
      clearPasswordFields();
    } finally {
      setLoading(false);
    }
  };

  const clearPasswordFields = () => {
    setNewPassword('');
    setConfirmPassword('');
  };

  useEffect(() => {
    if (step === 3) {
      clearPasswordFields();
    }
  }, [step]);

  return (
    // Changed h-screen to min-h-screen for better mobile compatibility
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">

        {/* TOP (Mobile) / RIGHT (Desktop) SECTION */}
        <div className="w-full lg:w-1/2 bg-[#8CB662] p-8 lg:p-10 flex flex-col items-center justify-center text-white text-center order-1 lg:order-2">
          <img 
            src="/images/Computer login-bro.png" 
            className="max-w-[150px] sm:max-w-[200px] lg:max-w-xs mb-4 lg:mb-6 drop-shadow-lg" 
            alt="Forgot Password Illustration"
          />
          <h1 className="text-xl lg:text-2xl font-bold">Mi Amore Café</h1>
          <p className="text-sm lg:text-base italic opacity-90">Admin Portal</p>
        </div>

        {/* BOTTOM (Mobile) / LEFT (Desktop) SECTION */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <Link href="/dashboardloginform" className="text-[#8CB662] hover:text-[#b7f777] text-sm font-semibold transition-colors">
              ← Back to Login
            </Link>
            <img src="/images/MiAmore2.png" className="h-10 lg:h-12" alt="Logo" />
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-[#8CB662] mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600 text-sm lg:text-base mb-6 lg:mb-8">
            {step === 1 && 'Enter your email to receive a verification code.'}
            {step === 2 && 'Enter the 6-digit code sent to your email.'}
            {step === 3 && 'Create your new password.'}
          </p>

          {error && <p className="text-red-500 font-medium text-xs lg:text-sm mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
          {success && <p className="text-green-600 font-medium text-xs lg:text-sm mb-4 bg-green-50 p-2 rounded border border-green-100">{success}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-4 lg:space-y-6">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8CB662] focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition-all transform active:scale-95"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-4 lg:space-y-6">
              <input
                type="text"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md text-center tracking-[0.5em] font-bold focus:ring-2 focus:ring-[#8CB662] focus:outline-none transition-all"
              />
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition-all transform active:scale-95"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-sm text-[#8CB662] hover:underline text-center font-medium"
                  disabled={loading}
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-4 lg:space-y-6">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8CB662] focus:outline-none transition-all"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8CB662] focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition-all transform active:scale-95"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardForgotPassword;