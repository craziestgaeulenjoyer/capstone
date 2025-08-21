// resources/js/Pages/website_pages/Menu.tsx
import React from 'react';
import NavbarLayout from '@/layouts/navbar_layouts/GuestNavBar_Layout';
import Footer from '@/components/footer/Footer_MiAmore';
import MenuHeader from '@/components/menu_sections/MenuHeader';

const Menu: React.FC = () => {
  return (
    <>
      <NavbarLayout>
        <MenuHeader />
      </NavbarLayout>
      <Footer />
    </>
  );
};

export default Menu;



