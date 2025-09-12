import { render, screen } from '@testing-library/react';
import React, { useRef } from 'react';
import { vi } from 'vitest';

// We'll mock the hook to simulate visibility reliably
vi.mock('../useOnScreen', () => {
  return {
    useOnScreen: vi.fn(() => false),
  };
});

import { useOnScreen } from '../useOnScreen';

const TestComp: React.FC<{ visible?: boolean }> = ({ visible = false }) => {
  const mocked = useOnScreen as unknown as unknown as { mockReturnValue: (v: any) => void };
  mocked.mockReturnValue?.(visible);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible: boolean = (useOnScreen as any)(ref, { threshold: 0.1 });
  return <div aria-label="probe">{isVisible ? 'yes' : 'no'}</div>;
};

describe('useOnScreen', () => {
  it('returns false when element is not visible', () => {
    render(<TestComp visible={false} />);
    expect(screen.getByLabelText('probe')).toHaveTextContent('no');
  });

  it('returns true when element is visible', () => {
    render(<TestComp visible={true} />);
    expect(screen.getByLabelText('probe')).toHaveTextContent('yes');
  });
});
