// resources/js/Layouts/AppLayout.tsx
import React from 'react';
import Navbar from '@/components/navbar_guest/GuestNavBar_MiAmore';

interface Props {
  children: React.ReactNode;
}

const GuestNavBar_Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default GuestNavBar_Layout;
