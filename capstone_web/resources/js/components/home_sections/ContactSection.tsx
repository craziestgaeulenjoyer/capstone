import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

const ContactSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "Full Name" },
    { id: "email", label: "Email Address", type: "email", placeholder: "Email Address" },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "Phone Number" },
  ];

  return (
    <motion.section
      id="contact"
      className="bg-[#d0ebbf] overflow-hidden px-4 py-16 md:py-28 w-full relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E0A478]/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#92E3A9]/10 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="w-[92%] max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-16 items-center lg:items-stretch relative z-10">
        
        <motion.div
          className="w-full lg:w-[45%] flex flex-col justify-center text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-5 py-2 bg-[#a2c57f] text-[#ffffff] rounded-full text-xs font-black tracking-widest uppercase mb-6 w-fit mx-auto lg:mx-0 border border-[#92E3A9]/30 shadow-sm">
            Keep in Touch
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-[#B47B50] mb-8 leading-[1.1]" style={{ fontFamily: "'Kalam', cursive" }}>
            Let’s share a <br /> 
            <span className="text-[#8CB662]">Coffee & Talk.</span>
          </h2>
          
          <p className="text-gray-800 text-lg md:text-xl mb-12 max-w-md leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Reach out to <span className="text-[#8CB662] font-bold">Mi Amore</span> for inquiries, collaborations, or just to say hi!
          </p>

          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            {[
              { icon: <MdEmail />, label: "Email us", val: "miamore.cml@gmail.com", color: "#8CB662", text: "#4c7ba0" },
              { icon: <FaPhoneAlt className="text-sm" />, label: "Call us", val: "+63 917 892 4125", color: "#8CB662", text: "#6b4d82" }
            ].map((info, idx) => (
              <div key={idx} className="flex items-center gap-5 p-5 bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all group">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: info.color }}
                >
                  {info.icon}
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: info.text }}>{info.label}</p>
                  <p className="text-sm md:text-base font-extrabold text-[#4A4A4A]">{info.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="w-full lg:w-[55%] h-full"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(224,164,120,0.15)] border border-[#E0A478]/10 flex flex-col h-full relative">
            
            <div className="mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-[#4A4A4A]">Send a Message</h3>
              <div className="w-12 h-1 bg-[#8CB662] mt-2 rounded-full" />
            </div>

            <motion.form 
              className="flex flex-col gap-5 flex-grow"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.slice(0, 2).map((field) => (
                  <motion.div key={field.id} variants={itemVariants} className="relative">
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder=" "
                      required
                      className="peer w-full px-6 pt-7 pb-3 bg-[#fdfaf8] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#90CAF9] focus:ring-4 focus:ring-[#90CAF9]/5 transition-all text-gray-800"
                    />
                    <label
                      htmlFor={field.id}
                      className="absolute left-6 top-[1.4rem] text-gray-400 text-sm transition-all duration-300 pointer-events-none 
                        peer-focus:text-xs peer-focus:top-3 peer-focus:text-[#b7e688] peer-focus:font-bold
                        peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:font-bold"
                    >
                      {field.placeholder} *
                    </label>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="relative">
                <input
                  id={fields[2].id}
                  type={fields[2].type}
                  placeholder=" "
                  className="peer w-full px-6 pt-7 pb-3 bg-[#fdfaf8] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#8E67AC] focus:ring-4 focus:ring-[#8E67AC]/5 transition-all text-gray-800"
                />
                <label
                  htmlFor={fields[2].id}
                  className="absolute left-6 top-[1.4rem] text-gray-400 text-sm transition-all duration-300 pointer-events-none 
                    peer-focus:text-xs peer-focus:top-3 peer-focus:text-[#8CB662] peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:font-bold"
                >
                  Contact Number (Optional)
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="relative flex-grow">
                <textarea
                  id="message"
                  rows={4}
                  placeholder=" "
                  required
                  className="peer w-full px-6 pt-7 pb-3 bg-[#fdfaf8] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#8CB662] focus:ring-4 focus:ring-[#8CB662]/5 transition-all text-gray-800 resize-none min-h-[150px]"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-6 top-[1.4rem] text-gray-400 text-sm transition-all duration-300 pointer-events-none 
                    peer-focus:text-xs peer-focus:top-3 peer-focus:text-[#8CB662] peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:font-bold"
                >
                  Your Message *
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="submit"
                  className="group w-full bg-[#8CB662] hover:bg-[#7aa154] text-white font-black text-lg rounded-2xl py-5 px-8 flex items-center justify-center transition-all duration-500 shadow-xl shadow-[#8CB662]/30 active:scale-[0.98]"
                >
                  <span>Send Message</span>
                  <div className="ml-3 transition-transform duration-300 group-hover:translate-x-2">
                    <IoMdArrowForward className="text-xl" />
                  </div>
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;