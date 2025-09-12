import React, { useLayoutEffect, useMemo, useRef } from 'react';
import StarIcon from './icons/StarIcon';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

// --- Content (from metadata.json) ---
const content = {
  headline: "Trusted by Professionals",
  testimonialItems: [
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
  ]
};

// This defines the initial (stacked) state of the cards
const initialTransforms = [
    { rotate: -2, x: -4 },
    { rotate: 1.5, x: 2 },
    { rotate: -1, x: 4 }
];

// --- Configuration for Card Spacing ---
const CARD_SPACING_CONFIG = {
  STACKED_VERTICAL_OFFSET_PX: 12,
  STACKED_SCALE_DIFFERENCE: 0.05,
  UNSTACKED_VERTICAL_SPREAD_PX: 220,
};

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const reduceMotion = useMemo(() => isReducedMotion(), []);

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        // Static end state: title visible, cards unstacked
        gsap.set(titleRef.current, { opacity: 1 });
        const count = content.testimonialItems.length;
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
      tl.from(titleRef.current, { opacity: 0, duration: 0.33 }, 0);

      // Cards: from stacked to unstacked positions
      const count = content.testimonialItems.length;
      content.testimonialItems.forEach((_, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        const stacked = initialTransforms[index] || { rotate: 0, x: 0 };
        const stackedY = (index - (count - 1)) * CARD_SPACING_CONFIG.STACKED_VERTICAL_OFFSET_PX;
        const stackedScale = 1 - (count - 1 - index) * CARD_SPACING_CONFIG.STACKED_SCALE_DIFFERENCE;
        const unstackedY = (index - (count - 1) / 2) * CARD_SPACING_CONFIG.UNSTACKED_VERTICAL_SPREAD_PX;

        tl.fromTo(el, {
          x: `calc(-50% + ${stacked.x}px)`,
          y: stackedY,
          scale: stackedScale,
          rotate: stacked.rotate,
        }, {
          x: '-50%',
          y: unstackedY,
          scale: 1,
          rotate: 0,
          duration: 0.8,
        }, 0.1 + index * 0.07);
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
            {content.headline}
          </h2>
        </div>

        <div className="relative w-full h-[500px] flex items-center justify-center">
          {content.testimonialItems.map((testimonial, index) => (
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
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
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
