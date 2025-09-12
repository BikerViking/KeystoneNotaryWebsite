import React from 'react';
import SmartImage from './SmartImage';
import Section from './Section';

type Proof = {
  label: string;
  value?: string;
  href?: string;
};

const proofs: Proof[] = [
  { label: 'NNA Certified', href: '#' },
  { label: 'Background Checked', href: '#' },
  { label: 'Bonded & Insured', value: 'E&O $100k', href: '#' },
  { label: 'Years in Business', value: '7+' },
  { label: 'Notarizations Completed', value: '3,200+' },
];

const ProofBar: React.FC = () => {
  return (
    <Section id="proof" className="bg-black">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 md:p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-center">
          {proofs.map((p) => (
            <li key={p.label} className="">
              {p.href ? (
                <a
                  href={p.href}
                  className="group block rounded-xl border border-zinc-800/80 bg-black/40 px-4 py-3 text-sm md:text-base text-neutral-200 hover:bg-zinc-900/60 transition-colors duration-300"
                >
                  {p.label.includes('NNA') && (
                    <SmartImage src="/assets/nna-seal.png" alt="NNA Certified Notary Signing Agent" width={48} height={48} className="inline-block h-10 w-10 md:h-12 md:w-12 mr-2 align-middle" />
                  )}
                  <span className="font-semibold text-white mr-2 align-middle">{p.label}</span>
                  {p.value && <span className="text-neutral-400">{p.value}</span>}
                  <span className="sr-only"> (opens verification)</span>
                </a>
              ) : (
                <div className="rounded-xl border border-zinc-800/80 bg-black/40 px-4 py-3 text-sm md:text-base text-neutral-200">
                  {p.label.includes('NNA') && (
                    <SmartImage src="/assets/nna-seal.png" alt="NNA Certified Notary Signing Agent" width={48} height={48} className="inline-block h-10 w-10 md:h-12 md:w-12 mr-2 align-middle" />
                  )}
                  <span className="font-semibold text-white mr-2 align-middle">{p.label}</span>
                  {p.value && <span className="text-neutral-400">{p.value}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default ProofBar;
