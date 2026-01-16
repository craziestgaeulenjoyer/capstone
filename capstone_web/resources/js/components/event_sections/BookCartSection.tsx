import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Coffee, Calendar, MapPin, Users, Phone, User } from "lucide-react";
import axios from "axios";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  field: string;
  type?: string;
  value?: string;
  onChange: (field: string, value: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, field, type = "text", value, onChange, error, icon }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="font-bold text-[#5C2E0A] text-[10px] tracking-[0.2em] uppercase ml-1 opacity-70">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8CB662] opacity-60 group-focus-within:opacity-100 transition-opacity">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        className={`w-full bg-transparent border-b border-[#5C2E0A]/20 py-2 pl-7 outline-none focus:border-[#8CB662] transition-all text-[#5C2E0A] placeholder-[#5C2E0A]/30 font-medium ${
          error ? "border-red-400" : ""
        }`}
        placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
      />
    </div>
    {error && <p className="text-red-500 text-[10px] mt-1 italic font-medium uppercase tracking-wider">{error}</p>}
  </div>
);

const BookCartSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    event_type: "",
    event_date: "",
    estimated_pax: "",
    event_location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const submitInquiry = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!/^\d{11}$/.test(form.phone)) newErrors.phone = "Enter valid 11-digit phone number";
    if (!form.event_type.trim()) newErrors.event_type = "Event type is required";
    if (!form.event_date) newErrors.event_date = "Date is required";
    if (!form.estimated_pax || Number(form.estimated_pax) <= 0) newErrors.estimated_pax = "Invalid pax";
    if (!form.event_location.trim()) newErrors.event_location = "Location is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post("/api/eventinquiry", { ...form, estimated_pax: Number(form.estimated_pax) });
      alert("Inquiry sent! We'll reach out soon.");
      closeModal();
      setForm({ name: "", phone: "", event_type: "", event_date: "", estimated_pax: "", event_location: "" });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="bg-[#faf7f2] py-24 px-6 md:px-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            className="relative group order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -inset-4 border border-[#5C2E0A]/10 rounded-[2rem] rotate-2 group-hover:rotate-0 transition-transform duration-700" />
            <video autoPlay loop muted playsInline className="relative z-10 w-full rounded-2xl shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700 aspect-video lg:aspect-square object-cover">
              <source src="/images/MiAmoreVideo1.mp4" type="video/mp4" />
            </video>
          </motion.div>

          <motion.div 
            className="space-y-6 order-1 lg:order-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[#8CB662] font-bold tracking-[0.4em] text-[10px] uppercase">Craftsmanship</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E0A] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Art of <br /><span className="italic text-[#8CB662]/80">Slow Brewing</span>
            </h2>
            <p className="text-[#5C2E0A]/70 text-base md:text-lg leading-relaxed max-w-md font-medium">
              Witness the precision behind every drop. Our artisan process ensures that every cup served at your event is a masterpiece of flavor.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="flex items-center gap-4 bg-[#5C2E0A] text-[#FAF9F6] px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#3d1f07] transition-all tracking-wide"
            >
              Book Now <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            className="space-y-6 order-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[#8CB662] font-bold tracking-[0.4em] text-[10px] uppercase">Mobile Cart</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E0A] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mi Amore <br /><span className="italic text-[#8CB662]/80">On-the-Go</span>
            </h2>
            <p className="text-[#5C2E0A]/70 text-base md:text-lg leading-relaxed max-w-md font-medium">
              We bring the Mi Amore experience straight to your venue—freshly handcrafted drinks and a vintage vibe that elevates any celebration.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="flex items-center gap-4 border-2 border-[#5C2E0A] text-[#5C2E0A] px-8 py-4 rounded-full font-bold hover:bg-[#5C2E0A] hover:text-[#FAF9F6] transition-all tracking-wide"
            >
              Book Now <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          <motion.div 
            className="relative group order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -inset-4 border border-[#5C2E0A]/10 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
            <video autoPlay loop muted playsInline className="relative z-10 w-full rounded-2xl shadow-2xl aspect-video lg:aspect-square object-cover">
              <source src="/images/MiAmoreVideo2.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-[#5C2E0A]/60 backdrop-blur-md flex items-center justify-center z-[999] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#FAF9F6] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative border border-[#5C2E0A]/10"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-[#5C2E0A] p-8 text-center relative">
                <button onClick={closeModal} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <h3 className="text-2xl md:text-3xl font-bold text-[#FAF9F6] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Event Inquiry</h3>
                <p className="text-[#8CB662] text-xs uppercase tracking-[0.3em] font-bold mt-2">Let’s craft your memory</p>
              </div>

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <InputField label="Full Name" placeholder="e.g. Maria Clara" field="name" onChange={handleChange} error={errors.name} icon={<User size={16}/>} />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[#5C2E0A] text-[10px] tracking-[0.2em] uppercase ml-1 opacity-70">Phone Number</label>
                    <div className="relative">
                      <Phone size={11} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8CB662] opacity-60" />
                      <input
                        type="text"
                        className={`w-full bg-transparent border-b border-[#5C2E0A]/20 py-2 pl-7 outline-none focus:border-[#8CB662] transition-all text-[#5C2E0A] ${errors.phone ? "border-red-400" : ""}`}
                        value={form.phone}
                        placeholder="09123456789"
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                          if (!val.startsWith("09") && val.length > 2) val = "09" + val.replace(/^0+/, "");
                          handleChange("phone", val);
                        }}
                      />
                      <span className="absolute right-0 bottom-2 text-[9px] font-mono text-gray-400">{form.phone.length}/11</span>
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] italic mt-1">{errors.phone}</p>}
                  </div>

                  <InputField label="Event Type" placeholder="Wedding, Gala..." field="event_type" onChange={handleChange} error={errors.event_type} icon={<Coffee size={16}/>} />
                  <InputField label="Event Date" field="event_date" type="date" onChange={handleChange} error={errors.event_date} icon={<Calendar size={16}/>} />
                  <InputField label="Estimated Pax" placeholder="No. of guests" field="estimated_pax" type="number" onChange={handleChange} error={errors.estimated_pax} icon={<Users size={16}/>} />
                  <InputField label="Venue Location" placeholder="City or Address" field="event_location" onChange={handleChange} error={errors.event_location} icon={<MapPin size={16}/>} />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#8CB662" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitInquiry}
                  className="w-full bg-[#5C2E0A] text-[#FAF9F6] py-4 rounded-xl font-bold shadow-lg transition-all mt-10 tracking-[0.2em] uppercase text-xs"
                >
                  Submit Inquiry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BookCartSection;