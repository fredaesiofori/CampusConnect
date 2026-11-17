/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BellRing,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FilePlus2,
  FileText,
  GraduationCap,
  Heart,
  Pencil,
  Send,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import {
  ActiveApplicationItem,
  ActiveApplicationStage,
  TargetListItem,
  User,
} from '../../services/auth';
import { StudentInitialsAvatar } from '../ui/StudentInitialsAvatar';
import { UniversityLogo } from '../ui/UniversityLogo';
import type { DashboardNavTab } from './DashboardSidebar';
import type { BookmarkFilter } from './SavedOpportunitiesView';
import type { StageFilter } from './ApplicationsView';

export interface DesktopDashboardOverviewProps {
  activeUser: User | null;
  profileCompletion: {
    percentage: number;
    completedCount: number;
    totalCount: number;
    missingFields: {
      id: string;
      label: string;
      category: string;
      completed: boolean;
    }[];
  };
  counts: {
    universities: number;
    scholarships: number;
    saved: number;
    savedUnis: number;
    savedScholarships: number;
    applications: number;
    preparingApps: number;
    submittedApps: number;
    acceptedApps: number;
    targets: number;
    highPriorityTargets: number;
  };
  opportunities: OpportunityItem[];
  recommendedMatches: OpportunityItem[];
  savedOpportunities: Set<string>;
  activeApplications: Record<string, ActiveApplicationItem>;
  targetList: Record<string, TargetListItem>;
  onNavigate: (
    tab: DashboardNavTab,
    section?: 'home' | 'saved' | 'applications'
  ) => void;
  onOpenSavedFiltered: (filter: BookmarkFilter) => void;
  onOpenApplicationsFiltered: (filter: StageFilter, openStartPicker?: boolean) => void;
  onToggleSave: (opportunityId: string, title: string) => void;
  onOpenOpportunity: (item: OpportunityItem) => void;
  onUpdateApplication: (
    opportunityId: string,
    patch: {
      stage?: ActiveApplicationStage;
      completedTasks?: string[];
      notes?: string;
      followUpDate?: string | null;
      requirementSnapshot?: string;
    }
  ) => Promise<void>;
  onOpenNotificationSettings?: () => void;
}

interface VerifiedDeadlineEntry {
  opportunity: OpportunityItem;
  sourceLabel: 'Active Application' | 'Target List' | 'Saved Opportunity';
  deadlineType: string;
  monthShort: string;
  dayNum: string;
  isoTimestamp: number;
  displayDateText: string;
}

function getRequiredTasksCount(item: OpportunityItem): number {
  const rawDocs = item.admissionsRequirements?.documents?.length
    ? item.admissionsRequirements.documents
    : item.admissionsRequirements?.documentsRequired;
  const docs =
    rawDocs && rawDocs.length > 0
      ? rawDocs
      : [
          'Official Academic Transcripts',
          'Identification / Passport',
          'Personal Statement / Motivation Letter',
        ];
  const unique = Array.from(new Set(docs.map((d) => d.trim()).filter(Boolean)));
  if (!unique.some((d) => d.toLowerCase().includes('submit official'))) {
    unique.push('Submit Official Online Application');
  }
  return unique.length;
}

function parseStrictConfirmedDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T23:59:59Z`
    : trimmed;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

export const DesktopDashboardOverview: React.FC<DesktopDashboardOverviewProps> = ({
  activeUser,
  profileCompletion,
  counts,
  opportunities,
  recommendedMatches,
  savedOpportunities,
  activeApplications,
  targetList,
  onNavigate,
  onOpenSavedFiltered,
  onOpenApplicationsFiltered,
  onToggleSave,
  onOpenOpportunity,
  onUpdateApplication,
  onOpenNotificationSettings,
}) => {
  const [matchPage, setMatchPage] = useState(0);
  const [showAllDeadlinesModal, setShowAllDeadlinesModal] = useState(false);
  const [showSetDeadlineModal, setShowSetDeadlineModal] = useState(false);
  const [selectedReminderOppId, setSelectedReminderOppId] = useState('');
  const [reminderDateInput, setReminderDateInput] = useState('');
  const [isSavingReminder, setIsSavingReminder] = useState(false);

  const firstName =
    activeUser?.fullName?.trim().split(/\s+/)[0] ||
    activeUser?.email?.split('@')[0] ||
    'Scholar';

  const userField = (
    activeUser?.profile?.fieldOfStudy ||
    activeUser?.studyField ||
    ''
  ).trim();
  const userTargetDegree = (
    activeUser?.profile?.intendedDegree ||
    activeUser?.degreeLevel ||
    ''
  ).trim();
  const userGradYear = (activeUser?.profile?.graduationYear || '').trim();

  const bannerSubParts: string[] = [];
  if (userField) bannerSubParts.push(userField);
  if (userTargetDegree) bannerSubParts.push(`Target: ${userTargetDegree}`);
  if (userGradYear) bannerSubParts.push(userGradYear);

  const opportunityMap = useMemo(() => {
    const map = new Map<string, OpportunityItem>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, [opportunities]);

  // Carousel pagination (2 cards visible at once on Desktop matching reference)
  const visibleMatches = useMemo(() => {
    if (recommendedMatches.length <= 2) return recommendedMatches;
    const totalPages = Math.ceil(recommendedMatches.length / 2);
    const safePage = matchPage % totalPages;
    const slice = recommendedMatches.slice(safePage * 2, safePage * 2 + 2);
    if (slice.length === 1 && recommendedMatches.length >= 2) {
      return [slice[0], recommendedMatches[0]];
    }
    return slice;
  }, [recommendedMatches, matchPage]);

  // Extract verified, non-expired, confirmed upcoming deadlines
  // Priority order: 1. Active Applications -> 2. Target List -> 3. Saved Opportunities
  const verifiedUpcomingDeadlines = useMemo<VerifiedDeadlineEntry[]>(() => {
    const seen = new Set<string>();
    const results: VerifiedDeadlineEntry[] = [];
    const now = new Date();
    const monthFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });

    const tryAdd = (
      opportunityId: string,
      sourceLabel: VerifiedDeadlineEntry['sourceLabel']
    ) => {
      if (seen.has(opportunityId)) return;
      const opp = opportunityMap.get(opportunityId);
      if (!opp || !opp.isVerified || !opp.deadlines) return;

      const evalResult = evaluateOpportunityDeadline(opp.deadlines, now);
      if (evalResult.isExpired || evalResult.status === 'rolling') return;

      const parsedDate = parseStrictConfirmedDate(opp.deadlines.deadlineDate);
      if (!parsedDate || parsedDate < now) return;

      seen.add(opportunityId);
      const monthShort = monthFormatter.format(parsedDate).toUpperCase();
      const dayNum = String(parsedDate.getUTCDate());
      const deadlineType = opp.deadlines.term
        ? `${opp.deadlines.term} Deadline`
        : opp.category === 'scholarship'
        ? 'Scholarship Deadline'
        : 'Admission Deadline';

      results.push({
        opportunity: opp,
        sourceLabel,
        deadlineType,
        monthShort,
        dayNum,
        isoTimestamp: parsedDate.getTime(),
        displayDateText: evalResult.displayText || opp.deadlines.deadlineText,
      });
    };

    Object.keys(activeApplications).forEach((id) =>
      tryAdd(id, 'Active Application')
    );
    Object.keys(targetList).forEach((id) => tryAdd(id, 'Target List'));
    savedOpportunities.forEach((id) => tryAdd(id, 'Saved Opportunity'));

    return results.sort((a, b) => a.isoTimestamp - b.isoTimestamp);
  }, [activeApplications, targetList, savedOpportunities, opportunityMap]);

  // Authentic Goal & Progress calculation strictly from real Active Applications & Target List (no invented %)
  const realGoalProgress = useMemo(() => {
    const appList = Object.values(activeApplications)
      .map((app) => ({ app, opp: opportunityMap.get(app.opportunityId) }))
      .filter((entry): entry is { app: ActiveApplicationItem; opp: OpportunityItem } =>
        Boolean(entry.opp)
      )
      .sort(
        (a, b) =>
          new Date(b.app.updatedAt).getTime() - new Date(a.app.updatedAt).getTime()
      );

    if (appList.length > 0) {
      const top = appList[0];
      const totalTasks = getRequiredTasksCount(top.opp);
      const doneTasks = top.app.completedTasks?.length || 0;
      const pct =
        top.app.stage === 'accepted'
          ? 100
          : totalTasks > 0
          ? Math.min(100, Math.round((doneTasks / totalTasks) * 100))
          : 0;
      const targetMeta = targetList[top.opp.id];
      const subParts: string[] = [];
      if (targetMeta?.intakeYear) subParts.push(`Target: ${targetMeta.intakeYear}`);
      subParts.push(`${doneTasks} of ${totalTasks} tasks complete`);

      return {
        hasTrackableGoal: true,
        title:
          targetMeta?.personalGoal?.trim() ||
          top.opp.shortName ||
          top.opp.officialName,
        subtitle: subParts.join(' · '),
        percentage: pct,
        targetOpportunity: top.opp,
        source: 'application' as const,
      };
    }

    const targets = Object.values(targetList)
      .map((t) => ({ target: t, opp: opportunityMap.get(t.opportunityId) }))
      .filter((entry): entry is { target: TargetListItem; opp: OpportunityItem } =>
        Boolean(entry.opp)
      )
      .sort((a, b) => {
        const rank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (rank[a.target.priority] ?? 2) - (rank[b.target.priority] ?? 2);
      });

    if (targets.length > 0) {
      const topTarget = targets[0];
      return {
        hasTrackableGoal: true,
        title:
          topTarget.target.personalGoal?.trim() ||
          topTarget.opp.shortName ||
          topTarget.opp.officialName,
        subtitle: `Target: ${topTarget.target.intakeYear} · ${topTarget.target.priority} Priority (Application not started)`,
        percentage: 0,
        targetOpportunity: topTarget.opp,
        source: 'target' as const,
      };
    }

    return {
      hasTrackableGoal: false,
      title: '',
      subtitle: '',
      percentage: 0,
      targetOpportunity: null,
      source: 'none' as const,
    };
  }, [activeApplications, targetList, opportunityMap]);

  const activeAppsList = useMemo(() => {
    return Object.values(activeApplications)
      .map((app) => ({ app, opp: opportunityMap.get(app.opportunityId) }))
      .filter((e): e is { app: ActiveApplicationItem; opp: OpportunityItem } =>
        Boolean(e.opp)
      );
  }, [activeApplications, opportunityMap]);

  const handleOpenSetDeadlineModal = () => {
    if (activeAppsList.length > 0) {
      const first = activeAppsList[0];
      setSelectedReminderOppId(first.opp.id);
      setReminderDateInput(first.app.followUpDate || '');
    } else {
      setSelectedReminderOppId('');
      setReminderDateInput('');
    }
    setShowSetDeadlineModal(true);
  };

  const handleSaveReminderDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReminderOppId) return;
    setIsSavingReminder(true);
    try {
      await onUpdateApplication(selectedReminderOppId, {
        followUpDate: reminderDateInput ? reminderDateInput : null,
      });
      setShowSetDeadlineModal(false);
    } finally {
      setIsSavingReminder(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Dashboard Page Heading */}
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-[#10132D] tracking-tight leading-tight">
          Dashboard
        </h2>
        <p className="text-xs sm:text-[13px] text-[#475569]">
          Your personal academic journey
        </p>
      </div>

      {/* 2. Compact Personalized Lavender Welcome Banner */}
      <section
        aria-label="Welcome and profile completion"
        className="rounded-[18px] bg-gradient-to-r from-[#F3EFFF] via-[#F7F4FF] to-[#EEEAFF] border border-[#E6DFFF] px-4 py-3.5 sm:px-5 sm:py-4 shadow-[0_2px_12px_rgba(104,70,245,0.05)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
          {/* Left: Student Initials + Welcome Name + Degree Metadata */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <StudentInitialsAvatar
              fullName={activeUser?.fullName}
              email={activeUser?.email}
              size="xl"
              className="ring-2 ring-white shadow-md"
            />
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#10132D] truncate">
                Welcome back, {firstName} 👋
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] truncate">
                {bannerSubParts.length > 0
                  ? bannerSubParts.join(' · ')
                  : 'Complete your study profile to tailor your university & scholarship matches'}
              </p>
            </div>
          </div>

          {/* Middle & Right: Real Profile Completion Bar + Complete Profile CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-5 shrink-0">
            <div className="w-full sm:w-56 lg:w-60 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1E293B]">
                <span>Profile Completion</span>
                <span className="text-[11px] font-medium text-slate-500">
                  {profileCompletion.completedCount}/{profileCompletion.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex-1 h-2.5 rounded-full bg-white border border-[#E2D9FA] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={profileCompletion.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Profile completion"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6846F5] transition-all duration-300"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-[#10132D] tabular-nums shrink-0">
                  {profileCompletion.percentage}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('profile', 'home')}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-[#FAF8FF] border border-[#D9CFFB] text-[#5B2EE6] text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm active:scale-[0.985] transition-all cursor-pointer min-h-[40px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span>
                {profileCompletion.percentage >= 100
                  ? 'View Profile'
                  : 'Complete Profile'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. ROW 1: My Applications (Left ~58%) + My Saved Opportunities (Right ~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* My Applications Card (Genuinely supported stages only) */}
        <section
          aria-label="My Applications"
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-[18px] h-[18px] text-[#6846F5] shrink-0" />
              <h3 className="text-[15px] sm:text-base font-bold font-display text-[#10132D]">
                My Applications
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenApplicationsFiltered('all')}
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Stage 1: In Progress (preparing) */}
            <button
              type="button"
              onClick={() => onOpenApplicationsFiltered('preparing')}
              className="rounded-xl bg-[#EEF5FF] hover:bg-[#E2EEFF] border border-[#DCE9FE] px-3.5 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#DCE9FE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <span className="text-xl font-extrabold font-display text-[#10132D] tabular-nums">
                  {counts.preparingApps}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1E293B] mt-1.5">
                In Progress
              </p>
            </button>

            {/* Stage 2: Submitted (submitted) */}
            <button
              type="button"
              onClick={() => onOpenApplicationsFiltered('submitted')}
              className="rounded-xl bg-[#F4F0FF] hover:bg-[#EBE3FF] border border-[#E6DCFF] px-3.5 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#E6DCFF] text-[#6846F5] flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </span>
                <span className="text-xl font-extrabold font-display text-[#10132D] tabular-nums">
                  {counts.submittedApps}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1E293B] mt-1.5">
                Submitted
              </p>
            </button>

            {/* Stage 3: Accepted (accepted) */}
            <button
              type="button"
              onClick={() => onOpenApplicationsFiltered('accepted')}
              className="rounded-xl bg-[#EBF9EE] hover:bg-[#DCF4E2] border border-[#D2F0DA] px-3.5 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#D2F0DA] text-[#16A34A] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xl font-extrabold font-display text-[#10132D] tabular-nums">
                  {counts.acceptedApps}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1E293B] mt-1.5">
                Accepted
              </p>
            </button>
          </div>
        </section>

        {/* My Saved Opportunities Card */}
        <section
          aria-label="My Saved Opportunities"
          className="lg:col-span-5 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-[18px] h-[18px] text-[#6846F5] shrink-0" />
              <h3 className="text-[15px] sm:text-base font-bold font-display text-[#10132D]">
                My Saved Opportunities
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenSavedFiltered('all')}
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onOpenSavedFiltered('universities')}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-[#E8EAF2] bg-white hover:border-[#C4B5FD] hover:bg-[#FAF8FF] active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <GraduationCap className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-xs sm:text-[13px] font-semibold text-[#10132D] truncate">
                  Universities Saved
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-[#EFEAFF] text-[#5B2EE6] text-xs font-bold tabular-nums">
                  {counts.savedUnis}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenSavedFiltered('scholarships')}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-[#E8EAF2] bg-white hover:border-[#C4B5FD] hover:bg-[#FAF8FF] active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Award className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-xs sm:text-[13px] font-semibold text-[#10132D] truncate">
                  Scholarships Saved
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-[#EFEAFF] text-[#5B2EE6] text-xs font-bold tabular-nums">
                  {counts.savedScholarships}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* 4. ROW 2: My Matches for You (Left ~58%) + Upcoming Deadlines (Right ~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* My Matches for You */}
        <section
          aria-label="My Matches for You"
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <Sparkles className="w-5 h-5 text-[#6846F5] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D] leading-snug">
                  My Matches for You
                </h3>
                <p className="text-xs text-[#64748B]">
                  Personalized opportunities based on your profile.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('universities', 'home')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer shrink-0 pt-0.5"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {visibleMatches.length > 0 ? (
            <div className="flex items-center gap-2.5">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
                {visibleMatches.map((item) => {
                  const isSaved = savedOpportunities.has(item.id);
                  const displayName = item.officialName || item.institution;
                  const degreeSnippet =
                    userTargetDegree &&
                    item.degreeLevels?.some((lvl) =>
                      lvl.toLowerCase().includes(userTargetDegree.toLowerCase().split(' ')[0])
                    )
                      ? userTargetDegree
                      : item.degreeLevels?.[0] || item.category;

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
                      className="rounded-xl border border-[#E8EAF2] bg-white p-3.5 flex items-center justify-between gap-3 hover:border-[#C4B5FD] hover:shadow-md active:scale-[0.985] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UniversityLogo item={item} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#10132D] leading-snug line-clamp-2">
                              {displayName}
                            </h4>
                            {item.isVerified && (
                              <BadgeCheck
                                className="w-3.5 h-3.5 text-[#2563EB] shrink-0"
                                aria-label="Verified institution"
                              />
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-[#64748B] truncate mt-0.5">
                            {degreeSnippet} · {item.country}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id, displayName);
                        }}
                        aria-label={
                          isSaved
                            ? `Remove ${displayName} from saved`
                            : `Save ${displayName}`
                        }
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                          isSaved
                            ? 'text-[#6846F5] bg-[#F4F0FF]'
                            : 'text-slate-400 hover:text-[#6846F5] hover:bg-[#F4F0FF]'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isSaved ? 'fill-[#6846F5]' : ''}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {recommendedMatches.length > 2 && (
                <button
                  type="button"
                  onClick={() => setMatchPage((prev) => prev + 1)}
                  aria-label="Show next personalized matches"
                  className="hidden sm:flex w-8 h-8 rounded-full bg-[#F4F0FF] hover:bg-[#E6DCFF] text-[#6846F5] items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-center space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-[#10132D]">
                No suitable verified matches found for your current criteria
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Update your preferred destinations, degree level, or field of study in Profile, or browse the verified directory directly.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('profile', 'home')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#6846F5] text-white text-xs font-semibold hover:bg-[#5734E6] cursor-pointer"
                >
                  Update Preferences
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('universities', 'home')}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Browse Directory
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Deadlines */}
        <section
          aria-label="Upcoming Deadlines"
          className="lg:col-span-5 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-[18px] h-[18px] text-[#6846F5] shrink-0" />
              <h3 className="text-[15px] sm:text-base font-bold font-display text-[#10132D]">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAllDeadlinesModal(true)}
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {verifiedUpcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {verifiedUpcomingDeadlines.slice(0, 2).map((entry) => (
                <button
                  key={entry.opportunity.id}
                  type="button"
                  onClick={() => onOpenOpportunity(entry.opportunity)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[#E8EAF2] bg-white hover:border-[#C4B5FD] hover:bg-[#FAF8FF] active:scale-[0.99] transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#F3EFFF] text-[#5B2EE6] flex flex-col items-center justify-center shrink-0 leading-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {entry.monthShort}
                      </span>
                      <span className="text-sm font-extrabold font-display mt-0.5 tabular-nums">
                        {entry.dayNum}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#10132D] truncate">
                        {entry.opportunity.shortName ||
                          entry.opportunity.officialName}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#64748B] truncate">
                        {entry.deadlineType}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-center space-y-2">
              <p className="text-xs font-semibold text-[#10132D]">
                No confirmed upcoming deadlines in your lists
              </p>
              <p className="text-[11px] text-slate-500">
                Save opportunities, shortlist targets, or start an application to track confirmed dates here.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('universities', 'home')}
                className="text-xs font-bold text-[#6846F5] hover:underline cursor-pointer"
              >
                Find Opportunities →
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 5. ROW 3: My Goals & Progress (Left ~58%) + Quick Actions (Right ~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* My Goals & Progress */}
        <section
          aria-label="My Goals and Progress"
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-[18px] h-[18px] text-[#6846F5] shrink-0" />
              <h3 className="text-[15px] sm:text-base font-bold font-display text-[#10132D]">
                My Goals &amp; Progress
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tracker', 'home')}
              className="text-xs sm:text-sm font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer"
            >
              Edit Goals
            </button>
          </div>

          {realGoalProgress.hasTrackableGoal ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                realGoalProgress.source === 'application'
                  ? onOpenApplicationsFiltered('all')
                  : onNavigate('tracker', 'home')
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (realGoalProgress.source === 'application') {
                    onOpenApplicationsFiltered('all');
                  } else {
                    onNavigate('tracker', 'home');
                  }
                }
              }}
              className="rounded-xl border border-[#EAEDF4] bg-[#FAF9FF] hover:border-[#C4B5FD] p-4 space-y-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <GraduationCap className="w-5 h-5 text-[#6846F5] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#10132D] truncate">
                      {realGoalProgress.title}
                    </h4>
                    <p className="text-xs text-[#64748B] truncate mt-0.5">
                      {realGoalProgress.subtitle}
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#6846F5] tabular-nums shrink-0">
                  {realGoalProgress.percentage}%
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-[#EFEAFF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6846F5] transition-all duration-300"
                  style={{ width: `${realGoalProgress.percentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#DFD8FA] bg-[#FAF9FF] px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-[#10132D]">
                  {userTargetDegree || userField
                    ? `Target Focus: ${[userTargetDegree, userField].filter(Boolean).join(' · ')}`
                    : 'No study targets tracked yet'}
                </p>
                <p className="text-xs text-slate-600">
                  Shortlist a university in Target List or start an application to track real task progress here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tracker', 'home')}
                className="px-3.5 py-2 rounded-xl bg-[#6846F5] hover:bg-[#5734E6] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
              >
                Add Target Goal
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section
          aria-label="Quick Actions"
          className="lg:col-span-5 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-[18px] h-[18px] text-[#6846F5] shrink-0" />
            <h3 className="text-[15px] sm:text-base font-bold font-display text-[#10132D]">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onOpenApplicationsFiltered('all', false)}
              className="rounded-xl bg-[#F4F0FF] hover:bg-[#EAE2FF] border border-[#E6DCFF] px-2 py-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <FilePlus2 className="w-[18px] h-[18px] text-[#6846F5]" />
              <span className="text-[11.5px] font-semibold text-[#10132D] leading-tight">
                Track Application
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('universities', 'home')}
              className="rounded-xl bg-[#F4F0FF] hover:bg-[#EAE2FF] border border-[#E6DCFF] px-2 py-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <Bookmark className="w-[18px] h-[18px] text-[#6846F5]" />
              <span className="text-[11.5px] font-semibold text-[#10132D] leading-tight">
                Save Opportunity
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('profile', 'home')}
              className="rounded-xl bg-[#F4F0FF] hover:bg-[#EAE2FF] border border-[#E6DCFF] px-2 py-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <Pencil className="w-[18px] h-[18px] text-[#6846F5]" />
              <span className="text-[11.5px] font-semibold text-[#10132D] leading-tight">
                Update Profile
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenSetDeadlineModal}
              className="rounded-xl bg-[#F4F0FF] hover:bg-[#EAE2FF] border border-[#E6DCFF] px-2 py-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <BellRing className="w-[18px] h-[18px] text-[#6846F5]" />
              <span className="text-[11.5px] font-semibold text-[#10132D] leading-tight">
                Set Deadline
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Modal 1: All Verified Upcoming Deadlines */}
      {showAllDeadlinesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-deadlines-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/60 backdrop-blur-xs"
          onClick={() => setShowAllDeadlinesModal(false)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3
                  id="all-deadlines-title"
                  className="text-base sm:text-lg font-bold font-display text-[#10132D]"
                >
                  Upcoming Verified Deadlines
                </h3>
                <p className="text-xs text-slate-500">
                  Confirmed upcoming dates from your Active Applications, Target List, and Saved Opportunities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllDeadlinesModal(false)}
                aria-label="Close deadlines modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {verifiedUpcomingDeadlines.length > 0 ? (
              <div className="space-y-2.5">
                {verifiedUpcomingDeadlines.map((entry) => (
                  <button
                    key={entry.opportunity.id}
                    type="button"
                    onClick={() => {
                      setShowAllDeadlinesModal(false);
                      onOpenOpportunity(entry.opportunity);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E6EAF2] hover:border-[#6846F5] hover:bg-[#FAF8FF] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#F3EFFF] text-[#5B2EE6] flex flex-col items-center justify-center shrink-0 leading-none">
                        <span className="text-[10px] font-bold uppercase">
                          {entry.monthShort}
                        </span>
                        <span className="text-sm font-extrabold mt-0.5">
                          {entry.dayNum}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#10132D] truncate">
                          {entry.opportunity.officialName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {entry.deadlineType} · {entry.sourceLabel} · {entry.displayDateText}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-[#10132D]">
                  No confirmed upcoming deadlines yet
                </p>
                <p className="text-xs text-slate-500">
                  Rolling admissions or unconfirmed dates are excluded automatically to prevent misleading alerts.
                </p>
              </div>
            )}

            {onOpenNotificationSettings && (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllDeadlinesModal(false);
                    onOpenNotificationSettings();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6846F5] hover:underline cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Manage Deadline Reminder Intervals</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Set Application Follow-Up Deadline Reminder */}
      {showSetDeadlineModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="set-deadline-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/60 backdrop-blur-xs"
          onClick={() => setShowSetDeadlineModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3
                  id="set-deadline-modal-title"
                  className="text-base sm:text-lg font-bold font-display text-[#10132D]"
                >
                  Set Follow-Up Deadline Reminder
                </h3>
                <p className="text-xs text-slate-500">
                  Attach a personal reminder date to one of your Active Applications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSetDeadlineModal(false)}
                aria-label="Close reminder modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeAppsList.length > 0 ? (
              <form onSubmit={handleSaveReminderDate} className="space-y-4">
                <div>
                  <label
                    htmlFor="dash-reminder-app"
                    className="block text-xs font-semibold text-[#10132D] mb-1.5"
                  >
                    Active Application
                  </label>
                  <select
                    id="dash-reminder-app"
                    value={selectedReminderOppId}
                    onChange={(e) => {
                      const oppId = e.target.value;
                      setSelectedReminderOppId(oppId);
                      const found = activeAppsList.find((x) => x.opp.id === oppId);
                      setReminderDateInput(found?.app.followUpDate || '');
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  >
                    {activeAppsList.map(({ opp }) => (
                      <option key={opp.id} value={opp.id}>
                        {opp.officialName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dash-reminder-date"
                    className="block text-xs font-semibold text-[#10132D] mb-1.5"
                  >
                    Personal Follow-Up Date
                  </label>
                  <input
                    id="dash-reminder-date"
                    type="date"
                    value={reminderDateInput}
                    onChange={(e) => setReminderDateInput(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSetDeadlineModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingReminder}
                    className="px-5 py-2 rounded-xl bg-[#6846F5] hover:bg-[#5734E6] text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSavingReminder ? 'Saving...' : 'Save Reminder'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You haven&apos;t started an application yet. Start an active application first to set a follow-up reminder date, or customize your automatic notification intervals.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSetDeadlineModal(false);
                      onOpenApplicationsFiltered('all', true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#6846F5] hover:bg-[#5734E6] text-white text-xs font-bold cursor-pointer"
                  >
                    Start an Application
                  </button>
                  {onOpenNotificationSettings && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSetDeadlineModal(false);
                        onOpenNotificationSettings();
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      Reminder Settings
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
