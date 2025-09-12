import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders nav links including FAQ', () => {
    render(<Header />);
    // Desktop + mobile nav may both be in the DOM; ensure at least one link exists
    expect(screen.getAllByRole('link', { name: /services/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /faq/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(0);
  });
});
