import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <Link href="/order">
        <button className="hero-button">Order Now</button>
      </Link>
    </section>
  );
};

export default HeroSection;

