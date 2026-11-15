/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  DollarSign,
  Landmark,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { Button } from '../ui/Button';
import { UniversityLogo, UniversityCrestCardImage } from '../ui/UniversityLogo';

export interface UniversityCardProps {
  item: OpportunityItem;
  isSaved: boolean;
  onToggleSave: (id: string, name: string) => void;
  onOpenDetails: (item: OpportunityItem) => void;
  variant?: 'list' | 'grid';
  showFundingSummary?: boolean;
  currentAppStatus?: string;
  onUpdateAppStatus?: (id: string, status: any) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onOpenDetails,
  variant = 'list',
  showFundingSummary = false,
}) => {
  const [crestError, setCrestError] = useState(false);
  const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
  const displayName = item.officialName || item.institution;
  const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;
  const logoUrl = item.logo?.logoUrl;
  const monogram =
    item.logo?.monogram ||
    (item.shortName
      ? item.shortName.slice(0, 4)
      : displayName
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 3)
    ).toUpperCase();
  const monogramBg = item.logo?.bg || '#0F2C59';
  const monogramText = item.logo?.text || '#FFFFFF';

  // =========================================================================
  // VARIANT 1: GRID CARD
  // =========================================================================
  if (variant === 'grid') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetails(item);
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#6846F5]/35 active:scale-[0.988] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out flex flex-col justify-between overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
      >
        <div>
          <UniversityCrestCardImage
            item={item}
            variant="cover"
            countryBadge={
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#10132D]/85 backdrop-blur-sm text-white shadow-xs">
                <span>{item.countryFlag}</span>
                <span>{item.country}</span>
              </span>
            }
            actionButton={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(item.id, displayName);
                }}
                className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors cursor-pointer shadow-xs ${
                  isSaved
                    ? 'bg-white text-[#6846F5]'
                    : 'bg-[#10132D]/70 text-white hover:bg-white hover:text-[#6846F5]'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <UniversityLogo item={item} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-[#10132D] tracking-tight truncate leading-snug">
                    {displayName}
                  </h3>
                  {item.isVerified && (
                    <span
                      className="inline-flex items-center text-blue-600 shrink-0"
                      title="Verified Institution"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{displayLocation}</span>
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[11px]">Degree:</span>
                <span className="font-medium text-slate-700 truncate max-w-[65%] text-right">
                  {(item.degreeLevels || []).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[11px]">Funding:</span>
                <span className="font-semibold text-[#6846F5] truncate max-w-[65%] text-right">
                  {item.fundingDetails?.type || item.funding?.type || 'Tuition Aid'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(item);
            }}
            className="border-[#CBD5E1] group-hover:border-[#6846F5]/40 group-hover:text-[#6846F5] hover:bg-slate-50 text-xs font-semibold justify-center transition-colors"
          >
            View Opportunity Details
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VARIANT 2: COMPACT HORIZONTAL CARD (Approved Explore Universities Reference)
  // Left: Crest + Country Flag/Code pill; Right: Name + Verified tick, City/Country,
  // Institution Type, and Functional Bookmark button
  // =========================================================================
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails(item);
        }
      }}
      className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#6846F5]/40 shadow-[0_1px_6px_rgba(15,23,42,0.04)] hover:shadow-md active:scale-[0.992] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 sm:gap-4 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
    >
      {/* Left: Flag + Country Code Badge & Authentic University Crest (or Initials Fallback) */}
      <div className="relative w-[108px] sm:w-[144px] h-[74px] sm:h-[82px] rounded-xl bg-slate-50/70 border border-slate-100 shrink-0 flex items-center justify-center p-2 pt-5 sm:p-2.5 sm:pt-5 overflow-hidden">
        <span className="absolute top-1.5 left-1.5 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#111827] text-white text-[10px] font-bold leading-none shadow-2xs">
          <span aria-hidden="true">{item.countryFlag}</span>
          <span>{item.countryCode}</span>
        </span>

        {logoUrl && !crestError ? (
          <img
            src={logoUrl}
            alt={`${displayName} official crest`}
            loading="lazy"
            onError={() => setCrestError(true)}
            className="max-h-[44px] sm:max-h-[50px] max-w-[92%] w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="px-2.5 py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm tracking-wider shadow-2xs select-none truncate max-w-full"
            style={{ backgroundColor: monogramBg, color: monogramText }}
            title={displayName}
          >
            {monogram}
          </div>
        )}
      </div>

      {/* Right: University Name + Blue Verification Tick + Location + Institution Type + Bookmark */}
      <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          {/* Row 1: University Name + Verified Blue Tick */}
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-[13px] sm:text-[15px] font-bold font-display text-[#10132D] group-hover:text-[#6846F5] leading-snug truncate transition-colors">
              {displayName}
            </h3>
            {item.isVerified && (
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2563EB] text-white shrink-0"
                title={item.verificationSource || 'Verified Institution'}
                aria-label="Verified Institution"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Row 2: City & Country */}
          <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#475569] truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{displayLocation}</span>
          </p>

          {/* Row 3: Verified Institution Type */}
          <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#64748B] truncate">
            <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.institutionType || 'Public University'}</span>
          </p>

          {/* Optional Funding / Deadline line shown only on Scholarships view */}
          {showFundingSummary && (
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] font-medium text-[#5B2EE6] pt-0.5">
              <span className="inline-flex items-center gap-1">
                <DollarSign className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>{item.fundingDetails?.type || item.funding?.type || 'Scholarship Aid'}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>{evalDeadline.displayText}</span>
              </span>
            </p>
          )}
        </div>

        {/* Functional Bookmark Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(item.id, displayName);
          }}
          className={`w-10 h-10 min-w-[40px] min-h-[40px] -mt-1 -mr-1.5 flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] ${
            isSaved
              ? 'text-[#6846F5] bg-[#F3EFFF]'
              : 'text-[#1E293B] hover:text-[#6846F5] hover:bg-[#F3EFFF]/60'
          }`}
          title={isSaved ? 'Remove from Saved Opportunities' : 'Save Opportunity'}
          aria-label={
            isSaved
              ? `Remove ${displayName} from saved`
              : `Save ${displayName}`
          }
          aria-pressed={isSaved}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
