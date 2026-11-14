/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Globe,
  Building2,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  DollarSign,
  GraduationCap,
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
  currentAppStatus?: string;
  onUpdateAppStatus?: (id: string, status: any) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onOpenDetails,
  variant = 'list',
}) => {
  const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
  const displayName = item.officialName || item.institution;
  const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;

  // =========================================================================
  // VARIANT 1: GRID CARD (Used in Dashboard "Recommended for You" section)
  // Displays authentic official crest / seal on clean institutional canvas
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
          {/* Authentic Official University Crest / Seal */}
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
                title={isSaved ? 'Remove from Target List' : 'Save to Target List'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" /> : <Bookmark className="w-4 h-4" />}
              </button>
            }
          />

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <UniversityLogo item={item} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-[#10132D] tracking-tight truncate leading-snug">
                    {displayName}
                  </h3>
                  {item.isVerified && (
                    <span className="inline-flex items-center text-blue-600 shrink-0" title="Verified Institution">
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

            {/* Quick Specs */}
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

        {/* Footer Action */}
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
  // VARIANT 2: HORIZONTAL LIST CARD (Matches Explore Universities Screen 2)
  // Left: Photo; Center: Title, location, accreditation, pills; Right: Verified & Bookmark
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
      className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#6846F5]/40 shadow-xs hover:shadow-md active:scale-[0.992] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center justify-between group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
    >
      {/* Left: Authentic Official University Crest / Seal */}
      <UniversityCrestCardImage
        item={item}
        variant="thumbnail"
        countryBadge={
          <div className="px-2 py-0.5 rounded-md bg-[#10132D]/85 backdrop-blur-sm text-white text-[10px] font-bold shadow-xs">
            {item.countryFlag} {item.countryCode}
          </div>
        }
      />

      {/* Center: University Info & Badges */}
      <div className="flex-1 min-w-0 space-y-2 w-full">
        {/* Row 1: Title on left, Verified and Bookmark on right matching Mockup Screen 2 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <UniversityLogo item={item} size="sm" />
            <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D] group-hover:text-[#6846F5] tracking-tight truncate leading-snug transition-colors">
              {displayName}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            {item.isVerified && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200"
                title={item.verificationSource || 'Verified Institution'}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}

            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => onToggleSave(item.id, displayName)}
              className={`w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#F0EDFF] text-[#6846F5]'
                  : 'text-slate-400 hover:text-[#6846F5] hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove from Target List' : 'Save to Target List'}
              aria-label={isSaved ? 'Remove from Target List' : 'Save to Target List'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Row 2: Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{displayLocation}</span>
        </div>

        {/* Row 3: Institution Type and Accreditation */}
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
          <span className="text-slate-600">
            {item.institutionType || 'Public'}
          </span>
          <span className="text-slate-300">·</span>
          {item.countryCode === 'GH' ? (
            <span className="text-slate-700 font-medium">GTEC Accredited</span>
          ) : (
            <span className="text-slate-700 font-medium">Official Ministry Accredited</span>
          )}
        </div>

        {/* Row 4: Visual Metadata Tags Strip matching showcase */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Eligibility Tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0EDFF] text-[#6846F5] border border-[#DDD6FE]">
            <Globe className="w-3.5 h-3.5 text-[#6846F5] shrink-0" />
            <span>Internationally Eligible</span>
          </span>

          {/* Funding Tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{item.fundingDetails?.type || item.funding?.type || 'Tuition Aid'}</span>
          </span>

          {/* Application Fee Tag if waiver available */}
          {(item.applicationFees?.status === 'Free ($0 Fee)' || item.applicationFee?.status === 'Free ($0 Fee)') && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>$0 Fee</span>
            </span>
          )}

          {/* Deadline text */}
          <span className="text-[11px] text-slate-500 flex items-center gap-1 w-full sm:w-auto sm:ml-auto pt-1 sm:pt-0">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{evalDeadline.displayText}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
