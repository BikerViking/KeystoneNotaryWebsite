import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ensureGSAP, isReducedMotion, makeMM } from '../lib/gsap';
import { useDebugFlag } from '../hooks/useDebugFlag';
import DocumentIcon from './icons/DocumentIcon';
import StampIcon from './icons/StampIcon';
import GlobalIcon from './icons/GlobalIcon';
import UserBadgeIcon from './icons/UserBadgeIcon';
import CarKeyIcon from './icons/CarKeyIcon';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: <DocumentIcon />,
    title: 'Loan Signings',
    description: 'Expert handling of mortgage documents, ensuring all signatures and notarizations are executed correctly.',
  },
  {
    icon: <StampIcon />,
    title: 'General Notary Work',
    description: 'Professional notarization for documents including affidavits, powers of attorney, and contracts.',
  },
  {
    icon: <GlobalIcon />,
    title: 'Apostille Services',
    description: 'Facilitating the authentication of documents for international use, streamlining a complex process.',
  },
  {
    icon: <UserBadgeIcon />,
    title: 'I-9 Employment Verification',
    description: 'Authorized representation for verifying employee identity and employment eligibility.',
  },
  {
    icon: <CarKeyIcon />,
    title: 'Vehicle Title Transfers',
    description: 'Secure and verified notarization for vehicle sales, ensuring a smooth and legal transfer of ownership.',
  },
];

// --- Configuration for Service Card Animation ---
// Adjust these values to change the final layout and timing of the card animation.
const SERVICES_ANIMATION_CONFIG = {
  // --- Layout Configuration ---
  // How far the cards spread out horizontally, in `rem` units.
  // This provides a stable layout that doesn't over-expand on wide screens.
  HORIZONTAL_SPREAD_REM: 40,
  
  // How far the cards spread out vertically, as a percentage of the viewport height.
  // Larger number = taller spread.
  VERTICAL_SPREAD_VH: 50,
  
  // Add a gentle arc to the flight path (in vh)
  ARC_HEIGHT_VH: 10,
  
  // The maximum rotation of the outermost cards at their final position.
  MAX_ROTATION_DEG: 10,
  
  // --- Timing Configuration ---
  // Slower per-card animation (more scroll to complete)
  ANIMATION_DURATION: 0.4,
  
  // How much the start of each card's animation is staggered, as a fraction of the total scroll duration.
  // With 5 cards: (4 * 0.15) + 0.4 = 1.0 — full sequence.
  ANIMATION_STAGGER: 0.15,
};

// --- Fine-tuned final card layout ---
// Hand-tuned final positions to achieve a natural "tossed" spread
// without fully obscuring the text on any card.
const FINAL_LAYOUT: { xRem: number; yVh: number; rotate: number }[] = [
  { xRem: -20, yVh: -10, rotate: -17 }, // Loan Signings (slightly right of original)
  { xRem:  30, yVh:  -8, rotate:  10 }, // General Notary Work (far right, upper)
  { xRem: -18, yVh:  18, rotate:  -8 }, // Apostille Services (left, low)
  { xRem:  24, yVh:  24, rotate:   6 }, // I-9 Employment Verification (right, low)
  { xRem:   3, yVh:  -6, rotate:  14 }, // Vehicle Title Transfers (center-top, tilt right)
];

// Tighter mobile layout to reduce overlap and keep content readable.
const FINAL_LAYOUT_MOBILE: { xRem: number; yVh: number; rotate: number }[] = [
  { xRem:  -8, yVh:  -6, rotate: -12 },
  { xRem:  14, yVh:  -4, rotate:  10 },
  { xRem: -12, yVh:  12, rotate:  -8 },
  { xRem:  12, yVh:  14, rotate:   6 },
  { xRem:   0, yVh:  -2, rotate:  10 },
];

// Optional manual per-title tweaks on top of the preset layout.
const CARD_POSITION_OVERRIDES: { [key: string]: { xRem?: number; yVh?: number; rotate?: number } } = {
  'I-9 Employment Verification': { yVh: 2 },
};

