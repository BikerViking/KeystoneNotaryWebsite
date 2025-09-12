import React, { useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
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

const seededRand = (seed: string, min: number, max: number) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  const t = Math.sin(h) * 10000;
  const frac = t - Math.floor(t);
  return min + frac * (max - min);
};


const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress(sectionRef);

  const titleOpacity = Math.max(0, 1 - scrollProgress * 5);
  const titleTranslateY = scrollProgress * -40;

  // Determine final positions (prefer preset layout; fallback to programmatic pattern)
  const baseFinalTransforms = services.map((service, index) => {
    const preset = FINAL_LAYOUT[index];
    if (preset) {
      const override = CARD_POSITION_OVERRIDES[service.title];
      // Apply stable jitter based on title for natural variance
      const jx = seededRand(service.title + ':x', -RANDOM_JITTER.X_REM, RANDOM_JITTER.X_REM);
      const jy = seededRand(service.title + ':y', -RANDOM_JITTER.Y_VH, RANDOM_JITTER.Y_VH);
      const jr = seededRand(service.title + ':r', -RANDOM_JITTER.ROT_DEG, RANDOM_JITTER.ROT_DEG);
      return {
        xRem: preset.xRem + (override?.xRem || 0) + jx,
        yVh: preset.yVh + (override?.yVh || 0) + jy,
        rotate: preset.rotate + (override?.rotate || 0) + jr,
      };
    }

    const totalItems = services.length;
    const progress = index / Math.max(1, (totalItems - 1));
    const isEven = index % 2 === 0;
    const magnitudeFactor = 1 - Math.floor(index / 2) / Math.max(1, Math.floor(totalItems / 2));

    let xRem = (isEven ? -1 : 1) * (SERVICES_ANIMATION_CONFIG.HORIZONTAL_SPREAD_REM / 2) * magnitudeFactor;
    let yVh = (progress - 0.5) * SERVICES_ANIMATION_CONFIG.VERTICAL_SPREAD_VH;
    let rotate = (isEven ? -1 : 1) * SERVICES_ANIMATION_CONFIG.MAX_ROTATION_DEG * magnitudeFactor;

    const override = CARD_POSITION_OVERRIDES[service.title];
    const jx = seededRand(service.title + ':x', -RANDOM_JITTER.X_REM, RANDOM_JITTER.X_REM);
    const jy = seededRand(service.title + ':y', -RANDOM_JITTER.Y_VH, RANDOM_JITTER.Y_VH);
    const jr = seededRand(service.title + ':r', -RANDOM_JITTER.ROT_DEG, RANDOM_JITTER.ROT_DEG);
    if (override) {
      xRem += (override.xRem || 0);
      yVh += (override.yVh || 0);
      rotate += (override.rotate || 0);
    }
    return { xRem: xRem + jx, yVh: yVh + jy, rotate: rotate + jr };
  });

  // Apply a light collision-avoidance pass near the end state to protect readability.
  // Converts rem/vh into px using current viewport and font metrics.
  const finalTransforms = (() => {
    const remPx = (() => {
      if (typeof window === 'undefined') return 16;
      const fs = getComputedStyle(document.documentElement).fontSize;
      const v = parseFloat(fs || '16');
      return Number.isFinite(v) ? v : 16;
    })();
    const vhPx = (typeof window !== 'undefined') ? (window.innerHeight / 100) : 8;

    const MIN_DIST_PX = 220; // approx card readable separation
    const MAX_ITERS = 8;
    const DAMP = 0.4; // smaller = gentler nudges

    const t = baseFinalTransforms.map(v => ({ ...v }));
    for (let iter = 0; iter < MAX_ITERS; iter++) {
      let moved = false;
      for (let i = 0; i < t.length; i++) {
        for (let j = i + 1; j < t.length; j++) {
          const ax = t[i].xRem * remPx;
          const ay = t[i].yVh * vhPx;
          const bx = t[j].xRem * remPx;
          const by = t[j].yVh * vhPx;
          const dx = bx - ax;
          const dy = by - ay;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < MIN_DIST_PX) {
            const push = (MIN_DIST_PX - dist) * DAMP;
            const ux = dx / dist;
            const uy = dy / dist;
            // Move both away from each other along their line
            const px = ux * push * 0.5;
            const py = uy * push * 0.5;
            t[i].xRem -= px / remPx;
            t[i].yVh  -= py / vhPx;
            t[j].xRem += px / remPx;
            t[j].yVh  += py / vhPx;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return t;
  })();

  // Programmatically generate animation windows based on the config
  const animationWindows = services.map((_, index) => {
    const start = index * SERVICES_ANIMATION_CONFIG.ANIMATION_STAGGER;
    const end = start + SERVICES_ANIMATION_CONFIG.ANIMATION_DURATION;
    return { start, end };
  });

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

  return (
    <section ref={sectionRef} id="services" className="relative h-[500vh] bg-black z-20">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: 'radial-gradient(circle, #111 0%, #000 80%)', isolation: 'isolate' }}>
        
        <div 
          style={{ 
            opacity: titleOpacity, 
            transform: `translateY(${titleTranslateY}px)`,
            willChange: 'opacity, transform',
          }}
          className="absolute top-0 left-0 right-0 pt-[10vh] z-10"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Expertise</h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              We offer a comprehensive suite of notary services designed for accuracy, confidentiality, and your convenience.
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
           <div className="relative w-full h-[450px]">
            {services.map((service, index) => {
              const window = animationWindows[index];

              let cardProgress = (scrollProgress - window.start) / (window.end - window.start);
              cardProgress = Math.max(0, Math.min(1, cardProgress));
              // Slower landing: ease-out cubic
              const easedProgress = 1 - Math.pow(1 - cardProgress, 3);
              
              const finalT = finalTransforms[index];

              const initialXRem = (index % 2 === 0 ? 1 : -1) * 60; // Start off-screen
              const initialYVh = 20;
              const initialRotate = (index % 2 === 0 ? 1 : -1) * 15;

              const currentXRem = initialXRem * (1 - easedProgress) + finalT.xRem * easedProgress;
              const arcOffsetVh = -SERVICES_ANIMATION_CONFIG.ARC_HEIGHT_VH * Math.sin(Math.PI * cardProgress);
              const currentYVh = initialYVh * (1 - easedProgress) + finalT.yVh * easedProgress + arcOffsetVh;
              const currentRotate = initialRotate * (1 - easedProgress) + finalT.rotate * easedProgress;
              const scaleBase = 0.95 + easedProgress * 0.05;
              const scaleJitter = seededRand(services[index].title + ':s', -RANDOM_JITTER.SCALE, RANDOM_JITTER.SCALE);
              const scale = scaleBase * (1 + scaleJitter);
              const opacity = easedProgress;

              return (
                 <div
                  key={service.title}
                  className="absolute w-full max-w-sm"
                  style={{
                    opacity,
                    top: '50%',
                    left: '50%',
                    zIndex: index,
                    transform: `translate(-50%, -50%) translateX(${currentXRem}rem) translateY(${currentYVh}vh) rotate(${currentRotate}deg) scale(${scale})`,
                    willChange: 'transform, opacity',
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
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
