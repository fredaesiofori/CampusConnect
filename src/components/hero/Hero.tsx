/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Globe,
  ArrowRight,
  ShieldCheck,
  User,
  ChevronDown,
} from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { CountrySelect } from '../ui/CountrySelect';

export interface HeroProps {
  onSearchSubmit?: (query: string, destination: string) => void;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, className = '' }) => {
  const [studyQuery, setStudyQuery] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveDestination = destination || 'All Countries';
    if (onSearchSubmit) {
      onSearchSubmit(studyQuery, effectiveDestination);
    }
  };

  return (
    <section
      id="home"
      aria-label="Campus Connect Hero Section"
      className={`relative w-full bg-[#10132D] text-white overflow-hidden ${className}`}
    >
      {/* Bottom Violet Graphic Wave Curve matching visual reference */}
      <div
        className="absolute bottom-0 left-0 w-full sm:w-2/3 lg:w-1/2 h-20 sm:h-28 lg:h-36 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 800 200"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full opacity-60"
        >
          <path
            d="M0 200 L0 80 C200 90 420 170 650 200 Z"
            fill="url(#bottom-left-wave-grad)"
          />
          <defs>
            <linearGradient
              id="bottom-left-wave-grad"
              x1="0"
              y1="80"
              x2="550"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6846F5" stopOpacity="0.85" />
              <stop offset="0.7" stopColor="#432CB8" stopOpacity="0.4" />
              <stop offset="1" stopColor="#10132D" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle atmospheric ambient glow */}
      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#8065FF]/10 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Exact Desktop Layout: Two-column grid (1.05fr ~52% Left, 0.95fr ~48% Right) on the same horizontal row */}
        <div className="hero-grid-desktop grid grid-cols-1 md:grid-cols-2 items-center gap-6 lg:gap-8">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Eyebrow, Headline, Supporting Paragraph, Search Panel, Trust */}
          {/* ========================================================================= */}
          <div className="w-full flex flex-col items-start text-left z-20 pr-0 md:pr-2 lg:pr-4">
            
            {/* 1. Small violet eyebrow */}
            <div className="text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-[#8065FF] mb-2.5 sm:mb-3 lg:mb-4">
              UNIVERSITIES • $0 APP FEES • TEST WAIVERS • SCHOLARSHIPS
            </div>

            {/* 2. Large, bold headline with "Education." in violet (#8065FF) */}
            <h1 className="text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.85rem] xl:text-[3.4rem] font-bold font-display tracking-tight text-white leading-[1.12] [text-wrap:balance]">
              Your Dream<br />
              <span className="text-[#8065FF]">Education.</span> Within Reach.
            </h1>

            {/* 3. Supporting paragraph, expanding beyond scholarships */}
            <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl [text-wrap:pretty]">
              Discover world-class universities, $0 application fee colleges, SAT/test waivers, official admissions criteria, and verified scholarships for African scholars.
            </p>

            {/* 4. Compact, elegant white search panel */}
            <div className="mt-5 sm:mt-6 w-full bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.14),0_2px_6px_-1px_rgba(0,0,0,0.06)] border border-slate-100/90 text-[#15152F] lg:min-h-[72px] lg:max-h-[84px] flex items-center">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full grid grid-cols-1 lg:grid-cols-[4fr_3fr_3fr] items-center gap-2 lg:gap-1.5"
              >
                {/* 1. Study-Interest Field (40% width distribution) */}
                <div className="h-10 sm:h-11 lg:h-[50px] flex items-center px-3 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-lg lg:rounded-xl border border-slate-200/60 focus-within:border-[#6846F5]/50 transition-all min-w-0">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" aria-hidden="true" />
                  <input
                    id="hero-study-field"
                    type="text"
                    value={studyQuery}
                    onChange={(e) => setStudyQuery(e.target.value)}
                    placeholder="Field or University (e.g. Computer Science)"
                    className="w-full text-xs sm:text-[13px] font-medium text-[#15152F] placeholder:text-slate-400 bg-transparent focus:outline-none min-w-0 truncate"
                  />
                </div>

                {/* 2. Destination Selector with all countries worldwide */}
                <div className="min-w-0">
                  <CountrySelect
                    id="hero-destination-field"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                    allowAll={true}
                    allLabel="All Global Destinations 🌐"
                    allValue=""
                    placeholder="All Global Destinations 🌐"
                    buttonClassName="h-10 sm:h-11 lg:h-[50px] bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white border-slate-200/60 rounded-lg lg:rounded-xl text-xs sm:text-[13px] font-medium"
                  />
                </div>

                {/* 3. Violet "Find Opportunities" Button (30% width distribution) */}
                <div className="min-w-0">
                  <button
                    type="submit"
                    className="w-full h-11 sm:h-11 lg:h-[50px] min-h-[44px] px-3 lg:px-2 xl:px-4 text-xs xl:text-[13px] font-semibold rounded-lg lg:rounded-xl bg-[#6846F5] hover:bg-[#5835E5] active:bg-[#4A27D6] text-white flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_14px_rgba(104,70,245,0.35)] cursor-pointer hover:shadow-[0_6px_18px_rgba(104,70,245,0.45)] active:scale-[0.99] whitespace-nowrap min-w-0"
                  >
                    <span className="truncate">Find Opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Pathway Pills */}
            <div className="mt-3 w-full flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-medium text-slate-400 mr-0.5">Quick Filters:</span>
              {[
                { label: 'Ghana 🇬🇭', query: '', dest: 'Ghana' },
                { label: '$0 App Fees', query: 'free', dest: '' },
                { label: 'SAT / Test Waivers', query: 'optional', dest: '' },
                { label: 'Full Scholarships', query: 'funded', dest: '' },
              ].map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    if (onSearchSubmit) {
                      onSearchSubmit(tag.query, tag.dest || 'All Countries');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#161B3D] text-slate-300 hover:text-white hover:bg-[#202758] border border-[#2D336B] transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* 5. Three Subtle Trust Labels Underneath */}
            <div className="mt-4 sm:mt-5 lg:mt-6 flex flex-wrap items-center gap-y-2 gap-x-2.5 sm:gap-x-4 text-xs lg:text-[13px] text-slate-300">
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Globe className="w-3.5 h-3.5 text-[#8065FF] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-200">Global Opportunities</span>
              </div>

              <span className="hidden sm:inline-block text-slate-600/70 shrink-0" aria-hidden="true">|</span>

              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8065FF] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-200">Trusted Information</span>
              </div>

              <span className="hidden sm:inline-block text-slate-600/70 shrink-0" aria-hidden="true">|</span>

              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <User className="w-3.5 h-3.5 text-[#8065FF] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-200">For Students Like You</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN — ESSENTIAL: Sibling beside the text column in the same row   */}
          {/* ========================================================================= */}
          <div className="w-full flex items-center justify-center md:justify-end z-10">
            <HeroVisual
              imageSrc="/assets/aistudio/Proud_Graduate_with_Diploma_and_Books_e327ce0d.png"
              altText="Proud graduate in black cap and gown holding diploma and books"
            />
          </div>

        </div>
      </div>

    </section>
  );
};
