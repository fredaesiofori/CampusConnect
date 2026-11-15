/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  FolderCheck,
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
  Trophy,
  Send,
  FileCheck,
  AlertCircle,
  Target,
  MapPin,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { ActiveApplicationItem, ActiveApplicationStage, TargetListItem } from '../../services/auth';
import { Button } from '../ui/Button';
import { UniversityLogo } from '../ui/UniversityLogo';

export interface ApplicationsViewProps {
  opportunities: OpportunityItem[];
  activeApplications: Record<string, ActiveApplicationItem>;
  targetList: Record<string, TargetListItem>;
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
  onStartApplication: (opportunityId: string, stage?: ActiveApplicationStage) => Promise<void>;
  onRemoveApplication: (opportunityId: string, title: string) => Promise<void>;
  onOpenDetails: (item: OpportunityItem) => void;
  onOpenTargetList: () => void;
  onExploreDirectory: () => void;
  onBack: () => void;
  initialStageFilter?: StageFilter;
  filterNonce?: number;
  openStartPickerNonce?: number;
}

export type StageFilter = 'all' | ActiveApplicationStage;

function getRequiredTasksForOpportunity(item: OpportunityItem): string[] {
  const rawDocs = item.admissionsRequirements?.documents?.length
    ? item.admissionsRequirements.documents
    : item.admissionsRequirements?.documentsRequired;
  const docs =
    rawDocs && rawDocs.length > 0
      ? rawDocs
      : ['Official Academic Transcripts', 'Identification / Passport', 'Personal Statement / Motivation Letter'];
  const uniqueDocs = Array.from(new Set(docs.map((d) => d.trim()).filter(Boolean)));
  const finalStep = 'Submit Official Online Application';
  if (!uniqueDocs.some((d) => d.toLowerCase().includes('submit official'))) {
    uniqueDocs.push(finalStep);
  }
  return uniqueDocs;
}

