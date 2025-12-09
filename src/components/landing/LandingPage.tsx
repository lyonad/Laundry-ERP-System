import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { BrandStrip } from './BrandStrip';
import { OrderTracking } from './OrderTracking';
import { BenefitsSection } from './BenefitsSection';
import { ServiceCards } from './ServiceCards';
import { PromoCta } from './PromoCta';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      <Header />
      <main>
        <Hero />
        <BrandStrip />
        <OrderTracking />
        <BenefitsSection />
        <ServiceCards />
        <PromoCta />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

