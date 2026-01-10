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
import SectionDivider from '@/components/about_sections/SectionDivider';

const faqData1 = [
    { 
        question: "1. What is Mi Amore Café known for?", 
        answer: "Mi Amore Café is known for its cozy ambiance, handcrafted beverages, and thoughtfully curated snacks. It's the go-to spot in Tuy for quality and comfort, balancing classics with creative twists." 
    },
    { 
        question: "2. How does the in-store Kiosk work?", 
        answer: "Our self-service Kiosk allows you to browse the full menu, customize your brew, and pay digitally. It's designed to give you a seamless, queue-free experience during our busiest hours." 
    },
    { 
        question: "3. What can I do with the Mi Amore Mobile App?", 
        answer: "The mobile app lets you order from anywhere! You can track your Amore Points, schedule pickups, and receive exclusive notifications for artisan seasonal releases." 
    },
    { 
        question: "4. Where is Mi Amore Café located?", 
        answer: "You can find us at JP Rizal Street, Poblacion, Tuy, Batangas. We are situated in the heart of the town, making us a convenient stop for a relaxing break." 
    },
    { 
        question: "5. Do you offer delivery and takeout?", 
        answer: "Yes! We offer takeout for those on the move, and delivery can be arranged through our mobile app or website to ensure your favorites reach you fresh." 
    },
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
        <SectionDivider />
        <AboutFaqs />
      </NavbarLayout>
      <Footer />
    </>
  );
};

export default AboutUs;



