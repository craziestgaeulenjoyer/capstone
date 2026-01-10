// resources/js/Pages/Event.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import HeaderSection from '@/components/event_sections/HeaderSection'; 
import BookCartSection from '@/components/event_sections/BookCartSection';
import GalleryEventSection from '@/components/event_sections/GalleryEventSection';
import EventsHeader from '@/components/event_sections/EventsHeader';

const Event: React.FC = () => {
    return (
      <>
        <NavbarLayout>
          <HeaderSection />
          <EventsHeader />
          <BookCartSection />
          <GalleryEventSection />
        </NavbarLayout>

        <Footer />
      </>
    );
};

export default Event;
