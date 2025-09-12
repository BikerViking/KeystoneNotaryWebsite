import { render, screen } from '@testing-library/react';
import React from 'react';
import About from './About';

describe('About', () => {
  it('renders the main headline', () => {
    render(<About />);
    const headline = screen.getByRole('heading', {
      name: /Your Trusted Partner in Official Documentation/i,
    });
    expect(headline).toBeInTheDocument();
  });

  it('renders the descriptive paragraphs', () => {
    render(<About />);
    const paragraph = screen.getByText(
      /was founded on the principles of integrity, professionalism/i
    );
    expect(paragraph).toBeInTheDocument();
  });

  it('renders the main image with correct alt text', () => {
    render(<About />);
    const image = screen.getByAltText(
      /Snowy mountains representing the 'Keystone' name/i
    );
    expect(image).toBeInTheDocument();
  });
});