function getStageMeta(stage: ActiveApplicationStage) {
  switch (stage) {
    case 'submitted':
      return {
        label: 'Application Submitted',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: <Send className="w-3.5 h-3.5 text-amber-600" />,
        basePercent: 75,
      };
    case 'accepted':
      return {
        label: 'Accepted / Enrolled',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: <Trophy className="w-3.5 h-3.5 text-emerald-600" />,
        basePercent: 100,
      };
    case 'preparing':
    default:
      return {
        label: 'Preparing Application',
        badgeClass: 'bg-[#F0EDFF] text-[#6846F5] border-[#DDD6FE]',
        icon: <FileCheck className="w-3.5 h-3.5 text-[#6846F5]" />,
        basePercent: 25,
      };
  }
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  opportunities,
  activeApplications,
  targetList,
  onUpdateApplication,
  onStartApplication,
  onRemoveApplication,
  onOpenDetails,
  onOpenTargetList,
  onExploreDirectory,
  onBack,
  initialStageFilter = 'all',
  filterNonce = 0,
  openStartPickerNonce = 0,
}) => {
  const [stageFilter, setStageFilter] = useState<StageFilter>(initialStageFilter);
  const [showStartModal, setShowStartModal] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pendingStartItem, setPendingStartItem] = useState<OpportunityItem | null>(null);
  const [pendingWithdrawItem, setPendingWithdrawItem] = useState<OpportunityItem | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  React.useEffect(() => {
    setStageFilter(initialStageFilter);
  }, [initialStageFilter, filterNonce]);

  React.useEffect(() => {
    if (openStartPickerNonce > 0) {
      setShowStartModal(true);
    }
  }, [openStartPickerNonce]);

  const opportunityMap = useMemo(() => {
    const map = new Map<string, OpportunityItem>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, [opportunities]);

  const applicationEntries = useMemo(() => {
    return Object.values(activeApplications)
      .map((app) => ({
        app,
        item: opportunityMap.get(app.opportunityId),
      }))
      .filter((entry): entry is { app: ActiveApplicationItem; item: OpportunityItem } => Boolean(entry.item))
      .sort((a, b) => new Date(b.app.updatedAt).getTime() - new Date(a.app.updatedAt).getTime());
  }, [activeApplications, opportunityMap]);

  const stageCounts = useMemo(() => {
    let preparing = 0;
    let submitted = 0;
    let accepted = 0;
    applicationEntries.forEach(({ app }) => {
      if (app.stage === 'preparing') preparing += 1;
      else if (app.stage === 'submitted') submitted += 1;
      else if (app.stage === 'accepted') accepted += 1;
    });
    return {
      all: applicationEntries.length,
      preparing,
      submitted,
      accepted,
    };
  }, [applicationEntries]);

  const filteredEntries = useMemo(() => {
    if (stageFilter === 'all') return applicationEntries;
    return applicationEntries.filter(({ app }) => app.stage === stageFilter);
  }, [applicationEntries, stageFilter]);

  // Candidate opportunities for manual Start New Application modal (Target List items prioritized, excludes already active)
  const pickerCandidates = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const list = opportunities.filter((opp) => {
      if (!q) return true;
      const name = (opp.officialName || opp.institution || '').toLowerCase();
      const country = (opp.country || '').toLowerCase();
      return name.includes(q) || country.includes(q);
    });

    return list
      .sort((a, b) => {
        const aTarget = Boolean(targetList[a.id]);
        const bTarget = Boolean(targetList[b.id]);
        if (aTarget && !bTarget) return -1;
        if (!aTarget && bTarget) return 1;
        return (a.officialName || '').localeCompare(b.officialName || '');
      })
      .slice(0, 30);
  }, [opportunities, pickerQuery, targetList]);

  const handleToggleTask = async (app: ActiveApplicationItem, taskLabel: string) => {
    const completed = new Set(app.completedTasks || []);
    if (completed.has(taskLabel)) {
      completed.delete(taskLabel);
    } else {
      completed.add(taskLabel);
    }
    await onUpdateApplication(app.opportunityId, {
      completedTasks: Array.from(completed),
    });
  };

  const handleConfirmStart = async () => {
    if (!pendingStartItem) return;
    setIsBusy(true);
    try {
      await onStartApplication(pendingStartItem.id, 'preparing');
      setPendingStartItem(null);
      setShowStartModal(false);
      setPickerQuery('');
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!pendingWithdrawItem) return;
    setIsBusy(true);
    try {
      await onRemoveApplication(
        pendingWithdrawItem.id,
        pendingWithdrawItem.officialName || pendingWithdrawItem.institution
      );
      setPendingWithdrawItem(null);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Navigation + Header */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6846F5] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard Overview</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-2xl font-bold font-display text-[#10132D] tracking-tight">
              Applications
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage active applications you have started, verify deadlines, and complete required tasks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowStartModal(true)}
              className="bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold"
            >
              Start Application
            </Button>
          </div>
        </div>
      </div>

      {/* Stage Filter & Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'all' as const, label: 'All Active', count: stageCounts.all, accent: 'text-[#10132D]' },
          { id: 'preparing' as const, label: 'Preparing', count: stageCounts.preparing, accent: 'text-[#6846F5]' },
          { id: 'submitted' as const, label: 'Submitted', count: stageCounts.submitted, accent: 'text-amber-700' },
          { id: 'accepted' as const, label: 'Accepted', count: stageCounts.accepted, accent: 'text-emerald-700' },
        ].map((stat) => {
          const isSelected = stageFilter === stat.id;
          return (
            <button
              key={stat.id}
              type="button"
              onClick={() => setStageFilter(stat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#F0EDFF] border-[#6846F5] shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 block">{stat.label}</span>
              <span className={`text-xl font-bold font-display mt-0.5 block ${stat.accent}`}>
                {stat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Applications List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#10132D]">
            {applicationEntries.length === 0
              ? 'No active applications started yet'
              : `No applications in "${stageFilter}" stage`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {applicationEntries.length === 0
              ? 'Bookmarked opportunities and Target List goals do not count as applications until you explicitly start applying.'
              : 'Switch stage filters above to view your other active applications.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {applicationEntries.length > 0 ? (
              <Button variant="outline" size="sm" onClick={() => setStageFilter('all')}>
                Show All Active Applications
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowStartModal(true)}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  Start an Application
                </Button>
                <Button variant="outline" size="sm" onClick={onOpenTargetList}>
                  Review Target List
                </Button>
                <Button variant="outline" size="sm" onClick={onExploreDirectory}>
                  Explore Directory
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(({ app, item }) => {
            const displayName = item.officialName || item.institution;
            const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;
            const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
            const stageMeta = getStageMeta(app.stage);
            const tasks = getRequiredTasksForOpportunity(item);
            const completedSet = new Set(app.completedTasks || []);
            const completedCount = tasks.filter((t) => completedSet.has(t)).length;
            const outstandingCount = Math.max(0, tasks.length - completedCount);

            // Compute honest completion percentage combining stage & tasks
            const taskRatio = tasks.length > 0 ? completedCount / tasks.length : 0;
            const progressPercent =
              app.stage === 'accepted'
                ? 100
                : app.stage === 'submitted'
                ? Math.max(75, Math.round(70 + taskRatio * 30))
                : Math.round(15 + taskRatio * 60);

            return (
              <div
                key={app.opportunityId}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-5"
              >
                {/* Top Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <UniversityLogo item={item} size="md" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stageMeta.badgeClass}`}
                        >
                          {stageMeta.icon}
                          <span>{stageMeta.label}</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            evalDeadline.isExpired
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : evalDeadline.status === 'open'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{evalDeadline.badgeText}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D] leading-snug">
                        {displayName}
                      </h3>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.countryFlag} {displayLocation}
                        </span>
                        <span>·</span>
                        <span>
                          Verified Deadline:{' '}
                          <strong className={evalDeadline.isExpired ? 'text-amber-700' : 'text-[#10132D]'}>
                            {item.deadlines?.term ? `${item.deadlines.term} — ` : ''}
                            {evalDeadline.displayText}
                          </strong>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Stage Updater */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-full sm:w-52">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Application Status
                      </label>
                      <select
                        value={app.stage}
                        onChange={(e) =>
                          onUpdateApplication(app.opportunityId, {
                            stage: e.target.value as ActiveApplicationStage,
                          })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-slate-50 text-xs font-bold text-[#10132D] focus:border-[#6846F5] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="preparing">Preparing Application</option>
                        <option value="submitted">Application Submitted</option>
                        <option value="accepted">Accepted / Enrolled</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPendingWithdrawItem(item)}
                      className="mt-5 p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove application"
                      aria-label={`Remove ${displayName} application`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Application Progress</span>
                    <span className="font-bold text-[#10132D]">
                      {progressPercent}% ·{' '}
                      <span className={outstandingCount === 0 ? 'text-emerald-600' : 'text-[#6846F5]'}>
                        {outstandingCount === 0
                          ? 'All checklist tasks complete'
                          : `${outstandingCount} task${outstandingCount === 1 ? '' : 's'} outstanding`}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        app.stage === 'accepted'
                          ? 'bg-emerald-500'
                          : app.stage === 'submitted'
                          ? 'bg-amber-500'
                          : 'bg-[#6846F5]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Outstanding Application Tasks Checklist */}
                <div className="p-4 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#10132D]">
                      Required Application Tasks ({completedCount}/{tasks.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Click to mark completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tasks.map((taskLabel) => {
                      const isDone = completedSet.has(taskLabel);
                      return (
                        <button
                          key={taskLabel}
                          type="button"
                          onClick={() => handleToggleTask(app, taskLabel)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-white border-slate-200 hover:border-[#6846F5]/50 text-slate-700'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={isDone ? 'line-through opacity-80' : 'font-medium'}>
                            {taskLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Personal Follow-Up Date Reminder */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label
                      htmlFor={`followup-${app.opportunityId}`}
                      className="text-xs font-bold text-[#10132D] block"
                    >
                      Personal Follow-Up Reminder Date (Optional)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Set your own date to check portals, send transcripts, or follow up on this application.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      id={`followup-${app.opportunityId}`}
                      type="date"
                      value={app.followUpDate || ''}
                      onChange={(e) =>
                        onUpdateApplication(app.opportunityId, {
                          followUpDate: e.target.value ? e.target.value : null,
                        })
                      }
                      className="h-9 px-3 rounded-xl border border-[#CBD5E1] bg-slate-50 focus:bg-white text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                    />
                    {app.followUpDate && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateApplication(app.opportunityId, { followUpDate: null })
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Clear follow-up reminder date"
                        aria-label="Clear follow-up reminder date"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DFFF] text-[#6846F5] font-bold transition-colors cursor-pointer"
                    >
                      <span>Official Requirements</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {(item.sourceUrl || item.officialWebsite) && (
                      <a
                        href={item.sourceUrl || item.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
                      >
                        <span>Open Application Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Started {new Date(app.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Start New Application (Picker + Explicit Confirmation) */}
      {showStartModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isBusy && setShowStartModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-[#10132D]">
                  {pendingStartItem ? 'Confirm Start Application' : 'Start an Application'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pendingStartItem
                    ? 'Confirm creating an active application record.'
                    : 'Choose an institution or scholarship to begin tracking your application.'}
                </p>
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setShowStartModal(false);
                  setPendingStartItem(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pendingStartItem ? (
              <div className="p-5 space-y-4">
                <div className="p-4 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] flex items-center gap-3">
                  <UniversityLogo item={pendingStartItem} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#10132D] truncate">
                      {pendingStartItem.officialName || pendingStartItem.institution}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {pendingStartItem.countryFlag} {pendingStartItem.country} · Deadline:{' '}
                      {evaluateOpportunityDeadline(pendingStartItem.deadlines).displayText}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Starting this application will add it to your <strong>Applications</strong> list at
                  the <strong>Preparing Application</strong> stage with its verified document checklist.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setPendingStartItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isBusy}
                    onClick={handleConfirmStart}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                  >
                    {isBusy ? 'Starting...' : 'Confirm & Start Application'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="Search verified universities or scholarships..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#CBD5E1] text-xs text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {pickerCandidates.map((opp) => {
                    const isAlreadyActive = Boolean(activeApplications[opp.id]);
                    const isTarget = Boolean(targetList[opp.id]);
                    return (
                      <div
                        key={opp.id}
                        className="p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between gap-3 hover:border-[#6846F5]/40"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UniversityLogo item={opp} size="xs" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#10132D] truncate">
                              {opp.officialName || opp.institution}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span>
                                {opp.countryFlag} {opp.country}
                              </span>
                              {isTarget && (
                                <span className="inline-flex items-center gap-0.5 text-amber-700 font-semibold">
                                  · <Target className="w-3 h-3" /> In Target List
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {isAlreadyActive ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold shrink-0">
                            Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingStartItem(opp)}
                            className="px-3 py-1.5 rounded-lg bg-[#F0EDFF] hover:bg-[#6846F5] text-[#6846F5] hover:text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirm Withdraw/Remove Application */}
      {pendingWithdrawItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isBusy && setPendingWithdrawItem(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#10132D]">
                  Remove Active Application?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Are you sure you want to remove{' '}
                  <strong>
                    {pendingWithdrawItem.officialName || pendingWithdrawItem.institution}
                  </strong>{' '}
                  from your active applications? Your progress and task checklist for this application
                  will be cleared.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setPendingWithdrawItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Keep Application
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isBusy ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
