/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Globe2, MapPin, RotateCcw } from 'lucide-react';
import { OpportunityItem } from '../../data/opportunities';
import { ExploreBannerShowcase } from '../../utils/universityDirectory';
import { getVerifiedCampusPhotoUrl } from '../../utils/verifiedCampusPhotos';
import { UniversityLogo } from '../ui/UniversityLogo';
import { CountryFlag } from '../ui/CountryFlagSvg';

export interface FeaturedUniversityBannerProps {
  showcase: ExploreBannerShowcase;
  onOpenDetails: (item: OpportunityItem) => void;
  onResetFilters?: () => void;
}

const SLIDE_INTERVAL_MS = 5000;

/**
 * Dynamic Featured University Showcase displayed below the Explore Universities heading
 * and above the search bar. Rotates through verified institutions with authentic campus
 * photographs across worldwide or active country/search contexts.
 */
export const FeaturedUniversityBanner: React.FC<FeaturedUniversityBannerProps> = ({
  showcase,
  onOpenDetails,
  onResetFilters,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [failedPhotoIds, setFailedPhotoIds] = useState<Set<string>>(() => new Set());

  // Keep only slides whose authentic verified photo has not failed to load
  const activeSlides = useMemo(() => {
    return showcase.slides.filter(
      (item) =>
        Boolean(getVerifiedCampusPhotoUrl(item)) && !failedPhotoIds.has(item.id)
    );
  }, [showcase.slides, failedPhotoIds]);

  const slidesSignature = useMemo(
    () => activeSlides.map((s) => s.id).join('|'),
    [activeSlides]
  );

  // Reset to first (flagship/best-match) slide whenever filter/search results change
  useEffect(() => {
    setActiveIndex(0);
  }, [slidesSignature, showcase.mode, showcase.countryLabel]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibility = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const safeIndex =
    activeSlides.length > 0 ? activeIndex % activeSlides.length : 0;

  // Preload upcoming campus photos to keep crossfades smooth with zero blank frames
  useEffect(() => {
    if (typeof window === 'undefined' || activeSlides.length <= 1) return;
    const nextIdx = (safeIndex + 1) % activeSlides.length;
    const preloadTargets = [activeSlides[nextIdx]];
    if (activeSlides.length > 2) {
      preloadTargets.push(activeSlides[(safeIndex + 2) % activeSlides.length]);
    }
    preloadTargets.forEach((slide) => {
      const url = getVerifiedCampusPhotoUrl(slide);
      if (url) {
        const img = new window.Image();
        img.src = url;
      }
    });
  }, [safeIndex, activeSlides]);

  // Automatic 5-second rotation when multiple photographed institutions exist
  useEffect(() => {
    if (
      activeSlides.length <= 1 ||
      isHovered ||
      isDocumentHidden ||
      prefersReducedMotion
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [activeSlides.length, isHovered, isDocumentHidden, prefersReducedMotion]);

  const currentItem =
    activeSlides[safeIndex] || showcase.fallbackItem || showcase.slides[0] || null;

  // Empty search / filter state fallback (zero unrelated photos)
  if (!currentItem || showcase.mode === 'empty') {
    return (
      <section
        aria-label="Explore Universities Spotlight"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D1775] via-[#211457] to-[#10132D] text-white px-4 py-4 sm:px-6 sm:py-5 shadow-[0_8px_24px_-10px_rgba(16,19,45,0.45)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#6846F5]/25 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#F8C555]/80 via-[#F8C555]/35 to-transparent"
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F8C555]">
              <Globe2 className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F8C555]">
                Verified Global Directory
              </p>
              <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-tight truncate">
                {showcase.countryLabel
                  ? `No matching universities for current filters in ${showcase.countryLabel}`
                  : 'Discover verified universities worldwide'}
              </h3>
            </div>
          </div>

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[38px] rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#10132D] text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5D35F5]" aria-hidden="true" />
              <span>View All Universities</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  const officialName = (currentItem.officialName || currentItem.institution || '').trim();
  const displayLocation = `${currentItem.city ? `${currentItem.city}, ` : ''}${currentItem.country}`;
  const hasPhotoSlides = activeSlides.length > 0;
  const isRotating = activeSlides.length > 1;

  const spotlightLabel =
    showcase.mode === 'country' && showcase.countryLabel
      ? `Featured in ${showcase.countryLabel}`
      : showcase.mode === 'university'
      ? 'Featured University'
      : 'Global University Spotlight';

  return (
    <section
      aria-label="Featured University Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D1775] via-[#211457] to-[#10132D] text-white min-h-[148px] sm:min-h-[156px] lg:min-h-[168px] px-4 py-4 sm:px-6 sm:py-5 flex items-end sm:items-center shadow-[0_10px_26px_-10px_rgba(16,19,45,0.48)]"
    >
      {/* Campus Photography Crossfade Layer (Authentic verified campus photos only) */}
      {hasPhotoSlides ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {activeSlides.map((slide, index) => {
            const photoUrl = getVerifiedCampusPhotoUrl(slide);
            if (!photoUrl) return null;
            const isActive = index === safeIndex;
            return (
              <img
                key={slide.id}
                src={photoUrl}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => {
                  setFailedPhotoIds((prev) => {
                    if (prev.has(slide.id)) return prev;
                    const next = new Set(prev);
                    next.add(slide.id);
                    return next;
                  });
                }}
                className={`absolute inset-0 h-full w-full object-cover object-center ${
                  prefersReducedMotion
                    ? 'transition-none'
                    : 'transition-opacity duration-1000 ease-in-out'
                } ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />
            );
          })}

          {/* Rich purple & navy gradient scrim preserving photo vibrancy on right and >=4.5:1 text contrast on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14113A]/95 via-[#2B1770]/78 sm:via-[#2B1770]/68 to-[#10132D]/34" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10132D]/68 via-[#10132D]/15 to-[#1E134B]/28" />
        </div>
      ) : (
        /* Tasteful branded fallback when no eligible campus photograph exists */
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-12 w-52 h-52 rounded-full bg-[#6846F5]/25 blur-2xl" />
          <div className="absolute right-16 bottom-0 w-36 h-36 rounded-full bg-[#F8C555]/10 blur-2xl" />
        </div>
      )}

      {/* Subtle gold bottom border accent matching Campus Connect brand palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#F8C555]/85 via-[#F8C555]/35 to-transparent z-10"
      />

      {/* Unobtrusive top-right slide indicators when multiple universities rotate */}
      {isRotating && (
        <div
          role="group"
          aria-label="Featured university slideshow controls"
          className="absolute top-3 right-3.5 sm:top-3.5 sm:right-5 z-20 flex items-center gap-1"
        >
          {activeSlides.map((slide, index) => {
            const isActive = index === safeIndex;
            const slideName = slide.officialName || slide.institution;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show featured university ${index + 1} of ${activeSlides.length}: ${slideName}`}
                aria-current={isActive ? 'true' : undefined}
                className="p-0.5 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8C555]"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-4 bg-[#F8C555]'
                      : 'w-1.5 bg-white/45 hover:bg-white/80'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Foreground */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5 pt-3 sm:pt-0">
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <UniversityLogo
            item={currentItem}
            size="md"
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 border-white/40 shadow-sm mt-0.5 sm:mt-0"
          />

          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F8C555]">
              {spotlightLabel}
            </p>

            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-display font-bold text-base sm:text-xl lg:text-[22px] text-white tracking-tight leading-snug line-clamp-2 sm:truncate">
                {officialName}
              </h3>
              {currentItem.isVerified && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3B82F6] text-white shrink-0 shadow-xs"
                  title="Verified Institution"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/90">
              <span className="inline-flex items-center gap-1.5 font-medium min-w-0">
                <CountryFlag
                  code={currentItem.countryCode}
                  country={currentItem.country}
                  className="w-4 h-[11px] rounded-[2px] ring-1 ring-white/30 overflow-hidden shrink-0"
                />
                <MapPin className="w-3 h-3 text-[#F8C555] shrink-0" aria-hidden="true" />
                <span className="truncate">{displayLocation}</span>
              </span>
              {currentItem.institutionType && (
                <>
                  <span aria-hidden="true" className="hidden sm:inline text-white/45">
                    ·
                  </span>
                  <span className="hidden sm:inline text-white/80 truncate">
                    {currentItem.institutionType}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compact CTA button */}
        <div className="shrink-0 flex items-center justify-end sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenDetails(currentItem)}
            aria-label={`Explore ${officialName} details`}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[38px] sm:min-h-[40px] rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#10132D] text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8C555]"
          >
            <span>Explore University</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5D35F5]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
