/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../ui/Container';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  highlights?: string[];
}

export interface FAQSectionProps {
  className?: string;
  onOpenAssistant?: () => void;
  onExploreUniversities?: () => void;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-what-is-campus-connect',
    question: 'What is Campus Connect, and how does it help students?',
    answer:
      'Campus Connect is a free student discovery platform that brings together accredited universities, scholarship opportunities, fee waiver policies, and admissions deadlines in one place. You can filter verified programs by destination, degree level, field of study, and funding type, bookmark opportunities, manage your target list, and track active application tasks.',
    highlights: [
      '100% free access to verified university and scholarship listings.',
      'Direct links to official institutional websites and admissions bulletins.',
      'Organize bookmarks, target goals, and application checklists in your dashboard.',
    ],
  },
  {
    id: 'faq-fully-funded-aid',
    question: 'How can I find fully funded scholarships and financial aid?',
    answer:
      'Open the Scholarships & Funding section or use the Funding Coverage filter in the Student Dashboard to filter for "Fully Funded" and "100% Need-Met" opportunities. Each listing outlines tuition coverage, living stipends where offered, nationality eligibility, and official source links.',
    highlights: [
      'Filter specifically by "Fully Funded" or "100% Need-Met" aid models.',
      'Check nationality eligibility and required academic records on each card.',
      'Scholarship awards and funding decisions are made solely by each host institution or sponsor.',
    ],
  },
  {
    id: 'faq-no-fee-sat',
    question: 'Can I find universities with no application fees or SAT requirements?',
    answer:
      'Yes. In the University Directory, you can filter for institutions offering "$0 Fee" applications or fee waivers, as well as universities with "Test-Optional" or "Test-Free" SAT/ACT policies. Always confirm program-specific rules directly on the university’s official admissions page before submitting.',
    highlights: [
      'Use Application Fee filters to locate "$0 Fee" and waiver-eligible universities.',
      'Review standardized test and English proficiency waiver policies per institution.',
      'Admission policies vary by faculty and intake term—verify directly on official portals.',
    ],
  },
  {
    id: 'faq-how-to-apply',
    question: 'How do I apply to universities and scholarships through Campus Connect?',
    answer:
      'Campus Connect connects you directly to each institution’s official admissions or scholarship portal rather than acting as a paid agent. Open any university or scholarship listing to review its verified deadline, academic requirements, and official application link, then submit your application directly on the university’s portal while tracking your progress in your dashboard.',
    highlights: [
      'Direct links send you straight to official university and scholarship portals.',
      'Track document tasks and verified deadlines inside the Applications section.',
      'All admissions and scholarship evaluations are handled independently by each institution.',
    ],
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({
  className = '',
  onOpenAssistant,
  onExploreUniversities,
}) => {
  // All FAQ answers are closed by default; only one question expands at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const baseId = useId();

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-main-heading"
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#F4EFFD] via-[#F2ECFC] to-[#EFE8FB] pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 text-[#15152F] ${className}`}
    >
      {/* Organic Soft Lavender Wave Transition from White Above */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 56"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 inset-x-0 w-full h-7 sm:h-10 lg:h-12"
      >
        <path
          d="M0 0 L1440 0 L1440 16 C1160 52 840 6 520 34 C290 54 115 26 0 14 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Subtle Soft Lavender Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#7C4DFF]/8 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#FFFFFF]/50 blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
          {/* Left Column: Badge + Heading + Subtitle + Curved Gold Underline */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DFFF] text-[#5D35F5] text-[11px] font-bold tracking-wider uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-[#5D35F5]" aria-hidden="true" />
              <span>FAQ</span>
            </div>

            <h2
              id="faq-main-heading"
              className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold font-display tracking-tight text-[#10132D] leading-[1.12] [text-wrap:balance]"
            >
              Frequently
              <br className="hidden sm:inline" /> Asked Questions
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] max-w-sm leading-relaxed [text-wrap:pretty]">
              Quick answers to common questions about Campus Connect.
            </p>

            {/* Gold Brush Underline */}
            <svg
              aria-hidden="true"
              viewBox="0 0 148 12"
              fill="none"
              className="w-32 sm:w-40 h-2.5 pt-0.5"
            >
              <path
                d="M2 8.5C44 2.5 102 2 146 6"
                stroke="#F8C555"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Compact COVA AI & Directory Help Strip */}
            {(onOpenAssistant || onExploreUniversities) && (
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {onOpenAssistant && (
                  <button
                    type="button"
                    onClick={onOpenAssistant}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF8FF] border border-[#DDD6FE] text-xs font-bold text-[#5D35F5] shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
                    <span>Ask COVA AI</span>
                  </button>
                )}
                {onExploreUniversities && (
                  <button
                    type="button"
                    onClick={onExploreUniversities}
                    className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold text-[#475569] hover:text-[#10132D] hover:bg-white/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                  >
                    <span>Explore Directory →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: 4 Crisp White Rounded Accordion Cards */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
            {FAQ_DATA.map((item) => {
              const isExpanded = expandedId === item.id;
              const headerId = `${baseId}-header-${item.id}`;
              const panelId = `${baseId}-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl sm:rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#C4B5FD] shadow-[0_8px_24px_rgba(91,46,230,0.1)] ring-1 ring-[#6846F5]/10'
                      : 'border-white shadow-[0_4px_16px_rgba(91,46,230,0.06)] hover:border-[#E5DCFF] hover:shadow-[0_6px_20px_rgba(91,46,230,0.09)]'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={headerId}
                      aria-controls={panelId}
                      aria-expanded={isExpanded}
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full min-h-[50px] text-left py-3.5 px-4 sm:px-5 flex items-center justify-between gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6846F5] select-none"
                    >
                      <span className="text-xs sm:text-[14px] font-bold text-[#10132D] leading-snug">
                        {item.question}
                      </span>

                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isExpanded
                            ? 'bg-[#F3F0FF] text-[#5D35F5] rotate-180'
                            : 'text-[#1E293B]'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                  </h3>

                  {/* Accessible Smooth Accordion Panel */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    aria-hidden={!isExpanded}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100'
                        : 'grid-rows-[0fr] opacity-0 invisible'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-5 bg-[#FAF8FF]/60 space-y-3">
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed [text-wrap:pretty]">
                          {item.answer}
                        </p>

                        {item.highlights && item.highlights.length > 0 && (
                          <div className="bg-white border border-[#EAE8F5] rounded-xl p-3 space-y-1.5">
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                              Key Takeaways:
                            </p>
                            <ul className="space-y-1.5">
                              {item.highlights.map((h, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-slate-600 flex items-start gap-2 leading-snug"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
