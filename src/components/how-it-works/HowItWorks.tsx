/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, UserCheck, Compass, ClipboardCheck } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

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
  onGetStartedClick,
  className = '',
}) => {
  return (
    <section
      id="how-it-works"
      aria-label="How It Works"
      className={`w-full bg-white py-14 sm:py-20 lg:py-24 border-b border-[#E2E8F0] ${className}`}
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 lg:mb-16">
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#6846F5] mb-2 sm:mb-3">
            YOUR JOURNEY STARTS HERE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#15152F] [text-wrap:balance]">
            From searching to applying, one step at a time.
          </h2>
          <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed [text-wrap:pretty]">
            A clearer path to discovering global universities, comparing admissions options, and preparing strong applications.
          </p>
        </div>

        {/* Steps Sequence Container */}
        <div className="relative">
          {/* Subtle Horizontal Connecting Line on Desktop (hidden on mobile) */}
          <div
            className="hidden md:block absolute top-6 lg:top-7 left-[16.6%] right-[16.6%] h-[2px] bg-[#E2E8F0] z-0"
            aria-hidden="true"
          />

          {/* 3 Horizontally Aligned Steps on Desktop & Tablet, Clean Vertical Sequence on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-5 lg:gap-8 items-start relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center group gap-4 sm:gap-5 md:gap-0"
              >
                {/* Mobile subtle vertical connector to next step */}
                {idx < steps.length - 1 && (
                  <div
                    className="md:hidden absolute top-12 left-6 bottom-[-2rem] w-[2px] bg-[#E2E8F0] z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Step Indicator Node with Numbered Circle & Restrained Badge */}
                <div className="relative mb-0 md:mb-5 lg:mb-6 shrink-0 z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#DDD6FE] shadow-[0_2px_8px_rgba(104,70,245,0.08)] flex items-center justify-center transition-all duration-200 group-hover:border-[#6846F5] group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(104,70,245,0.18)]">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#6846F5]">
                      {step.number}
                    </span>
                  </div>

                  {/* Restrained Line Icon Badge on bottom-right corner */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#6846F5] text-white flex items-center justify-center shadow-sm"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0 md:flex md:flex-col md:items-center">
                  {/* Step Eyebrow */}
                  <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#6846F5] mb-1 sm:mb-1.5">
                    {step.stepLabel}
                  </span>

                  {/* Step Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#15152F] tracking-tight">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section End Call to Action */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-[#E2E8F0] flex flex-col items-center text-center">
          <Button
            variant="primary"
            size="md"
            onClick={onGetStartedClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-[0_4px_16px_rgba(104,70,245,0.28)]"
          >
            Get Started Free
          </Button>
          <p className="text-xs text-[#64748B] mt-2.5 sm:mt-3">
            Free student account · Explore universities, scholarships, and application tools
          </p>
        </div>
      </Container>
    </section>
  );
};
