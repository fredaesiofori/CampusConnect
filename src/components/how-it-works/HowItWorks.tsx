/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserCheck, Compass, ClipboardCheck } from 'lucide-react';
import { Container } from '../ui/Container';

export interface HowItWorksProps {
  onGetStartedClick?: () => void;
  className?: string;
}

interface StepItem {
  number: string;
  stepLabel: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepItem[] = [
  {
    number: '01',
    stepLabel: 'STEP 01',
    title: 'Build Your Academic Profile',
    description:
      'Set your education level, nationality, preferred study destinations, and undergraduate or postgraduate goals.',
    icon: <UserCheck className="w-3.5 h-3.5 text-white" />,
  },
  {
    number: '02',
    stepLabel: 'STEP 02',
    title: 'Explore Universities & Opportunities',
    description:
      'Browse verified universities, compare admissions requirements, and filter for scholarships, fee waivers, or test-optional pathways.',
    icon: <Compass className="w-3.5 h-3.5 text-white" />,
  },
  {
    number: '03',
    stepLabel: 'STEP 03',
    title: 'Plan, Track & Apply',
    description:
      'Save opportunities, organize your target list, track deadlines and tasks with COVA AI guidance, and apply on official portals.',
    icon: <ClipboardCheck className="w-3.5 h-3.5 text-white" />,
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({
  className = '',
}) => {
  return (
    <section
      id="how-it-works"
      aria-label="How It Works"
      className={`w-full bg-white py-7 sm:py-9 lg:py-10 border-t border-slate-100 ${className}`}
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-7">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F0FF] border border-[#E5DCFF] text-[10.5px] font-bold tracking-wider uppercase text-[#5D35F5] mb-2">
            Your Journey Starts Here
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight text-[#10132D] [text-wrap:balance]">
            From searching to applying, one step at a time.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748B] leading-relaxed [text-wrap:pretty]">
            A clearer path to discovering global universities, comparing admissions options, and preparing strong applications.
          </p>
        </div>

        {/* Steps Sequence Container */}
        <div className="relative">
          {/* Subtle Horizontal Connecting Line on Desktop (hidden on mobile) */}
          <div
            className="hidden md:block absolute top-5 lg:top-6 left-[16.6%] right-[16.6%] h-[2px] bg-[#EAE4FF] z-0"
            aria-hidden="true"
          />

          {/* 3 Horizontally Aligned Steps on Desktop & Tablet, Clean Vertical Sequence on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-5 lg:gap-7 items-start relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center group gap-3.5 sm:gap-4 md:gap-0"
              >
                {/* Mobile subtle vertical connector to next step */}
                {idx < steps.length - 1 && (
                  <div
                    className="md:hidden absolute top-11 left-5 bottom-[-1.5rem] w-[2px] bg-[#EAE4FF] z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Step Indicator Node with Numbered Circle & Restrained Badge */}
                <div className="relative mb-0 md:mb-3.5 shrink-0 z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#DDD6FE] shadow-[0_2px_8px_rgba(91,46,230,0.08)] flex items-center justify-center transition-all duration-200 group-hover:border-[#5D35F5] group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(91,46,230,0.18)]">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#5D35F5]">
                      {step.number}
                    </span>
                  </div>

                  {/* Restrained Line Icon Badge on bottom-right corner */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5D35F5] text-white flex items-center justify-center shadow-sm"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0 md:flex md:flex-col md:items-center">
                  {/* Step Eyebrow */}
                  <span className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5D35F5] mb-0.5 sm:mb-1">
                    {step.stepLabel}
                  </span>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D] tracking-tight">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-1 sm:mt-1.5 text-xs sm:text-[13px] text-[#64748B] leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concise Footnote (no redundant account CTA) */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-[#64748B]">
            100% free student access · Explore verified universities, scholarships, and application timelines
          </p>
        </div>
      </Container>
    </section>
  );
};
