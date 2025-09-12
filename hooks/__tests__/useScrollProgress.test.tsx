import { fireEvent, render, screen } from '@testing-library/react';
import React, { useEffect, useRef } from 'react';
import { useScrollProgress } from '../useScrollProgress';

const TestComp: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);

  // Keep the element at a fixed size; we'll mock getBoundingClientRect
  useEffect(() => {
    const el = ref.current!;
    // @ts-ignore
    el.getBoundingClientRect = () => ({ top: -200, height: 1200, bottom: 1000, left: 0, right: 0, width: 800 });
    (window as any).innerHeight = 800;
    window.dispatchEvent(new Event('scroll'));
  }, []);

  return (
    <div>
      <div ref={ref} />
      <output aria-label="p">{progress.toFixed(2)}</output>
    </div>
  );
};

describe('useScrollProgress', () => {
  it('computes a progress between 0 and 1', () => {
    render(<TestComp />);
    const out = screen.getByLabelText('p');
    const val = parseFloat(out.textContent || '0');
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(1);
  });
});

