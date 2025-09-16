import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ensureGSAP, makeMM, isReducedMotion } from '../lib/gsap';

// --- Content ---
const content = {
  headline: [
    "Keystone Notary Group,",
    "LLC"
  ],
  subheading: "Excellence. Precision. On Demand. Mobile Notary Public and NNA Certified Signing Agents serving Bucks, Lehigh, Montgomery, and Northampton counties.",
  ctaButton: { text: "Book an Appointment", href: "#booking" },
  backgroundImageUrl: "https://images.unsplash.com/photo-1617575429321-cde443657757?q=80&w=2500&auto=format&fit=crop"
};

// --- Component ---
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const primaryLine = useMemo(() => content.headline[0].split(' '), []);
  const secondaryLine = useMemo(() => content.headline[1].split(' '), []);
  const reduceMotion = useMemo(() => isReducedMotion(), []);

  useLayoutEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof window === 'undefined' || reduceMotion) return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const mm = makeMM();
      const allRefs = [bgRef.current, midRef.current, headlineRef.current, subheadingRef.current, ctaRef.current];
      gsap.set(allRefs, { willChange: 'transform' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none', force3D: true }
      });

      // Background layer
      tl.to(bgRef.current, { yPercent: 35, scale: 1.2, transformOrigin: '50% 20%' });

      // Mid-layer (glow)
      tl.to(midRef.current, { yPercent: 25 }, 0);

      // Content layers (staggered parallax)
      tl.to(headlineRef.current, { yPercent: 70 }, 0);
      tl.to(subheadingRef.current, { yPercent: 50 }, 0);
      tl.to(ctaRef.current, { yPercent: 40 }, 0);

      // Word reveal animation (initial entrance)
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
    <section ref={heroRef} id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 hero-bg"
      />
      {/* Mid-layer highlight for added depth */}
      <div
        ref={midRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(60% 40% at 50% 30%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 70%)'
        }}
      />
      {/* Vignette overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          background: 'radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <div ref={contentRef} className="relative z-20 px-6">
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-tight mb-6 font-serif"
          aria-label={content.headline.join(' ')}
        >
          <span className="block">
            {primaryLine.map((w, i) => (
              <span key={`p-${i}-${w}`} className="word inline-block">{w}{' '}</span>
            ))}
          </span>
          <span className="block text-gold text-4xl md:text-6xl lg:text-7xl">
            {secondaryLine.map((w, i) => (
              <span key={`s-${i}-${w}`} className="word inline-block">{w}{' '}</span>
            ))}
          </span>
        </h1>
        <p ref={subheadingRef} className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto mb-8">
          {content.subheading}
        </p>
        <a
          ref={ctaRef}
          href={content.ctaButton.href}
          className="inline-block rounded-full bg-gold px-8 py-4 text-lg font-semibold text-black shadow-sm hover:bg-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300 transform hover:scale-105"
        >
          {content.ctaButton.text}
        </a>
      </div>
    </section>
  );
};

export default Hero;
