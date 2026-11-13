/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import {
  ChevronDown,
  Sparkles,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['faq-what-is-campus-connect'])
  );

  const baseId = useId();

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(FAQ_DATA.map((item) => item.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-main-heading"
      className={`relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24 text-[#15152F] border-t border-slate-100 ${className}`}
    >
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6846F5]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E7B75C]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#6846F50a_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      </div>

      <Container size="lg" className="relative z-10">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6846F5]/10 border border-[#6846F5]/20 text-xs font-semibold tracking-wider uppercase text-[#6846F5] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E7B75C]" />
            <span>COMMON ADMISSIONS QUESTIONS</span>
          </div>

          <h2
            id="faq-main-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold font-display tracking-tight text-[#10132D] [text-wrap:balance]"
          >
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Clear answers to help you explore universities worldwide, admissions requirements, fee waivers, test-optional pathways, and scholarships.
          </p>

          {/* Action Row: Expand / Collapse All */}
          <div className="pt-2 flex items-center justify-end text-xs text-slate-500 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="text-[#6846F5] hover:underline font-medium cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={collapseAll}
                className="text-slate-500 hover:underline font-medium cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Accordion List Container */}
        <div className="mt-4 mx-auto max-w-3xl space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isExpanded = expandedIds.has(item.id);
            const headerId = `${baseId}-header-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
                  isExpanded
                    ? 'border-[#6846F5]/40 shadow-sm ring-1 ring-[#6846F5]/10'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-controls={panelId}
                    aria-expanded={isExpanded}
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left py-4 px-4 sm:px-6 flex items-start justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] select-none"
                  >
                    <span className="flex items-start gap-3 min-w-0">
                      <span
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                          isExpanded
                            ? 'bg-[#6846F5] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#10132D] leading-snug">
                        {item.question}
                      </span>
                    </span>

                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-[#6846F5]/10 text-[#6846F5]'
                          : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </h3>

                {/* Accordion Content Panel */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`transition-all duration-200 ease-in-out ${
                    isExpanded
                      ? 'max-h-[600px] opacity-100 border-t border-slate-100'
                      : 'max-h-0 opacity-0 overflow-hidden border-t-0 pointer-events-none'
                  }`}
                >
                  <div className="p-4 sm:p-6 bg-slate-50/50 space-y-3.5">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed [text-wrap:pretty]">
                      {item.answer}
                    </p>

                    {/* Bullet Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
            );
          })}
        </div>

        {/* Bottom Help Banner / Interactive Bridge */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-r from-[#15152F] via-[#1A1A3D] to-[#10132D] p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#DDD6FE] text-xs font-semibold">
                <MessageCircle className="w-3.5 h-3.5 text-[#E7B75C]" />
                <span>HAVE A SPECIFIC QUESTION?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Still have questions about your eligibility?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                Chat with COVA, our AI admissions and opportunity advisor, to review your background, target destinations, universities, and funding options.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              {onOpenAssistant && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenAssistant}
                  className="w-full sm:w-auto bg-[#6846F5] hover:bg-[#5b3adb] text-white font-bold py-2.5 px-5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E7B75C]" />
                  <span>Ask COVA AI</span>
                </Button>
              )}
              {onExploreUniversities && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={onExploreUniversities}
                  className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-white/20 font-semibold py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  <span>Explore Directory</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
