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

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: self => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: parseFloat(delay) / 1000 || 0
        });
        if (once) self.kill();
      },
      onLeaveBack: () => {
        if (!once) gsap.to(el, { opacity: 0, y, scale: 0.98, rotateX: -10, duration: 0.5, ease: 'power2.in' });
      },
    });

    return () => st.kill();
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
