import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

type Props = {
  children: React.ReactNode;
  delay?: string;
  y?: number;      // initial translateY
  once?: boolean;  // animate only once
};

const AnimatedOnView: React.FC<Props> = ({ children, delay = '0ms', y = 28, once = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Keep existing semantic for tests/SSR: style reflects visibility immediately
  const isVisible = useOnScreen(ref, { threshold: 0.2 });

  const reduceMotion = useMemo(() => isReducedMotion(), []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) return; // no motion
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;

    const { gsap, ScrollTrigger } = ensureGSAP();

    // Start from hidden state and animate when in view
    gsap.set(el, { opacity: 0, y, scale: 0.98, rotateX: -10 });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top 60%',
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  }, [delay, y, once, reduceMotion]);

  // Only apply the inline fallback when matchMedia is not supported (e.g., tests/SSR)
  const hasMM = typeof window !== 'undefined' && typeof (window as any).matchMedia === 'function';

  return (
    <div
      ref={ref}
      style={
        hasMM
          ? undefined
          : {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : `translateY(${y}px)`,
              transitionDelay: delay,
            }
      }
    >
      {children}
    </div>
  );
};

export default AnimatedOnView;
