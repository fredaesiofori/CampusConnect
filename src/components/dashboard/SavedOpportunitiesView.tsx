/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookmarkCheck,
  Search,
  Building2,
  Award,
  MapPin,
  Calendar,
  ExternalLink,
  Trash2,
  Target,
  CheckCircle2,
  X,
  ChevronRight,
  Info,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { TargetListItem, TargetPriority } from '../../services/auth';
import { Button } from '../ui/Button';
import { UniversityLogo } from '../ui/UniversityLogo';
import { CountryFlag } from '../ui/CountryFlagSvg';

export interface SavedOpportunitiesViewProps {
  savedItems: OpportunityItem[];
  targetList: Record<string, TargetListItem>;
  onRemoveBookmark: (opportunityId: string, title: string) => Promise<void>;
  onAddToTargetList: (input: {
    opportunityId: string;
    priority: TargetPriority;
    intakeYear: string;
    personalGoal: string;
  }) => Promise<void>;
  onOpenDetails: (item: OpportunityItem) => void;
  onExploreDirectory: (tab: 'universities' | 'scholarships') => void;
  onBack: () => void;
  initialFilter?: BookmarkFilter;
  filterNonce?: number;
}

export type BookmarkFilter = 'all' | 'universities' | 'scholarships';

function isScholarshipItem(item: OpportunityItem): boolean {
  const fType = item.funding?.type || item.fundingDetails?.type || '';
  return (
    item.category === 'scholarship' ||
    fType === 'Fully Funded' ||
    fType === '100% Need-Met'
  );
}

