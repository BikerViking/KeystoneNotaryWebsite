import { useState, useEffect, RefObject, useRef } from 'react';

declare global {
  interface Window { __DEBUG_TIME_SCALE__?: number }
}

export const useScrollProgress = <T extends HTMLElement,>(ref: RefObject<T>): number => {
  const [progress, setProgress] = useState(0);
  const target = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // AUDIT NOTE: This hook attaches a listener to the global 'scroll' event.
    // This can be a performance bottleneck because the event fires very
    // frequently during scrolling, potentially causing lag or jank, especially
    // when complex calculations are performed in the components that use this hook.
    // For performance-critical animations, consider libraries like GSAP's
    // ScrollTrigger, which uses a more optimized update loop (requestAnimationFrame).
    const handleScroll = () => {
      const { top, height } = element.getBoundingClientRect();
      // The total distance the element can be scrolled through within the viewport
      const scrollableHeight = height - window.innerHeight;
      
      if (scrollableHeight <= 0) {
        // If the element is smaller than the viewport, progress can be considered 0 or 1
        // depending on whether it's on screen. For simplicity, we can just return.
        target.current = top < 0 ? 1 : 0;
        setProgress(target.current);
        return;
      }
      
      // The amount scrolled is the negative of the element's top position relative to the viewport
      const amountScrolled = -top;
      
      // Calculate progress and clamp it between 0 and 1
      const currentProgress = Math.max(0, Math.min(1, amountScrolled / scrollableHeight));
      target.current = currentProgress;
      const ts = typeof window !== 'undefined' && typeof window.__DEBUG_TIME_SCALE__ === 'number' ? window.__DEBUG_TIME_SCALE__! : 1;
      if (ts >= 1) {
        setProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run on mount to get initial position
    handleScroll();

    // slow-motion interpolation loop (debug only)
    const step = () => {
      const ts = typeof window !== 'undefined' && typeof window.__DEBUG_TIME_SCALE__ === 'number' ? window.__DEBUG_TIME_SCALE__! : 1;
      if (ts < 1) {
        const alpha = 0.18 * Math.max(0.05, ts); // slower when ts smaller
        setProgress((prev) => prev + (target.current - prev) * alpha);
      }
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ref]);

  return progress;
};
