import React, { useLayoutEffect, useMemo, useRef } from 'react';
import StarIcon from './icons/StarIcon';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

interface Testimonial {
    quote: string;
    author: string;
    company: string;
}

const testimonials: Testimonial[] = [
    {
        quote: "The team at Keystone was incredibly professional and efficient. They made a complex closing process feel simple and stress-free. Highly recommended!",
        author: "Sarah Johnson",
        company: "Real Estate Agent"
    },
    {
        quote: "Fast, reliable, and thorough. I needed urgent notarization for an international document, and Keystone handled it perfectly. Their apostille service is top-notch.",
        author: "Michael Chen",
        company: "International Exporter"
    },
    {
        quote: "I've used Keystone for all my business's legal documents. Their attention to detail and commitment to confidentiality gives me complete peace of mind.",
        author: "David Rodriguez",
        company: "Small Business Owner"
    }
];

// This defines the initial (stacked) state of the cards
const initialTransforms = [
    { rotate: -2, x: -4 },
    { rotate: 1.5, x: 2 },
    { rotate: -1, x: 4 }
];

// --- Configuration for Card Spacing ---
// Adjust these values to change the look and feel of the card stack animation.
const CARD_SPACING_CONFIG = {
  // The vertical offset (in pixels) between cards when they are stacked at the beginning.
  // Smaller number = tighter stack.
  STACKED_VERTICAL_OFFSET_PX: 12,
  
  // The percentage difference in scale between each card in the stack.
  // 0.05 means each card is 5% smaller than the one above it.
  STACKED_SCALE_DIFFERENCE: 0.05,
  
  // The total vertical spread (in pixels) of the cards when they are fully unstacked.
  // Larger number = cards are further apart at the end of the animation.
  UNSTACKED_VERTICAL_SPREAD_PX: 220,
};


const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const reduceMotion = useMemo(() => isReducedMotion(), []);
  useMemo(() => { ensureGSAP(); }, []);

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;

    const { gsap, ScrollTrigger } = ensureGSAP();
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        // Static end state: title visible, cards unstacked
        if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 });
        const count = testimonials.length;
        cardRefs.current.forEach((el, index) => {
          if (!el) return;
          const unstackedY = (index - (count - 1) / 2) * CARD_SPACING_CONFIG.UNSTACKED_VERTICAL_SPREAD_PX;
          gsap.set(el, {
            x: '-50%',
            yPercent: -50,
            y: unstackedY,
            scale: 1,
            rotate: 0,
          });
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // Title fades in over the first third
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.33 },
          0
        );
      }

      // Cards: from stacked to unstacked positions
      const count = testimonials.length;
      testimonials.forEach((t, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        const stacked = initialTransforms[index] || { rotate: 0, x: 0 };
        const stackedY = (index - (count - 1)) * CARD_SPACING_CONFIG.STACKED_VERTICAL_OFFSET_PX;
        const stackedScale = 1 - (count - 1 - index) * CARD_SPACING_CONFIG.STACKED_SCALE_DIFFERENCE;

        const unstackedY = (index - (count - 1) / 2) * CARD_SPACING_CONFIG.UNSTACKED_VERTICAL_SPREAD_PX;

        gsap.set(el, {
          x: `calc(-50% + ${stacked.x}px)`,
          yPercent: -50,
          y: stackedY,
          scale: stackedScale,
          rotate: stacked.rotate,
        });

        tl.to(
          el,
          {
            x: '-50%',
            y: unstackedY,
            scale: 1,
            rotate: 0,
            duration: 0.8,
          },
          0.1 + index * 0.07
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} id="testimonials" className="relative h-[300vh] bg-black">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ background: 'radial-gradient(circle, #111 0%, #000 80%)' }}
      >
        <div
          ref={titleRef}
          className="absolute top-0 w-full pt-20 md:pt-32 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Trusted by Professionals
          </h2>
        </div>

        <div className="relative w-full h-[500px] flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={(el) => (cardRefs.current[index] = el)}
              className="absolute w-[90%] max-w-xl"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: index,
                willChange: 'transform',
              }}
            >
              <div className="bg-zinc-900 rounded-xl p-8 h-full flex flex-col justify-between border border-zinc-800 shadow-2xl">
                <div>
                  <div className="flex text-neutral-300 mb-4">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </div>
                  <p className="text-neutral-300 italic mb-6">"{testimonial.quote}"</p>
                </div>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-sm text-neutral-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
