// resources/js/components/about_sections/GeneralFaqs.tsx
import React from "react";
import { Link } from "@inertiajs/react";
import { BsArrowUpRight } from "react-icons/bs";
import FaqItem from "./FaqItem";

interface GeneralFaqsProps {
  faqData1: { question: string; answer: string }[];
  openFaqs1: boolean[];
  toggleFaq1: (index: number) => void;
}

const GeneralFaqs: React.FC<GeneralFaqsProps> = ({ faqData1, openFaqs1, toggleFaq1 }) => {
  const circleColors = ["#8CB662", "#90CAF9", "#8CB662", "#90CAF9", "#8CB662"];

  return (
    <div className="relative px-6 md:px-20 py-24 bg-[#A0C670]">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center flex items-center space-x-2">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Any <span className="italic text-[#f7f7f7]">questions?</span> We got you.
        </h2>
        <img src="images/leaf-icon.png" alt="Leaf" className="w-20 h-20" />
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 text-left">
          <h4 className="text-md text-white uppercase font-bold">About</h4>
          <h3 className="text-4xl text-white font-bold">General Questions</h3>
          <p className="text-black italic font-medium text-md justify-baseline">
            Get to know more about Mi Amore Café what we offer, where we are, and what makes us special.
            Here are the basics you might be curious about before your visit or order.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 border-2 border-white text-white text-md font-extrabold hover:bg-white hover:text-[#7ba642] transition"
          >
            Contact Us <BsArrowUpRight className="ml-2" />
          </Link>
        </div>

        <div className="space-y-4">
          {faqData1.slice(0, 5).map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openFaqs1[index]}
              toggleFaq={() => toggleFaq1(index)}
              circleColor={circleColors[index % circleColors.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralFaqs;




