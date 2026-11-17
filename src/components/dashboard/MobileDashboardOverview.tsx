/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Search,
  Award,
  FileText,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  CheckSquare,
  Clock,
  FileCheck2,
  Target,
  UserPlus,
  Compass,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { ActiveApplicationItem, TargetListItem } from '../../services/auth';
import { DashboardNavTab } from './DashboardSidebar';
import { UniversityLogo } from '../ui/UniversityLogo';

export interface MobileDashboardOverviewProps {
  firstName: string;
  profileCompletion: {
    percentage: number;
    completedCount: number;
    totalCount: number;
    missingFields: { id: string; label: string; category: string; completed: boolean }[];
  };
  opportunities: OpportunityItem[];
  recommendedOpportunities: OpportunityItem[];
  savedOpportunities: Set<string>;
  savedItemsList: OpportunityItem[];
  activeApplications: Record<string, ActiveApplicationItem>;
  targetList: Record<string, TargetListItem>;
  onNavigate: (tab: DashboardNavTab, section?: 'home' | 'saved' | 'applications') => void;
  onToggleSave: (opportunityId: string, name: string) => void;
  onOpenOpportunity: (item: OpportunityItem) => void;
}

export const MobileDashboardOverview: React.FC<MobileDashboardOverviewProps> = ({
  firstName,
  profileCompletion,
  opportunities,
  recommendedOpportunities,
  savedOpportunities,
  savedItemsList,
  activeApplications,
  targetList,
  onNavigate,
  onToggleSave,
  onOpenOpportunity,
}) => {
  const percentage = Math.max(0, Math.min(100, profileCompletion.percentage));
  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - percentage / 100);

  // Compute the next real, meaningful action without duplicating the profile progress copy
  const nextJourneyAction = useMemo(() => {
    const oppMap = new Map<string, OpportunityItem>(opportunities.map((o) => [o.id, o]));

    const preparingApps = Object.values(activeApplications).filter(
      (a) => a.stage === 'preparing' && (oppMap.size === 0 || oppMap.has(a.opportunityId))
    );
    if (preparingApps.length > 0) {
      const firstApp = preparingApps[0];
      const opp = oppMap.get(firstApp.opportunityId);
      const labelName = opp?.shortName || opp?.officialName || opp?.institution || 'your';
      const evalDeadline = opp ? evaluateOpportunityDeadline(opp.deadlines) : null;
      return {
        key: 'continue-app',
        icon: <FileCheck2 className="w-5 h-5 text-[#5D35F5]" aria-hidden="true" />,
        title: `Continue ${labelName} application`,
        subtitle: evalDeadline?.displayText
          ? `${preparingApps.length} in preparation · ${evalDeadline.displayText}`
          : `${preparingApps.length} active application${preparingApps.length === 1 ? '' : 's'} in preparation`,
        onClick: () => onNavigate('overview', 'applications'),
      };
    }

    const targets = Object.values(targetList).filter(
      (t) => oppMap.size === 0 || oppMap.has(t.opportunityId)
    );
    if (targets.length > 0) {
      const priorityRank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
      const sortedTargets = [...targets].sort(
        (a, b) => (priorityRank[a.priority] ?? 2) - (priorityRank[b.priority] ?? 2)
      );
      const topTarget = sortedTargets[0];
      const opp = oppMap.get(topTarget.opportunityId);
      const labelName = opp?.shortName || opp?.officialName || opp?.institution || 'shortlisted';
      return {
        key: 'start-target',
        icon: <Target className="w-5 h-5 text-[#5D35F5]" aria-hidden="true" />,
        title: `Start ${labelName} application`,
        subtitle: `${targets.length} target${targets.length === 1 ? '' : 's'} saved · Review checklist & deadlines`,
        onClick: () => onNavigate('tracker', 'home'),
      };
    }

    if (savedItemsList.length > 0) {
      const firstSaved = savedItemsList[0];
      const displayName = firstSaved.shortName || firstSaved.officialName || firstSaved.institution;
      return {
        key: 'review-saved',
        icon: <BookmarkCheck className="w-5 h-5 text-[#5D35F5]" aria-hidden="true" />,
        title: `Review ${displayName}`,
        subtitle: `${savedItemsList.length} saved · Check funding & admission criteria`,
        onClick: () => onOpenOpportunity(firstSaved),
      };
    }

    if (profileCompletion.missingFields.length > 0) {
      const nextMissing = profileCompletion.missingFields[0];
      const remaining = profileCompletion.missingFields.length;
      return {
        key: 'add-profile-detail',
        icon: <UserPlus className="w-5 h-5 text-[#5D35F5]" aria-hidden="true" />,
        title: `Add ${nextMissing.label.toLowerCase()}`,
        subtitle: `${remaining} ${remaining === 1 ? 'detail' : 'details'} remaining · ${nextMissing.category}`,
        onClick: () => onNavigate('profile', 'home'),
      };
    }

    const topMatch = recommendedOpportunities[0];
    return {
      key: 'explore-top-match',
      icon: <Compass className="w-5 h-5 text-[#5D35F5]" aria-hidden="true" />,
      title: topMatch
        ? `Explore ${topMatch.shortName || topMatch.officialName || topMatch.institution}`
        : 'Explore verified universities',
      subtitle: topMatch
        ? `${topMatch.countryFlag} ${topMatch.country} · Top match for your profile`
        : 'Discover programs tailored to your academic goals',
      onClick: () => (topMatch ? onOpenOpportunity(topMatch) : onNavigate('universities', 'home')),
    };
  }, [
    opportunities,
    activeApplications,
    targetList,
    savedItemsList,
    profileCompletion.missingFields,
    recommendedOpportunities,
    onNavigate,
    onOpenOpportunity,
  ]);

  const recentItems = useMemo(() => {
    const source = recommendedOpportunities.length > 0 ? recommendedOpportunities : opportunities;
    return source.slice(0, 4);
  }, [recommendedOpportunities, opportunities]);

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* 1. Compact Purple Gradient Welcome Banner */}
      <section
        aria-label="Welcome"
        className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#734EF8] via-[#5E37EB] to-[#4722C5] px-4 py-3.5 text-white shadow-[0_10px_24px_-10px_rgba(94,55,235,0.48)]"
      >
        {/* Subtle ambient radial depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 left-8 w-32 h-32 rounded-full bg-[#A38BFF]/20 blur-2xl"
        />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="font-display text-[18px] min-[375px]:text-[20px] font-bold tracking-tight leading-snug text-white">
              Welcome back, {firstName} <span aria-hidden="true">👋</span>
            </h2>
            <p className="text-[12px] min-[375px]:text-[12.5px] leading-[1.45] text-white/90 max-w-[235px]">
              Discover opportunities, apply with confidence, and grow your future globally.
            </p>
          </div>

          {/* Compact Graduation Cap & Stacked Books Illustration */}
          <div className="shrink-0 self-end -mb-1" aria-hidden="true">
            <svg
              viewBox="0 0 112 92"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[82px] h-[68px] min-[375px]:w-[94px] min-[375px]:h-[78px] drop-shadow-[0_8px_14px_rgba(16,19,45,0.32)]"
            >
              <defs>
                <linearGradient id="ccBookTop" x1="18" y1="48" x2="96" y2="66" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#284C8F" />
                  <stop offset="1" stopColor="#172B59" />
                </linearGradient>
                <linearGradient id="ccBookBottom" x1="14" y1="64" x2="98" y2="84" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B68B8" />
                  <stop offset="1" stopColor="#1E3A78" />
                </linearGradient>
                <linearGradient id="ccCapTop" x1="22" y1="12" x2="88" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#31385A" />
                  <stop offset="1" stopColor="#12162F" />
                </linearGradient>
                <linearGradient id="ccCapCrown" x1="34" y1="28" x2="78" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#232849" />
                  <stop offset="1" stopColor="#10132A" />
                </linearGradient>
              </defs>

              {/* Soft shadow base */}
              <ellipse cx="56" cy="83" rx="44" ry="5" fill="#1A0E4F" fillOpacity="0.35" />

              {/* Bottom hardcover book */}
              <path d="M16 68C16 65.2 18.2 63 21 63H92C94.2 63 96 64.8 96 67V76C96 78.2 94.2 80 92 80H21C18.2 80 16 77.8 16 75V68Z" fill="url(#ccBookBottom)" />
              <path d="M22 67H94V75.5H22C20.3 75.5 19 73.6 19 71.25C19 68.9 20.3 67 22 67Z" fill="#EDF2FA" />
              <path d="M22 71.5H93" stroke="#CBD5E1" strokeWidth="1" />

              {/* Top hardcover book */}
              <path d="M20 53C20 50.2 22.2 48 25 48H90C92.2 48 94 49.8 94 52V61C94 63.2 92.2 65 90 65H25C22.2 65 20 62.8 20 60V53Z" fill="url(#ccBookTop)" />
              <path d="M26 52H92V60.5H26C24.3 60.5 23 58.6 23 56.25C23 53.9 24.3 52 26 52Z" fill="#F8FAFC" />
              <path d="M26 56.5H91" stroke="#CBD5E1" strokeWidth="1" />

              {/* Graduation cap crown */}
              <path d="M35 30V43.5C35 47.2 44.4 50.5 56 50.5C67.6 50.5 77 47.2 77 43.5V30H35Z" fill="url(#ccCapCrown)" />
              {/* Mortarboard top */}
              <path d="M56 11L19 25.5L56 40L93 25.5L56 11Z" fill="url(#ccCapTop)" stroke="#47507A" strokeWidth="0.8" />
              {/* Center button */}
              <ellipse cx="56" cy="25" rx="3.4" ry="2" fill="#E7B75C" />
              {/* Gold tassel */}
              <path d="M56 25L77 32V49" stroke="#F4C152" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="77" cy="50.5" r="2.2" fill="#F4C152" />
              <path d="M75 52.5L73.5 62.5H80.5L79 52.5H75Z" fill="#E7B75C" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Quick Access Cards — 2-Column Responsive Pastel Grid */}
      <section aria-label="Quick access" className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('universities', 'home')}
          className="min-h-[82px] rounded-2xl bg-[#F0ECFF] hover:bg-[#E7E0FF] hover:shadow-[0_6px_16px_rgba(16,19,45,0.07)] border border-[#DFD6FF] px-3 py-2.5 flex flex-col items-center justify-center text-center gap-1.5 transition-[box-shadow,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] active:shadow-2xs cursor-pointer shadow-[0_2px_8px_rgba(16,19,45,0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <span className="w-9 h-9 rounded-xl bg-white/85 flex items-center justify-center shadow-2xs text-[#5D35F5]">
            <Search className="w-[18px] h-[18px]" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#10132D] leading-tight">
            Explore Universities
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('scholarships', 'home')}
          className="min-h-[82px] rounded-2xl bg-[#FFF6E3] hover:bg-[#FFEFCE] hover:shadow-[0_6px_16px_rgba(16,19,45,0.07)] border border-[#F5E2B8] px-3 py-2.5 flex flex-col items-center justify-center text-center gap-1.5 transition-[box-shadow,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] active:shadow-2xs cursor-pointer shadow-[0_2px_8px_rgba(16,19,45,0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <span className="w-9 h-9 rounded-xl bg-white/85 flex items-center justify-center shadow-2xs text-[#C68615]">
            <Award className="w-[18px] h-[18px]" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#10132D] leading-tight">
            Scholarships
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('overview', 'applications')}
          className="min-h-[82px] rounded-2xl bg-[#EAF2FF] hover:bg-[#DFECFF] hover:shadow-[0_6px_16px_rgba(16,19,45,0.07)] border border-[#D1E1FC] px-3 py-2.5 flex flex-col items-center justify-center text-center gap-1.5 transition-[box-shadow,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] active:shadow-2xs cursor-pointer shadow-[0_2px_8px_rgba(16,19,45,0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <span className="w-9 h-9 rounded-xl bg-white/85 flex items-center justify-center shadow-2xs text-[#2258BD]">
            <FileText className="w-[18px] h-[18px]" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#10132D] leading-tight">
            Applications
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('overview', 'saved')}
          className="min-h-[82px] rounded-2xl bg-[#FDEBF1] hover:bg-[#FCE0EA] hover:shadow-[0_6px_16px_rgba(16,19,45,0.07)] border border-[#F7CFE0] px-3 py-2.5 flex flex-col items-center justify-center text-center gap-1.5 transition-[box-shadow,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] active:shadow-2xs cursor-pointer shadow-[0_2px_8px_rgba(16,19,45,0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <span className="w-9 h-9 rounded-xl bg-white/85 flex items-center justify-center shadow-2xs text-[#C43767]">
            <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#10132D] leading-tight">
            Saved Opportunities
          </span>
        </button>
      </section>

      {/* 3. Your Progress — Real Calculated Profile Completion Card */}
      <button
        type="button"
        onClick={() => onNavigate('profile', 'home')}
        aria-label={`Your Progress: ${percentage}% profile completion. Open profile`}
        className="w-full text-left bg-white rounded-2xl border border-[#EAEEF5] p-3.5 shadow-[0_2px_12px_rgba(16,19,45,0.04)] hover:shadow-[0_6px_18px_rgba(16,19,45,0.07)] hover:border-[#6846F5]/35 active:scale-[0.985] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] group"
      >
        {/* SVG Ring */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
            <circle
              cx="32"
              cy="32"
              r={ringRadius}
              fill="none"
              stroke="#ECEEF6"
              strokeWidth="6"
            />
            <circle
              cx="32"
              cy="32"
              r={ringRadius}
              fill="none"
              stroke="#6846F5"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringDashOffset}
            />
          </svg>
          <span className="absolute text-[13px] font-bold text-[#10132D] tabular-nums">
            {percentage}%
          </span>
        </div>

        {/* Title, Copy, and Subtle Progress Bar */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[14px] font-bold font-display text-[#10132D] leading-tight">
              Your Progress
            </h3>
          </div>
          <p className="text-[12px] text-[#64748B] leading-snug">
            {percentage < 100
              ? 'Complete your profile to get better matches.'
              : 'Your academic profile is complete and tailored.'}
          </p>
          <div className="w-full h-2 rounded-full bg-[#ECEEF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6846F5] to-[#7F61FA] transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <ChevronRight
          className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>

      {/* 4. Continue Your Journey — Entire Card Clickable */}
      <button
        type="button"
        onClick={nextJourneyAction.onClick}
        aria-label={`Continue Your Journey: ${nextJourneyAction.title}`}
        className="w-full text-left bg-white rounded-2xl border border-[#EAEEF5] p-3.5 shadow-[0_2px_12px_rgba(16,19,45,0.04)] hover:shadow-[0_6px_18px_rgba(16,19,45,0.07)] hover:border-[#6846F5]/35 active:scale-[0.985] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out space-y-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] group"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#374151] shrink-0" aria-hidden="true" />
          <h3 className="text-[14px] font-bold font-display text-[#10132D]">
            Continue Your Journey
          </h3>
        </div>

        <div className="w-full min-h-[52px] rounded-xl bg-[#F4F2FF] group-hover:bg-[#ECE8FF] border border-[#E5DFFF] px-3 py-2.5 flex items-center gap-3 transition-colors duration-150">
          <span className="w-10 h-10 rounded-xl bg-white border border-[#E3DCFF] flex items-center justify-center shrink-0 shadow-2xs">
            {nextJourneyAction.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#10132D] leading-snug truncate">
              {nextJourneyAction.title}
            </p>
            <p className="text-[11.5px] text-[#64748B] leading-snug truncate mt-0.5">
              {nextJourneyAction.subtitle}
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-[#6846F5] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </button>

      {/* 5. Recent Opportunities — Verified Database Records with Authentic Crests */}
      <section aria-label="Recent Opportunities" className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#374151] shrink-0" aria-hidden="true" />
            <h3 className="text-[14.5px] font-bold font-display text-[#10132D]">
              Recent Opportunities
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('universities', 'home')}
            className="min-h-[36px] px-1.5 text-[12px] font-bold text-[#6846F5] hover:underline flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] rounded-lg"
          >
            View All
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAEEF5] p-5 text-center space-y-2">
            <p className="text-xs text-slate-500">
              No verified opportunities loaded yet. Explore the catalog to get started.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('universities', 'home')}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#6846F5] text-white text-xs font-bold cursor-pointer"
            >
              Explore Universities
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentItems.map((item) => {
              const displayName = item.officialName || item.institution;
              const isSaved = savedOpportunities.has(item.id);
              const fundingLabel =
                item.fundingDetails?.type ||
                item.funding?.type ||
                (item.category === 'scholarship' ? 'Scholarship' : 'Tuition Aid');
              const evalDeadline = evaluateOpportunityDeadline(item.deadlines);

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenOpportunity(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenOpportunity(item);
                    }
                  }}
                  className="bg-white rounded-2xl border border-[#EAEEF5] p-3 shadow-[0_2px_10px_rgba(16,19,45,0.04)] hover:shadow-[0_6px_16px_rgba(16,19,45,0.07)] hover:border-[#6846F5]/35 active:scale-[0.985] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] group"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-3 text-left">
                    <UniversityLogo item={item} size="md" />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-[13.5px] font-bold text-[#10132D] group-hover:text-[#6846F5] transition-colors truncate leading-snug">
                        {displayName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11.5px] text-[#64748B] truncate">
                        <span className="shrink-0" aria-hidden="true">
                          {item.countryFlag}
                        </span>
                        <span className="truncate font-medium text-slate-700">{item.country}</span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="truncate font-semibold text-[#5D35F5]">{fundingLabel}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {evalDeadline.displayText}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(item.id, displayName);
                    }}
                    aria-label={isSaved ? `Remove ${displayName} from saved` : `Save ${displayName}`}
                    aria-pressed={isSaved}
                    className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] ${
                      isSaved
                        ? 'bg-[#F0EDFF] text-[#6846F5]'
                        : 'text-slate-400 hover:text-[#6846F5] hover:bg-slate-100'
                    }`}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-[18px] h-[18px] fill-[#6846F5]" aria-hidden="true" />
                    ) : (
                      <Bookmark className="w-[18px] h-[18px]" aria-hidden="true" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
