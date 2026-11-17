/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Award, GraduationCap, Layers } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { authenticOpportunities } from '../../data/opportunities';

export interface AuthSplitLayoutProps {
  onNavigateHome: () => void;
  headlineLine1: string;
  headlineLine2: string;
  mobileTitle: string;
  description: string;
  cardMaxWidthClass?: string;
  children: React.ReactNode;
}

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  onNavigateHome,
  headlineLine1,
  headlineLine2,
  mobileTitle,
  description,
  cardMaxWidthClass = 'max-w-[460px]',
  children,
}) => {
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

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2B0A6B] via-[#4C1CC2] to-[#743CF2] flex flex-col justify-center selection:bg-[#F8C555] selection:text-[#15152F]">
      {/* Atmospheric Purple Glow + Sweeping Bottom Purple & Gold Waves */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-[#8D62FF]/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#2E0D75]/40 blur-3xl" />

        {/* Integrated Campus Cap, Books, Diploma & University Background Illustration on Desktop */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[62%] overflow-hidden">
          <img
            src="/images/auth_campus_cap_books.jpg"
            alt="Classical university campus behind purple graduation cap, stacked books, and rolled diploma"
            className="w-full h-full object-cover object-right-bottom select-none"
            loading="eager"
            decoding="async"
          />
          {/* Seamless multi-edge purple blending so typography & left panel stay unified */}
          <div className="absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-[#340F80] via-[#4318A8]/90 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#330F7F]/85 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#5624D0]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#4317A8]/85 via-[#4317A8]/35 to-transparent" />
        </div>

        {/* Sweeping Bottom Purple & Gold Curved Ribbons matching both references */}
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 w-full h-20 sm:h-28 lg:h-36 z-20"
        >
          <path
            d="M0 140 C190 95 430 185 750 112 C1040 46 1260 12 1440 0 L1440 200 L0 200 Z"
            fill="#6C33F0"
            fillOpacity="0.45"
          />
          <path
            d="M0 165 C240 125 460 192 770 124 C1050 62 1260 28 1440 12"
            stroke="#FFCA28"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M0 174 C245 135 465 200 775 134 C1055 72 1265 36 1440 20 L1440 200 L0 200 Z"
            fill="#5622D4"
            fillOpacity="0.92"
          />
        </svg>
      </div>

      {/* Main Responsive Two-Column Stage */}
      <div className="relative z-30 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-8 items-center">
          {/* ========================================================== */}
          {/* MOBILE & TABLET COMPACT HEADER (< lg) — NO FLOATING PHOTO  */}
          {/* ========================================================== */}
          <div className="lg:hidden px-1 pt-0.5 pb-1 space-y-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl"
              aria-label="Return to Campus Connect home"
            >
              <Logo size="sm" variant="dark" iconShape="circle" onPurple={true} showWordmark={true} />
            </button>

            <div>
              <h1 className="font-display font-extrabold text-[22px] sm:text-[28px] leading-[1.1] text-white tracking-tight">
                {mobileTitle}
              </h1>
              <svg
                aria-hidden="true"
                viewBox="0 0 180 12"
                fill="none"
                className="w-36 sm:w-44 h-2.5 mt-1"
              >
                <path
                  d="M3 8.5C52 2.5 124 2.5 176 7"
                  stroke="#FFCA28"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs sm:text-[13px] text-white/90 mt-1 max-w-lg leading-snug">
                {totalUniversitiesCount}+ verified universities · {totalScholarshipsCount}+ scholarships · Track your applications
              </p>
            </div>
          </div>

          {/* ========================================================== */}
          {/* DESKTOP LEFT COLUMN — BRAND, HEADLINE & FEATURES (lg+)     */}
          {/* ========================================================== */}
          <section
            aria-label="Campus Connect overview"
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative min-h-[610px] xl:min-h-[650px] flex-col justify-between py-2 pr-4"
          >
            {/* Top-Left Brand Lockup */}
            <div className="relative z-20">
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl"
                aria-label="Return to Campus Connect home"
              >
                <Logo size="lg" variant="dark" iconShape="circle" onPurple={true} showWordmark={true} />
              </button>
            </div>

            {/* Headline, Curved Gold Underline, Intro & 3 Feature Items */}
            <div className="relative z-20 max-w-[330px] xl:max-w-[365px] space-y-5 my-auto py-6">
              <div>
                <h1 className="font-display font-extrabold text-[40px] xl:text-[46px] leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(16,12,42,0.3)]">
                  {headlineLine1}
                  <br />
                  {headlineLine2}
                </h1>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 210 14"
                  fill="none"
                  className="w-48 xl:w-56 h-3.5 mt-2"
                >
                  <path
                    d="M3 10.5C64 2.5 144 2.5 207 7.5"
                    stroke="#FFCA28"
                    strokeWidth="4.4"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="mt-4 text-[14px] xl:text-[15px] leading-[1.55] text-white/95 font-normal">
                  {description}
                </p>
              </div>

              <ul className="space-y-4 pt-1">
                <li className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-sm">
                    <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-white leading-tight">
                      Explore Verified Universities
                    </p>
                    <p className="text-[12.5px] text-white/85 mt-0.5 leading-snug">
                      {totalUniversitiesCount}+ global institutions
                    </p>
                  </div>
                </li>

                <li className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-5 h-5 text-[#FFCA28]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-white leading-tight">
                      Find Scholarships
                    </p>
                    <p className="text-[12.5px] text-white/85 mt-0.5 leading-snug">
                      {totalScholarshipsCount}+ opportunities updated regularly
                    </p>
                  </div>
                </li>

                <li className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-sm">
                    <Layers className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-white leading-tight">
                      Track Your Applications
                    </p>
                    <p className="text-[12.5px] text-white/85 mt-0.5 leading-snug">
                      Stay organized and meet deadlines
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="h-4" aria-hidden="true" />
          </section>

          {/* ========================================================== */}
          {/* RIGHT PANEL — ELEVATED WHITE AUTHENTICATION CARD           */}
          {/* ========================================================== */}
          <main className="lg:col-span-6 xl:col-span-5 w-full">
            <div
              className={`bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_24px_60px_-14px_rgba(18,8,54,0.48)] border border-white/85 p-5 sm:p-7 lg:px-9 lg:py-8 w-full ${cardMaxWidthClass} mx-auto`}
            >
              {/* Centered Desktop Brand Logo Inside White Card */}
              <div className="hidden lg:flex justify-center mb-4">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="inline-flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] rounded-xl"
                  aria-label="Return to Campus Connect home"
                >
                  <Logo size="md" variant="light" iconShape="circle" onPurple={false} showWordmark={true} />
                </button>
              </div>

              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
