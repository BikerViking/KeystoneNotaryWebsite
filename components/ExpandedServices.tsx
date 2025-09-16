import React from 'react';
import Section from './Section';
import AnimatedOnView from './AnimatedOnView';
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

// Re-using the same service data, but we can expand descriptions here.
const detailedServices: Service[] = [
  {
    icon: <DocumentIcon />,
    title: 'Loan Signings',
    description: 'Expert handling of mortgage documents for purchases, refinancing, and equity lines of credit. We ensure all signatures and notarizations are executed correctly and returned promptly.',
  },
  {
    icon: <StampIcon />,
    title: 'General Notary Work',
    description: 'Professional notarization for a wide range of documents including affidavits, powers of attorney, trusts, wills, and contracts. Your documents are handled with confidentiality and care.',
  },
  {
    icon: <GlobalIcon />,
    title: 'Apostille Services',
    description: 'Facilitating the authentication of documents for international use. We streamline the complex process of obtaining an apostille, making your documents valid for use in foreign countries.',
  },
  {
    icon: <UserBadgeIcon />,
    title: 'I-9 Employment Verification',
    description: 'As an authorized representative, we can complete Section 2 of the Form I-9, verifying employee identity and employment eligibility on behalf of employers.',
  },
  {
    icon: <CarKeyIcon />,
    title: 'Vehicle Title Transfers',
    description: 'Secure and verified notarization for vehicle sales, family transfers, and duplicate title applications. We ensure a smooth and legal transfer of ownership every time.',
  },
  {
    // Adding a new service as an example of expansion
    icon: <StampIcon />, // You can create a new icon component
    title: 'Oaths & Affirmations',
    description: 'Administering legally binding oaths and affirmations for depositions, court proceedings, and other legal contexts where sworn testimony is required.',
  }
];

const ExpandedServices: React.FC = () => {
  return (
    <Section id="detailed-services" className="py-24 sm:py-32 bg-zinc-950" debugName="ExpandedServices">
      <div className="container mx-auto px-6">
        <AnimatedOnView>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">Our Services in Detail</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-300 max-w-3xl mx-auto">
              We provide a wide range of notarial services to meet your needs with professionalism and precision.
            </p>
          </div>
        </AnimatedOnView>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {detailedServices.map((service, index) => (
            <AnimatedOnView key={service.title} delay={`${index * 100}ms`}>
              <div className="flex flex-col items-start text-left p-8 bg-zinc-900 rounded-2xl border border-zinc-800 h-full transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700">
                <div className="mb-6 text-gold">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gold mb-3">{service.title}</h3>
                <p className="text-neutral-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimatedOnView>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ExpandedServices;
