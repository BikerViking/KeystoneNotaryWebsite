import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ensureGSAP, makeMM, isReducedMotion } from '../lib/gsap';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const primaryLine = useMemo(() => 'Reliable Notary Services,'.split(' '), []);
  const secondaryLine = useMemo(() => 'Executed with Precision.'.split(' '), []);

  const reduceMotion = useMemo(() => isReducedMotion(), []);
  useMemo(() => { ensureGSAP(); }, []);

  useLayoutEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      if (reduceMotion) return; // No motion for reduced-motion users

      const mm = makeMM();
      // Hint the browser for smoother transforms
      if (bgRef.current) gsap.set(bgRef.current, { willChange: 'transform' });
      if (midRef.current) gsap.set(midRef.current, { willChange: 'transform' });
      if (contentRef.current) gsap.set(contentRef.current, { willChange: 'transform' });
      const build = (bgY: number, bgScale: number, midY: number, contentY: number) => {
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            yPercent: bgY,
            scale: bgScale,
            transformOrigin: '50% 20%',
            force3D: true,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        if (midRef.current) {
          gsap.to(midRef.current, {
            yPercent: midY,
            force3D: true,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        if (contentRef.current) {
          gsap.to(contentRef.current, {
            yPercent: contentY,
            force3D: true,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      };

      // Make the effect significantly stronger
      mm.add('(max-width: 767px)', () => build(30, 1.15, 20, 14));
      mm.add('(min-width: 768px)', () => build(45, 1.22, 30, 20));

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.from(words, {
          opacity: 0,
          y: 12,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section ref={heroRef} id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden vignette">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      {/* Mid-layer highlight for added depth */}
      <div
        ref={midRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 40% at 50% 30%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 70%)'
        }}
      />
      <div 
        ref={vignetteRef}
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)',
        }}
      ></div>
      <div 
        ref={contentRef}
        className="relative z-20 px-6"
      >
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-tight mb-4"
          aria-label="Reliable Notary Services, Executed with Precision."
        >
          <span className="block">
            {primaryLine.map((w, i) => (
              <span
                key={`p-${i}-${w}`}
                className="word inline-block"
              >
                {w}{' '}
              </span>
            ))}
          </span>
          <span className="block text-neutral-300">
            {secondaryLine.map((w, i) => (
              <span
                key={`s-${i}-${w}`}
                className="word inline-block"
              >
                {w}{' '}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
          Keystone Notary Group provides professional, certified notary services for all your important documents. Fast, secure, and available when you need us.
        </p>
        <a href="#contact" className="inline-block bg-neutral-300 text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
          Schedule an Appointment
        </a>
      </div>
    </section>
  );
};

export default Hero;
