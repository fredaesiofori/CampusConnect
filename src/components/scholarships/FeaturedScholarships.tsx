/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Container } from '../ui/Container';
import { ScholarshipCard } from './ScholarshipCard';
import { sampleScholarship, sampleScholarship2 } from './types';

export interface FeaturedScholarshipsProps {
  className?: string;
}

export const FeaturedScholarships: React.FC<FeaturedScholarshipsProps> = ({
  className = '',
}) => {
  return (
    <section
      id="scholarships"
      aria-label="Featured Scholarships"
      className={`w-full bg-white py-20 sm:py-24 lg:py-28 border-b border-[#E2E8F0] ${className}`}
    >
      <Container size="xl">
        {/* Section Heading & Subtitle */}
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display tracking-tight text-[#15152F] leading-tight sm:leading-snug [text-wrap:balance]">
            Discover Your Next Opportunity
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed [text-wrap:pretty] font-normal max-w-2xl mx-auto">
            Explore scholarship opportunities that match your education goals and future ambitions.
          </p>
        </div>

        {/* Sample Scholarship Cards Grid (Reusable Component) */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <ScholarshipCard scholarship={sampleScholarship} />
            <ScholarshipCard scholarship={sampleScholarship2} />
          </div>
        </div>
      </Container>
    </section>
  );
};
