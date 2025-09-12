import React from 'react';
import Section from './Section';
import AnimatedOnView from './AnimatedOnView';

type Job = {
  when: string; // e.g., "Today", "Yesterday"
  type: string; // e.g., "Apostille"
  area: string; // e.g., "Center City"
  duration: string; // e.g., "28 min onsite"
};

const jobs: Job[] = [
  { when: 'Today', type: 'Loan Signing', area: 'Rittenhouse', duration: '45 min onsite' },
  { when: 'Today', type: 'I-9 Verification', area: 'University City', duration: '15 min onsite' },
  { when: 'Yesterday', type: 'Apostille', area: 'Center City', duration: '28 min onsite' },
  { when: 'Yesterday', type: 'Vehicle Title', area: 'South Philly', duration: '20 min onsite' },
  { when: 'This week', type: 'POA Notarization', area: 'Manayunk', duration: '25 min onsite' },
];

const RecentJobs: React.FC = () => {
  return (
    <Section id="recent-work" className="bg-black">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Recent Work</h2>
        <p className="text-neutral-400 max-w-[65ch] mx-auto mt-3">An anonymized snapshot that shows recency and range of services.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {jobs.map((j, i) => (
          <AnimatedOnView key={i} delay={`${i * 60}ms`}>
            <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-left ${j.when === 'Today' ? 'shimmer' : ''}`}>
              <div className="text-neutral-400 text-xs mb-2">{j.when}</div>
              <div className="text-white font-semibold">{j.type}</div>
              <div className="text-neutral-300">{j.area}</div>
              <div className="text-neutral-500 text-sm mt-2 flex items-center gap-2">
                {j.when === 'Today' && <span aria-hidden className="live-indicator" />}
                <span>{j.duration}</span>
              </div>
            </div>
          </AnimatedOnView>
        ))}
      </div>
    </Section>
  );
};

export default RecentJobs;
