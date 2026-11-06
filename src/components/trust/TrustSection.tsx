/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Landmark, ReceiptText, CheckSquare, Info } from 'lucide-react';
import { Container } from '../ui/Container';

export interface TrustSectionProps {
  className?: string;
}

interface TrustFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const trustFeatures: TrustFeature[] = [
  {
    id: 'official-sources',
    title: 'Official Sources',
    description:
      "Access the original scholarship provider's website whenever an official source is available.",
    icon: <Landmark className="w-5 h-5 text-[#6846F5]" />,
  },
  {
    id: 'clear-funding',
    title: 'Clear Funding Details',
    description:
      'Distinguish tuition coverage, living allowances, travel support and expenses that may remain your responsibility.',
    icon: <ReceiptText className="w-5 h-5 text-[#6846F5]" />,
  },
  {
    id: 'transparent-eligibility',
    title: 'Transparent Eligibility',
    description:
      'See which requirements appear to match your profile and which details need further confirmation.',
    icon: <CheckSquare className="w-5 h-5 text-[#6846F5]" />,
  },
];

export const TrustSection: React.FC<TrustSectionProps> = ({ className = '' }) => {
  return (
    <section
      id="trust-transparency"
      aria-label="Trust and Transparency"
      className={`w-full bg-[#F8F7FF] py-14 sm:py-20 lg:py-24 border-b border-[#E2E8F0] ${className}`}
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 lg:mb-16">
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#6846F5] mb-2 sm:mb-3">
            TRANSPARENCY FIRST
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#15152F] [text-wrap:balance]">
            Scholarship information you can evaluate with confidence.
          </h2>
          <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed [text-wrap:pretty]">
            Know where an opportunity comes from, what it covers and which requirements you still need to check.
          </p>
        </div>

        {/* Three Compact Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {trustFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-[#E2E8F0] shadow-sm hover:border-[#DDD6FE] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F0EDFF] flex items-center justify-center mb-4 sm:mb-5 shrink-0">
                  {feature.icon}
                </div>

                {/* Feature Title */}
                <h3 className="text-base sm:text-lg lg:text-xl font-bold font-display text-[#15152F] tracking-tight">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subdued footer indicator reinforcing grounded clarity */}
              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#F1F5F9] flex items-center text-xs text-[#6846F5] font-medium">
                <span>Verified against published provider criteria</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Advisory Note explaining uncertainty clearly without fake claims */}
        <div className="mt-8 sm:mt-10 rounded-xl bg-white/80 border border-[#E2E8F0] p-4 sm:p-5 flex items-start gap-3 sm:gap-3.5 text-xs sm:text-[13px] text-[#64748B]">
          <Info className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#15152F] font-semibold">Our commitment to accuracy: </strong>
            Scholarship guidelines, funding caps, and eligibility criteria are established solely by awarding institutions. While Campus Connect indexes published information, we encourage scholars to always cross-check details directly on official awarding websites before submitting formal applications.
          </p>
        </div>
      </Container>
    </section>
  );
};
