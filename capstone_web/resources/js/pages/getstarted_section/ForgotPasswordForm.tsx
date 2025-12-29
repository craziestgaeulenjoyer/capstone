import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleSendCode = async () => {
    setProcessing(true);
    setErrors({});
    try {
      await axios.post('/api/customer/forgot-password', { email });

      // Store email for next steps
      localStorage.setItem('reset_email', email);
      window.location.href = '/verificationcode';
    } catch (err: any) {
      setErrors(err.response?.data || {});
      alert(err.response?.data?.message || "Failed to send code");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-500 hover:text-gray-700 text-sm"
  >
    ← Back
  </button>
</div>
        <div className="mb-6 mt-5 flex justify-center">
          <img src="/images/Forgot password-bro.png" className="w-50 h-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-[#8CB662] mb-2 text-center">Forgot password</h2>
        <p className="text-gray-600 mb-6 text-sm text-center px-2">
          Enter your email and we will send a 4-digit verification code.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow"
              placeholder="example@gmail.com"
            />
          </div>
          <button
            type="button"
            onClick={handleSendCode}
            disabled={processing}
            className="w-full mt-2 bg-white text-[#8CB662] border border-[#8CB662] font-bold py-2.5 rounded-lg hover:bg-[#8CB662] hover:text-white"
          >
            {processing ? "Sending..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
