import { useEffect } from 'react';
import { ensureGSAP } from './gsap';

// Generic hook: call this with a key that changes on route change
// Example with React Router: useScrollTriggerRefreshOnKey(useLocation().pathname)
export const useScrollTriggerRefreshOnKey = (key: unknown) => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;
    const { ScrollTrigger } = ensureGSAP();
    try {
      (ScrollTrigger as any)?.refresh?.();
    } catch {}
  }, [key]);
};

