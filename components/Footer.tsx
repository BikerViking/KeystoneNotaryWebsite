import React from 'react';
import SmartImage from './SmartImage';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-800" data-debug="footer">
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <SmartImage sources={["/assets/logo-silver.png","/assets/logo-black.PNG","/assets/icon-192.png"]} alt="Keystone Notary Group" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="text-white font-semibold text-lg">Keystone Notary Group, LLC</span>
        </div>
        <p className="text-neutral-400 text-sm max-w-[60ch] mx-auto">Professional, secure, and precise notary services.</p>

        <nav role="navigation" aria-label="Footer Navigation" className="mt-6 flex justify-center gap-6 text-sm text-neutral-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="mt-4 flex justify-center items-center gap-3 text-sm text-neutral-400">
          <a href="tel:+15551234567" className="hover:text-white transition-colors">(555) 123‑4567</a>
          <span className="opacity-40">•</span>
          <a href="mailto:contact@keystonenotary.llc" className="hover:text-white transition-colors">contact@keystonenotary.llc</a>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 opacity-90">
          <SmartImage src="/assets/nna-seal.png" alt="NNA Certified Notary Signing Agent" width={36} height={36} className="h-9 w-9" />
          <span className="text-neutral-300 text-sm">NNA Certified</span>
        </div>

        <div className="mt-8 h-px bg-zinc-800" />
        <div className="pt-6 text-neutral-500 text-xs md:text-sm flex flex-wrap items-center justify-center gap-6">
          <p>&copy; {new Date().getFullYear()} Keystone Notary Group, LLC. All rights reserved.</p>
          <a href="#main" className="text-neutral-400 hover:text-white transition-colors">Back to top</a>
          <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
