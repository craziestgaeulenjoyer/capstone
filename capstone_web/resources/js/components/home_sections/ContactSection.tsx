import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const ContactSection: React.FC = () => {

  return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image & Text */}
          <img
            src="/images/coffee-splash.png"
            alt="Coffee cups and beans"
            className="w-full max-w-md object-contain"
          />

          <div className="absolute bottom-4 left-4 bg-[#95C763] text-white p-6 rounded-xl w-[280px] sm:w-[300px] shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <span className="text-[#95C763] text-2xl font-bold">?</span>
              </div>
              <p className="text-white text-sm">
                We’d love to hear from you — connect with us for inquiries, orders, or just a friendly chat!
              </p>
              <div className="mt-4 flex items-center text-white font-semibold">
                <FaPhoneAlt className="mr-2" />
                +63 917 892 4125
              </div>
            </div>
          </div>

        {/* Right Side - Contact Form */}
          <p className="text-sm text-[#00B2A9] font-semibold uppercase">Contact Us</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            <span className="text-[#95C763]">Reach</span> & Get in Touch With Us!
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#95C763]"
            />
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#95C763]"
            />
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 rounded-l-md text-sm">
                +63
              </span>
              <input
                type="text"
                placeholder="--- --- ----"
                className="w-full border border-gray-300 rounded-r-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#95C763]"
              />
            </div>
            <textarea
              placeholder="Enter message"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#95C763]"
            />
            <button
              type="submit"
              className="w-full bg-[#95C763] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#7ab44e] transition-all"
            >
              SEND
            </button>
          </form>
      </div>
  );
};

export default ContactSection;
