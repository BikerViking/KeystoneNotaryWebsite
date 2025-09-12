import React, { useLayoutEffect, useMemo, useRef } from 'react';
import Section from './Section';
import { useDebugFlag } from '../hooks/useDebugFlag';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  // Easing helpers
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const easeInOutSine = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);

  // Reduced-motion guard
  const reduceMotion = useMemo(() => isReducedMotion(), []);

  // Parallax/animation styles
  const stageStyle = useMemo(() => {
    if (reduceMotion) return {};
    return {
      perspective: '1000px',
      transformStyle: 'preserve-3d',
    } as React.CSSProperties;
  }, [reduceMotion]);

  // Drive the animation with GSAP ScrollTrigger using the same formulas
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof (window as any).matchMedia !== 'function') return;

    const { gsap, ScrollTrigger } = ensureGSAP();

    // Reduced motion: snap to end states
    if (reduceMotion) {
      if (imgRef.current) gsap.set(imgRef.current, { x: 0, yPercent: -5, z: 0, scale: 1, opacity: 1, filter: 'blur(0px)' });
      if (titleRef.current) gsap.set(titleRef.current, { x: 0, y: 0, z: 0, scale: 1, opacity: 1 });
      if (copyRef.current) gsap.set(copyRef.current, { x: 0, y: 0, z: 0, scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Will-change hints
      if (imgRef.current) gsap.set(imgRef.current, { willChange: 'transform, filter' });
      if (titleRef.current) gsap.set(titleRef.current, { willChange: 'transform, opacity' });
      if (copyRef.current) gsap.set(copyRef.current, { willChange: 'transform, opacity' });

      const onUpdate = (self: any) => {
        const p = self.progress; // 0..1
        const clamp = (v: number) => Math.max(0, Math.min(1, v));
        const es = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);

        // Image (from left/lower/depth)
        if (imgRef.current) {
          const yPercent = (p - 0.5) * -10;
          const meet = es(clamp((p - 0.05) / 0.72));
          const x = -70 * (1 - meet);
          const z = -130 * (1 - meet);
          const scale = 0.92 + (1 - 0.92) * meet;
          const opacity = es(clamp((p - 0.04) / 0.75));
          const blur = 2 * (1 - meet);
          gsap.set(imgRef.current, { x, yPercent, z, scale, opacity, filter: `blur(${blur}px)` });
        }

        // Title (from right/upper/depth)
        if (titleRef.current) {
          const vis = es(clamp((p - 0.09) / 0.75));
          const meet = es(clamp((p - 0.07) / 0.72));
          const x = 74 * (1 - meet);
          const y = -(1 - vis) * 30;
          const z = -100 * (1 - meet);
          const scale = 0.96 + (1 - 0.96) * meet;
          gsap.set(titleRef.current, { x, y, z, scale, opacity: vis });
        }

        // Copy (later than title, from right/upper/depth)
        if (copyRef.current) {
          const vis = es(clamp((p - 0.13) / 0.78));
          const meet = es(clamp((p - 0.11) / 0.78));
          const x = 82 * (1 - meet);
          const y = -(1 - vis) * 26;
          const z = -115 * (1 - meet);
          const scale = 0.96 + (1 - 0.96) * meet;
          gsap.set(copyRef.current, { x, y, z, scale, opacity: vis });
        }
      };

      const mm = gsap.matchMedia();
      mm.add('(max-width: 767px)', () => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          end: 'top 0%',
          scrub: 0.55,
          onUpdate,
        });
      });
      mm.add('(min-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          end: 'top -10%',
          scrub: 0.65,
          onUpdate,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const debug = useDebugFlag();

  return (
    <Section id="about" className="bg-black z-10">
      <div ref={sectionRef} className="relative min-h-[160vh]">
        {debug && (
          <div className="fixed top-2 right-2 text-xs text-white bg-black/60 border border-zinc-800 rounded px-2 py-1 z-[9999] pointer-events-none">
            about: gsap
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20" style={stageStyle}>
          <div className="md:sticky top-0 h-screen md:flex md:items-center">
            <div className="w-full rounded-2xl shadow-2xl overflow-hidden aspect-[4/5] mt-20 md:mt-0 xl:-ml-6">
              <img
                ref={imgRef}
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Snowy mountains representing the 'Keystone' name"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="md:pt-32">
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white">
              Your Trusted Partner in <span className="text-neutral-300">Official Documentation</span>
            </h2>
          <div ref={copyRef} className="text-lg space-y-6 max-w-[65ch] mt-6">
            <p>
              Keystone Notary Group, LLC was founded on the principles of integrity, professionalism, and unwavering attention to detail. We understand the significance of the documents entrusted to us and are committed to providing a seamless and secure notarization experience.
            </p>
            <p>
              Our certified notaries are equipped with the knowledge and expertise to handle your most critical transactions with the confidentiality and care they deserve. We are more than a service; we are a partner you can rely on.
              </p>
              <p>
                Whether it's a complex loan signing, a simple affidavit, or an international document requiring an apostille, we bring precision and peace of mind to every interaction. Our commitment is to ensure your documents are handled correctly, every single time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
