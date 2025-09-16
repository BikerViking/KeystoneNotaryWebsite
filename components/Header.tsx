import React, { useState, useEffect, useRef } from 'react';

// --- Content ---
const content = {
  logoUrl: "https://placehold.co/150x50/1A1A1A/FFFFFF?text=Keystone",
  navLinks: [
    { text: "Services", href: "#services" },
    { text: "About", href: "#about" },
    { text: "FAQ", href: "#faq" }
  ],
  ctaButton: { text: "Book Now", href: "#booking" }
};

// --- Main Component ---
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // --- Accessibility & State Hooks ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      setTimeout(() => menuButtonRef.current?.focus(), 0);
    } else {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>('a, button');
      firstFocusable?.focus();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button');
      if (!focusables) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  // --- Render ---
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/70 backdrop-blur-lg border-b border-zinc-800' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center" aria-label="Keystone Notary Group Home">
            <img
              src={content.logoUrl}
              alt="Keystone Notary Group Logo"
              className="h-8 bg-zinc-800"
            />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            {content.navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-neutral-200 hover:text-white transition-colors duration-300">
                {link.text}
              </a>
            ))}
            <a href={content.ctaButton.href} className="inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300 transform hover:scale-105">
              {content.ctaButton.text}
            </a>
          </nav>
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              className="z-[60] text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu --- */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <nav
          ref={panelRef}
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-zinc-900/95 border-l border-zinc-800 p-8 flex flex-col items-start space-y-6 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {content.navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={closeMenu} className="text-3xl text-neutral-200 hover:text-white">
              {link.text}
            </a>
          ))}
          <a href={content.ctaButton.href} onClick={closeMenu} className="mt-4 inline-block rounded-full bg-neutral-100 px-8 py-4 text-lg font-semibold text-black shadow-sm hover:bg-white">
            {content.ctaButton.text}
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
