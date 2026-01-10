// resources/js/Pages/Home.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeroSection from '@/components/home_sections/HeroSection';
import FeatureSection from '@/components/home_sections/FeatureSection';
import GallerySection from '@/components/home_sections/GallerySection';
import BestSellerSection from '@/components/home_sections/BestSellerSection';
import WhyChooseUsSection from '@/components/home_sections/WhyChooseUsSEction';
import ContactSection from '@/components/home_sections/ContactSection';
import CustomerReviewSection from '@/components/home_sections/CustomerReviewSection';


const Home: React.FC = () => {
    return (
      <>
      
        <NavbarLayout>
          <HeroSection/>
          <WhyChooseUsSection/>
          <BestSellerSection/>
          <FeatureSection/>
          <GallerySection />
          <ContactSection/>
          <CustomerReviewSection/>

        </NavbarLayout>

        <Footer />
      </>
    );
};

export default Home;

