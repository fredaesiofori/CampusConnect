/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  DollarSign,
  ShieldCheck,
  FileCheck,
  Clock,
  Calendar,
  Check,
  Info,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { Button } from '../ui/Button';
import { UniversityLogo, UniversityCrestCardImage } from '../ui/UniversityLogo';

export interface OpportunityDetailModalProps {
  item: OpportunityItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string, name: string) => void;
}

export type ModalTab = 'overview' | 'requirements' | 'financial' | 'process';

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  item,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock background scroll while modal is active
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  const displayName = item.officialName || item.institution;
  const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;
  const evalDeadline = evaluateOpportunityDeadline(item.deadlines);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-university-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#10132D]/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 duration-150 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Authentic University Crest / Seal Banner with Prominent Touch-Friendly Close Button */}
        <div className="relative w-full rounded-t-2xl overflow-hidden">
          <UniversityCrestCardImage
            item={item}
            variant="banner"
            countryBadge={
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#10132D]/85 backdrop-blur-sm text-white shadow-xs">
                <span>{item.countryFlag}</span>
                <span>{item.country}</span>
              </span>
            }
          />

          {/* Prominent, easily tapable (>= 44px) Close button in top-right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#10132D]/85 hover:bg-[#10132D] text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8065FF] cursor-pointer shadow-lg z-30"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Main Body matching mockup screen 3 */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header Row: Title, Verified Badge & Bookmark */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <UniversityLogo item={item} size="md" className="mt-0.5" />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2
                      id="modal-university-title"
                      className="text-xl sm:text-2xl font-bold font-display text-[#10132D] tracking-tight"
                    >
                      {displayName}
                    </h2>
                    {item.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  {/* Location row */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{displayLocation}</span>
                  </div>
                </div>
              </div>

              {/* Bookmark CTA */}
              <button
                type="button"
                onClick={() => onToggleSave(item.id, displayName)}
                className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  isSaved
                    ? 'bg-[#F0EDFF] text-[#6846F5]'
                    : 'text-slate-400 hover:text-[#6846F5] hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from Target List' : 'Save to Target List'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 fill-[#6846F5]" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Tag Pills Row matching mockup screen 3 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F0EDFF] text-[#6846F5] border border-[#DDD6FE]">
              Top Ranked
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {item.institutionType || 'Research University'}
            </span>

            {item.nationalityEligibility && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Internationally Eligible</span>
              </span>
            )}
          </div>

          {/* 4 Key Attribute Cards Grid matching mockup screen 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Box 1: Degree Levels */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-[#6846F5]" />
                <span>Degree Levels</span>
              </div>
              <p className="text-xs font-bold text-[#10132D] truncate">
                {(item.degreeLevels || []).join(', ')}
              </p>
            </div>

            {/* Box 2: Funding */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Funding</span>
              </div>
              <p className="text-xs font-bold text-[#10132D] truncate">
                {item.fundingDetails?.type || item.funding?.type || 'Standard Tuition'}
              </p>
            </div>

            {/* Box 3: Application Fee */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Application Fee</span>
              </div>
              <p className="text-xs font-bold text-emerald-700 truncate">
                {item.applicationFees?.status || item.applicationFee?.status || 'See Official Portal'}
              </p>
            </div>

            {/* Box 4: Test Waiver */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Test Waiver</span>
              </div>
              <p className="text-xs font-bold text-purple-700 truncate">
                {item.testWaiverRules?.status || item.testPolicy?.status || 'Standard Policy'}
              </p>
            </div>
          </div>

          {/* Tab Navigation matching mockup screen 3 */}
          <div className="flex items-center border-b border-slate-200 gap-6 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'requirements', label: 'Admission Requirements' },
              { id: 'financial', label: 'Financial Aid' },
              { id: 'process', label: 'Application Process' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ModalTab)}
                className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-[#6846F5] font-bold border-b-2 border-[#6846F5]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Two-Column Content Layout matching mockup screen 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Tab Specific Content */}
            <div className="lg:col-span-7 space-y-5">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      About the University
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {item.summary || 'Official university catalog overview.'}
                    </p>
                  </div>

                  {/* Specs List matching showcase */}
                  <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
                    {item.officialWebsite && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#6846F5] shrink-0" />
                        <span className="text-slate-500">Official Website:</span>
                        <a
                          href={item.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#6846F5] hover:underline truncate"
                        >
                          {item.officialWebsite.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#6846F5] shrink-0" />
                      <span className="text-slate-500">Admissions Portal:</span>
                      <a
                        href={item.sourceUrl || item.officialUrl || item.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#6846F5] hover:underline truncate"
                      >
                        Official Application Link ↗
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileCheck className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500">Language Policy:</span>{' '}
                        <span className="font-semibold text-slate-700">
                          {item.admissionsRequirements.language || 'English proficiency (WAEC / IELTS / TOEFL)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500">Application Deadlines:</span>{' '}
                        <span className="font-semibold text-[#10132D]">
                          {item.deadlines.term} — {item.deadlines.deadlineText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Available Fields */}
                  {item.studyFields && item.studyFields.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Available Fields &amp; Programs
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {item.studyFields.map((field) => (
                          <span
                            key={field}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Academic Standard
                    </span>
                    <p className="text-slate-800 font-medium">
                      {item.admissionsRequirements?.academic || 'Verified academic standard required for this program.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      SAT / Standardized Testing
                    </span>
                    <p className="text-slate-800 font-medium">
                      {item.testWaiverRules?.details || item.testPolicy?.details || 'Standard admission policy applies.'}
                    </p>
                  </div>

                  {item.admissionsRequirements?.documents && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Required Documents
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 pt-1">
                        {item.admissionsRequirements.documents.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#F0EDFF]/50 border border-[#DDD6FE] space-y-1.5">
                    <span className="text-xs font-bold text-[#6846F5]">
                      {item.fundingDetails?.type || item.funding?.type || 'Tuition Aid'} — {item.fundingDetails?.amount || item.funding?.amount || 'Institutional Grant'}
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {item.fundingDetails?.details || item.funding?.details || 'Financial assistance and scholarship programs available.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Application Fee Policy
                    </span>
                    <p className="text-slate-800 font-bold">
                      {item.applicationFees?.status || item.applicationFee?.status || 'See Official Portal'}
                    </p>
                    <p className="text-slate-600">
                      {item.applicationFees?.details || item.applicationFee?.details || 'Official application fee guidelines.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-[#10132D]">Application Steps</h5>
                    <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                      <li>Review verified entry requirements on this portal.</li>
                      <li>Prepare academic transcripts and English verification.</li>
                      <li>Visit the official university portal via the button on the right.</li>
                      <li>Submit before the official intake deadline ({item.deadlines?.deadlineText || 'Upcoming Intake'}).</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Primary Source Verification Card & CTA matching mockup screen 3 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FD] border border-[#E2E8F0] space-y-3">
                <h4 className="text-xs font-bold text-[#10132D] uppercase tracking-wider">
                  Primary Source Verification
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official university website</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Government accreditation</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reputable ranking (QS, THE)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={item.sourceUrl || item.officialUrl || item.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs sm:text-sm font-bold shadow-md transition-all text-center cursor-pointer"
                  >
                    <span>Go to Official Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Target List quick toggle */}
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => onToggleSave(item.id, displayName)}
                leftIcon={isSaved ? <BookmarkCheck className="w-4 h-4 text-[#6846F5]" /> : <Bookmark className="w-4 h-4" />}
                className="justify-center text-xs font-semibold min-h-[44px]"
              >
                {isSaved ? 'Saved in Target Tracker' : 'Save to Target Tracker'}
              </Button>

              {/* Close Button on mobile */}
              <div className="pt-1 sm:hidden">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#10132D] hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
