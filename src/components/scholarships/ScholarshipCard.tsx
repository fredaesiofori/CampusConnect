/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, GraduationCap, Compass, Coins, ShieldCheck, ArrowRight } from 'lucide-react';
import { Scholarship } from './types';
import { Button } from '../ui/Button';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  onViewDetails?: (scholarship: Scholarship) => void;
  className?: string;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onViewDetails,
  className = '',
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(scholarship);
    }
  };

  return (
    <article
      aria-label={scholarship.title}
      className={`group bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_24px_-4px_rgba(21,21,47,0.06),0_2px_8px_-2px_rgba(21,21,47,0.03)] hover:shadow-[0_12px_32px_-4px_rgba(21,21,47,0.10),0_4px_12px_-2px_rgba(21,21,47,0.04)] hover:border-[#DDD6FE] transition-all duration-200 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Status Label / Verification Banner */}
      {scholarship.statusLabel && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 sm:px-6 flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
            {scholarship.statusLabel}
          </span>
        </div>
      )}

      {/* Card Body with Generous, Harmonious Internal Spacing */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 space-y-6">
        
        {/* Scannable Metadata Badges: Country, Study Level, Category */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0EDFF] text-[#6846F5] border border-[#DDD6FE]">
            <MapPin className="w-3.5 h-3.5 text-[#6846F5] shrink-0" aria-hidden="true" />
            <span>{scholarship.country}</span>
          </span>

          {/* Study Level */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F8F9FD] text-[#334155] border border-[#E2E8F0]">
            <GraduationCap className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
            <span>{scholarship.studyLevel}</span>
          </span>

          {/* Category */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F8F9FD] text-[#334155] border border-[#E2E8F0]">
            <Compass className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
            <span>{scholarship.category}</span>
          </span>
        </div>

        {/* Title & Description with Clear Typographic Hierarchy */}
        <div className="space-y-2.5">
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#15152F] tracking-tight leading-snug group-hover:text-[#6846F5] transition-colors">
            {scholarship.title}
          </h3>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {scholarship.description}
          </p>
        </div>

        {/* Dedicated Funding Detail Box for Quick Scanning */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F0EDFF] flex items-center justify-center text-[#6846F5] shrink-0 border border-[#DDD6FE]/60">
              <Coins className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Funding
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#15152F]">
                {scholarship.fundingLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Styled using existing violet brand color */}
        <div className="pt-2 mt-auto">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleViewDetails}
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            className="font-semibold shadow-[0_2px_10px_rgba(104,70,245,0.25)] hover:shadow-[0_4px_16px_rgba(104,70,245,0.35)]"
          >
            View Details
          </Button>
        </div>

      </div>
    </article>
  );
};
