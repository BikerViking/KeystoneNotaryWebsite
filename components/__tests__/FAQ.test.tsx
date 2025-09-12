import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import FAQ from '../../components/FAQ';
import { ensureGSAP } from '../../lib/gsap';

// Mock GSAP for the test environment
vi.mock('../../lib/gsap', () => ({
  ensureGSAP: () => ({
    gsap: {
      to: vi.fn(),
      from: vi.fn(),
      set: vi.fn(),
      timeline: vi.fn(() => ({
        to: vi.fn(),
        from: vi.fn(),
      })),
      context: vi.fn((fn) => {
        fn();
        return { revert: vi.fn() };
      }),
      utils: {
        toArray: vi.fn(() => []),
      },
    },
    ScrollTrigger: {
      create: vi.fn(),
    }
  }),
  isReducedMotion: () => false,
}));

describe('FAQ Component', () => {
  // Hardcoded questions from the component to test against
  const questions = [
    'What documents can you notarize?',
    'Do you offer mobile or on‑site service?',
    'What should I bring to the appointment?',
    'Can you help with apostilles for international use?',
    'Are you available outside standard business hours?',
    'How much does it cost?',
  ];

  it('renders the main heading and all question items', () => {
    render(<FAQ />);
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeInTheDocument();

    questions.forEach(q => {
      expect(screen.getByText(q)).toBeInTheDocument();
    });

    expect(screen.getAllByRole('button')).toHaveLength(questions.length);
  });

  it('toggles an answer panel when a question is clicked', async () => {
    render(<FAQ />);

    const firstQuestionButton = screen.getByRole('button', { name: questions[0] });
    const firstAnswerText = "We handle loan packages, powers of attorney, affidavits, deeds, I‑9 verifications (as an authorized representative), vehicle title transfers, and more. If you are unsure, reach out and we will confirm eligibility.";

    // Initially, the answer is not visible
    expect(screen.queryByText(firstAnswerText)).not.toBeVisible();
    expect(firstQuestionButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open the panel
    fireEvent.click(firstQuestionButton);

    // Now the answer should be visible
    await screen.findByText(firstAnswerText); // This waits for the element to appear
    expect(firstQuestionButton).toHaveAttribute('aria-expanded', 'true');

    // Click again to close the panel
    fireEvent.click(firstQuestionButton);

    // The answer should be hidden again
    // We expect it to eventually be not visible after the animation
    expect(firstQuestionButton).toHaveAttribute('aria-expanded', 'false');
  });
});

