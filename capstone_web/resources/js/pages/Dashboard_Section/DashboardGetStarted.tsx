import { Link } from '@inertiajs/react';

function DashboardGetStarted() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        
        {/* LEFT SECTION */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex items-center mb-5">
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-15 w-15 mr-3" />
          </div>

          <h2 className="text-2xl text-[#8cb662] font-bold mb-3">Admin Access</h2>
          <p className="text-gray-600 text-md mb-10 leading-relaxed">
            Login as Admin or Super Admin to manage the system.
          </p>

          {/* IMAGE */}
          <div className="mb-10 flex justify-center">
            <div
              className="relative w-60 h-60 bg-[#EFF5EE] overflow-hidden flex items-center justify-center
                         rounded-tl-[100px] rounded-br-[100px] shadow-lg"
            >
              <img
                src="/images/img2.jpg"
                alt="Product with Leaves"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center space-x-6">
            {/* Admin */}
            <Link href="/dashboardloginform?role=admin" className="block w-full max-w-[140px]">
              <button
                type="button"
                className="w-full px-4 py-2 bg-white text-[#8CB662] rounded-full
                           border border-[#8CB662] shadow-sm font-bold text-sm
                           hover:bg-[#8CB662] hover:text-white hover:shadow-md 
                           focus:outline-none focus:ring-2 focus:ring-[#8CB662] 
                           focus:ring-opacity-75 transition duration-300 ease-in-out 
                           transform hover:scale-105"
              >
                Admin
              </button>
            </Link>

            {/* Super Admin */}
            <Link href="/dashboardloginform?role=super_admin" method="get" data={{ role: 'super_admin' }} className="block w-full max-w-[140px]">
              <button
                type="button"
                className="w-full px-4 py-2 bg-white text-[#8CB662] rounded-full
                           border border-[#8CB662] shadow-sm font-bold text-sm
                           hover:bg-[#8CB662] hover:text-white hover:shadow-md 
                           focus:outline-none focus:ring-2 focus:ring-[#8CB662] 
                           focus:ring-opacity-75 transition duration-300 ease-in-out 
                           transform hover:scale-105"
              >
                Super Admin
              </button>
            </Link>
          </div>
        </div>
        
        {/* RIGHT SECTION */}
        <div className="w-1/2 bg-[#8CB662] p-10 flex flex-col items-center justify-center text-white text-center rounded-r-xl">
          <div className="mb-8">
            <img src="/images/admin-amico.png" alt="Admin Portal Illustration" className="max-w-65 h-auto drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "'Kalam', cursive" }} >Welcome to Mi Amore Café</h1>
          <p className="text-xl font-light italic opacity-90" >Admin Portal</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardGetStarted;
