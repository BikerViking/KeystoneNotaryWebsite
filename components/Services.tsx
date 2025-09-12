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

// --- Config ---
// Hand-tuned final positions for the "tossed" card layout.
const FINAL_LAYOUT = {
  desktop: [
    { xRem: -20, yVh: -10, rotate: -17 }, // Loan Signings
    { xRem:  30, yVh:  -8, rotate:  10 }, // General Notary Work
    { xRem: -18, yVh:  18, rotate:  -8 }, // Apostille Services
    { xRem:  24, yVh:  24, rotate:   6 }, // I-9 Employment Verification
    { xRem:   0, yVh:  -5, rotate:  10 }, // Vehicle Title Transfers (adjusted)
  ],
  mobile: [
    { xRem:  -8, yVh:  -6, rotate: -12 },
    { xRem:  14, yVh:  -4, rotate:  10 },
    { xRem: -12, yVh:  12, rotate:  -8 },
    { xRem:  12, yVh:  14, rotate:   6 },
    { xRem:   0, yVh:  -2, rotate:  10 },
  ]
};

// Stable pseudo-random jitter for a more natural, non-uniform layout.
const RANDOM_JITTER = {
  X_REM: 2,
  Y_VH: 3,
  ROT_DEG: 4,
  SCALE: 0.02,
};

// --- Component ---
const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const debug = useDebugFlag();

  const reduceMotion = useMemo(() => isReducedMotion(), []);

  // AUDIT NOTE: This component implements a complex, scroll-based animation.
  // The logic has been refactored to simplify the GSAP timeline creation,
  // improve maintainability, and better align with the project's technical
  // directives, while preserving the original animation's appearance.
  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;

    const { gsap, ScrollTrigger } = ensureGSAP();
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const finalTransforms = isMobile ? FINAL_LAYOUT.mobile : FINAL_LAYOUT.desktop;

      if (reduceMotion) {
        // Set final states without animations for reduced motion users
        gsap.set(titleRef.current, { opacity: 1, y: 0 });
        cardRefs.current.forEach((el, index) => {
          if (!el) return;
          const finalT = finalTransforms[index];
          const scaleJitter = 1 + gsap.utils.random(-RANDOM_JITTER.SCALE, RANDOM_JITTER.SCALE);
          gsap.set(el, {
            opacity: 1,
            x: `${finalT.xRem}rem`,
            y: `${finalT.yVh}vh`,
            rotate: finalT.rotate,
            scale: scaleJitter,
          });
        });
        gsap.set(progressRef.current, { width: '100%' });
        return;
      }

      // Main timeline for the scroll-driven animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              const progress = Math.max(0, Math.min(100, self.progress * 100));
              progressRef.current.style.width = `${progress}%`;
              progressRef.current.setAttribute('aria-valuenow', String(Math.round(progress)));
            }
          },
        },
        defaults: { ease: 'power3.out' },
      });

      // Animate title out
      tl.to(titleRef.current, { opacity: 0, y: -40, duration: 0.4 }, 0);

      // Animate cards in with a stagger
      cardRefs.current.forEach((el, index) => {
        if (!el) return;

        const finalT = finalTransforms[index];
        const initialXRem = (index % 2 === 0 ? 1 : -1) * gsap.utils.random(40, 60);
        const initialYVh = gsap.utils.random(10, 30);
        const initialRotate = (index % 2 === 0 ? 1 : -1) * gsap.utils.random(10, 20);

        // Add jitter to final state for a more natural look
        const finalX = `${finalT.xRem + gsap.utils.random(-RANDOM_JITTER.X_REM, RANDOM_JITTER.X_REM)}rem`;
        const finalY = `${finalT.yVh + gsap.utils.random(-RANDOM_JITTER.Y_VH, RANDOM_JITTER.Y_VH)}vh`;
        const finalRotate = finalT.rotate + gsap.utils.random(-RANDOM_JITTER.ROT_DEG, RANDOM_JITTER.ROT_DEG);
        const finalScale = 1 + gsap.utils.random(-RANDOM_JITTER.SCALE, RANDOM_JITTER.SCALE);

        // Set initial state (off-screen)
        gsap.set(el, {
          opacity: 0,
          x: `${initialXRem}rem`,
          y: `${initialYVh}vh`,
          rotate: initialRotate,
          scale: 0.95,
        });

        // Animate to final state
        tl.to(el, {
          opacity: 1,
          x: finalX,
          y: finalY,
          rotate: finalRotate,
          scale: finalScale,
          duration: 0.4,
        }, "<15%"); // Stagger each animation
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

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
