import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

const ContactSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white" id="contact">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
          className="w-full md:w-1/2 flex items-center justify-center p-2"
        >
          <img
            src="/images/coffee-splash.png"
            alt="Coffee cups and beans"
            className="w-full max-w-lg object-contain"
          />
        </motion.div>

        <div className="w-full md:w-1/2 flex">
          <div className="bg-[#8CB662] flex flex-col items-center justify-center p-6 text-white rounded-l-xl w-[60%]">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#9D7353] text-3xl font-bold">?</span>
            </div>
            <p className="text-center text-sm max-w-xs mb-6">
              We’d love to hear from you connect with us for inquiries, orders, or just a friendly chat!
            </p>
            <div className="flex flex-col gap-2 items-center text-sm">
              <div className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                +63 917 892 4125
              </div>
              <div className="flex items-center">
                <MdEmail className="mr-2" />
                miamore.cml@gmail.com
              </div>
            </div>
          </div>

          <div className="bg-[#9D7353] p-8 text-white flex flex-col justify-center rounded-r-xl w-[90%]">
            <p className="text-sm text-[#41E2DA] font-semibold uppercase">Contact Us</p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="text-3xl font-bold mt-1 mb-6 leading-snug"
            >
              <span className="text-[#8CB662]">Reach</span> & Get in Touch With Us!
            </motion.h2>

            <form className="space-y-4">
              {[
                { label: "Name", type: "text" },
                { label: "Email", type: "email" },
                { label: "Phone Number", type: "text" }
              ].map((input, index) => (
                <div key={index} className="relative">
                  <input
                    type={input.type}
                    required
                    className="peer w-full px-4 pt-6 pb-2 rounded-md text-sm bg-white text-black focus:outline-none"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8CB662]">
                    {input.label}
                  </label>
                </div>
              ))}

              <div className="relative">
                <textarea
                  rows={4}
                  required
                  className="peer w-full px-4 pt-6 pb-2 rounded-md text-sm bg-white text-black focus:outline-none"
                  placeholder=" "
                ></textarea>
                <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8CB662]">
                  Enter message
                </label>
              </div>

              <button
                type="submit"
                className="relative overflow-hidden group flex items-center justify-between px-6 py-2 rounded-full text-white font-semibold bg-[#8CB662] transition-all"
              >
                <span className="absolute inset-0 w-0 bg-[#7ab44e] transition-all duration-300 group-hover:w-full"></span>
                <span className="relative flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                  Send Message
                  <span className="bg-white text-[#8CB662] rounded-full p-1">
                    <IoMdSend className="text-lg" />
                  </span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;








