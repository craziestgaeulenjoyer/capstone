import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useForm } from '@inertiajs/react';

interface FormData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender?: string;  
  birthday?: string;
  phone_number?: string;
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
          onChange={(e) => onChange(e.target.value)}
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

const SignUpForm: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    gender: '',
    birthday: '',
    phone_number: '',
  });

  // Signup form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  post(route('customer.signup.store'), {
    preserveScroll: true,
    // onSuccess not needed for redirect
  });
};

  return (
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
            <Link href="/signincard" className="text-[#8CB662] hover:text-[#b6f577]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <img src="/images/MiAmore2.png" alt="logo" className="h-15 object-contain" />
          </div>

          <h2 className="text-3xl font-bold text-[#8CB662] mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            New here? Sign up and start your Mi Amore journey!
          </p>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
              />
              {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Optional Fields */}
            <div className="mb-4 flex gap-4">
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={data.phone_number}
                  onChange={(e) => setData('phone_number', e.target.value)}
                  placeholder="Phone number"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
                {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number}</p>}
              </div>
            </div>

            <div className="mb-4 flex gap-4">
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Gender (Optional)</label>
                <select
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Birthday (Optional)</label>
                <input
                  type="date"
                  value={data.birthday}
                  onChange={(e) => setData('birthday', e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#8CB662] focus:border-[#8CB662] focus:outline-none"
                />
                {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday}</p>}
              </div>
            </div>

            {/* Passwords */}
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

            <button
              type="submit"
              disabled={processing}
              className="w-full block bg-[#8CB662] hover:bg-[#7aa44f] text-white font-bold py-2 rounded-md text-center transition duration-200"
            >
              {processing ? 'Signing Up...' : 'SIGN UP'}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-[#8CB662] flex flex-col justify-center items-center text-center px-8 py-10">
          <p className="text-white text-xl font-medium leading-relaxed mb-6" style={{ fontFamily: "'Indie Flower', cursive" }}>
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
  );
};

export default SignUpForm;
