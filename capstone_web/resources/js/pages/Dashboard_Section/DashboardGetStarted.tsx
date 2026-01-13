import { Link } from '@inertiajs/react';

function DashboardGetStarted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        
        {/* LEFT SECTION (Admin Access) */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center order-2 lg:order-1">
          <div className="flex items-center mb-5 justify-center lg:justify-start">
            <img src="/images/MiAmore2.png" alt="Mi Amore Cafe Logo" className="h-12 w-12 sm:h-15 sm:w-15 mr-3" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl text-[#8cb662] font-bold mb-3">Admin Access</h2>
            <p className="text-gray-600 text-sm sm:text-md mb-8 leading-relaxed">
              Login as Admin or Super Admin to manage the system.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div
              className="relative w-40 h-40 sm:w-60 h-60 bg-[#EFF5EE] overflow-hidden flex items-center justify-center
                         rounded-tl-[80px] rounded-br-[80px] sm:rounded-tl-[100px] sm:rounded-br-[100px] shadow-lg"
            >
              <img
                src="/images/img2.jpg"
                alt="Product"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            {/* Admin */}
            <Link href="/dashboardloginform?role=admin" className="w-full sm:w-auto sm:min-w-[140px]">
              <button
                type="button"
                className="w-full px-4 py-3 sm:py-2 bg-white text-[#8CB662] rounded-full
                           border border-[#8CB662] shadow-sm font-bold text-sm
                           hover:bg-[#8CB662] hover:text-white transition duration-300 
                           transform hover:scale-105 active:scale-95"
              >
                Admin
              </button>
            </Link>

            {/* Super Admin */}
            <Link 
              href="/dashboardloginform?role=super_admin" 
              method="get" 
              data={{ role: 'super_admin' }} 
              className="w-full sm:w-auto sm:min-w-[140px]"
            >
              <button
                type="button"
                className="w-full px-4 py-3 sm:py-2 bg-white text-[#8CB662] rounded-full
                           border border-[#8CB662] shadow-sm font-bold text-sm
                           hover:bg-[#8CB662] hover:text-white transition duration-300 
                           transform hover:scale-105 active:scale-95"
              >
                Super Admin
              </button>
            </Link>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 bg-[#8CB662] p-8 sm:p-10 flex flex-col items-center justify-center text-white text-center order-1 lg:order-2">
          <div className="mb-6 lg:mb-8">
            <img 
              src="/images/admin-amico.png" 
              alt="Illustration" 
              className="max-w-[150px] sm:max-w-[200px] lg:max-w-[260px] h-auto drop-shadow-lg" 
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "'Kalam', cursive" }} >
            Welcome to Mi Amore Café
          </h1>
          <p className="text-lg sm:text-xl font-light italic opacity-90">Admin Portal</p>
        </div>

      </div>
    </div>
  );
}

export default DashboardGetStarted;