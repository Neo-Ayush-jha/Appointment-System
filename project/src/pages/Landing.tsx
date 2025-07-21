import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import ServicesSection from '../components/landing/ServicesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;