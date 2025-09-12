import { render, screen } from '@testing-library/react';
import React from 'react';
import Hero from '../Hero';

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />);
    const headline = screen.getByRole('heading', {
      name: /Reliable Notary Services, Executed with Precision./i,
    });
    expect(headline).toBeInTheDocument();
  });

  it('renders the descriptive paragraph', () => {
    render(<Hero />);
    const paragraph = screen.getByText(
      /Keystone Notary Group provides professional, certified notary services/i
    );
    expect(paragraph).toBeInTheDocument();
  });

  it('renders the call-to-action button', () => {
    render(<Hero />);
    const ctaButton = screen.getByRole('link', {
      name: /schedule an appointment/i,
    });
    expect(ctaButton).toBeInTheDocument();
  });
});
