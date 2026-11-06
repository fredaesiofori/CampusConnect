/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  Clock,
  CheckCircle2,
  BookmarkCheck,
  Send,
  FileCheck,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { Button } from '../ui/Button';
import { UniversityLogo } from '../ui/UniversityLogo';

export type ApplicationStage = 'saved' | 'preparing' | 'submitted' | 'accepted';

export interface TargetTrackerBoardProps {
  savedItems: OpportunityItem[];
  applicationTracker: Record<string, ApplicationStage>;
  onUpdateStage: (opportunityId: string, stage: ApplicationStage) => void;
  onOpenDetails: (item: OpportunityItem) => void;
  onExploreMore: () => void;
}

export const TargetTrackerBoard: React.FC<TargetTrackerBoardProps> = ({
  savedItems,
  applicationTracker,
  onUpdateStage,
  onOpenDetails,
  onExploreMore,
}) => {
  // Columns definition matching mockup screen 5
  const columns: {
    id: ApplicationStage;
    label: string;
    headerBg: string;
    textColor: string;
    borderColor: string;
    badgeBg: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'saved',
      label: 'Saved',
      headerBg: 'bg-blue-50/70',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-800',
      icon: <BookmarkCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'preparing',
      label: 'Preparing Application',
      headerBg: 'bg-[#F0EDFF]/80',
      textColor: 'text-[#6846F5]',
      borderColor: 'border-[#DDD6FE]',
      badgeBg: 'bg-[#DDD6FE] text-[#5835E5]',
      icon: <FileCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'submitted',
      label: 'Application Submitted',
      headerBg: 'bg-amber-50/80',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800',
      icon: <Send className="w-3.5 h-3.5" />,
    },
    {
      id: 'accepted',
      label: 'Accepted / Enrolled',
      headerBg: 'bg-emerald-50/80',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: <Trophy className="w-3.5 h-3.5" />,
    },
  ];

  // Group saved items by current status
  const groupedItems = React.useMemo(() => {
    const map: Record<ApplicationStage, OpportunityItem[]> = {
      saved: [],
      preparing: [],
      submitted: [],
      accepted: [],
    };

    savedItems.forEach((item) => {
      const stage = applicationTracker[item.id] || 'saved';
      if (map[stage]) {
        map[stage].push(item);
      } else {
        map.saved.push(item);
      }
    });

    return map;
  }, [savedItems, applicationTracker]);

  const [mobileActiveStage, setMobileActiveStage] = React.useState<ApplicationStage | 'all'>('all');

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Target Tracker Header matching showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#10132D] tracking-tight">
            Target Tracker
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track your applications and stay on top of your goals.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">
            Total Tracked: <strong className="text-[#10132D]">{savedItems.length}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onExploreMore}
            className="text-xs font-semibold min-h-[44px] sm:min-h-[36px]"
          >
            + Add From Directory
          </Button>
        </div>
      </div>

      {/* Mobile Stage Selector Switcher (Visible only on < md screens) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        <button
          type="button"
          onClick={() => setMobileActiveStage('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5 active:scale-95 ${
            mobileActiveStage === 'all'
              ? 'bg-[#10132D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Stages</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
            {savedItems.length}
          </span>
        </button>

        {columns.map((col) => {
          const isSelected = mobileActiveStage === col.id;
          const count = groupedItems[col.id].length;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setMobileActiveStage(col.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-[#6846F5] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{col.icon}</span>
              <span>{col.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : col.badgeBg}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4-Column Kanban Board Layout matching mockup screen 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 items-start">
        {columns.map((col) => {
          const items = groupedItems[col.id];
          const isHiddenOnMobile = mobileActiveStage !== 'all' && mobileActiveStage !== col.id;

          if (isHiddenOnMobile) return null;

          return (
            <div
              key={col.id}
              className="bg-[#F8F9FD] rounded-2xl border border-[#E2E8F0] p-3 sm:p-4 flex flex-col min-h-[220px] sm:min-h-[460px] space-y-3"
            >
              {/* Column Header */}
              <div
                className={`p-2.5 rounded-xl border ${col.headerBg} ${col.borderColor} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={col.textColor}>{col.icon}</span>
                  <span className={`text-xs font-bold truncate ${col.textColor}`}>
                    {col.label}
                  </span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {items.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="h-full min-h-[160px] sm:min-h-[300px] flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-2 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
                    {col.id === 'accepted' ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">No accepted opportunities yet</p>
                        <p className="text-[11px] text-slate-500 max-w-[190px] leading-relaxed">
                          Keep going! Your goals are within reach.
                        </p>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-8 h-8 text-slate-300" />
                        <p className="text-xs font-medium text-slate-500">No items in {col.label}</p>
                        <p className="text-[11px] text-slate-400">
                          Move opportunities here as you make progress.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  items.map((item) => {
                    const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
                    const displayName = item.officialName || item.institution;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-xs hover:shadow-md transition-shadow space-y-2.5"
                      >
                        {/* Title and Country */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <UniversityLogo item={item} size="xs" />
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-[#10132D] truncate">
                                {displayName}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                {(item.degreeLevels || []).join(', ')} · {(item.studyFields && item.studyFields[0]) || 'General'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Deadline Date */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Deadline:</span>
                          </span>
                          <span className={`font-semibold ${evalDeadline.isExpired ? 'text-amber-700' : 'text-[#6846F5]'}`}>
                            {evalDeadline.displayText}
                          </span>
                        </div>

                        {/* Stage Selector to Move Card Between Columns */}
                        <div className="pt-1 space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block">
                            Move Stage:
                          </label>
                          <select
                            value={col.id}
                            onChange={(e) => onUpdateStage(item.id, e.target.value as ApplicationStage)}
                            className="w-full min-h-[42px] h-10 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-[#10132D] focus:outline-none focus:border-[#6846F5] cursor-pointer"
                          >
                            <option value="saved">1. Saved Target</option>
                            <option value="preparing">2. Preparing Application</option>
                            <option value="submitted">3. Application Submitted</option>
                            <option value="accepted">4. Accepted / Enrolled</option>
                          </select>
                        </div>

                        {/* Action Link */}
                        <div className="pt-1 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => onOpenDetails(item)}
                            className="text-[11px] font-semibold text-[#6846F5] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>Official Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          {item.officialWebsite && (
                            <a
                              href={item.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Visit official website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
