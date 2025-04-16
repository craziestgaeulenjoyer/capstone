import React from 'react';
import { Link } from '@inertiajs/react';

const HeroSection: React.FC = () => {
  return (
    <section
      className="bg-[url('/images/HeroSection-img.png')] bg-no-repeat bg-cover bg-center flex justify-start items-end p-5 h-[500px] w-full max-w-[1440px]"
    >
      <Link href="/order">
        <button
          className="bg-[#B47B50] text-white py-3 px-12 rounded-full font-bold text-base cursor-pointer shadow-lg transition-colors duration-300 hover:bg-[#c7794e] relative -top-[70px] mb-[30px] ml-[130px]"
        >
          Order Now
        </button>
      </Link>
    </section>
  );
};

export default HeroSection;
