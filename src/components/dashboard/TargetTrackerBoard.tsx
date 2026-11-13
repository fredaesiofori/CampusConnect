/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Target,
  Calendar,
  ExternalLink,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle2,
  FolderCheck,
  MapPin,
  Save,
  AlertCircle,
  Info,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { ActiveApplicationItem, TargetListItem, TargetPriority } from '../../services/auth';
import { Button } from '../ui/Button';
import { UniversityLogo } from '../ui/UniversityLogo';

// Kept exported for COVA Assistant backward compatibility
export type ApplicationStage = 'saved' | 'preparing' | 'submitted' | 'accepted';

export interface TargetTrackerBoardProps {
  opportunities: OpportunityItem[];
  targetList: Record<string, TargetListItem>;
  activeApplications: Record<string, ActiveApplicationItem>;
  onUpsertTarget: (input: {
    opportunityId: string;
    priority: TargetPriority;
    intakeYear: string;
    personalGoal: string;
  }) => Promise<void>;
  onRemoveTarget: (opportunityId: string, title: string) => Promise<void>;
  onStartApplicationFromTarget: (opportunityId: string) => Promise<void>;
  onOpenApplications?: () => void;
  onOpenDetails: (item: OpportunityItem) => void;
  onExploreMore: () => void;
  onBack?: () => void;
}

