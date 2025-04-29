// resources/js/Pages/Home.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeroSection from '@/components/home_sections/HeroSection';
import FeatureSection from '@/components/home_sections/FeatureSection';
import WhyChooseUsSection from '@/components/home_sections/WhyChooseUsSEction';
import BestSellerSection from '@/components/home_sections/BestSellerSection';
import ContactSection from '@/components/home_sections/ContactSection';


const Home: React.FC = () => {
  return (
    <>
      <NavbarLayout>
        <HeroSection/>
        <FeatureSection/>
        <WhyChooseUsSection/>
        <BestSellerSection/>
        <ContactSection/>

      </NavbarLayout>

      <Footer />
    </>
  );
};

export default Home;

