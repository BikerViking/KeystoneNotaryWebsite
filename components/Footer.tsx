import React from 'react';

// --- Content (from metadata.json) ---
const content = {
  logo: {
    primary: "KEY",
    secondary: "STONE",
    alt: "Keystone Notary Group Logo",
    src: "/assets/logo-silver-metallic.png"
  },
  footer: {
    copyrightText: "Keystone Notary Group, LLC. All Rights Reserved.",
    tagline: "Professional Notary Services You Can Trust."
  },
  header: {
    navLinks: [
      { text: "Services", href: "#services" },
      { text: "About", href: "#about" },
      { text: "FAQ", href: "#faq" },
      { text: "Contact", href: "#contact" }
    ],
  },
  contact: {
    email: "info@keystonenotarygroup.com",
    phone: "(267) 309-9000"
  }
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Logo & Tagline */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <a href="#" className="inline-flex items-center gap-2 mb-4" aria-label="Keystone Notary Group Home">
              <img src={content.logo.src} alt={content.logo.alt} className="h-8 w-8 object-contain" />
              <div className="text-xl font-bold text-white tracking-wider">
                <span className="text-neutral-300">{content.logo.primary}</span>
                {content.logo.secondary}
              </div>
            </a>
            <p className="text-neutral-400 text-sm">{content.footer.tagline}</p>
          </div>

          {/* Center: Navigation Links */}
          <div className="lg:col-span-4 text-center">
            <h3 className="font-semibold text-white tracking-wider uppercase">Menu</h3>
            <nav role="navigation" aria-label="Footer Navigation" className="mt-4 flex flex-col space-y-2 text-sm">
              {content.header.navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-neutral-400 hover:text-white transition-colors">{link.text}</a>
              ))}
            </nav>
          </div>

          {/* Right: Contact Info */}
          <div className="lg:col-span-4 text-center lg:text-right">
            <h3 className="font-semibold text-white tracking-wider uppercase">Contact Us</h3>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <a href={`mailto:${content.contact.email}`} className="text-neutral-400 hover:text-white transition-colors">{content.contact.email}</a>
              <a href={`tel:${content.contact.phone}`} className="text-neutral-400 hover:text-white transition-colors">{content.contact.phone}</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center text-xs text-neutral-500 sm:flex sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {content.footer.copyrightText}</p>
          <div className="mt-4 sm:mt-0 flex justify-center gap-x-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
