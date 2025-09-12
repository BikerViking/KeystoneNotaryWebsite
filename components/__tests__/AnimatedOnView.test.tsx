import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

vi.mock('../../hooks/useOnScreen', () => {
  return { useOnScreen: vi.fn(() => false) };
});

import { useOnScreen } from '../../hooks/useOnScreen';
import AnimatedOnView from '../../components/AnimatedOnView';

describe('AnimatedOnView', () => {
  let originalMatchMedia: any;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('is hidden when not on screen', () => {
    (useOnScreen as any).mockReturnValue(false);
    render(
      <AnimatedOnView>
        <div aria-label="content">X</div>
      </AnimatedOnView>
    );
    const wrapper = screen.getByLabelText('content').parentElement as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');
  });

  it('fades in when on screen', () => {
    (useOnScreen as any).mockReturnValue(true);
    render(
      <AnimatedOnView>
        <div aria-label="content">X</div>
      </AnimatedOnView>
    );
    const wrapper = screen.getByLabelText('content').parentElement as HTMLElement;
    expect(wrapper.style.opacity).toBe('1');
  });
});

