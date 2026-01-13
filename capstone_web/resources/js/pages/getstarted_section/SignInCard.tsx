
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, router } from "@inertiajs/react";

const CoffeeLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#8A9A84]/95 backdrop-blur-md"
  >
    <div className="relative scale-125">
      <div className="flex gap-2 mb-2 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20], 
              opacity: [0, 1, 0],
              scale: [1, 1.2] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeOut" 
            }}
            className="w-1.5 h-6 bg-[#FAF9F6] rounded-full blur-[1px]"
          />
        ))}
      </div>
      
      <div className="relative w-20 h-16 bg-[#FAF9F6] rounded-b-2xl border-t-4 border-[#C5A059] shadow-xl">
        <div className="absolute -right-4 top-2 w-6 h-8 border-4 border-[#FAF9F6] rounded-r-full" />
      </div>
    </div>
    
    <motion.p 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="mt-12 text-[#FAF9F6] font-serif italic tracking-[0.2em] text-sm uppercase"
    >
      Brewing your experience...
    </motion.p>
  </motion.div>
);

const SignInCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setProcessing(true);
  setErrors({});

  console.log("🔐 Attempting login with:", {
    email,
    rememberMe,
  });

  try {
    const response = await axios.post("/customer/login", {
      email,
      password,
      remember_me: rememberMe,
    });

    console.log("✅ Login successful");
    console.log("📦 Full response:", response);
    console.log("📦 Response data:", response.data);

   if (response.data?.customer) {
  console.log("👤 Logged in customer:", response.data.customer);
} else {
  console.log("⚠️ Login succeeded but customer data missing");
}


   router.visit("/home", {
  replace: true,
  preserveScroll: true,
});


  } catch (error: any) {
    console.error("❌ Login failed");

    if (error.response) {
      console.error("📛 Error data:", error.response.data);
      console.error("📛 Status:", error.response.status);
    } else {
      console.error("📛 Unknown error:", error);
    }

    setProcessing(false);
    setErrors(
      error.response?.data?.errors || {
        general: "Login failed",
      }
    );
  }
};


  return (
    <>
      <AnimatePresence>
        {processing && <CoffeeLoader />}
      </AnimatePresence>

      <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
        
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#4A5D45]/20 blur-[120px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
        >
          <div className="px-8 py-12 md:px-14">
            <div className="flex justify-between items-center mb-10">
              <Link href="/" className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45] transition-all">
                <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Return</span>
              </Link>
              <img src="/images/MiAmore2.png" alt="Logo" className="h-10 w-auto brightness-0 opacity-70" />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-[#3d230d] text-4xl font-serif italic mb-2">Welcome Back</h2>
              <p className="text-[#4A5D45]/50 text-[10px] uppercase tracking-[0.5em] font-bold">Authenticating Member</p>
            </div>

            {errors.general && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs text-center font-bold">
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-4 text-sm text-[#3d230d] placeholder-[#4A5D45]/30 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-sm"
                  placeholder="name@email.com"
                  required
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1 font-bold italic">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] ml-1">Password</label>
                  <Link 
                    href="/forgotpasswordform" 
                    className="text-[9px] uppercase tracking-tighter font-bold text-[#C5A059] hover:underline transition-all"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-4 text-sm text-[#3d230d] placeholder-[#4A5D45]/30 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5D45]/30 hover:text-[#4A5D45] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-[10px] mt-1 font-bold italic">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-2 px-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-[#4A5D45]/20 text-[#4A5D45] focus:ring-[#C5A059]/30 transition-all"
                />
                <label htmlFor="remember" className="text-[10px] uppercase tracking-widest font-bold text-[#4A5D45]/60 cursor-pointer">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-[#4A5D45] text-[#FAF9F6] font-bold py-5 rounded-2xl shadow-xl hover:bg-[#3d4b38] transition-all duration-300 active:scale-95 text-[11px] uppercase tracking-[0.3em] mt-4"
              >
                {processing ? 'Crafting Session...' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#4A5D45]/10" /></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em]"><span className="bg-[#FAF9F6] px-4 text-[#4A5D45]/40 font-bold">Partner Login</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-2 border border-[#4A5D45]/10 py-4 rounded-xl hover:bg-white hover:shadow-md transition-all text-[11px] font-bold text-[#4A5D45] uppercase tracking-tighter">
                <FcGoogle size={18} /> Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 border border-[#4A5D45]/10 py-4 rounded-xl hover:bg-white hover:shadow-md transition-all text-[11px] font-bold text-[#4A5D45] uppercase tracking-tighter">
                <FaFacebookF className="text-blue-600" size={16} /> Facebook
              </button>
            </div>

            <p className="text-center text-[10px] text-[#4A5D45]/40 mt-10 uppercase tracking-[0.2em] font-medium">
              New here? <Link href="/signupform" className="text-[#C5A059] font-black underline underline-offset-4 ml-1">REGISTER</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default SignInCard;