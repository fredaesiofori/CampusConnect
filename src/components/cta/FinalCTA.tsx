/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, CalendarCheck2, Compass, Globe } from 'lucide-react';
import { Container } from '../ui/Container';

export interface FinalCTAProps {
  onCreateAccountClick?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

const EDUCATIONAL_BENEFITS = [
  {
    title: 'Direct Official Portals',
    description:
      'Apply straight through verified university and scholarship websites with zero agent markups.',
    icon: Globe,
  },
  {
    title: 'Tuition & Waiver Clarity',
    description:
      'Compare application fee waivers, scholarships, and test-optional pathways side by side.',
    icon: Award,
  },
  {
    title: 'Organized Deadlines',
    description:
      'Keep intake dates, required records, and shortlisted applications structured in one place.',
    icon: CalendarCheck2,
  },
  {
    title: 'Goal-Matched Discovery',
    description:
      'Filter global institutions by degree level, field of study, funding type, and destination.',
    icon: Compass,
  },
];

export const FinalCTA: React.FC<FinalCTAProps> = ({ className = '' }) => {
  return (
    <section
      id="educational-benefits"
      aria-label="Educational Benefits"
      className={`w-full bg-white py-7 sm:py-9 border-t border-slate-100 ${className}`}
    >
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-5 sm:mb-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F0FF] border border-[#E5DCFF] text-[10.5px] font-bold tracking-wider uppercase text-[#5D35F5] mb-2">
              Student Advantages
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-[#10132D] [text-wrap:balance]">
              Built to simplify global admissions planning.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md [text-wrap:pretty]">
            Clear institutional details and planning tools designed for applicants worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {EDUCATIONAL_BENEFITS.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl bg-[#FAF8FF] border border-[#EAE4FF] p-4 sm:p-5 flex flex-col items-start gap-2.5 shadow-[0_2px_10px_rgba(91,46,230,0.04)]"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DCFF] text-[#5D35F5] flex items-center justify-center shadow-2xs shrink-0">
                  <IconComponent className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold font-display text-[#10132D] leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
