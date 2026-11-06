/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Award, Globe, ShieldCheck, ArrowRight, ExternalLink, Bookmark, BookmarkCheck, Building2, CheckCircle2, Clock, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { authenticOpportunities, OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { InstitutionLogo } from '../dashboard/StudentDashboard';

export interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  destination: string;
  onSelectOpportunity?: (item: OpportunityItem) => void;
}

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  isOpen,
  onClose,
  query,
  destination,
  onSelectOpportunity,
}) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('cc_target_list');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8); // 8, 16, or 0 (All)

  // Reset page when search or destination changes
  useEffect(() => {
    setPage(1);
  }, [query, destination, selectedCategory]);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSave = (id: string, name: string) => {
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      setToastMessage(`Removed ${name} from your Target List.`);
    } else {
      next.add(id);
      setToastMessage(`Saved ${name} to your Target List!`);
    }
    setSavedIds(next);
    try {
      localStorage.setItem('cc_target_list', JSON.stringify(Array.from(next)));
    } catch {
      // ignore storage error
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter based on query text, destination selection, and category from verified database
  const filteredOpportunities = useMemo(() => {
    return authenticOpportunities.filter((item) => {
      // 1. Destination Match
      const matchesDest =
        !destination ||
        destination.toLowerCase().includes('all') ||
        destination === 'Any Destination' ||
        item.country.toLowerCase().includes(destination.toLowerCase()) ||
        item.countryCode.toLowerCase() === destination.toLowerCase() ||
        item.eligibilityCountries.some((c) => c.toLowerCase().includes(destination.toLowerCase()));

      if (!matchesDest) return false;

      // 2. Category / Institution Type Match
      if (selectedCategory !== 'all') {
        if (item.institutionType !== selectedCategory) return false;
      }

      // 3. Query Match
      const q = (query || '').toLowerCase().trim();
      if (!q) return true;

      const matchesQuery =
        item.officialName.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        (item.shortName && item.shortName.toLowerCase().includes(q)) ||
        (item.institutionType && item.institutionType.toLowerCase().includes(q)) ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.studyFields.some((f) => f.toLowerCase().includes(q)) ||
        (item.admissionsRequirements.academic?.toLowerCase().includes(q) ?? false);

      return matchesQuery;
    });
  }, [query, destination, selectedCategory]);

  const totalItems = filteredOpportunities.length;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  const paginatedOpportunities = useMemo(() => {
    if (pageSize <= 0) return filteredOpportunities;
    const start = (page - 1) * pageSize;
    return filteredOpportunities.slice(start, start + pageSize);
  }, [filteredOpportunities, page, pageSize]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-[#10132D]/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10132D] text-white text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-[#2D336B] animate-in fade-in slide-in-from-top-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#E7B75C]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E2E8F0] bg-[#F8F9FD] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6846F5] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified University Directory
                </span>
                <span className="text-xs font-bold text-[#10132D] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-full shadow-2xs">
                  {totalItems} Records
                </span>
              </div>
              <h3 id="search-modal-title" className="text-base sm:text-xl font-bold font-display text-[#10132D] mt-1 leading-snug truncate">
                {query ? `Opportunities for "${query}"` : 'All Verified Opportunities'}
                {destination && destination !== 'All Countries' && destination !== 'Any Destination'
                  ? ` in ${destination}`
                  : ''}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close search results"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-[#10132D] hover:bg-slate-100 border border-transparent hover:border-[#E2E8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex overflow-x-auto scrollbar-none items-center gap-1.5 pt-1 pb-1">
            {[
              { value: 'all', label: 'All Institutions' },
              { value: 'Public University', label: 'Public Universities' },
              { value: 'Technical University', label: 'Technical Universities' },
              { value: 'Private University', label: 'Private Universities' },
              { value: 'Specialized / Regional', label: 'Specialized / Regional' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[34px] ${
                    isSelected
                      ? 'bg-[#6846F5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOpportunities.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#6846F5] flex items-center justify-center mx-auto border border-[#DDD6FE]">
                <ShieldCheck className="w-6 h-6 text-[#6846F5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#10132D]">No Verified Opportunities Found</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Campus Connect exclusively indexes verified real university programs with authenticated sources.
                  We never generate fictional listings or unverified opportunities.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                  className="bg-[#6846F5] text-white"
                >
                  Explore All Destinations
                </Button>
              </div>
            </div>
          ) : (
            paginatedOpportunities.map((item) => {
              const isSaved = savedIds.has(item.id);
              const evalDeadline = evaluateOpportunityDeadline(item.deadlines);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#DDD6FE] hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <InstitutionLogo
                          item={item}
                          logo={item.logo}
                          countryFlag={item.countryFlag}
                          countryCode={item.countryCode}
                          isVerified={item.isVerified}
                          institutionType={item.institutionType}
                          officialName={item.officialName || item.institution}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#10132D] truncate">
                              {item.officialName}
                            </span>
                            {item.officialWebsite && (
                              <a
                                href={item.officialWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-[#6846F5] transition-colors shrink-0"
                                title={`Visit official ${item.officialName} website`}
                              >
                                <Globe className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>{item.countryFlag}</span>
                            <span>{item.city}, {item.country}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="gold" size="sm">
                          <Award className="w-3 h-3" />
                          <span>{item.fundingDetails.type}</span>
                        </Badge>
                        <button
                          type="button"
                          onClick={() => toggleSave(item.id, item.officialName)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-[#F0EDFF] border-[#DDD6FE] text-[#6846F5]'
                              : 'border-slate-200 text-slate-400 hover:text-[#6846F5]'
                          }`}
                          title={isSaved ? 'Saved in Target List' : 'Save to Target List'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#10132D] group-hover:text-[#6846F5] transition-colors mt-2.5">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>

                    {/* Evidence-Backed Accreditation, International Eligibility & Type Badges */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {item.isVerified && item.verificationSource && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200"
                          title={item.verificationSource}
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Accredited: {item.countryCode === 'GH' ? 'GTEC Verified' : 'Officially Accredited'}</span>
                        </span>
                      )}

                      {item.nationalityEligibility && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F0EDFF] text-[#5835E5] border border-[#DDD6FE]"
                          title={item.nationalityEligibility.details}
                        >
                          <Globe className="w-3 h-3 text-[#6846F5] shrink-0" />
                          <span>
                            {item.nationalityEligibility.category === 'All International Citizens'
                              ? 'International Students'
                              : item.nationalityEligibility.category === 'All Nationalities'
                              ? 'All Nationalities'
                              : item.nationalityEligibility.category === 'African Citizens'
                              ? 'African & Intl'
                              : 'Ghanaian & Intl'}
                          </span>
                        </span>
                      )}

                      {item.institutionType && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <Building2 className="w-3 h-3 text-[#6846F5] shrink-0" />
                          <span>{item.institutionType}</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Eligibility:</span>
                        <strong className="text-slate-700 truncate block">
                          {item.nationalityEligibility.category}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Application Fee:</span>
                        <strong
                          className={
                            item.applicationFees.status === 'Free ($0 Fee)'
                              ? 'text-emerald-700'
                              : 'text-slate-700'
                          }
                        >
                          {item.applicationFees.status}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">SAT / Tests:</span>
                        <strong className="text-slate-700 truncate block">
                          {item.testWaiverRules.status}
                        </strong>
                      </div>
                    </div>

                    {/* Source Verification Citation */}
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[280px] sm:max-w-[400px]">
                        Verified: {item.verificationSource}
                      </span>
                      <span className={`shrink-0 font-medium ${evalDeadline.isExpired ? 'text-amber-700 font-semibold' : 'text-slate-600'}`}>
                        Deadline: {evalDeadline.displayText}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={item.sourceUrl || item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#6846F5] hover:border-[#6846F5] transition-colors min-h-[38px] sm:min-h-0"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Official Source Bulletin</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </a>

                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-lg bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-semibold shadow-xs transition-colors min-h-[38px] sm:min-h-0"
                    >
                      <span className="truncate">Official University Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Pagination Bar */}
        {filteredOpportunities.length > 0 && (
          <div className="px-5 sm:px-6 py-2.5 border-t border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 text-[11px]">
              Showing{' '}
              <strong className="text-[#10132D] font-bold">
                {totalItems === 0 ? 0 : pageSize > 0 ? (page - 1) * pageSize + 1 : 1}
              </strong>
              {' – '}
              <strong className="text-[#10132D] font-bold">
                {pageSize > 0 ? Math.min(page * pageSize, totalItems) : totalItems}
              </strong>{' '}
              of <strong className="text-[#10132D] font-bold">{totalItems}</strong> records
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Per page:</span>
                {[8, 16, 0].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setPageSize(sz);
                      setPage(1);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      pageSize === sz
                        ? 'bg-[#6846F5] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sz === 0 ? 'All' : sz}
                  </button>
                ))}
              </div>

              {pageSize > 0 && totalPages > 1 && (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="text-[11px] text-slate-500 px-1">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8F9FD] flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Campus Connect Official Higher Education Directory</span>
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
