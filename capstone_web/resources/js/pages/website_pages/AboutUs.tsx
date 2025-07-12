
import React, { useState } from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeroSection from '../../components/aboutus_sections/HeroSection';
import WelcomeSection from '../../components/aboutus_sections/WelcomeSection';
import ProductDisplaySection from '../../components/aboutus_sections/ProductDislplaySection';
import QuoteSection from '../../components/aboutus_sections/QuoteSection';
import FaqSection from '../../components/aboutus_sections/FaqSection';
import faqData1 from '../../lib/FaqData1';
import faqData2 from '../../lib/FaqData2';

function AboutUs() {
    const [openFaqs1, setOpenFaqs1] = useState(Array(faqData1.length).fill(false));
    const [openFaqs2, setOpenFaqs2] = useState(Array(faqData2.length).fill(false));

    
    const toggleFaq1 = (index: number) => {
        setOpenFaqs1(prev => {
            const newOpenFaqs = [...prev];
            newOpenFaqs[index] = !newOpenFaqs[index];
            return newOpenFaqs;
        });
    };

   
    const toggleFaq2 = (index: number) => {
        setOpenFaqs2(prev => {
            const newOpenFaqs = [...prev];
            newOpenFaqs[index] = !newOpenFaqs[index];
            return newOpenFaqs;
        });
    };

    return (
        <>
            <NavbarLayout>
                
                <div className="min-h-screen bg-white font-serif antialiased">
                    <HeroSection />
                    <WelcomeSection />
                    <ProductDisplaySection />
                    <QuoteSection />
                    <FaqSection
                        faqData1={faqData1}
                        openFaqs1={openFaqs1}
                        toggleFaq1={toggleFaq1}
                        faqData2={faqData2}
                        openFaqs2={openFaqs2}
                        toggleFaq2={toggleFaq2}
                    />
                </div>
            </NavbarLayout>

          
            <Footer />
        </>
    );
}

export default AboutUs;