// resources/js/Pages/Home.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';

const Home: React.FC = () => {
  return (
    <>
      <NavbarLayout>
        <div className="p-6 text-2xl font-bold text-center">
          Test
        </div>
      </NavbarLayout>

      <Footer />
    </>
  );
};

export default Home;