const PRIORITY_ORDER: Record<TargetPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function getPriorityBadgeClass(priority: TargetPriority): string {
  if (priority === 'High') {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (priority === 'Medium') {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export const TargetTrackerBoard: React.FC<TargetTrackerBoardProps> = ({
  opportunities,
  targetList,
  activeApplications,
  onUpsertTarget,
  onRemoveTarget,
  onStartApplicationFromTarget,
  onOpenApplications,
  onOpenDetails,
  onExploreMore,
  onBack,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | TargetPriority>('all');
  const [intakeFilter, setIntakeFilter] = useState<string>('all');

  // Add Target Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [selectedNewOpp, setSelectedNewOpp] = useState<OpportunityItem | null>(null);
  const [newPriority, setNewPriority] = useState<TargetPriority>('High');
  const [newIntakeYear, setNewIntakeYear] = useState<string>('2026');
  const [newPersonalGoal, setNewPersonalGoal] = useState<string>('');

  // Inline personal goal draft edits keyed by opportunityId
  const [goalDrafts, setGoalDrafts] = useState<Record<string, string>>({});

  // Confirmation dialogs
  const [confirmStartTarget, setConfirmStartTarget] = useState<OpportunityItem | null>(null);
  const [confirmRemoveTarget, setConfirmRemoveTarget] = useState<OpportunityItem | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const opportunityMap = useMemo(() => {
    const map = new Map<string, OpportunityItem>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, [opportunities]);

  const targetEntries = useMemo(() => {
    return Object.values(targetList)
      .map((target) => ({
        target,
        item: opportunityMap.get(target.opportunityId),
      }))
      .filter((entry): entry is { target: TargetListItem; item: OpportunityItem } => Boolean(entry.item))
      .sort((a, b) => {
        const pDiff = PRIORITY_ORDER[a.target.priority] - PRIORITY_ORDER[b.target.priority];
        if (pDiff !== 0) return pDiff;
        return a.target.intakeYear.localeCompare(b.target.intakeYear);
      });
  }, [targetList, opportunityMap]);

  const priorityCounts = useMemo(() => {
    let High = 0;
    let Medium = 0;
    let Low = 0;
    targetEntries.forEach(({ target }) => {
      if (target.priority === 'High') High += 1;
      else if (target.priority === 'Medium') Medium += 1;
      else Low += 1;
    });
    return { all: targetEntries.length, High, Medium, Low };
  }, [targetEntries]);

  const availableIntakeYears = useMemo(() => {
    const set = new Set<string>();
    targetEntries.forEach(({ target }) => {
      if (target.intakeYear) set.add(target.intakeYear);
    });
    return Array.from(set).sort();
  }, [targetEntries]);

  const filteredEntries = useMemo(() => {
    return targetEntries.filter(({ target }) => {
      if (priorityFilter !== 'all' && target.priority !== priorityFilter) return false;
      if (intakeFilter !== 'all' && target.intakeYear !== intakeFilter) return false;
      return true;
    });
  }, [targetEntries, priorityFilter, intakeFilter]);

  const pickerCandidates = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    return opportunities
      .filter((opp) => {
        if (!q) return true;
        const name = (opp.officialName || opp.institution || '').toLowerCase();
        const country = (opp.country || '').toLowerCase();
        const fields = (opp.studyFields || []).join(' ').toLowerCase();
        return name.includes(q) || country.includes(q) || fields.includes(q);
      })
      .slice(0, 30);
  }, [opportunities, pickerQuery]);

  const handleAddTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewOpp) return;
    setIsBusy(true);
    try {
      await onUpsertTarget({
        opportunityId: selectedNewOpp.id,
        priority: newPriority,
        intakeYear: newIntakeYear,
        personalGoal: newPersonalGoal,
      });
      setShowAddModal(false);
      setSelectedNewOpp(null);
      setPickerQuery('');
      setNewPriority('High');
      setNewIntakeYear('2026');
      setNewPersonalGoal('');
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmStartApplication = async () => {
    if (!confirmStartTarget) return;
    setIsBusy(true);
    try {
      await onStartApplicationFromTarget(confirmStartTarget.id);
      setConfirmStartTarget(null);
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmRemoveTarget) return;
    setIsBusy(true);
    try {
      await onRemoveTarget(
        confirmRemoveTarget.id,
        confirmRemoveTarget.officialName || confirmRemoveTarget.institution
      );
      setConfirmRemoveTarget(null);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Navigation + Header */}
      <div className="space-y-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6846F5] transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard Overview</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-2xl font-bold font-display text-[#10132D] tracking-tight">
              Target List
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Organize your shortlist of future study goals with priorities and target intake years.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              className="bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold"
            >
              Add Target Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Distinction Notice */}
      <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Your <strong>Target List</strong> is your dedicated academic shortlist of universities and
          scholarships you plan to pursue. When you are ready to apply to a target, click{' '}
          <strong>Start Application</strong> to move it into your active Applications tracker with
          confirmation.
        </p>
      </div>

      {/* Priority Summary & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all' as const, label: 'All Targets', count: priorityCounts.all },
            { id: 'High' as const, label: 'High Priority', count: priorityCounts.High },
            { id: 'Medium' as const, label: 'Medium Priority', count: priorityCounts.Medium },
            { id: 'Low' as const, label: 'Low Priority', count: priorityCounts.Low },
          ].map((tab) => {
            const active = priorityFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPriorityFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#6846F5] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="target-intake-filter" className="text-xs font-medium text-slate-500">
            Intake:
          </label>
          <select
            id="target-intake-filter"
            value={intakeFilter}
            onChange={(e) => setIntakeFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#CBD5E1] bg-slate-50 text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
          >
            <option value="all">All Intake Years</option>
            {availableIntakeYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr} Intake
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Shortlist Cards */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#10132D]">
            {targetEntries.length === 0
              ? 'Your Target List is empty'
              : 'No targets match the selected priority or intake year'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {targetEntries.length === 0
              ? 'Build a focused shortlist of universities and scholarships you seriously intend to pursue, assign priorities, and set your intake goals.'
              : 'Try adjusting the priority or intake year filters above.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {targetEntries.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPriorityFilter('all');
                  setIntakeFilter('all');
                }}
              >
                Show All Targets
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  + Add Target Goal
                </Button>
                <Button variant="outline" size="sm" onClick={onExploreMore}>
                  Browse University Directory
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEntries.map(({ target, item }) => {
            const displayName = item.officialName || item.institution;
            const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;
            const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
            const hasActiveApp = Boolean(activeApplications[item.id]);
            const draftGoal =
              goalDrafts[item.id] !== undefined ? goalDrafts[item.id] : target.personalGoal;
            const isGoalDirty =
              goalDrafts[item.id] !== undefined && goalDrafts[item.id] !== target.personalGoal;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <UniversityLogo item={item} size="sm" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadgeClass(
                              target.priority
                            )}`}
                          >
                            {target.priority} Priority
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F0EDFF] text-[#6846F5] border border-[#DDD6FE]">
                            Intake {target.intakeYear}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#10132D] leading-snug">
                          {displayName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {item.countryFlag} {displayLocation}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmRemoveTarget(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove from Target List"
                      aria-label={`Remove ${displayName} from Target List`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Priority & Intake Year Controls */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={target.priority}
                        onChange={(e) =>
                          onUpsertTarget({
                            opportunityId: item.id,
                            priority: e.target.value as TargetPriority,
                            intakeYear: target.intakeYear,
                            personalGoal: target.personalGoal,
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-xl border border-[#CBD5E1] bg-slate-50 text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Intended Intake Year
                      </label>
                      <select
                        value={target.intakeYear}
                        onChange={(e) =>
                          onUpsertTarget({
                            opportunityId: item.id,
                            priority: target.priority,
                            intakeYear: e.target.value,
                            personalGoal: target.personalGoal,
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-xl border border-[#CBD5E1] bg-slate-50 text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                  </div>

                  {/* Personal Goal Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Personal Study Goal
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={draftGoal}
                        onChange={(e) =>
                          setGoalDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Add personal notes or scholarship goal..."
                        className="flex-1 h-9 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                      />
                      {isGoalDirty && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onUpsertTarget({
                              opportunityId: item.id,
                              priority: target.priority,
                              intakeYear: target.intakeYear,
                              personalGoal: draftGoal,
                            });
                            setGoalDrafts((prev) => {
                              const copy = { ...prev };
                              delete copy[item.id];
                              return copy;
                            });
                          }}
                          className="h-9 px-3 rounded-xl bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Deadline Row */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline:</span>
                    </span>
                    <span className={`font-semibold ${evalDeadline.isExpired ? 'text-amber-700' : 'text-[#10132D]'}`}>
                      {evalDeadline.displayText}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {(item.sourceUrl || item.officialWebsite) && (
                      <a
                        href={item.sourceUrl || item.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#6846F5]"
                        title="Official portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {hasActiveApp ? (
                    <button
                      type="button"
                      onClick={onOpenApplications}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Application Active</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmStartTarget(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FolderCheck className="w-3.5 h-3.5" />
                      <span>Start Application</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Add Target Goal from Verified Catalog */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isBusy && setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[88vh] flex flex-col bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-[#10132D]">
                  {selectedNewOpp ? 'Configure Target Goal' : 'Add to Target List'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedNewOpp
                    ? 'Set priority, intended intake year, and your personal goal.'
                    : 'Select any verified university or scholarship directly.'}
                </p>
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedNewOpp(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedNewOpp ? (
              <form onSubmit={handleAddTargetSubmit} className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] flex items-center gap-3">
                  <UniversityLogo item={selectedNewOpp} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#10132D] truncate">
                      {selectedNewOpp.officialName || selectedNewOpp.institution}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedNewOpp.countryFlag} {selectedNewOpp.country}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TargetPriority)}
                      className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1">
                      Intended Intake Year
                    </label>
                    <select
                      value={newIntakeYear}
                      onChange={(e) => setNewIntakeYear(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1">
                    Personal Goal
                  </label>
                  <input
                    type="text"
                    value={newPersonalGoal}
                    onChange={(e) => setNewPersonalGoal(e.target.value)}
                    placeholder="e.g. Target Computer Science BSc with full scholarship"
                    className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setSelectedNewOpp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isBusy}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                  >
                    {isBusy ? 'Saving...' : 'Save to Target List'}
                  </Button>
                </div>
              </form>
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
                    const alreadyTargeted = Boolean(targetList[opp.id]);
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
                            <p className="text-[11px] text-slate-500">
                              {opp.countryFlag} {opp.country} ·{' '}
                              {opp.fundingDetails?.type || opp.funding?.type || 'Tuition Aid'}
                            </p>
                          </div>
                        </div>

                        {alreadyTargeted ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold shrink-0">
                            Targeted
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedNewOpp(opp)}
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

      {/* Modal 2: Explicit Confirmation before Starting Application from Target */}
      {confirmStartTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isBusy && setConfirmStartTarget(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6846F5]">
                  Confirm Action
                </span>
                <h3 className="text-lg font-bold font-display text-[#10132D] mt-0.5">
                  Start Application Now?
                </h3>
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setConfirmStartTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Close confirmation dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm starting an active application for{' '}
              <strong className="text-[#10132D]">
                {confirmStartTarget.officialName || confirmStartTarget.institution}
              </strong>
              . This will create an active application in your <strong>Applications</strong> section
              at the Preparing stage with its required tasks checklist. Your Target List goal will
              stay preserved.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setConfirmStartTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isBusy}
                onClick={handleConfirmStartApplication}
                className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
              >
                {isBusy ? 'Starting...' : 'Confirm & Start Application'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Remove Target */}
      {confirmRemoveTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isBusy && setConfirmRemoveTarget(null)}
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
                  Remove Target Goal?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Remove{' '}
                  <strong>
                    {confirmRemoveTarget.officialName || confirmRemoveTarget.institution}
                  </strong>{' '}
                  from your Target List? Your Saved Opportunities bookmarks and any started
                  Applications will not be affected.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setConfirmRemoveTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={handleConfirmRemove}
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
