import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

interface InputFieldProps {
  label: string;
  placeholder: string;
}

const BookCartSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Name" placeholder="Enter your full name" />
                <InputField label="Phone Number" placeholder="09XXXXXXXXX" />
                <InputField label="Type of Event" placeholder="Wedding, Birthday, etc." />
                <InputField label="Date of Event" placeholder="MM/DD/YYYY" />
                <InputField label="Estimated Pax" placeholder="Number of guests" />
                <InputField label="Event Location" placeholder="Venue or address" />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
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

const InputField: React.FC<InputFieldProps> = ({ label, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="font-medium text-sm sm:text-base">{label}</label>
    <input
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none text-sm sm:text-base"
      placeholder={placeholder}
    />
  </div>
);

export default BookCartSection;