export const SavedOpportunitiesView: React.FC<SavedOpportunitiesViewProps> = ({
  savedItems,
  targetList,
  onRemoveBookmark,
  onAddToTargetList,
  onOpenDetails,
  onExploreDirectory,
  onBack,
  initialFilter = 'all',
  filterNonce = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<BookmarkFilter>(initialFilter);
  const [confirmTargetItem, setConfirmTargetItem] = useState<OpportunityItem | null>(null);
  const [targetPriority, setTargetPriority] = useState<TargetPriority>('Medium');
  const [targetIntakeYear, setTargetIntakeYear] = useState<string>('2026');
  const [targetGoal, setTargetGoal] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    setTypeFilter(initialFilter);
  }, [initialFilter, filterNonce]);

  const filterCounts = useMemo(() => {
    const scholarships = savedItems.filter(isScholarshipItem).length;
    const universities = savedItems.filter((i) => i.category !== 'scholarship').length;
    return {
      all: savedItems.length,
      universities,
      scholarships,
    };
  }, [savedItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedItems.filter((item) => {
      if (typeFilter === 'universities' && item.category === 'scholarship') return false;
      if (typeFilter === 'scholarships' && !isScholarshipItem(item)) return false;

      if (q) {
        const name = (item.officialName || item.institution || '').toLowerCase();
        const country = (item.country || '').toLowerCase();
        const city = (item.city || '').toLowerCase();
        const fields = (item.studyFields || []).join(' ').toLowerCase();
        const title = (item.title || '').toLowerCase();
        if (
          !name.includes(q) &&
          !country.includes(q) &&
          !city.includes(q) &&
          !fields.includes(q) &&
          !title.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [savedItems, typeFilter, searchQuery]);

  const handleOpenConfirmTarget = (item: OpportunityItem) => {
    setConfirmTargetItem(item);
    setTargetPriority('Medium');
    setTargetIntakeYear('2026');
    setTargetGoal('');
  };

  const handleConfirmAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmTargetItem) return;
    setIsProcessing(true);
    try {
      await onAddToTargetList({
        opportunityId: confirmTargetItem.id,
        priority: targetPriority,
        intakeYear: targetIntakeYear,
        personalGoal: targetGoal,
      });
      setConfirmTargetItem(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Back Navigation + Header */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6846F5] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard Overview</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#10132D] tracking-tight">
              Saved Opportunities
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5">
              Personal bookmarks of universities and scholarships for future reference.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-[#F0EDFF] text-[#6846F5] text-xs font-bold border border-[#DDD6FE]">
              {savedItems.length} Bookmarked
            </span>
          </div>
        </div>
      </div>

      {/* Distinction Notice */}
      <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Bookmarks stay strictly in <strong>Saved Opportunities</strong>. Saving an item does not
          automatically add it to your <strong>Target List</strong> or start an{' '}
          <strong>Application</strong> unless you explicitly choose to promote it.
        </p>
      </div>

      {/* Search & Category Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter your bookmarks by university, scholarship, country, or field..."
              className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:border-[#6846F5] focus:outline-none text-[#10132D]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'all' as const, label: 'All Bookmarks', count: filterCounts.all },
              { id: 'universities' as const, label: 'Universities', count: filterCounts.universities },
              { id: 'scholarships' as const, label: 'Scholarships', count: filterCounts.scholarships },
            ].map((tab) => {
              const active = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTypeFilter(tab.id)}
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
        </div>
      </div>

      {/* Bookmarked Opportunities List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#6846F5] flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#10132D]">
            {savedItems.length === 0
              ? 'No bookmarked opportunities yet'
              : 'No bookmarks match your current filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {savedItems.length === 0
              ? 'Explore verified universities and scholarships and tap the bookmark icon to keep interesting options here for later.'
              : 'Try clearing your search term or switching between Universities and Scholarships.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {savedItems.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
              >
                Show All Bookmarks
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onExploreDirectory('universities')}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  Explore Universities
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExploreDirectory('scholarships')}
                >
                  Browse Scholarships
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const displayName = item.officialName || item.institution;
            const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;
            const evalDeadline = evaluateOpportunityDeadline(item.deadlines);
            const fundingLabel = item.fundingDetails?.type || item.funding?.type || 'Tuition Aid';
            const isScholarship = item.category === 'scholarship';
            const alreadyInTargets = Boolean(targetList[item.id]);

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenDetails(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenDetails(item);
                  }
                }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs hover:shadow-md hover:border-[#6846F5]/35 active:scale-[0.99] active:shadow-xs transition-[box-shadow,border-color,transform] duration-150 ease-out flex flex-col justify-between space-y-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] group"
              >
                <div className="space-y-3">
                  {/* Top Row: Logo + Title + Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <UniversityLogo item={item} size="sm" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isScholarship
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isScholarship ? (
                              <Award className="w-3 h-3 text-amber-600" />
                            ) : (
                              <Building2 className="w-3 h-3 text-slate-500" />
                            )}
                            <span>{isScholarship ? 'Scholarship' : 'University'}</span>
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {fundingLabel}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#10132D] group-hover:text-[#6846F5] transition-colors leading-snug">
                          {displayName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <CountryFlag
                            code={item.countryCode}
                            country={item.country}
                            className="w-4 h-[11px] rounded-[2px] ring-1 ring-black/10 overflow-hidden shrink-0"
                          />
                          <span className="truncate">{displayLocation}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(item.id, displayName);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove from Saved Opportunities"
                      aria-label={`Remove ${displayName} from Saved Opportunities`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Specs */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline:</span>
                      <strong className={evalDeadline.isExpired ? 'text-amber-700' : 'text-[#10132D]'}>
                        {evalDeadline.displayText}
                      </strong>
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {(item.degreeLevels || []).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div
                  className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DFFF] text-[#6846F5] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {(item.sourceUrl || item.officialWebsite) && (
                      <a
                        href={item.sourceUrl || item.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                        title="Open official admissions or scholarship link"
                      >
                        <span>Official Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {alreadyInTargets ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>In Target List</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenConfirmTarget(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] hover:border-[#6846F5] hover:text-[#6846F5] text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Add to Target List</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explicit Confirmation Modal before adding a Bookmark to Target List */}
      {confirmTargetItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isProcessing && setConfirmTargetItem(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6846F5]">
                  Confirm Target Goal
                </span>
                <h3 className="text-lg font-bold font-display text-[#10132D] mt-0.5">
                  Add to Target List?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => !isProcessing && setConfirmTargetItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Close confirmation dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm adding{' '}
              <strong className="text-[#10132D]">
                {confirmTargetItem.officialName || confirmTargetItem.institution}
              </strong>{' '}
              to your <strong>Target List</strong>. Your bookmark in Saved Opportunities will remain
              intact, and no application will be started automatically.
            </p>

            <form onSubmit={handleConfirmAddTarget} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1">
                    Target Priority
                  </label>
                  <select
                    value={targetPriority}
                    onChange={(e) => setTargetPriority(e.target.value as TargetPriority)}
                    className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1">
                    Intended Intake Year
                  </label>
                  <select
                    value={targetIntakeYear}
                    onChange={(e) => setTargetIntakeYear(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  >
                    <option value="2026">2026 Intake</option>
                    <option value="2027">2027 Intake</option>
                    <option value="2028">2028 Intake</option>
                    <option value="2029">2029 Intake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10132D] mb-1">
                  Personal Study Goal (Optional)
                </label>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="e.g. Apply for full tuition scholarship before Fall deadline"
                  className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setConfirmTargetItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isProcessing}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                >
                  {isProcessing ? 'Adding...' : 'Confirm & Add Target'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
