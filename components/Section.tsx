import React from 'react';

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  debugName?: string;
};

const Section: React.FC<Props> = ({ id, className = '', children, debugName }) => {
  const dbg = debugName || id;
  return (
    <section
      id={id}
      className={`relative py-28 md:py-36 scroll-mt-24 md:scroll-mt-28 ${className}`}
      data-debug={dbg}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;
