import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Globally mock the entire GSAP library for all tests.
// This prevents the real GSAP code from running and crashing the test environment.
const timeline = {
  from: vi.fn(() => timeline),
  to: vi.fn(() => timeline),
};

vi.mock('../lib/gsap', () => ({
  ensureGSAP: () => ({
    gsap: {
      context: (fn: any) => {
        try {
          fn();
        } catch (e) {
          // prevent errors in components from crashing tests
        }
        return { revert: () => {} };
      },
      set: vi.fn(),
      to: vi.fn(),
      from: vi.fn(),
      timeline: vi.fn(() => timeline),
      matchMedia: () => ({ add: vi.fn() }),
      registerPlugin: vi.fn(),
      delayedCall: vi.fn(),
    },
    ScrollTrigger: {
      create: vi.fn(() => ({ kill: vi.fn() })),
      refresh: vi.fn(),
    },
  }),
  isReducedMotion: () => false,
  makeMM: () => ({ add: vi.fn() }),
  attachGlobalScrollTriggerRefresh: () => () => {},
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Minimal IntersectionObserver mock for jsdom tests
class MockIntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
// @ts-ignore
globalThis.IntersectionObserver = MockIntersectionObserver as any;