import { render, screen } from '@testing-library/react';
import React from 'react';
import Services from '../Services';

describe('Services', () => {
  it('renders the main heading and subheading', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { name: /our expertise/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /We offer a comprehensive suite of notary services/i
      )
    ).toBeInTheDocument();
  });

  it('renders all five service cards', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { name: /loan signings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /general notary work/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /apostille services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /i-9 employment verification/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /vehicle title transfers/i })).toBeInTheDocument();
  });

  it('renders the descriptions for the services', () => {
    render(<Services />);
    expect(screen.getByText(/Expert handling of mortgage documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional notarization for documents including affidavits/i)).toBeInTheDocument();
  });
});
