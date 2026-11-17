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
  onGetStartedClick?: () => void;
  isLoggedIn?: boolean;
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
  onGetStartedClick,
  isLoggedIn = false,
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
    <div id="home" className="bg-white">
      {/* 1. Responsive Hero Banner: Rounded Card on Mobile (< md), Full-Bleed Purple & Gold Hero on Tablet/Desktop (md+) */}
      <div className="px-3 sm:px-6 md:px-0 pt-2.5 sm:pt-4 md:pt-0">
        <div className="max-w-7xl mx-auto md:max-w-none">
          <section
            aria-label="Campus Connect Hero"
            className="relative overflow-hidden rounded-[20px] sm:rounded-3xl md:rounded-none bg-gradient-to-br from-[#3B148E] via-[#5B2EE6] to-[#7D4BF8] text-white shadow-[0_10px_26px_-8px_rgba(91,46,230,0.45)] md:shadow-none min-h-[214px] sm:min-h-[260px] md:min-h-[380px] lg:min-h-[420px] flex items-center"
          >
            {/* Soft atmospheric violet glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -left-12 w-52 sm:w-80 h-52 sm:h-80 rounded-full bg-white/10 blur-3xl"
            />

            {/* Mobile (< md): Bottom-right curved purple & gold trim ribbon + Smiling Female Graduate Portrait */}
            <svg
              aria-hidden="true"
              viewBox="0 0 360 80"
              fill="none"
              preserveAspectRatio="none"
              className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 w-full h-11 sm:h-14 z-20"
            >
              <path
                d="M115 80 C215 76 298 54 360 18 L360 80 Z"
                fill="#4C1AC3"
              />
              <path
                d="M128 79 C222 74 304 51 360 14"
                stroke="#F8C555"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            <div
              aria-hidden="true"
              className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-[56%] sm:w-[50%] overflow-hidden"
            >
              <img
                src="/images/hero_smiling_graduate.jpg"
                alt="Smiling female graduate wearing purple graduation gown and cap with gold tassel"
                className="w-full h-full object-cover object-[42%_12%] select-none"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-[#501FD1] via-[#5625DB]/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#4919BF]/70 to-transparent" />
            </div>

            {/* Desktop & Tablet (md+): Integrated Smiling Female Graduate & Sunlit Campus Artwork */}
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-[56%] lg:w-[52%] overflow-hidden"
            >
              <img
                src="/images/hero_smiling_graduate.jpg"
                alt="Smiling female graduate wearing purple graduation gown and mortarboard against university campus columns"
                className="w-full h-full object-cover object-[center_10%] select-none"
                loading="eager"
                decoding="async"
              />
              {/* Seamless multi-stop horizontal & vertical fade into hero background */}
              <div className="absolute inset-y-0 left-0 w-40 lg:w-56 bg-gradient-to-r from-[#4E1EC7] via-[#5422D4]/75 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#4517B4]/35 to-transparent" />
            </div>

            {/* Desktop & Tablet (md+): Unified Purple & Gold Sweeping Wave into Clean White Surface */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1440 84"
              fill="none"
              preserveAspectRatio="none"
              className="hidden md:block pointer-events-none absolute inset-x-0 bottom-0 w-full h-14 lg:h-[72px] z-20"
            >
              <path
                d="M0 68 C380 56 820 48 1130 32 C1285 24 1380 12 1440 2 L1440 84 L0 84 Z"
                fill="#7329F6"
              />
              <path
                d="M660 54 C930 46 1190 28 1440 0"
                stroke="#F8C555"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M0 78 C420 68 860 66 1165 50 C1305 42 1390 32 1440 24 L1440 84 L0 84 Z"
                fill="#FFFFFF"
              />
            </svg>

            {/* Unified Hero Foreground Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4.5 min-[375px]:px-5 sm:px-8 sm:py-7 lg:px-8 lg:py-12">
              <div className="w-[63%] min-[390px]:w-[60%] sm:w-[56%] md:w-[54%] lg:w-[50%] flex flex-col items-start text-left pb-0 md:pb-5">
                <h1 className="font-display font-extrabold text-[18px] min-[375px]:text-[20px] sm:text-3xl md:text-[36px] lg:text-[44px] leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(16,19,45,0.28)]">
                  Your Global
                  <br />
                  University Journey
                  <span
                    style={{ fontFamily: "'Caveat', cursive" }}
                    className="block mt-0.5 text-[24px] min-[375px]:text-[26px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold italic text-[#F8C555] leading-[0.92]"
                  >
                    Starts Here
                  </span>
                </h1>

                {/* Curved gold brush underline beneath "Starts Here" */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 116 10"
                  fill="none"
                  className="w-24 sm:w-36 md:w-44 lg:w-48 h-2 sm:h-2.5 mt-0.5 mb-2 sm:mb-3 opacity-95"
                >
                  <path
                    d="M2 7.5C36 2 78 2 114 5.5"
                    stroke="#F8C555"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="text-[11px] sm:text-sm md:text-[15px] leading-[1.45] text-white/95 max-w-[196px] sm:max-w-md lg:max-w-lg">
                  Discover verified universities, scholarships, and application opportunities worldwide.
                </p>

                <div className="mt-3 sm:mt-4.5 md:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={onExploreUniversities}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 md:px-6 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[42px] md:min-h-[44px] rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#15152F] text-[11.5px] sm:text-xs md:text-[13.5px] font-bold shadow-[0_6px_18px_rgba(16,19,45,0.24)] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
                  >
                    <span>Explore Universities</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5D35F5] shrink-0" aria-hidden="true" />
                  </button>

                  {!isLoggedIn && onGetStartedClick && (
                    <button
                      type="button"
                      onClick={onGetStartedClick}
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 md:px-6 py-2 sm:py-2.5 min-h-[42px] md:min-h-[44px] rounded-full bg-gradient-to-r from-[#6D35F5] to-[#8D49FF] hover:from-[#5D29E4] hover:to-[#7B38F2] border border-white/25 text-white text-xs md:text-[13.5px] font-semibold shadow-[0_6px_18px_rgba(32,10,96,0.3)] transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
                    >
                      <span>Create Free Account</span>
                    </button>
                  )}
                </div>

                {/* Desktop & Tablet (md+) Inline Feature Strip inside Hero */}
                <div className="hidden md:flex flex-wrap items-center gap-x-4 lg:gap-x-5 gap-y-2 mt-6 text-xs lg:text-[13px] font-medium text-white/95">
                  <button
                    type="button"
                    onClick={onExploreUniversities}
                    className="inline-flex items-center gap-2 hover:text-[#F8C555] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    <GraduationCap className="w-4 h-4 text-[#F8C555] shrink-0" aria-hidden="true" />
                    <span>Find Universities</span>
                  </button>

                  <span aria-hidden="true" className="h-3.5 w-px bg-white/25" />

                  <button
                    type="button"
                    onClick={onOpenScholarships}
                    className="inline-flex items-center gap-2 hover:text-[#F8C555] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    <Award className="w-4 h-4 text-[#F8C555] shrink-0" aria-hidden="true" />
                    <span>Discover Scholarships</span>
                  </button>

                  <span aria-hidden="true" className="h-3.5 w-px bg-white/25" />

                  <button
                    type="button"
                    onClick={onOpenDeadlines}
                    className="inline-flex items-center gap-2 hover:text-[#F8C555] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    <Layers className="w-4 h-4 text-[#DDD6FE] shrink-0" aria-hidden="true" />
                    <span>Track Applications</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 md:pt-7 lg:pt-8 pb-5 sm:pb-8 lg:pb-9 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 2. Mobile (< md): Four Quick-Access Cards Row */}
        <section
          aria-label="Quick access sections"
          className="md:hidden grid grid-cols-4 gap-1.5 min-[375px]:gap-2"
        >
          <button
            type="button"
            onClick={onExploreUniversities}
            className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span className="flex items-center justify-center mb-1.5 shrink-0">
              <GraduationCap className="w-6 h-6 text-[#5B2EE6] shrink-0" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
                Universities
              </span>
              <span className="block text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 tabular-nums truncate max-w-full">
                {totalUniversitiesCount} Verified
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenScholarships}
            className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span className="flex items-center justify-center mb-1.5 shrink-0">
              <Award className="w-6 h-6 text-[#F59E0B] shrink-0" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
                Scholarships
              </span>
              <span className="block text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 tabular-nums truncate max-w-full">
                {totalScholarshipsCount} Aid Paths
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenResources}
            className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span className="flex items-center justify-center mb-1.5 shrink-0">
              <BookOpen className="w-6 h-6 text-[#2563EB] shrink-0" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
                Resources
              </span>
              <span className="block text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 truncate max-w-full">
                Guides &amp; Tips
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenDeadlines}
            className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E9E2FF] px-1 py-2.5 min-h-[82px] flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(93,53,245,0.05)] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <span className="flex items-center justify-center mb-1.5 shrink-0">
              <CalendarDays className="w-6 h-6 text-[#EC4899] shrink-0" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10.5px] min-[375px]:text-[11.5px] font-bold text-[#10132D] leading-tight truncate max-w-full">
                Deadlines
              </span>
              <span className="block text-[9px] min-[375px]:text-[9.5px] font-medium text-[#64748B] leading-tight mt-0.5 truncate max-w-full">
                Stay on track
              </span>
            </div>
          </button>
        </section>

        {/* 3. Popular Destinations (Mobile Compact Strip < md / Desktop "Study in Top Destinations" 6-Card Showcase md+) */}
        <section aria-label="Popular destinations" className="space-y-2.5 md:space-y-5">
          {/* Mobile Header Row (< md) */}
          <div className="flex md:hidden items-center justify-between">
            <div className="flex items-center gap-2">
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
              className="min-h-[36px] px-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#5D35F5] hover:text-[#4B22B8] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop & Tablet Centered Heading (md+) */}
          <div className="hidden md:flex flex-col items-center text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F3F0FF] border border-[#E5DCFF] text-[11px] font-bold tracking-wider uppercase text-[#5D35F5]">
              <Globe className="w-3.5 h-3.5 text-[#5D35F5]" aria-hidden="true" />
              <span>Popular Destinations</span>
            </span>
            <h2 className="font-display font-extrabold text-2xl lg:text-[32px] text-[#10132D] tracking-tight">
              Study in Top Destinations
            </h2>
            <p className="text-sm text-[#64748B] max-w-lg">
              Explore opportunities in leading study-abroad countries.
            </p>
          </div>

          {/* Mobile 6-Chip Destination Strip (< md) */}
          <div className="grid md:hidden grid-cols-6 gap-1.5">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.label}
                type="button"
                onClick={() => onSelectDestination(dest.queryValue)}
                className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E8ECF4] hover:border-[#D4C9FF] px-0.5 py-2 min-h-[60px] flex flex-col items-center justify-center gap-1 shadow-[0_2px_6px_rgba(16,19,45,0.04)] active:scale-[0.96] transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
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
              className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E8ECF4] hover:border-[#D4C9FF] px-0.5 py-2 min-h-[60px] flex flex-col items-center justify-center gap-1 shadow-[0_2px_6px_rgba(16,19,45,0.04)] active:scale-[0.96] transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span className="h-[19px] flex items-center justify-center text-[#5D35F5]">
                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-[9.5px] min-[390px]:text-[10.5px] font-semibold text-[#10132D] leading-tight">
                More
              </span>
            </button>
          </div>

          {/* Desktop & Tablet 6-Card Country + More Grid (md+) matching reference */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              POPULAR_DESTINATIONS[0], // Canada
              POPULAR_DESTINATIONS[3], // UK
              POPULAR_DESTINATIONS[4], // USA
              POPULAR_DESTINATIONS[1], // Australia
              POPULAR_DESTINATIONS[2], // Germany
            ].map((dest) => (
              <button
                key={dest.label}
                type="button"
                onClick={() => onSelectDestination(dest.queryValue)}
                className="group rounded-2xl bg-white hover:bg-[#FAF8FF] border border-[#EAE8F5] hover:border-[#C4B5FD] px-4 py-4.5 flex flex-col items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,19,45,0.04)] hover:shadow-[0_10px_24px_rgba(93,53,245,0.1)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
              >
                <span className="text-3xl lg:text-4xl leading-none drop-shadow-2xs select-none" aria-hidden="true">
                  {dest.flag}
                </span>
                <span className="text-sm font-bold text-[#10132D] group-hover:text-[#5D35F5] transition-colors">
                  {dest.label}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsDestinationsModalOpen(true)}
              aria-label="Browse all study destinations"
              className="group rounded-2xl bg-white hover:bg-[#FAF8FF] border border-[#EAE8F5] hover:border-[#C4B5FD] px-4 py-4.5 flex flex-col items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,19,45,0.04)] hover:shadow-[0_10px_24px_rgba(93,53,245,0.1)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span className="h-9 lg:h-10 flex items-center justify-center text-[#5D35F5] group-hover:scale-110 transition-transform">
                <MoreHorizontal className="w-7 h-7" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-[#10132D] group-hover:text-[#5D35F5] transition-colors">
                More
              </span>
            </button>
          </div>
        </section>

        {/* 4. Mobile (< md): Get Opportunity Alerts Banner */}
        <section aria-label="Opportunity alerts" className="md:hidden">
          <div className="rounded-2xl bg-[#F3F0FF] border border-[#E6DFFF] px-3 py-3 flex items-center justify-between gap-2.5 shadow-[0_2px_10px_rgba(93,53,245,0.05)]">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
              className="shrink-0 min-h-[36px] px-3 py-1.5 rounded-full bg-[#5B2EE6] hover:bg-[#4B21CC] active:scale-[0.97] text-white text-[10.5px] min-[375px]:text-[11px] font-bold shadow-[0_4px_12px_rgba(91,46,230,0.3)] inline-flex items-center gap-1.5 transition-[transform,background-color,box-shadow] duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <Bell className="w-3 h-3" aria-hidden="true" />
              <span>Turn On Alerts</span>
            </button>
          </div>
        </section>

        {/* 5. Why CampusConnect? Compact Trust Row (Unified anchor #benefits & #trust-transparency) */}
        <section
          id="benefits"
          aria-label="Why CampusConnect"
          className="space-y-2.5 sm:space-y-3 pt-0.5"
        >
          <div id="trust-transparency" className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B2EE6] fill-[#5B2EE6] shrink-0" aria-hidden="true" />
              <h2 className="font-display font-bold text-[15px] sm:text-lg text-[#10132D] tracking-tight">
                Why CampusConnect?
              </h2>
            </div>

            {/* Compact Desktop Resource & Alerts Shortcuts */}
            <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={onOpenResources}
                className="text-[#475569] hover:text-[#5D35F5] transition-colors cursor-pointer"
              >
                Resources &amp; Guides
              </button>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onTurnOnAlerts}
                className="text-[#5D35F5] hover:text-[#4B22B8] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Opportunity Alerts</span>
              </button>
            </div>
          </div>

          <div
            id="mobile-why-campus-connect"
            className="grid grid-cols-3 divide-x divide-[#E2E8F0] text-center md:rounded-2xl md:border md:border-[#EAE8F5] md:bg-[#FAF9FF]/75 md:py-4"
          >
            <div className="px-1 sm:px-4 flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#6846F5] mb-1 sm:mb-1.5 shrink-0" aria-hidden="true" />
              <h3 className="text-[10.5px] min-[375px]:text-[11px] sm:text-sm font-bold text-[#10132D] leading-tight">
                Verified Institutions
              </h3>
              <p className="text-[9.5px] sm:text-xs text-[#64748B] leading-tight mt-0.5">
                Real and accredited
              </p>
            </div>

            <div className="px-1 sm:px-4 flex flex-col items-center">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#6846F5] mb-1 sm:mb-1.5 shrink-0" aria-hidden="true" />
              <h3 className="text-[10.5px] min-[375px]:text-[11px] sm:text-sm font-bold text-[#10132D] leading-tight">
                Global Opportunities
              </h3>
              <p className="text-[9.5px] sm:text-xs text-[#64748B] leading-tight mt-0.5">
                Study anywhere
              </p>
            </div>

            <div className="px-1 sm:px-4 flex flex-col items-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#F5B82E] fill-[#F5B82E] mb-1 sm:mb-1.5 shrink-0" aria-hidden="true" />
              <h3 className="text-[10.5px] min-[375px]:text-[11px] sm:text-sm font-bold text-[#10132D] leading-tight">
                Student Focused
              </h3>
              <p className="text-[9.5px] sm:text-xs text-[#64748B] leading-tight mt-0.5">
                Simple, reliable, and free
              </p>
            </div>
          </div>
        </section>
      </div>

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
