import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import Section from './Section';
import { ensureGSAP, isReducedMotion } from '../lib/gsap';

type FAQItem = { q: string; a: string };

const FAQ: React.FC = () => {
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
  }), [items]);

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const questionsListRef = useRef<HTMLUListElement>(null);
  const reduceMotion = isReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = e.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      const buttons = questionsListRef.current?.querySelectorAll('button');
      buttons?.[newIndex]?.focus();
      setActiveIndex(newIndex);
    }
  };

  useLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    if (!reduceMotion) {
      tl.from(questionsRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }).from(
        answersRef.current,
        {
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    answerRefs.current.forEach((el, index) => {
      gsap.to(el, {
        height: index === activeIndex ? 'auto' : 0,
        opacity: index === activeIndex ? 1 : 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    });
  }, [activeIndex]);

  return (
    <Section id="faq" className="bg-black" debugName="faq">
      <div ref={sectionRef}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mt-4">
            Straight answers about our services, scheduling, and requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div ref={questionsRef} className="md:sticky top-24 h-full">
            <ul ref={questionsListRef} className="space-y-4">
              {items.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-expanded={activeIndex === index}
                    className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                      activeIndex === index
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-900 text-neutral-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="font-semibold">{item.q}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div ref={answersRef}>
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => (answerRefs.current[index] = el)}
                className="overflow-hidden"
                style={{ height: index === activeIndex ? 'auto' : 0 }}
              >
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-neutral-300 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
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
