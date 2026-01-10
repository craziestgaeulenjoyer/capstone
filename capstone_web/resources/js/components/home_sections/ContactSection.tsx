import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { motion, Variants } from "framer-motion";

const ContactSection: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "phone", label: "Phone Number", type: "tel" },
  ];

  return (
    <section
      id="contact"
      className="bg-[#b1c79c] overflow-hidden px-6 py-20 md:py-32 w-full relative"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative z-10">
        
        <motion.div
          className="w-full lg:w-5/12 text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className="w-8 h-[1px] bg-[#63aa1c]" />
            <span className="text-[#ffffff] text-[11px] font-bold tracking-[0.4em] uppercase">
              Get In Touch
            </span>
          </motion.div>
          
          <h2 
            className="text-4xl md:text-6xl font-bold text-[#5C2E0A] mb-8 leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We'd love to <br /> 
            <span className="italic text-[#7cbd3b]">Hear from You.</span>
          </h2>
          
          <p className="text-[#5C2E0A]/70 text-base md:text-lg mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Whether it's a bulk order, partnership, or just a friendly hello, we're here to craft a connection with you.
          </p>

          <div className="space-y-4 w-full max-w-md mx-auto lg:mx-0">
            {[
              { icon: <MdEmail />, label: "Email us", val: "miamore.cml@gmail.com" },
              { icon: <FaPhoneAlt className="text-sm" />, label: "Call us", val: "+63 917 892 4125" }
            ].map((info, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 5 }}
                className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-[#5C2E0A]/5 shadow-sm transition-all"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#5C2E0A] flex items-center justify-center text-[#FAF9F6] text-xl">
                  {info.icon}
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-[#8CB662] font-bold mb-1">{info.label}</p>
                  <p className="text-sm md:text-base font-bold text-[#5C2E0A]">{info.val}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="w-full lg:w-7/12"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(92,46,10,0.12)] border border-[#5C2E0A]/5">
            <div className="mb-12">
              <h3 
                className="text-2xl md:text-3xl font-bold text-[#5C2E0A] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Send a Message
              </h3>
              <p className="text-[#5C2E0A]/40 text-sm italic">Fields marked with * are required</p>
            </div>

            <motion.form 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.slice(0, 2).map((field) => (
                  <motion.div key={field.id} variants={itemVariants} className="relative group">
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder=" "
                      required
                      className="peer w-full px-0 py-4 bg-transparent border-b border-[#5C2E0A]/10 outline-none focus:border-[#8CB662] transition-all text-[#5C2E0A]"
                    />
                    <label
                      htmlFor={field.id}
                      className="absolute left-0 top-4 text-[#5C2E0A]/40 text-sm transition-all duration-300 pointer-events-none 
                        peer-focus:text-[10px] peer-focus:top-[-10px] peer-focus:text-[#8CB662] peer-focus:font-bold
                        peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-[-10px]"
                    >
                      {field.label} *
                    </label>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="relative group">
                <input
                  id={fields[2].id}
                  type={fields[2].type}
                  placeholder=" "
                  className="peer w-full px-0 py-4 bg-transparent border-b border-[#5C2E0A]/10 outline-none focus:border-[#8CB662] transition-all text-[#5C2E0A]"
                />
                <label
                  htmlFor={fields[2].id}
                  className="absolute left-0 top-4 text-[#5C2E0A]/40 text-sm transition-all duration-300 pointer-events-none 
                    peer-focus:text-[10px] peer-focus:top-[-10px] peer-focus:text-[#8CB662] peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-[-10px]"
                >
                  Contact Number (Optional)
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="relative group">
                <textarea
                  id="message"
                  rows={4}
                  placeholder=" "
                  required
                  className="peer w-full px-0 py-4 bg-transparent border-b border-[#5C2E0A]/10 outline-none focus:border-[#8CB662] transition-all text-[#5C2E0A] resize-none"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-0 top-4 text-[#5C2E0A]/40 text-sm transition-all duration-300 pointer-events-none 
                    peer-focus:text-[10px] peer-focus:top-[-10px] peer-focus:text-[#8CB662] peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-[-10px]"
                >
                  Your Message *
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8">
                <button
                  type="submit"
                  className="group relative w-full bg-[#5C2E0A] text-[#FAF9F6] py-5 px-8 rounded-full overflow-hidden transition-all duration-500 shadow-xl hover:shadow-[#5C2E0A]/20"
                >
                  <div className="absolute inset-0 bg-[#8CB662] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-widest">Send Inquiry</span>
                    <IoMdArrowForward className="text-xl transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;