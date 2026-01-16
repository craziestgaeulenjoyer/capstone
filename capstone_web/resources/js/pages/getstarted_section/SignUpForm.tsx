import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaScroll } from 'react-icons/fa';
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

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3d230d]/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-[#FAF9F6] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-[#C5A059]/30"
        >
          <div className="p-8 md:p-10 max-h-[70vh] overflow-y-auto custom-scrollbar text-[#4A5D45]">
            <div className="flex items-center gap-3 mb-6">
              <FaScroll className="text-[#C5A059] text-2xl" />
              <h3 className="text-[#3d230d] text-2xl font-serif italic">Terms of Service</h3>
            </div>
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="font-bold uppercase tracking-widest text-[10px]">1. The Mi Amore Experience</p>
              <p>By joining, you agree to receive handcrafted updates and exclusive member-only access to our finest blends and pastries.</p>
              <p className="font-bold uppercase tracking-widest text-[10px]">2. Privacy & Beans</p>
              <p>Your data is brewed with care. We never sell your personal information; we only use it to enhance your journey.</p>
              <p className="font-bold uppercase tracking-widest text-[10px]">3. Conduct</p>
              <p>We believe in kindness and mutual respect. Any misuse of our services may result in account suspension.</p>
            </div>
          </div>
          <div className="p-6 bg-[#8A9A84]/10 border-t border-[#C5A059]/10 flex justify-end">
            <button onClick={onClose} className="bg-[#4A5D45] text-[#FAF9F6] px-8 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#3d4b38] transition-colors">
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const CoffeeLoader = ({ isDone }: { isDone: boolean }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#8A9A84]/95 backdrop-blur-md"
  >
    <div className="relative scale-125">
      {!isDone ? (
        <div className="flex gap-2 mb-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ y: [0, -20], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              className="w-1.5 h-6 bg-[#FAF9F6] rounded-full blur-[1px]" />
          ))}
        </div>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-10 left-6 text-[#FAF9F6] text-3xl">✓</motion.div>
      )}
      <div className="relative w-20 h-16 bg-[#FAF9F6] rounded-b-2xl border-t-4 border-[#C5A059] shadow-xl">
        <div className="absolute -right-4 top-2 w-6 h-8 border-4 border-[#FAF9F6] rounded-r-full" />
      </div>
    </div>
    <p className="mt-12 text-[#FAF9F6] font-serif italic tracking-[0.2em] text-sm uppercase">
      {isDone ? "Welcome to the family!" : "Brewing your account..."}
    </p>
  </motion.div>
);

const PasswordInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder: string; error?: string }> = 
({ label, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required
          className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-3 text-sm text-[#3d230d] focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5D45]/30 cursor-pointer hover:text-[#4A5D45]" onClick={() => setShow(!show)}>
          {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </span>
      </div>
      {error && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold italic">{error}</p>}
    </div>
  );
};

const SignUpForm: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    full_name: '', email: '', password: '', password_confirmation: '',
    gender: '', birthday: '', phone_number: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!agreed) return;
    post(route('customer.signup.store'), {
      preserveScroll: true,
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
      
      <AnimatePresence>
       {processing && <CoffeeLoader isDone={false} />}

      </AnimatePresence>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
      >
        <div className="px-8 py-12 md:px-16">
          <div className="flex justify-between items-center mb-10">
            <Link href="/signincard" className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45]">
              <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Return</span>
            </Link>
            <img src="/images/MiAmore2.png" alt="logo" className="h-10 brightness-0 opacity-70" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[#3d230d] text-4xl font-serif italic mb-2">Create Account</h2>
            <p className="text-[#4A5D45]/50 text-[10px] uppercase tracking-[0.5em] font-bold">Start your Mi Amore Journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Full Name</label>
              <input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} placeholder="Juan Dela Cruz" required className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-3 text-sm text-[#3d230d] focus:border-[#C5A059] outline-none shadow-sm" />
              {errors.full_name && <p className="text-red-400 text-[10px] mt-1 italic">{errors.full_name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Email Address</label>
                  <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="example@gmail.com" required className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-3 text-sm text-[#3d230d] focus:border-[#C5A059] outline-none shadow-sm" />
                  {errors.email && <p className="text-red-400 text-[10px] mt-1 italic">{errors.email}</p>}
                </div>
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Phone (Optional)</label>
                 <input
  type="tel"
  value={data.phone_number}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setData("phone_number", value);
  }}
  placeholder="09123456789"
  maxLength={11}
  inputMode="numeric"
  className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-3 text-sm text-[#3d230d] focus:border-[#C5A059] outline-none shadow-sm"
/>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Gender (Optional)</label>
                  <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-3 text-sm text-[#3d230d] focus:border-[#C5A059] outline-none shadow-sm appearance-none">
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
               </div>
               <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#4A5D45] block mb-2 ml-1">Birthday (Optional)</label>
                  <input type="date" value={data.birthday} onChange={(e) => setData('birthday', e.target.value)} className="w-full bg-white border border-[#4A5D45]/10 rounded-xl px-5 py-[10px] text-sm text-[#3d230d] focus:border-[#C5A059] outline-none shadow-sm" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput label="Password" value={data.password} onChange={(val) => setData('password', val)} placeholder="••••••••" error={errors.password} />
              <PasswordInput label="Confirm" value={data.password_confirmation} onChange={(val) => setData('password_confirmation', val)} placeholder="••••••••" error={errors.password_confirmation} />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={() => setAgreed(!agreed)}
                  className="w-4 h-4 rounded border-[#4A5D45]/20 text-[#4A5D45] focus:ring-[#C5A059]/30 transition-all"
                />
                <span className="text-[11px] text-[#4A5D45]/60 font-medium tracking-tight">
                  I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-[#C5A059] font-black hover:underline underline-offset-2">Terms & Conditions</button>
                </span>
              </label>
            </div>

            <button
              type="submit" 
              disabled={processing || !agreed}
              className={`w-full py-5 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 text-[12px] uppercase tracking-[0.3em] mt-2 font-bold
                ${agreed ? 'bg-[#4A5D45] text-[#FAF9F6] hover:bg-[#3d4b38]' : 'bg-[#4A5D45]/20 text-[#4A5D45]/40 cursor-not-allowed'}`}
            >
              {processing ? 'Crafting Account...' : 'Join Mi Amore'}
            </button>
          </form>

          <p className="text-center text-[10px] text-[#4A5D45]/40 mt-8 uppercase tracking-[0.2em]">
            Already a member? <Link href="/signincard" className="text-[#C5A059] font-black underline ml-1">SIGN IN</Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default SignUpForm;
