// resources/js/Pages/website_pages/AboutUs.tsx
import React, { useState } from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeroSection from '@/components/about_sections/HeroSection';
import WelcomeSection from '@/components/about_sections/WelcomeSection';
import ProductDisplaySection from '@/components/about_sections/ProductDislplaySection';
import QuoteSection from '@/components/about_sections/QuoteSection';
import GeneralFaqs from '@/components/about_sections/GeneralFaqs';
import AboutFaqs from '@/components/about_sections/AboutFaqs';

const faqData1 = [
  { question: "1. What is Mi Amore Café known for?", answer: "Mi Amore Café is known for its cozy ambiance, handcrafted beverages, and thoughtfully curated snacks and platters. Whether you're craving a rich coffee blend, a refreshing fruit juice, or a relaxing space to hang out, Mi Amore Café is the go-to spot in Tuy for quality and comfort. It's also loved for its Instagram-worthy drinks and a menu that perfectly balances classics with creative twists." },
  { question: "2. Do you offer both dine-in and takeout?", answer: "Yes! Mi Amore Café offers both dine-in and takeout options. You can enjoy your favorite drinks and snacks inside the café’s comfortable space or order to go if you’re in a hurry. Either way, you’ll get the same great taste and service." },
  { question: "3. Where is Mi Amore Café located?", answer: "Mi Amore Café is located at JP Rizal Street, Poblacion, Tuy, Batangas. It’s easily accessible from the town center and is a favorite stop for both locals and visitors looking for a relaxing café experience." },
  { question: "4. What are your café hours?", answer: "Mi Amore Café typically opens from [insert actual opening time here, e.g., 10:00 AM to 9:00 PM daily]. Please note that hours may vary during holidays or special events, so it's always good to check their social media pages for the latest updates." },
  { question: "5. Do you have non-coffee drinks?", answer: "Absolutely! While Mi Amore Café is known for its delicious coffee, there’s also a wide range of non-coffee beverages such as fruit juices, lemonades, milk teas, and even chocolate-based drinks perfect for those who want something different or caffeine-free." },
];

const AboutUs: React.FC = () => {
  const [openFaqs1, setOpenFaqs1] = useState<boolean[]>(faqData1.map(() => false));

  const toggleFaq1 = (index: number) => {
    setOpenFaqs1(prev => prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)));
  };

  return (
    <>
      <NavbarLayout>
        <HeroSection />
        <WelcomeSection />
        <ProductDisplaySection />
        <QuoteSection />
        <GeneralFaqs
          faqData1={faqData1}
          openFaqs1={openFaqs1}
          toggleFaq1={toggleFaq1}
        />
        <AboutFaqs />
      </NavbarLayout>
      <Footer />
    </>
  );
};

export default AboutUs;



