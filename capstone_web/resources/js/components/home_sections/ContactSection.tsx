import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import axios from "axios";

const ContactSection: React.FC = () => {
  type ContactFields = "name" | "email" | "phone" | "message";

  const [formData, setFormData] = useState<Record<ContactFields, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<ContactFields, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Timing-based spam prevention
  const [startTime] = useState(Date.now());

  // INPUT CHANGE HANDLER
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.id as ContactFields;
    let value = e.target.value;

    // SPECIAL LOGIC FOR PHONE FIELD
    if (field === "phone") {
      // Allow only digits
      value = value.replace(/\D/g, "");

      // Auto-prefix "09"
      if (!value.startsWith("09")) {
        value = "09" + value.replace(/^0+/, "");
      }

      // Limit to 11 digits
      value = value.slice(0, 11);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // VALIDATION FUNCTION
  const validate = () => {
    const newErrors: Record<ContactFields, string> = {
      name: "",
      email: "",
      phone: "",
      message: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";
    if (!emailRegex.test(formData.email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (!/^\d{11}$/.test(formData.phone.trim()))
      newErrors.phone = "Phone must be exactly 11 digits.";
    if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters.";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    // Timing spam check
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed < 5) {
      setSuccessMsg("Your submission looks like spam. Please try again.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/contact", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      setSuccessMsg("Your message has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      setSuccessMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="bg-[#daffb3] shadow px-4 py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-stretch">
        
        {/* LEFT SIDE */}
        <motion.div className="md:w-1/2 pl-12 pr-6 flex flex-col justify-center">
          <div className="mb-2">
            <motion.img
              src="/images/coffee-splash.png"
              alt="Coffee splash"
              className="mb-2 w-full max-w-xs"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.4 }}
            />

            <motion.h2
              className="text-3xl font-extrabold mb-4 leading-tight text-left"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <span className="text-[#76B13A]">We’d </span>
              <span className="text-[#B13A3A]">Love </span>
              <span className="text-[#76B13A]">to </span>
              <span className="text-[#76B13A]">Hear </span>
              <span className="text-blue-400">From </span>
              <span className="text-blue-400">You!</span>
            </motion.h2>

            <p className="text-black text-lg mb-6 max-w-md text-left">
              Whether you’re craving a cup, planning a visit, or just want to
              say hello — Mi Amore is here for you.
            </p>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <MdEmail className="text-[#76B13A] text-2xl mt-1" />
              <div>
                <p className="text-lg font-bold text-[#9D7353] mb-1">E-mail</p>
                <p className="text-md font-bold text-[#1b1b1b]">
                  miamore.cml@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-[#76B13A] text-2xl mt-1" />
              <div>
                <p className="text-lg font-bold text-[#9D7353] mb-1">
                  Phone Number
                </p>
                <p className="text-md font-bold text-[#1b1b1b]">
                  +63 917 892 4125
                </p>
              </div>
            </div>
          </div> 
        </motion.div>

        {/* RIGHT SIDE — FORM */}
        <div className="md:w-1/2 pr-12">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-1 border-[#e0fac7] h-full">

            <p className="text-[#41E2DA] uppercase text-sm font-bold mb-2">
              Contact Us
            </p>

            <motion.h2 className="text-3xl font-bold text-[#9D7353] leading-snug mb-6">
              <span className="text-[#76B13A]">Reach</span> & Get in Touch With Us!
            </motion.h2>

            <motion.form onSubmit={handleSubmit} className="space-y-4">
              
              {/* NAME */}
              <div>
                <label className="block text-md font-medium text-black mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white border ${
                    errors.name ? "border-red-500" : "border-gray-400"
                  } shadow-sm rounded-md text-sm text-black`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-md font-medium text-black mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white border ${
                    errors.email ? "border-red-500" : "border-gray-400"
                  } shadow-sm rounded-md text-sm text-black`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* UPDATED PHONE FIELD */}
              <div>
                <label className="block text-md font-medium text-black mb-1">Phone</label>

                <input
                  id="phone"
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white border ${
                    errors.phone ? "border-red-500" : "border-gray-400"
                  } shadow-sm rounded-md text-sm text-black`}
                />

                {/* LIVE COUNTER */}
                <p className="text-xs text-gray-600 mt-1">
                  {formData.phone.length} / 11 digits
                </p>

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-md font-medium text-black mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white border ${
                    errors.message ? "border-red-500" : "border-gray-400"
                  } shadow-sm rounded-md text-sm text-black`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {successMsg && (
                <p
                  className={`font-medium ${
                    successMsg.includes("success")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {successMsg}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-[#8CB662] hover:bg-[#7AB44E] text-white font-semibold text-md rounded-full py-2 px-5 flex items-center transition-all duration-300"
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  <span className="ml-3 bg-white text-[#8CB662] p-1 rounded-full transition-transform duration-300 group-hover:translate-x-1">
                    <IoMdArrowForward className="text-base" />
                  </span>
                </button>
              </div>

            </motion.form>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
