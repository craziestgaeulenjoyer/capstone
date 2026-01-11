import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaArrowLeft, FaRegEnvelopeOpen } from 'react-icons/fa';

const VerificationCode = () => {
    const inputRefs = [
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)
    ];
    
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const email = localStorage.getItem("reset_email");

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            
            if (value && index < 5) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }

        if (!email) {
            setError("Email session expired. Please go back.");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            await axios.post("/api/customer/verify-code", { 
                email, 
                otp_code: fullCode 
            });
            window.location.href = "/resetpasswordform";
        } catch (err: any) {
            setError(err.response?.data?.message || "The code you entered is incorrect.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await axios.post("/api/customer/resend-code", { email });
            alert("A new premium security code has been sent to your email.");
            setCode(["", "", "", "", "", ""]);
            inputRefs[0].current?.focus();
        } catch {
            setError("Failed to resend code. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#8A9A84] px-4 py-8 relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
            
            <div className="absolute top-[-10%] right-[-10%] w-72 h-72 md:w-96 md:h-96 bg-[#C5A059]/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 md:w-96 md:h-96 bg-[#4A5D45]/20 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-[#FAF9F6] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-[#C5A059]/20 overflow-hidden relative z-10"
            >
                <div className="px-6 py-10 md:px-12 md:py-14">
                    
                    <div className="flex justify-between items-center mb-10">
                        <button 
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-[#4A5D45]/60 hover:text-[#4A5D45] transition-all"
                        >
                            <div className="p-2 rounded-full border border-[#4A5D45]/10 group-hover:bg-white transition-all shadow-sm">
                                <FaArrowLeft className="h-3 w-3" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Go Back</span>
                        </button>
                        <img src="/images/MiAmore2.png" alt="Logo" className="h-7 md:h-8 w-auto brightness-0 opacity-60" />
                    </div>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A5D45]/5 text-[#C5A059] mb-6">
                            <FaRegEnvelopeOpen size={28} />
                        </div>
                        <h2 className="text-[#3d230d] text-3xl md:text-4xl font-serif italic mb-3">Security Check</h2>
                        <p className="text-[#4A5D45]/60 text-[10px] md:text-[11px] leading-relaxed uppercase tracking-[0.2em] font-medium max-w-xs mx-auto">
                            Please enter the <span className="text-[#C5A059] font-bold">6-digit code</span> sent to your email address to continue.
                        </p>
                    </div>

                    <div className="grid grid-cols-6 gap-2 md:gap-4 mb-8">
                        {code.map((_, i) => (
                            <input
                                key={i}
                                ref={inputRefs[i]}
                                type="text"
                                maxLength={1}
                                value={code[i]}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onChange={(e) => handleChange(e.target.value, i)}
                                className="w-full aspect-square md:h-16 rounded-xl border border-[#4A5D45]/10 bg-white text-center text-xl md:text-2xl font-bold text-[#3d230d] focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all outline-none shadow-inner"
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] mb-6 text-center font-bold italic uppercase tracking-wider">
                            {error}
                        </motion.p>
                    )}

                    <div className="space-y-6">
                        <button
                            onClick={handleVerifyCode}
                            disabled={loading}
                            className="w-full bg-[#4A5D45] text-[#FAF9F6] font-bold py-5 rounded-2xl shadow-xl hover:bg-[#3d4b38] hover:shadow-[0_10px_20px_rgba(74,93,69,0.3)] transition-all duration-300 active:scale-95 text-[12px] uppercase tracking-[0.3em] font-serif disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify & Proceed"}
                        </button>

                        <div className="text-center">
                            <p className="text-[10px] text-[#4A5D45]/50 uppercase tracking-widest font-bold">
                                Didn't receive the code?{" "}
                                <button 
                                    onClick={handleResend} 
                                    className="text-[#C5A059] hover:text-[#3d230d] transition-colors underline underline-offset-4 ml-1"
                                >
                                    Resend Code
                                </button>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-[9px] text-[#4A5D45]/40 mt-12 uppercase tracking-[0.4em] font-medium leading-relaxed">
                        Mi Amore Café &bull; Authentic Coffee Experience
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default VerificationCode;