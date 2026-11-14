/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  GraduationCap,
  BookOpen,
  Building2,
  FileCheck2,
  Wallet,
  Award,
  CalendarClock,
} from 'lucide-react';
import { CountrySelect } from '../ui/CountrySelect';

export interface UniversitySearchFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedDestination: string;
  onDestinationChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  selectedField: string;
  onFieldChange: (value: string) => void;
  selectedInstitutionType: string;
  onInstitutionTypeChange: (value: string) => void;
  selectedTestPolicy: string;
  onTestPolicyChange: (value: string) => void;
  selectedAppFee: string;
  onAppFeeChange: (value: string) => void;
  selectedFunding: string;
  onFundingChange: (value: string) => void;
  selectedDeadlineStatus: string;
  onDeadlineStatusChange: (value: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  onResetAll: () => void;
  onSearchSubmit?: () => void;
  isScholarshipsTab?: boolean;
}

const LEVEL_LABELS: Record<string, string> = {
  undergraduate: "Undergraduate / Bachelor's",
  master: "Master's / Postgraduate",
  phd: 'PhD / Doctorate',
};

const FIELD_LABELS: Record<string, string> = {
  'cs-tech': 'Computer Science & AI',
  engineering: 'Engineering & Architecture',
  business: 'Business & Economics',
  health: 'Medicine & Health Sciences',
  law: 'Law & International Relations',
  education: 'Education & Social Sciences',
};

const TEST_POLICY_LABELS: Record<string, string> = {
  'test-optional': 'SAT-Free / Test-Optional',
  'waec-accepted': 'WAEC / WASSCE Accepted',
};

const APP_FEE_LABELS: Record<string, string> = {
  free: 'Free ($0 Application Fee)',
  waiver: 'Fee Waiver Available',
  'free-or-waiver': 'Free or Waiver Available',
};

const FUNDING_LABELS: Record<string, string> = {
  'fully-funded': 'Fully Funded',
  'need-met': '100% Need-Met',
  'tuition-free': 'Tuition-Free / Waiver',
  'merit-aid': 'Merit / Government Aid',
};

const DEADLINE_LABELS: Record<string, string> = {
  open: 'Applications Open (Fixed)',
  rolling: 'Rolling Admissions',
  'open-or-rolling': 'Open or Rolling Now',
};

