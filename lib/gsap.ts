import gsapCore from 'gsap';
import ScrollTriggerPlugin from 'gsap/ScrollTrigger';

// Ensure GSAP + ScrollTrigger are registered once.
export const ensureGSAP = () => {
  // Safe to call multiple times. Avoid registering in environments without matchMedia (e.g., jsdom tests)
  if (typeof window !== 'undefined' && typeof (window as any).matchMedia === 'function') {
    gsapCore.registerPlugin(ScrollTriggerPlugin);
  }
  return { gsap: gsapCore, ScrollTrigger: ScrollTriggerPlugin };
};

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  // Developer override: URL ?motion=on or localStorage MOTION_OVERRIDE=on
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('motion') === 'on') return false;
  } catch {}
  try {
    if (typeof w.localStorage !== 'undefined' && w.localStorage.getItem('MOTION_OVERRIDE') === 'on') return false;
  } catch {}
  if (typeof w.matchMedia !== 'function') return false;
  try {
    return w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

// Create a gsap.matchMedia instance
export const makeMM = () => ensureGSAP().gsap.matchMedia();

// Common breakpoints
export const breakpoints = {
  sm: '(max-width: 639px)',
  md: '(min-width: 640px)',
  lg: '(min-width: 1024px)',
};

// Attach global ScrollTrigger refresh on load/resize (debounced)
export const attachGlobalScrollTriggerRefresh = () => {
  if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return () => {};
  const { gsap, ScrollTrigger } = ensureGSAP();
  const refresh = () => {
    try {
      (ScrollTrigger as any) && (ScrollTrigger as any).refresh && (ScrollTrigger as any).refresh();
    } catch {}
  };
  const onResize = () => gsap.delayedCall(0.2, refresh);
  const onHash = () => gsap.delayedCall(0.05, refresh);
  const onPop = () => gsap.delayedCall(0.05, refresh);
  window.addEventListener('load', refresh);
  window.addEventListener('resize', onResize);
  window.addEventListener('hashchange', onHash);
  window.addEventListener('popstate', onPop);
  return () => {
    window.removeEventListener('load', refresh);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('hashchange', onHash);
    window.removeEventListener('popstate', onPop);
  };
};

export { gsapCore as gsap, ScrollTriggerPlugin as ScrollTrigger };
