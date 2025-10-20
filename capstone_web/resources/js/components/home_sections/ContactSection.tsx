import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

const ContactSection: React.FC = () => {
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
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
          className="md:w-1/2 pl-12 pr-6 flex flex-col justify-center"
        >
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <span className="text-[#76B13A]">We’d </span>
              <span className="text-[#B13A3A]">Love </span>
              <span className="text-[#76B13A]">to </span>
              <span className="text-[#76B13A]">Hear </span>
              <span className="text-blue-400">From </span>
              <span className="text-blue-400">You!</span>
            </motion.h2>
            <p className="text-black text-md mb-6 max-w-md text-left">
              Whether you’re craving a cup, planning a visit, or just want to say hello—Mi Amore is here for you.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <MdEmail className="text-[#76B13A] text-xl mt-1" />
              <div>
                <p className="text-sm font-semibold text-[#4e4c4c] mb-1">E-mail</p>
                <p className="text-sm font-bold text-[#1b1b1b]">miamore.cml@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-[#76B13A] text-xl mt-1" />
              <div>
                <p className="text-sm font-semibold text-[#4e4c4c] mb-1">Phone Number</p>
                <p className="text-sm font-bold text-[#1b1b1b]">+63 917 892 4125</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <div className="md:w-1/2 pr-12">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-1 border-[#e0fac7] h-full">
            <p className="text-[#41E2DA] uppercase text-sm font-bold shadow-2xs mb-2">
              Contact Us
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl font-bold text-[#9D7353] leading-snug mb-6"
            >
              <span className="text-[#76B13A] shadow-2xs ">Reach</span> & Get in Touch With Us!
            </motion.h2>

            {/* Form */}
            <motion.form
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "phone", label: "Phone Number", type: "text" }
              ].map(field => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm text-black mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#76B13A]"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-black mb-1"
                >
                  Enter message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#76B13A]"
                ></textarea>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group bg-[#8CB662] hover:bg-[#7AB44E] text-white font-semibold text-sm rounded-full py-2 px-5 flex items-center transition-all duration-300"
                >
                  <span>Send Message</span>
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






















