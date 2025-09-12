import { render, screen, within } from '@testing-library/react';
import React from 'react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer with copyright and current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} Keystone Notary Group, LLC. All rights reserved.`);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders the main navigation links', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: /footer navigation/i });
    expect(within(nav).getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /faq/i })).toBeInTheDocument();
    // Use exact match to avoid conflict with email
    expect(within(nav).getByRole('link', { name: /^contact$/i })).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    // More robust query for phone number
    expect(screen.getByText('(555) 123‑4567').closest('a')).toHaveAttribute('href', 'tel:+15551234567');
    expect(screen.getByRole('link', { name: /contact@keystonenotary.llc/i })).toHaveAttribute('href', 'mailto:contact@keystonenotary.llc');
  });

  it('renders the NNA certification seal', () => {
    render(<Footer />);
    expect(screen.getByAltText(/NNA Certified Notary Signing Agent/i)).toBeInTheDocument();
    expect(screen.getByText(/NNA Certified/i)).toBeInTheDocument();
  });
});
