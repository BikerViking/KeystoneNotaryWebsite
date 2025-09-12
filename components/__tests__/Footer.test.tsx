import { render, screen, within } from '@testing-library/react';
import React from 'react';
import Footer from '../Footer';

// Mock data mirroring what's in the component
const content = {
  footer: {
    copyrightText: "Keystone Notary Group, LLC. All Rights Reserved."
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

describe('Footer', () => {
  it('renders the footer with copyright and current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    // Use a regex to accommodate the space between year and text
    const copyrightText = screen.getByText(`© ${currentYear} ${content.footer.copyrightText}`);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders the main navigation links', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: /footer navigation/i });
    content.header.navLinks.forEach(link => {
      expect(within(nav).getByRole('link', { name: link.text })).toHaveAttribute('href', link.href);
    });
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText(content.contact.phone)).toHaveAttribute('href', `tel:${content.contact.phone}`);
    expect(screen.getByText(content.contact.email)).toHaveAttribute('href', `mailto:${content.contact.email}`);
  });
});
