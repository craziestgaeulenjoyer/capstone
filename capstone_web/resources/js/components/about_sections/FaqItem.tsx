// resources/js/components/about_sections/FaqItem.tsx
import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

interface FaqItemProps {
  faq: { question: string; answer: string };
  isOpen: boolean;
  toggleFaq: () => void;
  circleColor: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, isOpen, toggleFaq, circleColor }) => {
  return (
    <div
      className="flex justify-between items-start gap-4 p-4 bg-white rounded-md shadow-md transition-all duration-300 cursor-pointer"
      onClick={toggleFaq}
    >
      <div className="flex-1">
        <h4 className="text-gray-800 font-semibold text-sm md:text-base">{faq.question}</h4>
        {isOpen && (
          <p className="mt-2 text-gray-700 text-sm md:text-justify transition-all duration-200 ease-in-out">
            {faq.answer}
          </p>
        )}
      </div>

      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: circleColor }}
      >
        {isOpen ? (
          <AiOutlineMinus className="text-white" />
        ) : (
          <AiOutlinePlus className="text-white" />
        )}
      </div>
    </div>
  );
};

export default FaqItem;
