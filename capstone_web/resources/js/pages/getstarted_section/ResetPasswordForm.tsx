import React, { useState } from 'react';

const ResetPasswordForm = () => {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col">
        {/* Back Button */}
        <button onClick={() => console.log('Back clicked')} className="absolute top-4 left-4 focus:outline-none text-cyan-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Logo (Placeholder) */}
        <div className="absolute top-4 right-4 text-green-500 text-xl font-bold">m.</div>

        {/* Reset Password Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Reset Password</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          Set the new password to your account so you can login and access all the features.
        </p>

        {/* New Password Input */}
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={newPasswordVisible ? 'text' : 'password'}
              id="new-password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {newPasswordVisible ? (
                  <path
                    fillRule="evenodd"
                    d="M10 12a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path d="M10 12s-1-5.5-9-5.5c.167 1.277 1.032 2.417 2.666 3.44C8.76 14.588 9.996 12.278 10 12zm0 0V8a5 5 0 10-2.163 9.44c.182.318.405.602.67.846 1.646-1.023 2.975-2.279 3.299-3.467l.005-.003zm0 0V8a5 5 0 102.163 9.44c-.182.318-.405.602-.67.846-1.646-1.023-2.975-2.279-3.299-3.467l-.005-.003z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirm-password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {confirmPasswordVisible ? (
                  <path
                    fillRule="evenodd"
                    d="M10 12a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path d="M10 12s-1-5.5-9-5.5c.167 1.277 1.032 2.417 2.666 3.44C8.76 14.588 9.996 12.278 10 12zm0 0V8a5 5 0 10-2.163 9.44c.182.318.405.602.67.846 1.646-1.023 2.975-2.279 3.299-3.467l.005-.003zm0 0V8a5 5 0 102.163 9.44c-.182.318-.405.602-.67.846-1.646-1.023-2.975-2.279-3.299-3.467l-.005-.003z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Reset Password Button */}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={() => console.log('Reset Password clicked')}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;