import React, { useState, useEffect, useRef } from 'react';
import SmartImage from './SmartImage';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close on Escape for accessibility comfort
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus trap when mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return;
    // Focus first link on open
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const isShift = e.shiftKey;
      if (isShift && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!isShift && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Restore focus to menu button when the panel closes
  useEffect(() => {
    if (!isMenuOpen) {
      // Defer to allow DOM to settle after transitions
      setTimeout(() => menuButtonRef.current?.focus(), 0);
    }
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/70 backdrop-blur-lg border-b border-zinc-800' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {(() => {
              const scrolledSources = [
                "/assets/logo-silver.png",
                "/assets/icon-192.png",
                "/assets/icon-512.png",
                "/assets/logo-black.PNG",
              ];
              const topSources = [
                "/assets/logo-black.PNG",
                "/assets/icon-192.png",
                "/assets/logo-silver.png",
                "/assets/icon-512.png",
              ];
              const sources = isScrolled ? scrolledSources : topSources;
              return (
                <SmartImage
                  sources={sources}
                  alt="Keystone Notary Group"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain transition-opacity duration-300"
                />
              );
            })()}
            <div className="text-2xl font-bold text-white tracking-wider select-none">
              <span className="text-neutral-300">KEY</span>STONE
            </div>
          </div>
          <nav className="hidden md:flex space-x-10">
            <a href="#services" className="text-neutral-300 hover:text-white transition-colors duration-300">Services</a>
            <a href="#about" className="text-neutral-300 hover:text-white transition-colors duration-300">About</a>
            <a href="#faq" className="text-neutral-300 hover:text-white transition-colors duration-300">FAQ</a>
            <a href="#contact" className="text-neutral-300 hover:text-white transition-colors duration-300">Contact</a>
          </nav>
          <a href="#contact" className="hidden md:block bg-neutral-300 text-black font-bold py-2 px-6 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105">
            Get Started
          </a>
          <div className="md:hidden">
            <button 
              className="z-[60] text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              ref={menuButtonRef}
            >
              {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <div 
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-40 ${isMenuOpen ? 'visible' : 'invisible'}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        {/* Sliding panel */}
        <nav 
            className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-black/95 border-l border-zinc-800 p-10 flex flex-col items-start space-y-8 transform transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on nav links
            ref={panelRef}
        >
            <a href="#services" onClick={closeMenu} className="text-3xl text-neutral-300 hover:text-white transition-colors duration-300">Services</a>
            <a href="#about" onClick={closeMenu} className="text-3xl text-neutral-300 hover:text-white transition-colors duration-300">About</a>
            <a href="#faq" onClick={closeMenu} className="text-3xl text-neutral-300 hover:text-white transition-colors duration-300">FAQ</a>
            <a href="#contact" onClick={closeMenu} className="text-3xl text-neutral-300 hover:text-white transition-colors duration-300">Contact</a>
            <a href="#contact" onClick={closeMenu} className="mt-4 inline-block bg-neutral-300 text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
              Get Started
            </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
