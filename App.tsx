import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProofBar from './components/ProofBar';
import RecentJobs from './components/RecentJobs';
import DebugOverlay from './components/DebugOverlay';

const App: React.FC = () => {
  return (
    <div className="bg-black text-neutral-300 font-sans antialiased">
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <ProofBar />
        <RecentJobs />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <DebugOverlay />
    </div>
  );
};

export default App;
