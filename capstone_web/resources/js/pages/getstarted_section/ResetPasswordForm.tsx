import React, { useState } from 'react';
import axios from "axios";

const ResetPasswordForm = () => {
  const email = localStorage.getItem("reset_email") || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      await axios.post('/api/customer/reset-password', {
        email,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      alert("Password reset successfully");
      window.location.href = "/login";
    } catch (error: any) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else if (error.response?.data?.message) setErrors({ general: error.response.data.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 px-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-500 hover:text-gray-700 text-sm"
  >
    ← Back
  </button>
</div>
        <h2 className="text-2xl font-semibold text-[#8CB662] mb-2 mt-8 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
          <button
            type="submit"
            disabled={processing}
            className="w-full block text-center bg-[#8CB662] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition"
          >
            {processing ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
