// resources/js/Pages/website_pages/Contact.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import ContactSection from '@/components/home_sections/ContactSection'; 
import ContactPage from '@/components/contact_sections/ContactPage';

const Contact: React.FC = () => {
    return (
        <div className="bg-[#FAF9F6] min-h-screen flex flex-col">
            <NavbarLayout>
                <main className="flex-grow pt-24 md:pt-32">
                    <ContactPage/>
                    <ContactSection />
                </main>
            </NavbarLayout>

            <Footer />
        </div>
    );
};

export default Contact;