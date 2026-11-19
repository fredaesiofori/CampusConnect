/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { OpportunityItem } from '../../data/opportunities';
import { UniversityLogo } from '../ui/UniversityLogo';
import { CountryFlag } from '../ui/CountryFlagSvg';

export interface CovaOpportunityCardProps {
  item: OpportunityItem;
  isSaved: boolean;
  onToggleSave: (id: string, name: string) => void;
  onViewDetails: (item: OpportunityItem) => void;
}

export const CovaOpportunityCard: React.FC<CovaOpportunityCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onViewDetails,
}) => {
  const officialName = item.officialName || item.title;
  const officialUrl = item.officialWebsite || item.officialUrl || item.sourceUrl || '#';
  const deadlineText = item.deadlines?.deadlineText || item.deadlines?.term || 'Rolling / Check Portal';

  return (
    <div className="bg-white border border-slate-200/90 hover:border-[#6846F5]/50 rounded-xl p-3 shadow-2xs hover:shadow-sm transition-all duration-150 text-left group">
      {/* Top Header: Logo, Name, Location & Save Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <UniversityLogo item={item} size="sm" showVerifiedShield={true} />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#6846F5] transition-colors">
              {officialName}
            </h4>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
              <CountryFlag
                code={item.countryCode}
                country={item.country}
                className="w-3.5 h-[10px] rounded-[1.5px] ring-1 ring-black/10 overflow-hidden shrink-0"
              />
              <span>{item.country}</span>
              {item.city && <span className="text-slate-400">• {item.city}</span>}
            </p>
          </div>
        </div>

        {/* Save Opportunity Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(item.id, officialName);
          }}
          className={`shrink-0 p-1.5 rounded-lg border transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-2xs'
              : 'bg-slate-50 hover:bg-violet-50 border-slate-200 hover:border-violet-300 text-slate-400 hover:text-[#6846F5]'
          }`}
          title={isSaved ? 'Remove from Saved Opportunities' : 'Save Opportunity'}
          aria-label={isSaved ? `Remove ${officialName} from Saved Opportunities` : `Save ${officialName} to Saved Opportunities`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Verified Policies & Badges */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
        {/* Funding badge */}
        {item.fundingDetails?.type && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <DollarSign className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[130px]">{item.fundingDetails.type}</span>
          </span>
        )}

        {/* Application fee badge */}
        {item.applicationFees?.status && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${
              item.applicationFees.status.toLowerCase().includes('free') ||
              item.applicationFees.status.toLowerCase().includes('$0') ||
              item.applicationFees.status.toLowerCase().includes('waiver')
                ? 'bg-violet-50 text-[#6846F5] border-violet-200/80'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">{item.applicationFees.status}</span>
          </span>
        )}

        {/* Testing Policy badge */}
        {item.testWaiverRules?.status && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
            <GraduationCap className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate max-w-[140px]">{item.testWaiverRules.status}</span>
          </span>
        )}
      </div>

      {/* Footer: Verified Deadline & Actions */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{deadlineText}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* External portal link */}
          {officialUrl && officialUrl !== '#' && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md text-slate-400 hover:text-[#6846F5] hover:bg-slate-100 transition-colors"
              title="Open Official University Portal"
              aria-label="Open Official University Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* View Details Primary Action */}
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6846F5] hover:bg-[#5835ea] active:scale-[0.98] text-white font-medium text-[11px] shadow-2xs transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
