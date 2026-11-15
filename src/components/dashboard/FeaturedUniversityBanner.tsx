/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { OpportunityItem } from '../../data/opportunities';

export interface FeaturedUniversityBannerProps {
  item: OpportunityItem;
  onOpenDetails: (item: OpportunityItem) => void;
}

/**
 * Renders the verified Featured University Banner above Explore Universities
 * when a country is filtered/searched or a specific institution is searched.
 *
 * Uses strictly verified institutional branding (official name, authentic crest/monogram,
 * institutional color palette, and factual location/type) without fabricating slogans or photos.
 */
export const FeaturedUniversityBanner: React.FC<FeaturedUniversityBannerProps> = ({
  item,
  onOpenDetails,
}) => {
  const [logoError, setLogoError] = useState(false);

  if (!item || !item.isVerified) return null;

  const officialName = (item.officialName || item.institution || '').trim();
  if (!officialName) return null;

  const logoUrl = item.logo?.logoUrl;
  const monogram =
    item.logo?.monogram ||
    (item.shortName || officialName)
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 4)
      .toUpperCase();

  if (!logoUrl && !monogram) return null;

  const brandBg = item.logo?.bg || '#3B169C';
  const displayLocation = `${item.city ? `${item.city}, ` : ''}${item.country}`;

  return (
    <button
      type="button"
      onClick={() => onOpenDetails(item)}
      aria-label={`View verified institutional details for ${officialName}`}
      className="relative w-full rounded-2xl overflow-hidden text-left shadow-md hover:shadow-lg active:scale-[0.995] transition-all duration-150 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] focus-visible:ring-offset-2"
      style={{
        background: `linear-gradient(125deg, ${brandBg} 0%, #10132D 100%)`,
      }}
    >
      {/* Subtle architectural dark overlay & radial sheen for consistent WCAG AA contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/25 to-[#10132D]/70 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 px-4 py-3.5 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
        {/* Left: Authentic Crest / Emblem + Official Name */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/95 p-1.5 shadow-sm flex items-center justify-center shrink-0 border border-white/30">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={`${officialName} official crest`}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span
                className="font-mono font-black text-xs sm:text-sm tracking-wider text-center leading-none"
                style={{ color: brandBg === '#FFFFFF' ? '#10132D' : brandBg }}
              >
                {monogram}
              </span>
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-xl font-bold font-display text-white tracking-tight truncate">
                {officialName}
              </h3>
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3B82F6] text-white shrink-0 shadow-xs"
                title="Verified Institution"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-white/90">
              <span className="inline-flex items-center gap-1 font-medium">
                <span>{item.countryFlag}</span>
                <span>{displayLocation}</span>
              </span>
              {item.institutionType && (
                <>
                  <span aria-hidden="true" className="text-white/50">
                    ·
                  </span>
                  <span className="text-white/85">{item.institutionType}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hairline Divider + Factual Action Callout (No fabricated slogans) */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:border-l sm:border-white/20 sm:pl-5">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-white/95">
              {item.countryCode === 'GH'
                ? 'GTEC Accredited Institution'
                : 'Verified Admissions Profile'}
            </p>
            <p className="text-[11px] text-white/75 flex items-center justify-end gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>View programs &amp; aid</span>
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
};
