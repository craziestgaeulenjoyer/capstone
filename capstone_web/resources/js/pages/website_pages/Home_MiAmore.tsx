// resources/js/Pages/Home.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';

const Home: React.FC = () => {
  return (
    <>
      <NavbarLayout>
        <HeroSection/>
        <FeatureSection/>

      </NavbarLayout>

      <Footer />
    </>
  );
};

export default Home;

