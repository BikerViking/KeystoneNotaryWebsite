import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ensureGSAP, makeMM, isReducedMotion } from '../lib/gsap';

// --- Content (from metadata.json) ---
const content = {
  headline: [
    "Reliable Notary Services,",
    "Executed with Precision."
  ],
  subheading: "Mobile Notary Public and NNA Certified Signing Agents serving Bucks, Lehigh, Montgomery, and Northampton counties.",
  ctaButton: { text: "Schedule an Appointment", href: "#booking" },
  backgroundImageUrl: "https://placehold.co/1920x1080/1A1A1A/FFFFFF?text=Keystone+Notary+Group"
};

// --- Component ---
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const primaryLine = useMemo(() => content.headline[0].split(' '), []);
  const secondaryLine = useMemo(() => content.headline[1].split(' '), []);
  const reduceMotion = useMemo(() => isReducedMotion(), []);

  useLayoutEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof window === 'undefined' || reduceMotion) return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const mm = makeMM();
      // Hint the browser for smoother transforms
      gsap.set([bgRef.current, midRef.current, contentRef.current], { willChange: 'transform' });

      const build = (bgY: number, bgScale: number, midY: number, contentY: number) => {
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

        tl.to(bgRef.current, { yPercent: bgY, scale: bgScale, transformOrigin: '50% 20%' })
          .to(midRef.current, { yPercent: midY }, 0)
          .to(contentRef.current, { yPercent: contentY }, 0);
      };

      mm.add('(max-width: 767px)', () => build(30, 1.15, 20, 14));
      mm.add('(min-width: 768px)', () => build(45, 1.22, 30, 20));

      // Word reveal animation
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
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('${content.backgroundImageUrl}')` }}
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
          <span className="block text-gold">
            {secondaryLine.map((w, i) => (
              <span key={`s-${i}-${w}`} className="word inline-block">{w}{' '}</span>
            ))}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto mb-8">
          {content.subheading}
        </p>
        <a
          href={content.ctaButton.href}
          className="inline-block rounded-full bg-neutral-100 px-8 py-4 text-lg font-semibold text-black shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 transition-all duration-300 transform hover:scale-105"
        >
          {content.ctaButton.text}
        </a>
      </div>
    </section>
  );
};

export default Hero;
