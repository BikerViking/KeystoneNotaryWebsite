import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import FAQ from '../../components/FAQ';

describe('FAQ', () => {
  it('renders FAQ heading and items', () => {
    render(<FAQ />);
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(3);
  });

  it('toggles items and maintains correct aria attributes', () => {
    render(<FAQ />);
    const buttons = screen.getAllByRole('button');
    const first = buttons[0];
    const second = buttons[1];
    // first is open by default
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');
    // open second
    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports arrow key navigation between questions', () => {
    render(<FAQ />);
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[1]);
    fireEvent.keyDown(buttons[1], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[0]);
  });
});

