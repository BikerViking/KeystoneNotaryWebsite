import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ExpandedServices from './components/ExpandedServices';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DebugOverlay from './components/DebugOverlay';

const App: React.FC = () => {
  return (
    <div className="bg-black text-neutral-300 font-sans antialiased">
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <ExpandedServices />
        <About />
        <Testimonials />
        <FAQ />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <DebugOverlay />
    </div>
  );
};

export default App;
