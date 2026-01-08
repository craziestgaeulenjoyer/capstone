import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import axios from "axios";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  field: string;
  type?: string;
  onChange: (field: string, value: string) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, field, type = "text", onChange, error }) => (
  <div className="flex flex-col gap-1">
    <label className="font-medium text-sm sm:text-base">{label}</label>
    <input
      type={type}
      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none text-sm sm:text-base ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
      onChange={(e) => onChange(field, e.target.value)}
      min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const BookCartSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    event_type: "",
    event_date: "",
    estimated_pax: "",
    event_location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const submitInquiry = async () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    // PHONE VALIDATION
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{11}$/.test(form.phone))
      newErrors.phone = "Phone number must be exactly 11 digits";

    if (!form.event_type.trim()) newErrors.event_type = "Event type is required";

    if (!form.event_date.trim()) newErrors.event_date = "Event date is required";
    else if (new Date(form.event_date) < new Date(new Date().toDateString()))
      newErrors.event_date = "Event date cannot be in the past";

    if (!form.estimated_pax || Number(form.estimated_pax) <= 0)
      newErrors.estimated_pax = "Estimated Pax must be a positive number";

    if (!form.event_location.trim()) newErrors.event_location = "Event location is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post("/api/eventinquiry", {
        ...form,
        estimated_pax: Number(form.estimated_pax),
      });

      alert("Inquiry submitted successfully!");
      setIsModalOpen(false);
      setForm({
        name: "",
        phone: "",
        event_type: "",
        event_date: "",
        estimated_pax: "",
        event_location: "",
      });
      setErrors({});
    } catch (error: any) {
      console.error("ERROR RESPONSE:", error.response?.data);
      alert("Failed to submit inquiry");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 space-y-24 md:space-y-28">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.video
            autoPlay loop muted playsInline
            className="w-full rounded-xl shadow-lg object-cover object-center max-h-[300px] sm:max-h-[360px] md:max-h-[460px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <source src="/images/MiAmoreVideo1.mp4" type="video/mp4" />
          </motion.video>

          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[#8e674a]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              The Art of Coffee Brewing
            </motion.h2>

            <p className="text-gray-700 leading-relaxed max-w-md text-sm sm:text-base">
              See how we craft each cup with care—from grinding the beans to the perfect pour.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={openModal}
              className="flex items-center gap-3 bg-[#8e674a] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-md hover:bg-[#7d5a3f] transition-all text-sm sm:text-base"
            >
              Book Now
              <motion.span whileTap={{ x: 10 }}>
                <ArrowRight size={20} />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            className="space-y-4 sm:space-y-5 order-2 md:order-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[#65b741]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              Mi Amore On-the-Go
            </motion.h2>

            <p className="text-gray-700 leading-relaxed max-w-md text-sm sm:text-base">
              We bring the Mi Amore experience straight to your event—fresh drinks and premium flavors.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={openModal}
              className="flex items-center gap-3 bg-[#65b741] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-md hover:bg-[#56a23a] transition-all text-sm sm:text-base"
            >
              Book Now
              <motion.span whileTap={{ x: 10 }}>
                <ArrowRight size={20} />
              </motion.span>
            </motion.button>
          </motion.div>

          <motion.video
            autoPlay loop muted playsInline
            className="w-full rounded-xl shadow-lg object-cover object-center max-h-[300px] sm:max-h-[360px] md:max-h-[460px] order-1 md:order-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <source src="/images/MiAmoreVideo2.mp4" type="video/mp4" />
          </motion.video>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-3xl rounded-2xl p-6 sm:p-7 md:p-8 shadow-xl relative"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-center text-xl sm:text-2xl font-bold">
                Send Us Your Event Inquiry
              </h2>

              <div className="w-[200px] h-[3px] bg-[#7fb25d] mx-auto mt-2 mb-4"></div>

              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                Let us help make your special day unforgettable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <InputField label="Name" placeholder="Enter your full name" field="name" onChange={handleChange} error={errors.name} />

                {/* CUSTOM PHONE INPUT WITH COUNTER + AUTO PREFIX + MAX 11 */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-sm sm:text-base">Phone Number</label>

                  <input
                    type="text"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none text-sm sm:text-base ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="09XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");

                      // enforce 09 prefix
                      if (!value.startsWith("09")) {
                        value = "09" + value.replace(/^0+/, "");
                      }

                      // restrict to 11 digits max
                      value = value.slice(0, 11);

                      handleChange("phone", value);
                    }}
                  />

                  {/* LIVE COUNTER */}
                  <p className="text-xs text-gray-600 mt-1">
                    {form.phone.length} / 11 digits
                  </p>

                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <InputField label="Type of Event" placeholder="Wedding, Birthday, etc." field="event_type" onChange={handleChange} error={errors.event_type} />
                <InputField label="Date of Event" field="event_date" type="date" onChange={handleChange} error={errors.event_date} />
                <InputField label="Estimated Pax" placeholder="Number of guests" field="estimated_pax" type="number" onChange={handleChange} error={errors.estimated_pax} />
                <InputField label="Event Location" placeholder="Venue or address" field="event_location" onChange={handleChange} error={errors.event_location} />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                onClick={submitInquiry}
                className="w-full bg-[#7fb25d] text-white py-3 rounded-lg font-semibold hover:bg-[#6ea351] transition-all mt-6"
              >
                Submit Inquiry
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookCartSection;
