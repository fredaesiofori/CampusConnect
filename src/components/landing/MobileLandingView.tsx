/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Globe,
  GraduationCap,
  Layers,
  MoreHorizontal,
  Rocket,
  Search,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { authenticOpportunities } from '../../data/opportunities';

export interface MobileLandingViewProps {
  onExploreUniversities: () => void;
  onOpenScholarships: () => void;
  onOpenResources: () => void;
  onOpenDeadlines: () => void;
  onSelectDestination: (country: string) => void;
  onTurnOnAlerts: () => void;
}

interface DestinationChip {
  label: string;
  queryValue: string;
  flag: string;
}

const POPULAR_DESTINATIONS: DestinationChip[] = [
  { label: 'Canada', queryValue: 'Canada', flag: '🇨🇦' },
  { label: 'Australia', queryValue: 'Australia', flag: '🇦🇺' },
  { label: 'Germany', queryValue: 'Germany', flag: '🇩🇪' },
  { label: 'UK', queryValue: 'United Kingdom', flag: '🇬🇧' },
  { label: 'USA', queryValue: 'United States', flag: '🇺🇸' },
];

export const MobileLandingView: React.FC<MobileLandingViewProps> = ({
  onExploreUniversities,
  onOpenScholarships,
  onOpenResources,
  onOpenDeadlines,
  onSelectDestination,
  onTurnOnAlerts,
}) => {
  const [isDestinationsModalOpen, setIsDestinationsModalOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');

  // Genuine, dynamically computed database counts (no hardcoded numbers)
  const totalUniversitiesCount = authenticOpportunities.length;

  const totalScholarshipsCount = useMemo(
    () =>
      authenticOpportunities.filter((item) => {
        const fType = item.funding?.type || item.fundingDetails?.type || '';
        return (
          item.category === 'scholarship' ||
          fType === 'Fully Funded' ||
          fType === '100% Need-Met'
        );
      }).length,
    []
  );

  // Full list of countries represented in the verified registry
  const availableCountries = useMemo(() => {
    const map = new Map<string, { name: string; flag: string; count: number }>();
    for (const item of authenticOpportunities) {
      if (!item.country) continue;
      const existing = map.get(item.country);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(item.country, {
          name: item.country,
          flag: item.countryFlag || '🌐',
          count: 1,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countryFilter.trim().toLowerCase();
    if (!q) return availableCountries;
    return availableCountries.filter((c) => c.name.toLowerCase().includes(q));
  }, [availableCountries, countryFilter]);

  useEffect(() => {
    if (!isDestinationsModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDestinationsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDestinationsModalOpen]);

  return (
    <div id="home" className="bg-white px-3 pt-2.5 pb-6 space-y-4">
      {/* 1. Rounded Purple Gradient Graduation Hero Card */}
      <section
        aria-label="Campus Connect Hero"
        className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3B148E] via-[#5F31EC] to-[#7D4BF8] text-white shadow-[0_10px_26px_-8px_rgba(91,46,230,0.48)] min-h-[214px] flex items-center"
      >
        {/* Soft atmospheric violet highlights */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -left-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"
        />

        {/* Bottom-right curved purple & gold trim ribbon matching reference */}
        <svg
          aria-hidden="true"
          viewBox="0 0 360 90"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-14 z-20"
        >
          <path
            d="M115 90 C215 86 298 62 360 24 L360 90 Z"
            fill="#3B1598"
            fillOpacity="0.92"
          />
          <path
            d="M138 89 C226 83 306 58 360 20"
            stroke="#F4B844"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Approved Graduate Portrait Blended Smoothly on Right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-[56%] overflow-hidden"
        >
          <img
            src="/assets/aistudio/Proud_Graduate_with_Diploma_and_Books_e327ce0d.png"
            alt="Graduate smiling in cap and gown holding diploma and books"
            className="w-full h-full object-cover object-[center_8%] select-none"
            loading="eager"
            decoding="async"
          />
          {/* Seamless purple transition into portrait */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#552AE2] via-[#592EE5]/80 to-transparent" />
          <div className="absolute inset-0 bg-[#4A1EC0]/20 mix-blend-multiply" />
        </div>

        {/* Left Content Column */}
        <div className="relative z-10 w-[64%] min-[390px]:w-[61%] px-4 py-4.5 min-[375px]:px-5 flex flex-col items-start text-left">
          <h1 className="font-display font-extrabold text-[18px] min-[375px]:text-[20px] leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(16,19,45,0.28)]">
            Your Global
            <br />
            University Journey
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="block mt-0.5 text-[24px] min-[375px]:text-[26px] font-bold italic text-[#F8C555] leading-[0.95]"
            >
              Starts Here
            </span>
          </h1>

          {/* Curved gold brush underline beneath "Starts Here" */}
          <svg
            aria-hidden="true"
            viewBox="0 0 116 10"
            fill="none"
            className="w-24 h-2 mt-0.5 mb-2 opacity-95"
          >
            <path
              d="M2 7.5C36 2 78 2 114 5.5"
              stroke="#F8C555"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>

          <p className="text-[11px] leading-[1.4] text-white/95 max-w-[196px]">
            Discover verified universities, scholarships, and application opportunities worldwide.
          </p>

          <button
            type="button"
            onClick={onExploreUniversities}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#15152F] text-[11.5px] font-bold shadow-[0_6px_16px_rgba(16,19,45,0.22)] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
          >
            <span>Explore Universities</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5D35F5] shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* 2. Four Quick-Access Cards in One Horizontal Row */}
      <section aria-label="Quick access sections" className="grid grid-cols-4 gap-1.5 min-[375px]:gap-2">
        <button
          type="button"
          onClick={onExploreUniversities}
          className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] hover:shadow-[0_6px_14px_rgba(93,53,245,0.1)] active:scale-[0.97] transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <GraduationCap className="w-6 h-6 text-[#5B2EE6] mb-1.5 shrink-0" aria-hidden="true" />
          <span className="text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
            Universities
          </span>
          <span className="text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 tabular-nums truncate max-w-full">
            {totalUniversitiesCount} Verified
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenScholarships}
          className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] hover:shadow-[0_6px_14px_rgba(93,53,245,0.1)] active:scale-[0.97] transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <Award className="w-6 h-6 text-[#F59E0B] mb-1.5 shrink-0" aria-hidden="true" />
          <span className="text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
            Scholarships
          </span>
          <span className="text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 tabular-nums truncate max-w-full">
            {totalScholarshipsCount} Aid Paths
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenResources}
          className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] hover:shadow-[0_6px_14px_rgba(93,53,245,0.1)] active:scale-[0.97] transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <BookOpen className="w-6 h-6 text-[#2563EB] mb-1.5 shrink-0" aria-hidden="true" />
          <span className="text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
            Resources
          </span>
          <span className="text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 truncate max-w-full">
            Guides &amp; Tips
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenDeadlines}
          className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] hover:shadow-[0_6px_14px_rgba(93,53,245,0.1)] active:scale-[0.97] transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <CalendarDays className="w-6 h-6 text-[#EC4899] mb-1.5 shrink-0" aria-hidden="true" />
          <span className="text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
            Deadlines
          </span>
          <span className="text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 truncate max-w-full">
            Stay on track
          </span>
        </button>
      </section>

      {/* 3. Popular Destinations */}
      <section aria-label="Popular destinations" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6846F5] to-[#4324B5] text-white flex items-center justify-center shrink-0">
              <Globe className="w-3 h-3" aria-hidden="true" />
            </span>
            <h2 className="font-display font-bold text-[15px] text-[#10132D] tracking-tight">
              Popular Destinations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsDestinationsModalOpen(true)}
            className="min-h-[36px] px-1 inline-flex items-center gap-0.5 text-[11.5px] font-bold text-[#5D35F5] hover:text-[#4B22B8] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.label}
              type="button"
              onClick={() => onSelectDestination(dest.queryValue)}
              className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E8ECF4] hover:border-[#D4C9FF] px-0.5 py-2 min-h-[60px] flex flex-col items-center justify-center gap-1 shadow-[0_2px_6px_rgba(16,19,45,0.04)] hover:shadow-[0_5px_12px_rgba(93,53,245,0.08)] active:scale-[0.96] transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span className="text-[19px] leading-none" aria-hidden="true">
                {dest.flag}
              </span>
              <span className="text-[9.5px] min-[390px]:text-[10.5px] font-semibold text-[#10132D] leading-tight truncate max-w-full">
                {dest.label}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsDestinationsModalOpen(true)}
            aria-label="Browse all study destinations"
            className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E8ECF4] hover:border-[#D4C9FF] px-0.5 py-2 min-h-[60px] flex flex-col items-center justify-center gap-1 shadow-[0_2px_6px_rgba(16,19,45,0.04)] hover:shadow-[0_5px_12px_rgba(93,53,245,0.08)] active:scale-[0.96] transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span className="h-[19px] flex items-center justify-center text-[#5D35F5]">
              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="text-[9.5px] min-[390px]:text-[10.5px] font-semibold text-[#10132D] leading-tight">
              More
            </span>
          </button>
        </div>
      </section>

      {/* 4. Get Opportunity Alerts Banner */}
      <section aria-label="Opportunity alerts">
        <div className="rounded-2xl bg-[#F3F0FF] border border-[#E6DFFF] px-3 py-3 flex items-center justify-between gap-2.5 shadow-[0_2px_10px_rgba(93,53,245,0.05)]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Compact Envelope + Notification Dot Visual */}
            <div aria-hidden="true" className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                <rect x="4" y="10" width="28" height="20" rx="4" fill="#B59DFF" />
                <path d="M4 13L18 22L32 13V10C32 7.8 30.2 6 28 6H8C5.8 6 4 7.8 4 10V13Z" fill="#DDD6FE" />
                <path d="M4 13L18 22L32 13V26C32 28.2 30.2 30 28 30H8C5.8 30 4 28.2 4 26V13Z" fill="#9D82FF" fillOpacity="0.85" />
                <circle cx="18" cy="10" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="17.3" y="7.5" width="1.4" height="3.2" rx="0.7" fill="#FFFFFF" />
                <circle cx="18" cy="12.2" r="0.8" fill="#FFFFFF" />
              </svg>
            </div>

            <div className="min-w-0">
              <h2 className="font-display font-bold text-[13px] min-[375px]:text-[13.5px] text-[#10132D] leading-tight">
                Get Opportunity Alerts
              </h2>
              <p className="text-[10.5px] text-[#475569] leading-[1.35] mt-0.5 line-clamp-2">
                Be the first to know about new scholarships, fee waivers, and admissions updates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onTurnOnAlerts}
            className="shrink-0 min-h-[36px] px-3 py-1.5 rounded-full bg-[#5B2EE6] hover:bg-[#4B21CC] active:scale-[0.97] text-white text-[10.5px] min-[375px]:text-[11px] font-bold shadow-[0_4px_12px_rgba(91,46,230,0.3)] inline-flex items-center gap-1 transition-[transform,background-color,box-shadow] duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <Bell className="w-3 h-3" aria-hidden="true" />
            <span>Turn On Alerts</span>
          </button>
        </div>
      </section>

      {/* 5. Why CampusConnect? 3-Column Trust Row */}
      <section
        id="mobile-why-campus-connect"
        aria-label="Why CampusConnect"
        className="space-y-2.5 pt-0.5"
      >
        <div className="flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-[#5B2EE6] fill-[#5B2EE6] shrink-0" aria-hidden="true" />
          <h2 className="font-display font-bold text-[15px] text-[#10132D] tracking-tight">
            Why CampusConnect?
          </h2>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] text-center">
          <div className="px-1 flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-[#6846F5] mb-1 shrink-0" aria-hidden="true" />
            <h3 className="text-[10.5px] min-[375px]:text-[11px] font-bold text-[#10132D] leading-tight">
              Verified Institutions
            </h3>
            <p className="text-[9.5px] text-[#64748B] leading-tight mt-0.5">
              Real and accredited
            </p>
          </div>

          <div className="px-1 flex flex-col items-center">
            <Layers className="w-5 h-5 text-[#6846F5] mb-1 shrink-0" aria-hidden="true" />
            <h3 className="text-[10.5px] min-[375px]:text-[11px] font-bold text-[#10132D] leading-tight">
              Global Opportunities
            </h3>
            <p className="text-[9.5px] text-[#64748B] leading-tight mt-0.5">
              Study anywhere
            </p>
          </div>

          <div className="px-1 flex flex-col items-center">
            <Zap className="w-5 h-5 text-[#F5B82E] fill-[#F5B82E] mb-1 shrink-0" aria-hidden="true" />
            <h3 className="text-[10.5px] min-[375px]:text-[11px] font-bold text-[#10132D] leading-tight">
              Student Focused
            </h3>
            <p className="text-[9.5px] text-[#64748B] leading-tight mt-0.5">
              Simple, reliable, and free
            </p>
          </div>
        </div>
      </section>

      {/* Searchable Global Study Destinations Sheet (Triggered by More / View All) */}
      {isDestinationsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All Verified Study Destinations"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        >
          <div
            className="fixed inset-0 bg-[#10132D]/50 backdrop-blur-xs"
            onClick={() => setIsDestinationsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[82vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-base text-[#10132D]">
                  All Study Destinations
                </h3>
                <p className="text-xs text-[#64748B]">
                  {availableCountries.length} countries · {totalUniversitiesCount} verified opportunities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDestinationsModalOpen(false)}
                aria-label="Close destinations"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#10132D] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  placeholder="Search country..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#10132D] placeholder:text-slate-400 focus:outline-none focus:border-[#6846F5] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsDestinationsModalOpen(false);
                  onExploreUniversities();
                }}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#F3F0FF] hover:bg-[#EAE3FF] border border-[#DDD6FE] text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 font-bold text-sm text-[#5D35F5]">
                  <span>🌐</span>
                  <span>Explore All Countries Worldwide</span>
                </span>
                <span className="text-xs font-bold text-[#6846F5] tabular-nums">
                  {totalUniversitiesCount}
                </span>
              </button>

              {filteredCountries.map((country) => (
                <button
                  key={country.name}
                  type="button"
                  onClick={() => {
                    setIsDestinationsModalOpen(false);
                    onSelectDestination(country.name);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 text-left cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-[#10132D]">
                    <span className="text-lg leading-none" aria-hidden="true">
                      {country.flag}
                    </span>
                    <span>{country.name}</span>
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
                    {country.count}
                  </span>
                </button>
              ))}

              {filteredCountries.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-6">
                  No destinations match &ldquo;{countryFilter}&rdquo;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
