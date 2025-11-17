import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { Link, useForm } from '@inertiajs/react';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </span>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

function SignUpForm() {
  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('signup.store'), {
      onSuccess: () => {
        setShowModal(true);
        reset();
      },
    });
  };

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');`}
      </style>

      <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4 py-8">
        <motion.div
          className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* LEFT FORM SIDE */}
          <div className="w-full md:w-1/2 px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="text-[#8CB662] hover:text-[#b6f577]">
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
              <img src="/images/MiAmore2.png" alt="logo" className="h-15 object-contain" />
            </div>

            <h2 className="text-3xl font-bold text-[#8CB662] mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 mb-6">
              New here? Sign up and start your Mi Amore journey!
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="mb-4 flex gap-4">
                <div className="w-full">
                  <label className="block text-sm text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={data.first_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('first_name', e.target.value)}
                    placeholder="First Name"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={data.last_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('last_name', e.target.value)}
                    placeholder="Last Name"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Passwords using PasswordInput component */}
              <PasswordInput
                label="Password"
                value={data.password}
                onChange={(val) => setData('password', val)}
                placeholder="Enter password"
                error={errors.password}
              />

              <PasswordInput
                label="Confirm Password"
                value={data.password_confirmation}
                onChange={(val) => setData('password_confirmation', val)}
                placeholder="Confirm password"
                error={errors.password_confirmation}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full block bg-[#8CB662] hover:bg-[#7aa44f] text-white font-bold py-2 rounded-md text-center transition duration-200"
              >
                {processing ? 'Signing Up...' : 'SIGN UP'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col text-gray-700 sm:flex-row gap-3">
              <button className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition">
                <FcGoogle className="text-xl mr-2" /> Log in with Google
              </button>
              <button className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition">
                <FaFacebookF className="text-blue-600 text-lg mr-2" /> Sign in with Facebook
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/signincard" className="text-[#8CB662] hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 bg-[#8CB662] flex flex-col justify-center items-center text-center px-8 py-10">
            <p
              className="text-white text-xl font-medium leading-relaxed mb-6"
              style={{ fontFamily: "'Indie Flower', cursive" }}
            >
              Discover the taste of love at Mi Amore Café<br />
              where every sip tells a story.
            </p>
            <img
              src="images/Coffee shop-bro.png"
              alt="Cafe Illustration"
              className="w-full max-w-sm object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully. Please verify your email to continue.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#8CB662] text-white px-6 py-2 rounded-md hover:bg-[#7aa44f] transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SignUpForm;
