import React from 'react';

// --- Content ---
const content = {
  companyName: "Keystone Notary Group, LLC",
  tagline: "Professional Notary Services You Can Trust.",
  logoUrl: "https://placehold.co/200x100/1A1A1A/FFFFFF?text=Logo",
  nnaSealUrl: "https://placehold.co/150x150/FFFFFF/1A1A1A?text=NNA+Certified",
  navLinks: [
    { text: "Services", href: "#services" },
    { text: "About", href: "#about" },
    { text: "FAQ", href: "#faq" },
    { text: "Book Now", href: "#booking" },
    { text: "Contact", href: "#contact" }
  ],
  serviceAreas: [
    "Montgomery County",
    "Bucks County",
    "Lehigh County",
    "Northampton County"
  ],
  contact: {
    email: "info@keystonenotarygroup.com",
    phone: "(267) 309-9000"
  }
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">

          {/* Column 1: Logo & NNA Seal */}
          <div className="flex flex-col items-center md:items-start">
            <img src={content.logoUrl} alt={`${content.companyName} Logo`} className="h-12 mb-4 bg-zinc-800" />
            <p className="text-neutral-400 text-sm mb-6">{content.tagline}</p>
            <img src={content.nnaSealUrl} alt="NNA Certified Signing Agent" className="h-20 bg-zinc-800" />
          </div>

          {/* Column 2: Menu */}
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Menu</h3>
            <nav role="navigation" aria-label="Footer Navigation" className="mt-4 flex flex-col space-y-2 text-sm">
              {content.navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-neutral-400 hover:text-white transition-colors">{link.text}</a>
              ))}
            </nav>
          </div>

          {/* Column 3: Service Area */}
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Service Area</h3>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              {content.serviceAreas.map(area => (
                <p key={area} className="text-neutral-400">{area}</p>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Contact Us</h3>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <a href={`mailto:${content.contact.email}`} className="text-neutral-400 hover:text-white transition-colors">{content.contact.email}</a>
              <a href={`tel:${content.contact.phone}`} className="text-neutral-400 hover:text-white transition-colors">{content.contact.phone}</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center text-xs text-neutral-500 sm:flex sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {content.companyName}. All Rights Reserved.</p>
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
