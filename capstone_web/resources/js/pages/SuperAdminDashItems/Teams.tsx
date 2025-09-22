import React, { useState } from 'react';

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
}

// Admin Account Table component
const AdminAccountTable = ({ onEditClick }: AdminAccountTableProps) => (
  <div className="p-8 w-full">
    {/* Admin Account Table Heading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Account</h2>

    {/* Search and filter bar */}
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
          className="w-full px-4 py-2 pl-10 bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      </button>
    </div>

    {/* The table */}
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
          {/* Placeholder for future data */}
        </tbody>
      </table>
    </div>
  </div>
);

// Account Settings component
const AccountSettings = () => (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h2>
      <p className="text-gray-500 mb-8">Here, you can change your account information and password.</p>
  
      <div className="bg-white rounded-lg p-6 space-y-8">
        {/* Email Address Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Address</h3>
          <p className="text-gray-600">
            Your email address is <span className="font-medium text-[#8cb662]">email@example.com</span>
            <button className="text-[#8cb662] ml-4 hover:underline">Change</button>
          </p>
        </div>
  
        {/* Password Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Password</h3>
          <p className="text-gray-600 mb-4">
            <button className="text-[#8cb662] hover:underline">Hide</button>
          </p>
          <div className="flex space-x-4">
            <input
              type="password"
              placeholder="New password"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
            />
            <input
              type="password"
              placeholder="Current password"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
            />
          </div>
          <p className="text-gray-500 mt-2">
            Can't remember your current password? <button className="text-[#8cb662] hover:underline">Reset your password</button>
          </p>
          <button className="mt-4 px-6 py-2 bg-[#8cb662] text-white rounded-lg shadow-md hover:bg-[#78a252] transition-colors duration-200">
            Save password
          </button>
        </div>
  
        {/* Delete Account Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete account</h3>
          <p className="text-gray-600 mb-2">
            Would you like to delete your account? Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="text-red-500 hover:underline">I want to delete my account</button>
        </div>
      </div>
    </div>
  );

// Form components remain the same
const Step1Form = ({ formData, handleChange, onNext, isValid }: Step1FormProps) => (
  <>
    {/* Progress bar for step 1 */}
    <div className="h-2 bg-gray-200 rounded-full mb-2">
      <div className="h-full bg-[#8cb662] rounded-full w-1/3"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">33%</p>

    {/* Main heading and subheading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
    <p className="text-gray-500 mb-8">Provide the required information to complete the setup.</p>

    {/* Form fields */}
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
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
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
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
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
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
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
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
      <div className="h-full bg-[#8cb662] rounded-full w-2/3"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">66%</p>

    {/* Main heading and subheading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Details</h2>
    <p className="text-gray-500 mb-8">Enter login info and role.</p>

    {/* Form fields */}
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div >
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        >
            <option value="">Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
        </select>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75l-1.583 1.584M18.75 18.75L17.167 17.167M12.75 21l-1.584-1.583M5.25 18.75L6.833 17.167M3 12.75L4.583 1.584M6.75 6.75L5.167 5.167M12.75 3l-1.583 1.584m4.5 4.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-all duration-200"
        >
            <option value="">Branch</option>
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

const Step3Form = ({ formData, onBack }: Step3FormProps) => (
  <>
    {/* Progress bar for step 3 */}
    <div className="h-2 bg-gray-200 rounded-full mb-2">
      <div className="h-full bg-[#8cb662] rounded-full w-full"></div>
    </div>
    <p className="text-sm text-gray-500 mb-8 text-right">100%</p>

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
      <button className="bg-[#8cb662] text-white px-8 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-[#78a252] focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:ring-offset-2">
        Submit
      </button>
    </div>
  </>
);


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
  const showAccountSettings = () => setView('accountSettings');

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
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${step === 3 ? 'bg-[#8cb662] text-white shadow-lg' : 'border-2 border-gray-300 text-gray-300'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="block text-gray-800 font-semibold mb-1">Review & Confirmation</span>
            <p className="text-sm text-gray-500">Confirm and finalize</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">
      {/* Top navigation buttons */}
      <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow">
        <button
          onClick={showOnboarding}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 ${
            view === 'onboarding'
              ? 'bg-[#8cb662] text-white hover:bg-[#78a252] focus:ring-[#8cb662] focus:ring-offset-2'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 focus:ring-offset-2'
          }`}
        >
          Create Account
        </button>
        <button
          onClick={showAdminTable}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 ${
            view === 'adminTable'
              ? 'bg-[#8cb662] text-white hover:bg-[#78a252] focus:ring-[#8cb662] focus:ring-offset-2'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 focus:ring-offset-2'
          }`}
        >
          Admin Account Table
        </button>
      </div>

      {/* Main content container */}
      <div className="bg-white rounded-2xl shadow-xl flex max-w-5xl w-full">
        {/* Left sidebar with progress steps */}
        {renderSidebar()}

        {/* Right content area */}
        {view === 'onboarding' ? (
          <div className="w-2/3 p-8 flex flex-col">
            {step === 1 && <Step1Form formData={formData} handleChange={handleChange} onNext={handleNext} isValid={isStep1Valid} />}
            {step === 2 && <Step2Form formData={formData} handleChange={handleChange} onBack={handleBack} onNext={handleNext} isValid={isStep2Valid} />}
            {step === 3 && <Step3Form formData={formData} onBack={handleBack} />}
          </div>
        ) : view === 'adminTable' ? (
          <div className="w-full">
            <AdminAccountTable onEditClick={showAccountSettings} />
          </div>
        ) : (
          <div className="w-full">
            <AccountSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
