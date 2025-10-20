// resources/js/components/about_sections/AboutFaqs.tsx
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  { question: "1. Do you deliver?", answer: "Yes, Mi Amore Café offers delivery through their website and partnered delivery apps (if available). Whether you’re at home or work, you can enjoy their menu without leaving your place. Delivery areas may vary, so it’s best to check availability in your location." },
  { question: "2. How do I order through the mobile app?", answer: "Ordering through the mobile app is easy! Just download the Mi Amore Café app or use their web-based ordering system. Browse the menu, customize your order, choose a payment method, and confirm then just sit back and wait for your order to arrive!" },
  { question: "3. Do you have a loyalty program?", answer: "Yes! Mi Amore Café rewards its loyal customers through a points-based loyalty program. Every time you order, you earn points that can be redeemed for discounts or free items. Make sure to sign up or log in before ordering to take advantage of this sweet deal!" },
  { question: "4. Can I customize my drinks?", answer: "Definitely! Mi Amore Café allows you to customize your drink according to your taste from selecting your preferred base (coffee, tea, or juice), sweetness level, to toppings and flavors. It’s all about making your drink the way you love it." },
  { question: "5. Can I book a table or reserve space?", answer: "Yes, you can! Whether it's a casual meet-up, small celebration, or study session, Mi Amore Café welcomes table reservations. You can book through their contact form, social media, or by calling directly. Early reservations are encouraged for weekends or peak hours." },
];

const circleColors = ["#8CB662", "#90CAF9", "#8CB662", "#90CAF9", "#8CB662"];

const AboutFaqs: React.FC = () => {
  const [openFaqs, setOpenFaqs] = React.useState<boolean[]>(faqData.map(() => false));

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="bg-[#90CAF9] w-full py-12 px-4 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        
        <div className="flex flex-col space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaqs[index];
            const Icon = isOpen ? FaMinus : FaPlus;
            const circleColor = circleColors[index % circleColors.length];

            return (
              <div
                key={index}
                className="bg-white text-gray-800 p-4 rounded-md shadow hover:shadow-lg transition duration-300 relative"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full"
                >
                  <span className="text-md font-semibold text-left">{faq.question}</span>
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: circleColor }}
                  >
                    <Icon className="text-white text-xs" />
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700 text-sm md:text-justify">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-white">
          <p className="font-bold text-md uppercase">Information</p>
          <h2 className="text-4xl font-bold mt-2">Frequently Asked Questions (FAQs)</h2>
          <p className="mt-4 text-black italic font-medium text-md leading-relaxed">
            Here are answers to the most common questions we receive about ordering, delivery, rewards, and more.
            We want your experience with Mi Amore Café to be smooth and sweet.
          </p>
          <button className="mt-6 px-5 py-2 border-2 border-white text-white font-extrabold text-md flex items-center gap-2 hover:border-[#8bc4f3] hover:bg-white hover:text-[#90CAF9] transition duration-300">
            Contact Us <BsArrowUpRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutFaqs;


