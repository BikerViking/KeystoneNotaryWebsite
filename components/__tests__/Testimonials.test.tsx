import { render, screen } from '@testing-library/react';
import React from 'react';
import Testimonials from '../Testimonials';

describe('Testimonials', () => {
  it('renders the main heading', () => {
    render(<Testimonials />);
    expect(screen.getByRole('heading', { name: /trusted by professionals/i })).toBeInTheDocument();
  });

  it('renders all three testimonial cards with author and company', () => {
    render(<Testimonials />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Real Estate Agent')).toBeInTheDocument();

    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('International Exporter')).toBeInTheDocument();

    expect(screen.getByText('David Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Small Business Owner')).toBeInTheDocument();
  });

  it('renders the quote content', () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/The team at Keystone was incredibly professional/i)
    ).toBeInTheDocument();
  });

  // A more advanced test could mock the StarIcon and count its instances.
  // For now, we assume its presence if the rest of the card renders.
});