// Stable pseudo-random jitter for a more natural, non-uniform layout
const RANDOM_JITTER = {
  X_REM: 2,        // tighter horizontal randomness
  Y_VH: 3,         // tighter vertical randomness
  ROT_DEG: 4,      // tighter rotation randomness
  SCALE: 0.02,     // smaller scale jitter
};

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const debug = useDebugFlag();

  // Ensure GSAP available
  useMemo(() => { ensureGSAP(); }, []);

  // Reduced motion
  const reduceMotion = useMemo(() => isReducedMotion(), []);

  const finalTransformsDesktop = FINAL_LAYOUT;
  const finalTransformsMobile = FINAL_LAYOUT_MOBILE;

  // Programmatically generate animation windows based on the config
  const animationWindows = useMemo(() => (
    services.map((_, index) => {
      const start = index * SERVICES_ANIMATION_CONFIG.ANIMATION_STAGGER;
      const end = start + SERVICES_ANIMATION_CONFIG.ANIMATION_DURATION;
      return { start, end };
    })
  ), []);

  // AUDIT NOTE: This component implements a complex, scroll-based animation by
  // manually calculating styles based on scroll progress. This approach has a
  // few drawbacks:
  // 1. Performance: Relies on a 'scroll' event listener which can be inefficient.
  // 2. Maintainability: The animation logic is complex, brittle, and hard to
  //    debug or modify. 
  // 3. Deviation: The project's `metadata.json` explicitly directs the use of
  //    GSAP and ScrollTrigger for animations. Refactoring this component to use
  //    GSAP would greatly simplify the code, improve performance, and align with
  //    the technical directives.

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    const stickyEl = stickyRef.current;
    if (!sectionEl || !stickyEl) return;
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;

    // Cleanup previous contexts on re-run
    const { gsap, ScrollTrigger } = ensureGSAP();
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        // Set final states without animations
        if (titleRef.current) {
          gsap.set(titleRef.current, { opacity: 1, y: 0 });
        }
        const useMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
        const fts = useMobile ? finalTransformsMobile : finalTransformsDesktop;
        cardRefs.current.forEach((el, index) => {
          if (!el) return;
          const finalT = fts[index];
          const scaleJitter = gsap.utils.random(-RANDOM_JITTER.SCALE, RANDOM_JITTER.SCALE);
          gsap.set(el, {
            opacity: 1,
            x: `${finalT.xRem}rem`,
            y: `${finalT.yVh}vh`,
            rotate: finalT.rotate,
            scale: 1 * (1 + scaleJitter),
          });
        });
        if (progressRef.current) {
          gsap.set(progressRef.current, { width: '100%' });
        }
        return;
      }

      // Build timelines by breakpoint
      const mm = makeMM();
      const build = () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });

        // Title fades/flies up as the sequence begins
        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -40, duration: SERVICES_ANIMATION_CONFIG.ANIMATION_DURATION },
            0
          );
        }

        // Cards fly from initial to final with a slight stagger window
        services.forEach((svc, index) => {
          const el = cardRefs.current[index];
          if (!el) return;

          const useMobile = window.matchMedia('(max-width: 767px)').matches;
          const finalT = (useMobile ? finalTransformsMobile : finalTransformsDesktop)[index];
          
          const initialXRem = (index % 2 === 0 ? 1 : -1) * gsap.utils.random(40, 60); // off-screen start
          const initialYVh = gsap.utils.random(10, 30);
          const initialRotate = (index % 2 === 0 ? 1 : -1) * gsap.utils.random(10, 20);
          const scaleJitter = gsap.utils.random(-RANDOM_JITTER.SCALE, RANDOM_JITTER.SCALE);

          const windowPos = animationWindows[index];
          const startAt = windowPos.start; // place within [0,1]
          const dur = SERVICES_ANIMATION_CONFIG.ANIMATION_DURATION;

          // Set initial state so there's no flash
          gsap.set(el, {
            opacity: 0,
            x: `${initialXRem}rem`,
            y: `${initialYVh}vh`,
            rotate: initialRotate,
            scale: 0.95,
          });

          // Animate to final state within the timeline window (with multipliers)
          tl.to(
            el,
            {
              opacity: 1,
              x: `${finalT.xRem + gsap.utils.random(-RANDOM_JITTER.X_REM, RANDOM_JITTER.X_REM)}rem`,
              y: `${finalT.yVh + gsap.utils.random(-RANDOM_JITTER.Y_VH, RANDOM_JITTER.Y_VH)}vh`,
              rotate: finalT.rotate + gsap.utils.random(-RANDOM_JITTER.ROT_DEG, RANDOM_JITTER.ROT_DEG),
              scale: 1 * (1 + scaleJitter),
              duration: dur,
            },
            startAt
          );
        });

        return tl;
      };

      mm.add('(max-width: 767px)', () => build());
      mm.add('(min-width: 768px)', () => build());

      // Progress rail synced to overall ScrollTrigger progress
      if (progressRef.current) {
        ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${Math.max(0, Math.min(100, self.progress * 100))}%`;
              progressRef.current.setAttribute('aria-valuenow', String(Math.round(self.progress * 100)));
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [animationWindows, finalTransformsDesktop, finalTransformsMobile, reduceMotion]);

  return (
    <section ref={sectionRef} id="services" className="relative h-[320vh] bg-black z-20 scroll-mt-24 md:scroll-mt-28">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden" style={{ background: 'radial-gradient(circle, #111 0%, #000 80%)', isolation: 'isolate' }}>
        
        <div ref={titleRef} className="absolute top-0 left-0 right-0 pt-[10vh] z-10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Expertise</h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              We offer a comprehensive suite of notary services designed for accuracy, confidentiality, and your convenience.
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
           {/* Progress rail for the sticky sequence */}
           <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800/60">
             <div
                ref={progressRef}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                className="h-full bg-neutral-300"
                style={{ width: '0%' }}
              />
           </div>
           <div className="relative w-full h-[450px]">
            {services.map((service, index) => (
              <div
                key={service.title}
                ref={(el) => (cardRefs.current[index] = el)}
                className="absolute w-full max-w-[18rem] md:max-w-sm"
                style={{
                  top: '50%',
                  left: '50%',
                  zIndex: index,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="bg-zinc-900 rounded-xl p-8 h-full border border-zinc-800">
                  <div className="mb-6 text-neutral-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          {debug && (
            <div className="fixed top-2 right-2 text-xs text-white bg-black/60 border border-zinc-800 rounded px-2 py-1 z-[9999] pointer-events-none">
              services: gsap
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
