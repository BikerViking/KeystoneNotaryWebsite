import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Contact from '../../components/Contact';

describe('Contact form', () => {
  // Mock window.location.href to prevent navigation errors in JSDOM
  let originalLocation: Location;

  beforeAll(() => {
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, href: '' }, // Mock href as an empty string
    });
  });

  afterEach(() => {
    // Reset href after each test to ensure isolation
    window.location.href = '';
  });

  afterAll(() => {
    // Restore original window.location after all tests are done
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('shows validation errors on empty submit', () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/brief description/i)).toBeInTheDocument();
    // Appears both as label and error; ensure error message is present
    expect(screen.getAllByText(/consent to be contacted/i).length).toBeGreaterThan(0);
  });

  it('clears errors when fields are filled', () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/how can we help/i), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByLabelText(/consent/i));

    // submit again — errors should disappear
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    expect(screen.queryByText(/Please enter your full name/i)).toBeNull();
    expect(screen.queryByText(/valid email address/i)).toBeNull();
  });
});
