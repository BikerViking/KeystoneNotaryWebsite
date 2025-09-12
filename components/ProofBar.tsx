import React from 'react';
import Section from './Section';

type Proof = {
  label: string;
  value?: string;
  href?: string;
  icon?: string;
};

const proofs: Proof[] = [
  { label: 'NNA Certified', href: '#', icon: '/assets/nna-seal.png' },
  { label: 'Background Checked', href: '#' },
  { label: 'Bonded & Insured', value: 'E&O $100k', href: '#' },
  { label: 'Years in Business', value: '7+' },
  { label: 'Notarizations Completed', value: '3,200+' },
];

const ProofBar: React.FC = () => {
  return (
    <Section id="proof" className="bg-black -mt-12 sm:-mt-16 md:-mt-20">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-4">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {proofs.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href || undefined}
                  className={`group block rounded-lg px-2 py-4 transition-colors duration-300 ${p.href ? 'hover:bg-zinc-800/60' : 'cursor-default'}`}
                  onClick={(e) => !p.href && e.preventDefault()}
                >
                  <div className="font-semibold text-white text-sm sm:text-base">{p.label}</div>
                  {p.value && <div className="text-xs sm:text-sm text-neutral-400 mt-1">{p.value}</div>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default ProofBar;
