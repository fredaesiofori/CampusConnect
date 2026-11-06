/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, AlertTriangle, MapPin, GraduationCap, BookOpen, Calendar, CheckCircle2, FileText, Info } from 'lucide-react';
import { ScholarshipOpportunity } from './types';
import { Button } from '../ui/Button';

export interface ScholarshipDetailsModalProps {
  scholarship: ScholarshipOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScholarshipDetailsModal: React.FC<ScholarshipDetailsModalProps> = ({
  scholarship,
  isOpen,
  onClose,
}) => {
  // Close on Escape key and lock body scroll
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !scholarship) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#15152F]/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden overscroll-contain animate-in zoom-in-95 duration-150"
      >
        {/* Sample Notice Header */}
        <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-[#92400E]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span className="truncate">SAMPLE DATA — NOT A VERIFIED OPPORTUNITY</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#FEF3C7] px-2 py-0.5 rounded text-[#B45309] shrink-0 ml-2">
            Demonstration
          </span>
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-7 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6846F5] uppercase tracking-wider mb-1.5 flex-wrap">
              <span>{scholarship.destinationCountry}</span>
              <span>·</span>
              <span>{scholarship.studyLevel}</span>
            </div>
            <h3 id="sample-modal-title" className="text-lg sm:text-2xl font-bold font-display text-[#15152F] break-words">
              {scholarship.title}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 break-words">
              Field of Study: <span className="font-medium text-[#15152F]">{scholarship.fieldOfStudy}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:text-[#15152F] hover:bg-[#F8F9FD] border border-[#E2E8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Funding Breakdown */}
          <div className="p-4 rounded-xl bg-[#F0EDFF]/60 border border-[#DDD6FE]/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6846F5] mb-1">
              Funding Coverage Model
            </h4>
            <p className="text-sm font-semibold text-[#15152F]">
              {scholarship.fundingCoverage}
            </p>
          </div>

          {/* Eligibility Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#15152F] mb-2">
              Eligibility Summary
            </h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {scholarship.eligibilitySummary}
            </p>
          </div>

          {/* Sample Academic Requirements */}
          {scholarship.academicRequirements && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#15152F] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6846F5]" />
                What to Check (Academic Criteria)
              </h4>
              <ul className="space-y-2">
                {scholarship.academicRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#64748B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6846F5] mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Document Checklist */}
          {scholarship.documentChecklist && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#15152F] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6846F5]" />
                Typical Preparation Checklist
              </h4>
              <ul className="space-y-2">
                {scholarship.documentChecklist.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#64748B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E7B75C] mt-2 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deadline disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] text-xs text-[#64748B] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span>
              {scholarship.deadlineNotice}. This card illustrates layout and requirements formatting only.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#F8F9FD] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            Example demonstration record
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