export const UniversitySearchFilters: React.FC<UniversitySearchFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedDestination,
  onDestinationChange,
  selectedLevel,
  onLevelChange,
  selectedField,
  onFieldChange,
  selectedInstitutionType,
  onInstitutionTypeChange,
  selectedTestPolicy,
  onTestPolicyChange,
  selectedAppFee,
  onAppFeeChange,
  selectedFunding,
  onFundingChange,
  selectedDeadlineStatus,
  onDeadlineStatusChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  onResetAll,
  onSearchSubmit,
  isScholarshipsTab = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeAdvancedFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; clear: () => void }> = [];
    if (selectedInstitutionType !== 'all') {
      items.push({
        key: 'institutionType',
        label: selectedInstitutionType,
        clear: () => onInstitutionTypeChange('all'),
      });
    }
    if (selectedTestPolicy !== 'all') {
      items.push({
        key: 'testPolicy',
        label: TEST_POLICY_LABELS[selectedTestPolicy] || selectedTestPolicy,
        clear: () => onTestPolicyChange('all'),
      });
    }
    if (selectedAppFee !== 'all') {
      items.push({
        key: 'appFee',
        label: APP_FEE_LABELS[selectedAppFee] || selectedAppFee,
        clear: () => onAppFeeChange('all'),
      });
    }
    if (selectedFunding !== 'all') {
      items.push({
        key: 'funding',
        label: FUNDING_LABELS[selectedFunding] || selectedFunding,
        clear: () => onFundingChange('all'),
      });
    }
    if (selectedDeadlineStatus !== 'all') {
      items.push({
        key: 'deadlineStatus',
        label: DEADLINE_LABELS[selectedDeadlineStatus] || selectedDeadlineStatus,
        clear: () => onDeadlineStatusChange('all'),
      });
    }
    return items;
  }, [
    selectedInstitutionType,
    selectedTestPolicy,
    selectedAppFee,
    selectedFunding,
    selectedDeadlineStatus,
    onInstitutionTypeChange,
    onTestPolicyChange,
    onAppFeeChange,
    onFundingChange,
    onDeadlineStatusChange,
  ]);

  const activePrimaryFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; clear: () => void }> = [];
    if (selectedDestination) {
      items.push({
        key: 'destination',
        label: `Destination: ${selectedDestination}`,
        clear: () => onDestinationChange(''),
      });
    }
    if (selectedLevel !== 'all') {
      items.push({
        key: 'level',
        label: `Degree: ${LEVEL_LABELS[selectedLevel] || selectedLevel}`,
        clear: () => onLevelChange('all'),
      });
    }
    if (selectedField !== 'all') {
      items.push({
        key: 'field',
        label: `Field: ${FIELD_LABELS[selectedField] || selectedField}`,
        clear: () => onFieldChange('all'),
      });
    }
    return items;
  }, [
    selectedDestination,
    selectedLevel,
    selectedField,
    onDestinationChange,
    onLevelChange,
    onFieldChange,
  ]);

  const advancedCount = activeAdvancedFilters.length;
  const totalActiveCount =
    activePrimaryFilters.length + advancedCount + (searchQuery.trim() ? 1 : 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchInputRef.current?.blur();
    onSearchSubmit?.();
  };

  return (
    <section
      aria-label="Search and filter universities"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 lg:p-6 shadow-xs space-y-4"
    >
      {/* 1. Prominent Search Bar */}
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus-within:bg-white focus-within:border-[#6846F5] focus-within:ring-4 focus-within:ring-[#6846F5]/10 transition-all">
          <Search
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 ml-2.5 shrink-0 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={
              isScholarshipsTab
                ? 'Search scholarships, universities, countries, or fields...'
                : 'Search universities by name, city, country, or field of study...'
            }
            aria-label="Search universities by name, city, country, or field of study"
            className="flex-1 min-w-0 h-10 px-1.5 bg-transparent text-xs sm:text-sm font-medium text-[#10132D] placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchQueryChange('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="h-10 px-4 sm:px-5 rounded-lg bg-[#6846F5] hover:bg-[#5835E5] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] focus-visible:ring-offset-1"
          >
            Search
          </button>
        </div>
      </form>

      {/* 2. Primary Filter Row: Destination, Degree Level, Field of Study + More Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Destination */}
        <div className="lg:col-span-3 min-w-0">
          <CountrySelect
            id="dash-country-select"
            value={selectedDestination}
            onChange={onDestinationChange}
            allowAll={true}
            allLabel="All Destinations"
            allValue=""
            placeholder="All Destinations"
            buttonClassName="h-11 min-h-[44px] bg-slate-50/70 hover:bg-white focus:bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-xs sm:text-[13px] font-medium rounded-xl"
          />
        </div>

        {/* Degree Level */}
        <div className="lg:col-span-3 relative min-w-0">
          <GraduationCap
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            aria-label="Filter by degree level"
            className={`w-full h-11 min-h-[44px] pl-10 pr-8 text-xs sm:text-[13px] font-medium rounded-xl border transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6846F5]/15 ${
              selectedLevel !== 'all'
                ? 'bg-[#F0EDFF]/50 border-[#6846F5]/50 text-[#10132D] font-semibold'
                : 'bg-slate-50/70 hover:bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#10132D] focus:bg-white focus:border-[#6846F5]'
            }`}
          >
            <option value="all">All Degree Levels</option>
            <option value="undergraduate">Undergraduate / Bachelor&apos;s</option>
            <option value="master">Master&apos;s / Postgraduate</option>
            <option value="phd">PhD / Doctorate</option>
          </select>
          <ChevronDown
            className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Field of Study */}
        <div className="lg:col-span-3 relative min-w-0">
          <BookOpen
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={selectedField}
            onChange={(e) => onFieldChange(e.target.value)}
            aria-label="Filter by field of study"
            className={`w-full h-11 min-h-[44px] pl-10 pr-8 text-xs sm:text-[13px] font-medium rounded-xl border transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6846F5]/15 ${
              selectedField !== 'all'
                ? 'bg-[#F0EDFF]/50 border-[#6846F5]/50 text-[#10132D] font-semibold'
                : 'bg-slate-50/70 hover:bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#10132D] focus:bg-white focus:border-[#6846F5]'
            }`}
          >
            <option value="all">All Fields of Study</option>
            <option value="cs-tech">Computer Science &amp; AI</option>
            <option value="engineering">Engineering &amp; Architecture</option>
            <option value="business">Business &amp; Economics</option>
            <option value="health">Medicine &amp; Health Sciences</option>
            <option value="law">Law &amp; International Relations</option>
            <option value="education">Education &amp; Social Sciences</option>
          </select>
          <ChevronDown
            className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* More Filters Toggle Button */}
        <div className="lg:col-span-3 min-w-0">
          <button
            type="button"
            onClick={onToggleAdvancedFilters}
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-university-filters"
            className={`w-full h-11 min-h-[44px] px-3.5 rounded-xl border text-xs sm:text-[13px] font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]/20 ${
              showAdvancedFilters || advancedCount > 0
                ? 'bg-[#F0EDFF] border-[#6846F5] text-[#6846F5]'
                : 'bg-slate-50/70 hover:bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">More Filters</span>
              {advancedCount > 0 && (
                <span
                  aria-label={`${advancedCount} active advanced filters`}
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#6846F5] text-white text-[11px] font-bold tabular-nums shrink-0"
                >
                  {advancedCount}
                </span>
              )}
            </span>
            {showAdvancedFilters ? (
              <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Expandable More Filters Panel */}
      {showAdvancedFilters && (
        <div
          id="advanced-university-filters"
          className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Institution Type */}
            <div className="min-w-0">
              <label
                htmlFor="filter-institution-type"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Institution Type</span>
              </label>
              <div className="relative">
                <select
                  id="filter-institution-type"
                  value={selectedInstitutionType}
                  onChange={(e) => onInstitutionTypeChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Institutions</option>
                  <option value="Public University">Public University</option>
                  <option value="Private University">Private University</option>
                  <option value="Technical University">Technical University</option>
                  <option value="Specialized / Regional">Specialized / Regional</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Testing / SAT Policy */}
            <div className="min-w-0">
              <label
                htmlFor="filter-test-policy"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Admission Testing</span>
              </label>
              <div className="relative">
                <select
                  id="filter-test-policy"
                  value={selectedTestPolicy}
                  onChange={(e) => onTestPolicyChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Testing Policies</option>
                  <option value="test-optional">SAT-Free / Test-Optional</option>
                  <option value="waec-accepted">WAEC / WASSCE Accepted</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Application Fee */}
            <div className="min-w-0">
              <label
                htmlFor="filter-app-fee"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Application Fee</span>
              </label>
              <div className="relative">
                <select
                  id="filter-app-fee"
                  value={selectedAppFee}
                  onChange={(e) => onAppFeeChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Fee Policies</option>
                  <option value="free">Free ($0 Fee)</option>
                  <option value="waiver">Fee Waiver Available</option>
                  <option value="free-or-waiver">Free or Waiver Available</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Funding / Scholarship Coverage */}
            <div className="min-w-0">
              <label
                htmlFor="filter-funding"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <Award className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Funding &amp; Aid</span>
              </label>
              <div className="relative">
                <select
                  id="filter-funding"
                  value={selectedFunding}
                  onChange={(e) => onFundingChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Funding Types</option>
                  <option value="fully-funded">Fully Funded</option>
                  <option value="need-met">100% Need-Met</option>
                  <option value="tuition-free">Tuition-Free / Waiver</option>
                  <option value="merit-aid">Merit / Government Aid</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Admissions Cycle Status */}
            <div className="min-w-0">
              <label
                htmlFor="filter-deadline-status"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <CalendarClock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Intake Status</span>
              </label>
              <div className="relative">
                <select
                  id="filter-deadline-status"
                  value={selectedDeadlineStatus}
                  onChange={(e) => onDeadlineStatusChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Intake Cycles</option>
                  <option value="open-or-rolling">Open or Rolling Now</option>
                  <option value="open">Open Fixed Deadline</option>
                  <option value="rolling">Rolling Admissions</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Drawer footer row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-500">
              Filters evaluate verified institutional attributes across the catalog.
            </span>
            <div className="flex items-center gap-2 ml-auto">
              {totalActiveCount > 0 && (
                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>Reset Filters</span>
                </button>
              )}
              <button
                type="button"
                onClick={onToggleAdvancedFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6846F5] hover:bg-[#F0EDFF]/60 transition-colors cursor-pointer"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Filter Summary & Quick Remove Controls (Shown only when filters are applied) */}
      {(activePrimaryFilters.length > 0 || activeAdvancedFilters.length > 0) && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Active:</span>
          {[...activePrimaryFilters, ...activeAdvancedFilters].map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.clear}
              title={`Remove ${filter.label}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0EDFF]/80 hover:bg-[#E6DFFF] border border-[#DDD6FE] text-xs font-semibold text-[#10132D] transition-colors cursor-pointer"
            >
              <span>{filter.label}</span>
              <X className="w-3.5 h-3.5 text-[#6846F5]" aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
