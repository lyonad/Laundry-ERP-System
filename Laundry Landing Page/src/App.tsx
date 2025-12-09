import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandStrip } from './components/BrandStrip';
import { OrderTracking } from './components/OrderTracking';
import { BenefitsSection } from './components/BenefitsSection';
import { ServiceCards } from './components/ServiceCards';
import { PromoCta } from './components/PromoCta';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';

function App() {
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

export default App;
