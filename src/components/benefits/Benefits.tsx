/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, GraduationCap, ClipboardCheck } from 'lucide-react';
import { Container } from '../ui/Container';

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: BenefitItem[] = [
  {
    id: 'universities-pathways',
    title: 'Universities Worldwide',
    description:
      'Discover verified undergraduate and postgraduate programs across Ghana, the United States, UK, Canada, Germany, Australia, and other international destinations.',
    icon: <GraduationCap className="w-6 h-6 text-[#6846F5]" />,
  },
  {
    id: 'app-fee-sat-waivers',
    title: 'Fee Waivers, Test Policies & Aid',
    description:
      'Find universities with free applications or fee waivers, SAT-free and test-optional admission pathways, and scholarship or financial aid opportunities.',
    icon: <Target className="w-6 h-6 text-[#6846F5]" />,
  },
  {
    id: 'admissions-funding',
    title: 'Application Planning & COVA AI',
    description:
      'Understand official requirements and deadlines, save universities and opportunities, track active applications, and receive tailored guidance from COVA AI.',
    icon: <ClipboardCheck className="w-6 h-6 text-[#6846F5]" />,
  },
];

export const Benefits: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section
      id="benefits"
      aria-label="Platform Benefits"
      className={`w-full bg-white py-14 sm:py-20 lg:py-24 border-b border-[#E2E8F0] ${className}`}
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 lg:mb-16">
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#6846F5] mb-2 sm:mb-3">
            GLOBAL EDUCATION OPPORTUNITIES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#15152F] [text-wrap:balance]">
            Universities, admissions pathways, and financial support in one place.
          </h2>
          <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed [text-wrap:pretty]">
            Explore international study programs, check entry criteria and deadlines, identify fee-waiver or test-optional options where offered, and organize every application.
          </p>
        </div>

        {/* Three Balanced Equal-Width Cards on Desktop & Tablet, 1 Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group h-full p-6 sm:p-7 lg:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_4px_-1px_rgba(21,21,47,0.04),0_1px_2px_-1px_rgba(21,21,47,0.02)] hover:border-[#DDD6FE] hover:shadow-[0_12px_24px_-4px_rgba(21,21,47,0.08),0_4px_8px_-2px_rgba(21,21,47,0.03)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Soft Lavender Icon Background */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-xl bg-[#F0EDFF] border border-[#DDD6FE]/60 flex items-center justify-center mb-5 sm:mb-6 transition-colors duration-200 group-hover:bg-[#EAE4FF]">
                  {benefit.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-[#15152F] tracking-tight">
                  {benefit.title}
                </h3>

                {/* Card Description */}
                <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
