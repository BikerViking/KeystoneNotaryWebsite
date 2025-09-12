import { render, screen } from '@testing-library/react';
import React from 'react';
import ProofBar from '../../components/ProofBar';

describe('ProofBar', () => {
  it('renders core proof badges', () => {
    render(<ProofBar />);
    expect(screen.getByText(/NNA Certified/i)).toBeInTheDocument();
    expect(screen.getByText(/Bonded & Insured/i)).toBeInTheDocument();
    expect(screen.getByText(/Notarizations Completed/i)).toBeInTheDocument();
  });
});

