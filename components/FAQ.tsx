import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import Section from './Section';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';
import AnimatedOnView from './AnimatedOnView';

// --- Types & Content ---
type FAQItem = { q: string; a: string };

const items: FAQItem[] = [
  {
    q: 'What documents can you notarize?',
    a: 'We handle loan packages, powers of attorney, affidavits, deeds, I‑9 verifications (as an authorized representative), vehicle title transfers, and more. If you are unsure, reach out and we will confirm eligibility.'
  },
  {
    q: 'Do you offer mobile or on‑site service?',
    a: 'Yes. We travel to homes, offices, hospitals, and public locations within our service area. Travel fees are quoted up front and included in your confirmation.'
  },
  {
    q: 'What should I bring to the appointment?',
    a: 'A valid government‑issued photo ID, unsigned documents, and any required witnesses. If witnesses are needed and you cannot provide them, ask us and we can help arrange independent witnesses.'
  },
  {
    q: 'Can you help with apostilles for international use?',
    a: 'Yes. We facilitate apostille processing for eligible documents and provide clear instructions, shipping labels, and status updates.'
  },
  {
    q: 'Are you available outside standard business hours?',
    a: 'We operate by appointment and accommodate evenings and weekends when possible. Same‑day and rush service is available based on availability.'
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing depends on document type, number of notarizations, travel distance, and urgency. You will receive an itemized quote before booking—no surprises.'
  }
];

// --- Sub-components ---

const AccordionItem: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  const answerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    gsap.to(answerRef.current, {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.4,
      ease: 'power3.inOut',
      onStart: () => answerRef.current?.style.setProperty('display', 'block'),
      onComplete: () => {
        if (!isOpen) {
          answerRef.current?.style.setProperty('display', 'none');
        }
      }
    });
    gsap.to(iconRef.current, {
      rotate: isOpen ? 45 : 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }, [isOpen]);

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-neutral-100">{item.q}</span>
        <svg
          ref={iconRef}
          className="h-6 w-6 flex-shrink-0 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <div
        ref={answerRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, display: 'none' }}
      >
        <p className="pb-6 text-neutral-300 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
};

// --- Main Component ---

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = isReducedMotion();

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.a,
      },
    })),
  }), []);

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const { gsap } = ensureGSAP();
    const q = gsap.utils.toArray<HTMLElement>('.faq-item');

    gsap.from(q, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }, [reduceMotion]);

  return (
    <Section id="faq" className="bg-black" debugName="faq">
      <div ref={sectionRef} className="container mx-auto max-w-3xl px-6">
        <AnimatedOnView>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center">Frequently Asked Questions</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mt-4 text-center">
            Straight answers about our services, scheduling, and requirements.
          </p>
        </AnimatedOnView>

        <div className="mt-12">
          {items.map((item, index) => (
            <div key={index} className="faq-item">
              <AccordionItem
                item={item}
                isOpen={activeIndex === index}
                onClick={() => handleItemClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
};

export default FAQ;
