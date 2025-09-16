import React, { useLayoutEffect, useMemo, useRef } from 'react';
import Section from './Section';
import { useDebugFlag } from '../hooks/useDebugFlag';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

// --- Content (from metadata.json) ---
const content = {
  headline: "Your Trusted Partner in Official Documentation",
  bodyParagraphs: [
    "Keystone Notary Group, LLC was founded on the principles of integrity, professionalism, and unwavering attention to detail. We are NNA Certified Notary Signing Agents, and we carry full Error & Omission insurance. We understand the significance of the documents entrusted to us and are committed to providing a seamless and secure notarization experience.",
    "Our certified notaries are equipped with the knowledge and expertise to handle your most critical transactions with the confidentiality and care they deserve. We are more than a service; we are a partner you can rely on.",
    "Whether it's a complex loan signing, a simple affidavit, or an international document requiring an apostille, we bring precision and peace of mind to every interaction. Our commitment is to ensure your documents are handled correctly, every single time."
  ],
  imageUrl: "https://placehold.co/800x1000/1A1A1A/C0A062?text=Keystone",
  imageAlt: "Keystone Notary Group"
};

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useMemo(() => isReducedMotion(), []);

  const stageStyle = useMemo(() => ({
    perspective: reduceMotion ? 'none' : '1000px',
    transformStyle: reduceMotion ? 'flat' : 'preserve-3d',
  } as React.CSSProperties), [reduceMotion]);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || reduceMotion) return;

    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 0.6,
        },
        defaults: { ease: 'power2.out', duration: 1 }
      });

      // Image: from left/depth/blur
      tl.from(imgRef.current, {
        xPercent: -15,
        z: -130,
        scale: 0.92,
        opacity: 0.2,
        filter: 'blur(8px)',
      }, 0);

      // Title: from right/depth
      tl.from(titleRef.current, {
        xPercent: 15,
        z: -100,
        scale: 0.96,
        opacity: 0
      }, 0.05);

      // Copy: from right/depth, slightly later
      tl.from(copyRef.current, {
        xPercent: 18,
        z: -115,
        scale: 0.96,
        opacity: 0
      }, 0.1);

    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const debug = useDebugFlag();

  return (
    <Section id="about" className="bg-black z-10">
      <div ref={sectionRef} className="relative py-24 md:py-32">
        {debug && (
          <div className="fixed top-2 right-2 text-xs text-white bg-black/60 border border-zinc-800 rounded px-2 py-1 z-[9999] pointer-events-none">
            about: gsap
          </div>
        )}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center" style={stageStyle}>
            <div className="w-full rounded-2xl shadow-2xl overflow-hidden aspect-[4/5]">
              <img
                ref={imgRef}
                src={content.imageUrl}
                alt={content.imageAlt}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="relative">
              <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white font-serif">
                {content.headline}
              </h2>
              <div ref={copyRef} className="text-lg text-neutral-300 space-y-6 max-w-[65ch] mt-6">
                {content.bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
