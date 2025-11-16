import React, { useState } from 'react';
import axios from 'axios';

// Define the types for the form data
interface FormData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  branch: string;
}

// Define the props for each component
interface AdminAccountTableProps {
  onEditClick: () => void;
}

interface Step1FormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
  isValid: boolean;
}

interface Step2FormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBack: () => void;
  onNext: () => void;
  isValid: boolean;
}

interface Step3FormProps {
  formData: FormData;
  onBack: () => void;
  onSubmit: () => void;
}

interface Step4FormProps {
  formData: FormData;
  onBack: () => void;
  onSubmit: (otp: string) => void;
}

// Admin Account Table component
const AdminAccountTable = ({ onEditClick }: AdminAccountTableProps) => {
  const [admins, setAdmins] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in as Super Admin first');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/superadmin/admins', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // assuming the API returns an array of admins/superadmins
        setAdmins(response.data.data || []);
      } catch (error: any) {
        console.error('Failed to fetch admins:', error.response?.data || error);
        alert(
          error.response?.status === 401
            ? 'Unauthorized. Please log in as Super Admin.'
            : 'Something went wrong while fetching admins.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Account</h2>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 mb-8 border border-gray-300 rounded-lg p-2 shadow-sm">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Filter search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Last Active</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">No admins found</td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-all duration-150">
                  <td className="px-6 py-3 text-gray-800">{admin.name}</td>
                  <td className="px-6 py-3 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-3 text-gray-600 capitalize">{admin.role}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {admin.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{admin.branch || 'N/A'}</td>
                  <td className="px-6 py-3 text-gray-500">{admin.last_active || '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={onEditClick}
                      className="text-[#8cb662] hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Form components remain the same
const Step1Form = ({ formData, handleChange, onNext, isValid }: Step1FormProps) => (
  <>
    {/* Progress bar for step 1 */}
    <div className="h-2 bg-gray-200 rounded-full mb-2">
      <div className="h-full bg-[#8cb662] rounded-full w-1/4"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">25%</p>

    {/* Main heading and subheading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
    <p className="text-gray-500 mb-8">Provide the required information to complete the setup.</p>

    {/* Form fields */}
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 pl-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a7.5 7.5 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21.75a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full px-4 py-2 pl-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full px-4 py-2 pl-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex justify-end space-x-4 mt-12">
      <button className="px-6 py-2 text-gray-500 font-semibold rounded-lg hover:text-gray-700 transition-all duration-200">
        Cancel
      </button>
      <button onClick={onNext} className="bg-[#8cb662] text-white px-8 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-[#78a252] focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isValid}>
        Next
      </button>
    </div>
  </>
);

const Step2Form = ({ formData, handleChange, onBack, onNext, isValid }: Step2FormProps) => (
  <>
    {/* Progress bar for step 2 */}
    <div className="h-2 bg-gray-200 rounded-full mb-2">
      <div className="h-full bg-[#8cb662] rounded-full w-2/4"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">50%</p>

    {/* Main heading and subheading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Details</h2>
    <p className="text-gray-500 mb-8">Enter login info and role.</p>

    {/* Form fields */}
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div >
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200 ${
            formData.role ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="" disabled>Roles</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75l-1.583 1.584M18.75 18.75L17.167 17.167M12.75 21l-1.584-1.583M5.25 18.75L6.833 17.167M3 12.75L4.583 1.584M6.75 6.75L5.167 5.167M12.75 3l-1.583 1.584m4.5 4.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200 ${
            formData.branch ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="" disabled>Branch</option>
          <option value="Branch A">Branch A</option>
          <option value="Branch B">Branch B</option>
        </select>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex justify-end space-x-4 mt-12">
      <button onClick={onBack} className="px-6 py-2 text-gray-500 font-semibold rounded-lg hover:text-gray-700 transition-all duration-200">
        Back
      </button>
      <button onClick={onNext} className="bg-[#8cb662] text-white px-8 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-[#78a252] focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isValid}>
        Next
      </button>
    </div>
  </>
);

const Step3Form = ({ formData, onBack, onSubmit }: Step3FormProps) => (
  <>
    {/* Progress bar for step 3 */}
    <div className="h-2 bg-gray-200 rounded-full mb-2">
      <div className="h-full bg-[#8cb662] rounded-full w-3/4"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">75%</p>

    {/* Main heading and subheading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Confirmation</h2>
    <p className="text-gray-500 mb-8">Confirm and finalize your information.</p>

    {/* Summary of information */}
    <div className="bg-gray-50 p-6 rounded-lg space-y-4 shadow-inner">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Full Name</span>
        <span className="text-gray-600">{formData.fullName}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Username</span>
        <span className="text-gray-600">{formData.username}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Email Address</span>
        <span className="text-gray-600">{formData.email}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Role</span>
        <span className="text-gray-600">{formData.role}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Branch</span>
        <span className="text-gray-600">{formData.branch}</span>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex justify-end space-x-4 mt-12">
      <button onClick={onBack} className="px-6 py-2 text-gray-500 font-semibold rounded-lg hover:text-gray-700 transition-all duration-200">
        Back
      </button>
      <button
        onClick={onSubmit}
        className="bg-[#8cb662] text-white px-8 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-[#78a252]"
      >
        Submit
      </button>
    </div>
  </>
);

const Step4Form = ({ formData, onBack, onSubmit }: Step4FormProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);

  // Resend OTP handler with 60s cooldown
  const handleResend = async () => {
    if (!canResend) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as Super Admin first');
        return;
      }

      await axios.post(
        'http://127.0.0.1:8000/api/superadmin/create/request-otp',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCanResend(false);
      setTimer(60);
    } catch (err) {
      console.error(err);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  // Countdown effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!canResend) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canResend]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    onSubmit(otp);
  };

  return (
    <>
      {/* Progress bar for Step 4 */}
      <div className="h-2 bg-gray-200 rounded-full mb-2">
        <div className="h-full bg-[#8cb662] rounded-full w-full"></div>
      </div>
      <p className="text-sm text-gray-500 mb-8 text-right">100%</p>

      {/* New heading & subheading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Validation</h2>
      <p className="text-gray-500 mb-4">For security and validity purposes</p>

      <div className="w-50% h-px bg-gray-300 mb-4"></div>

      {/* Resend OTP */}
      <p className="text-gray-500 text-sm mb-8">
        Didn't receive a code?{' '}
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`text-[#8cb662] font-semibold hover:underline ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
        </button>
      </p>

      {/* OTP Input */}
      <div className="space-y-6">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            // Allow only numbers
            const numericValue = e.target.value.replace(/\D/g, '');
            setOtp(numericValue);
          }}
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-2 text-center text-xl text-gray-900 tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-4 mt-14">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-500 font-semibold rounded-lg hover:text-gray-700 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handleVerify}
          className="bg-[#8cb662] text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-[#78a252] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:ring-offset-2"
        >
          Verify & Create
        </button>
      </div>
    </>
  );
};

// The main App component that contains the entire UI.
const App = () => {
  const [step, setStep] = useState(1);
  const [view, setView] = useState<'onboarding' | 'adminTable' | 'accountSettings'>('onboarding'); // New state for view switching
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    role: '',
    branch: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Handlers for top navigation buttons
  const showOnboarding = () => {
    setView('onboarding');
    setStep(1); // Reset step when returning to onboarding flow
  };
  const showAdminTable = () => setView('adminTable');

  // Validation logic
  const isStep1Valid = formData.fullName !== '' && formData.username !== '' && formData.email !== '';
  const isStep2Valid = formData.role !== '' && formData.branch !== '';

  // Sidebar is only shown for the onboarding flow
  const renderSidebar = () => view === 'onboarding' && (
    <div className="w-1/3 p-8 border-r border-gray-200 flex flex-col justify-start">
      <div className="text-gray-400 font-medium">
        <h3 className="mb-4"></h3>
        {/* Step 1: Basic Information */}
        <div className="flex items-start mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shadow-lg transition-colors duration-300 ${step > 1 ? 'bg-[#8cb662] text-white' : 'bg-[#8cb662] text-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                {step > 1 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                )}
            </svg>
          </div>
          <div>
            <span className="block text-gray-800 font-semibold mb-1">Basic Information</span>
            <p className="text-sm text-gray-500">Provide required information</p>
          </div>
        </div>

        {/* Separator line */}
        <div className="w-px h-12 bg-gray-300 ml-4 mb-6"></div>

        {/* Step 2: Account Details */}
        <div className={`flex items-start mb-6 transition-opacity duration-300 ${step < 2 ? 'opacity-50' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${step > 2 ? 'bg-[#8cb662] text-white' : step === 2 ? 'bg-[#8cb662] text-white shadow-lg' : 'border-2 border-gray-300 text-gray-300'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            {step > 2 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
            </svg>
          </div>
          <div>
            <span className="block text-gray-800 font-semibold mb-1">Account Details</span>
            <p className="text-sm text-gray-500">Complete additional details</p>
          </div>
        </div>

        {/* Separator line */}
        <div className="w-px h-12 bg-gray-300 ml-4 mb-6"></div>
        
        {/* Step 3: Review & Confirmation */}
        <div className={`flex items-start transition-opacity duration-300 ${step < 3 ? 'opacity-50' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${
            step > 3 ? 'bg-[#8cb662] text-white' : step === 3 ? 'bg-[#8cb662] text-white shadow-lg' : 'border-2 border-gray-300 text-gray-300'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              {step > 3 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <div>
            <span className="block text-gray-800 font-semibold mb-1">Review & Confirmation</span>
            <p className="text-sm text-gray-500">Confirm and finalize</p>
          </div>
        </div>

        <div className="w-px h-12 bg-gray-300 ml-4 mb-6"></div>

        {/* Step 4: Security Validation */}
        <div className={`flex items-start transition-opacity duration-300 ${step < 4 ? 'opacity-50' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${
            step === 4 ? 'bg-[#8cb662] text-white shadow-lg' : step > 4 ? 'bg-[#8cb662] text-white' : 'border-2 border-gray-300 text-gray-300'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              {step > 4 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              ) : (
                <>
                  {/* Shield outline */}
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 2L4 5v6c0 5 3.58 9.36 8 11 4.42-1.64 8-6 8-11V5l-8-3z" />
                  {/* Inner line for detail (optional) */}
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4l2 2" />
                </>
              )}
            </svg>
          </div>
          <div>
            <span className="block text-gray-800 font-semibold mb-1">Security Validation</span>
            <p className="text-sm text-gray-500">For security and validity purposes</p>
          </div>
        </div>
        {/* End of sidebar content */}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // Use the stored Bearer token
      if (!token) {
        alert('Please log in as Super Admin first');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/superadmin/create/request-otp',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Submitting OTP request with data:', formData);

      if (response.data.success) setStep(4);
      else alert('OTP request failed.');
    } catch (error: any) {
      console.error('OTP request failed:', error);
      alert(
        error.response?.status === 401
            ? 'Unauthorized. Please log in as Super Admin.'
            : 'Something went wrong while requesting OTP.'
      );
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as Super Admin first');
        return;
      }

      const payload = {
        name: formData.fullName, 
        username: formData.username,
        email: formData.email,
        role: formData.role,
        branch: formData.branch,
        otp,
      };

      console.log('Sending OTP verification payload:', payload);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/superadmin/create/verify-otp',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Account successfully created!');
        setView('adminTable');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error.response?.data || error);
      alert(
        error.response?.status === 401
            ? 'Unauthorized. Please log in as Super Admin.'
            : 'Something went wrong while verifying OTP.'
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (only shows during onboarding) */}
      {renderSidebar()}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top navigation for switching views */}
        <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Teams Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={showOnboarding}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                view === 'onboarding' ? 'bg-[#8cb662] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Add Admin
            </button>
            <button
              onClick={showAdminTable}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                view === 'adminTable' ? 'bg-[#8cb662] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Admin Accounts
            </button>
          </div>
        </div>

        {/* View content area */}
        <div className="p-8">
          {view === 'onboarding' && (
            <>
              {step === 1 && <Step1Form formData={formData} handleChange={handleChange} onNext={handleNext} isValid={isStep1Valid} />}
              {step === 2 && <Step2Form formData={formData} handleChange={handleChange} onBack={handleBack} onNext={handleNext} isValid={isStep2Valid} />}
              {step === 3 && <Step3Form formData={formData} onBack={handleBack} onSubmit={handleNext} />}
              {step === 4 && <Step4Form formData={formData} onBack={handleBack} onSubmit={(otp) => console.log('OTP submitted:', otp)} />}
            </>
          )}

          {view === 'adminTable' && (
            <AdminAccountTable onEditClick={() => console.log('Edit clicked')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

