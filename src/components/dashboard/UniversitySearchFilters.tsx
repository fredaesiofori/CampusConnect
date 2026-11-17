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
      className="space-y-3"
    >
      {/* 1. Prominent Search Bar matching approved reference */}
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_6px_rgba(15,23,42,0.04)] focus-within:border-[#6846F5] focus-within:ring-4 focus-within:ring-[#6846F5]/10 transition-all">
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
                ? 'Search scholarships, universities, or countries...'
                : 'Search universities by name, city, or country...'
            }
            aria-label="Search universities by name, city, or country"
            className="flex-1 min-w-0 h-9 sm:h-10 px-1.5 bg-transparent text-xs sm:text-sm font-medium text-[#10132D] placeholder:text-slate-400 focus:outline-none"
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
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-[#6846F5] hover:bg-[#5835E5] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] focus-visible:ring-offset-1"
          >
            Search
          </button>
        </div>
      </form>

      {/* 2. Compact 3-Control Filter Row: Destination, Degree Level, More Filters */}
      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 gap-2 sm:gap-3">
        {/* Country / Destination */}
        <div className="min-w-0">
          <CountrySelect
            id="dash-country-select"
            value={selectedDestination}
            onChange={onDestinationChange}
            allowAll={true}
            allLabel="All Destinations"
            allValue=""
            placeholder="All Destinations"
            buttonClassName={`h-10 sm:h-11 min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3.5 text-[11px] sm:text-[13px] font-medium rounded-full sm:rounded-xl ${
              selectedDestination
                ? 'bg-[#F3EFFF] border-[#D8CCFE] text-[#5B2EE6] font-semibold'
                : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#1E293B]'
            }`}
          />
        </div>

        {/* Degree Level */}
        <div className="relative min-w-0">
          <GraduationCap
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            aria-label="Filter by degree level"
            className={`w-full h-10 sm:h-11 min-h-[40px] sm:min-h-[44px] pl-7 sm:pl-10 pr-6 sm:pr-8 text-[11px] sm:text-[13px] font-medium rounded-full sm:rounded-xl border transition-colors appearance-none cursor-pointer truncate focus:outline-none focus:ring-2 focus:ring-[#6846F5]/15 ${
              selectedLevel !== 'all'
                ? 'bg-[#F3EFFF] border-[#D8CCFE] text-[#5B2EE6] font-semibold'
                : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#1E293B] focus:border-[#6846F5]'
            }`}
          >
            <option value="all">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="master">Master&apos;s / PG</option>
            <option value="phd">PhD / Doctorate</option>
          </select>
          <ChevronDown
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* More Filters Toggle Button */}
        <div className="min-w-0 col-span-2 min-[400px]:col-span-1">
          <button
            type="button"
            onClick={onToggleAdvancedFilters}
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-university-filters"
            className={`w-full h-10 sm:h-11 min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3.5 rounded-full sm:rounded-xl border text-[11px] sm:text-[13px] font-medium flex items-center justify-center sm:justify-between gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]/20 ${
              showAdvancedFilters || advancedCount > 0 || selectedField !== 'all'
                ? 'bg-[#F3EFFF] border-[#6846F5] text-[#5B2EE6] font-semibold'
                : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#1E293B]'
            }`}
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">More Filters</span>
              {advancedCount + (selectedField !== 'all' ? 1 : 0) > 0 && (
                <span
                  aria-label={`${advancedCount + (selectedField !== 'all' ? 1 : 0)} active advanced filters`}
                  className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#6846F5] text-white text-[10px] font-bold tabular-nums shrink-0"
                >
                  {advancedCount + (selectedField !== 'all' ? 1 : 0)}
                </span>
              )}
            </span>
            {showAdvancedFilters ? (
              <ChevronUp className="hidden sm:block w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="hidden sm:block w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Expandable More Filters Panel (Includes Field of Study + All Genuine Structured Filters) */}
      {showAdvancedFilters && (
        <div
          id="advanced-university-filters"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm space-y-4 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Field of Study */}
            <div className="min-w-0">
              <label
                htmlFor="filter-field-of-study"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Field of Study</span>
              </label>
              <div className="relative">
                <select
                  id="filter-field-of-study"
                  value={selectedField}
                  onChange={(e) => onFieldChange(e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-3 pr-8 text-xs font-medium bg-slate-50/70 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6846F5] rounded-xl text-[#10132D] focus:outline-none appearance-none cursor-pointer transition-colors"
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
                  className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
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
