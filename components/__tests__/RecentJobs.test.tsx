import { render, screen } from '@testing-library/react';
import React from 'react';
import RecentJobs from '../RecentJobs';

describe('RecentJobs', () => {
  it('renders the main heading and subheading', () => {
    render(<RecentJobs />);
    expect(screen.getByRole('heading', { name: /recent work/i })).toBeInTheDocument();
    expect(
      screen.getByText(/An anonymized snapshot that shows recency/i)
    ).toBeInTheDocument();
  });

  it('renders all five job cards', () => {
    render(<RecentJobs />);
    expect(screen.getByText('Loan Signing')).toBeInTheDocument();
    expect(screen.getByText('I-9 Verification')).toBeInTheDocument();
    expect(screen.getByText('Apostille')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Title')).toBeInTheDocument();
    expect(screen.getByText('POA Notarization')).toBeInTheDocument();
  });

  it('renders other job details like area and duration', () => {
    render(<RecentJobs />);
    expect(screen.getByText('Rittenhouse')).toBeInTheDocument();
    expect(screen.getByText('45 min onsite')).toBeInTheDocument();
  });
});
