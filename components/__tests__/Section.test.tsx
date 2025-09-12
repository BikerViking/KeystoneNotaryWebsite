import { render, screen } from '@testing-library/react';
import React from 'react';
import Section from '../../components/Section';

describe('Section', () => {
  it('renders children inside a centered container with spacing and scroll offsets', () => {
    render(
      <Section id="sample" className="bg-black">
        <div>Content</div>
      </Section>
    );
    const section = document.querySelector('section#sample');
    expect(section).toBeInTheDocument();
    // container exists
    const container = document.querySelector('section#sample .container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Content');
    // scroll margin classes present via className contains scroll-mt
    expect(section?.className).toMatch(/scroll-mt/);
  });
});
