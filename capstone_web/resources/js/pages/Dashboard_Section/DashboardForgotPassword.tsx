import React, { useEffect, useState } from 'react';
import axiosClient from '../../axiosClient';
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

      // DO NOT clear OTP here
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
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">

        {/* LEFT */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboardloginform" className="text-[#8CB662] hover:text-[#b7f777]">
              ← Back to Login
            </Link>
            <img src="/images/MiAmore2.png" className="h-12" />
          </div>

          <h2 className="text-2xl font-bold text-[#8CB662] mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600 mb-8">
            {step === 1 && 'Enter your email to receive a verification code.'}
            {step === 2 && 'Enter the 6-digit code sent to your email.'}
            {step === 3 && 'Create your new password.'}
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-6">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-[#8CB662]"
              />
              <button
                className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <input
                type="text"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md text-center tracking-widest focus:ring-[#8CB662]"
              />
              <div className="flex justify-between items-center text-sm">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-sm text-[#8CB662] hover:underline ml-4"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-6">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-[#8CB662]"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                requiredborder-gray-300
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-[#8CB662]"
              />
              <button
                className="w-full py-3 rounded-full border border-[#8CB662] text-[#8CB662] font-bold hover:bg-[#8CB662] hover:text-white transition"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-[#8CB662] p-10 flex flex-col items-center justify-center text-white text-center">
          <img src="/images/Computer login-bro.png" className="max-w-xs mb-6" />
          <h1 className="text-2xl font-bold">Mi Amore Café</h1>
          <p className="italic opacity-90">Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardForgotPassword;
