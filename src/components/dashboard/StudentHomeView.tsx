/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Compass,
  FileText,
  Globe,
  GraduationCap,
  MoreHorizontal,
  Search,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { ActiveApplicationItem, User } from '../../services/auth';
import { StudentNotificationRecord } from '../../services/firebase';
import { UniversityLogo } from '../ui/UniversityLogo';
import { DashboardNavTab } from './DashboardSidebar';
import campusHistoricQuadImg from '../../assets/images/campus_historic_quad_1794926300997.jpg';
import campusModernGlassImg from '../../assets/images/campus_modern_glass_1794926301324.jpg';
import campusGrandLibraryImg from '../../assets/images/campus_grand_library_1794926301715.jpg';
import campusWalkwayTreesImg from '../../assets/images/campus_walkway_trees_1794926302413.jpg';
import campusCourtyardArchImg from '../../assets/images/campus_courtyard_arch_1794926303162.jpg';

interface CampusBannerSlide {
  src: string;
  alt: string;
}

const CAMPUS_BANNER_SLIDES: CampusBannerSlide[] = [
  {
    src: campusHistoricQuadImg,
    alt: 'Historic limestone university campus quad and sunlit green lawns',
  },
  {
    src: campusModernGlassImg,
    alt: 'Modern university innovation building with glass facade and reflecting plaza',
  },
  {
    src: campusGrandLibraryImg,
    alt: 'Classical sandstone university library portico overlooking courtyard gardens',
  },
  {
    src: campusWalkwayTreesImg,
    alt: 'Tree-lined collegiate walkway flanked by warm brick academic halls',
  },
  {
    src: campusCourtyardArchImg,
    alt: 'Sunlit stone university archway framing a campus clocktower courtyard',
  },
];

const BANNER_SLIDE_INTERVAL_MS = 5000;

export interface StudentHomeViewProps {
  activeUser: User | null;
  opportunities: OpportunityItem[];
  recommendedOpportunities: OpportunityItem[];
  savedOpportunities: Set<string>;
  activeApplications: Record<string, ActiveApplicationItem>;
  notifications: StudentNotificationRecord[];
  onNavigate: (tab: DashboardNavTab, section?: 'home' | 'saved' | 'applications') => void;
  onSelectDestination: (country: string) => void;
  onOpenOpportunity: (item: OpportunityItem) => void;
  onToggleSave: (opportunityId: string, title: string) => void;
  onOpenNotificationSettings: () => void;
}

interface DestinationItem {
  label: string;
  queryValue: string;
  flag: string;
}

const DEFAULT_POPULAR_DESTINATIONS: DestinationItem[] = [
  { label: 'Canada', queryValue: 'Canada', flag: '🇨🇦' },
  { label: 'Australia', queryValue: 'Australia', flag: '🇦🇺' },
  { label: 'Germany', queryValue: 'Germany', flag: '🇩🇪' },
  { label: 'UK', queryValue: 'United Kingdom', flag: '🇬🇧' },
  { label: 'USA', queryValue: 'United States', flag: '🇺🇸' },
];

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  activeUser,
  opportunities,
  recommendedOpportunities,
  savedOpportunities,
  activeApplications,
  notifications,
  onNavigate,
  onSelectDestination,
  onOpenOpportunity,
  onToggleSave,
  onOpenNotificationSettings,
}) => {
  const [isDestinationsModalOpen, setIsDestinationsModalOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [failedSlideIndices, setFailedSlideIndices] = useState<Set<number>>(() => new Set());

  // Derived student profile values strictly from real saved user record
  const firstName = useMemo(() => {
    const raw = activeUser?.fullName?.trim();
    if (raw) return raw.split(/\s+/)[0];
    if (activeUser?.email) return activeUser.email.split('@')[0];
    return 'Scholar';
  }, [activeUser?.fullName, activeUser?.email]);

  const userField =
    activeUser?.profile?.fieldOfStudy?.trim() ||
    activeUser?.studyField?.trim() ||
    '';
  const userTargetDegree =
    activeUser?.profile?.intendedDegree?.trim() ||
    activeUser?.degreeLevel?.trim() ||
    '';
  const userResidence =
    activeUser?.profile?.countryOfResidence?.trim() ||
    activeUser?.country?.trim() ||
    '';
  const userGradYear = activeUser?.profile?.graduationYear?.trim() || '';

  const journeySummaryText = useMemo(() => {
    const parts: string[] = [];
    if (userTargetDegree && userField) {
      parts.push(`Pursuing ${userTargetDegree} in ${userField}`);
    } else if (userTargetDegree) {
      parts.push(`Target degree: ${userTargetDegree}`);
    } else if (userField) {
      parts.push(`Study focus: ${userField}`);
    }
    if (userGradYear) {
      parts.push(`Class of ${userGradYear}`);
    }
    if (userResidence) {
      parts.push(`Based in ${userResidence}`);
    }
    return parts.join(' · ');
  }, [userTargetDegree, userField, userGradYear, userResidence]);

  // Verified catalog counts
  const verifiedOpportunities = useMemo(
    () => opportunities.filter((item) => item && item.isVerified),
    [opportunities]
  );

  const scholarshipsCount = useMemo(
    () =>
      verifiedOpportunities.filter((item) => {
        const fType = item.funding?.type || item.fundingDetails?.type || '';
        return (
          item.category === 'scholarship' ||
          fType === 'Fully Funded' ||
          fType === '100% Need-Met'
        );
      }).length,
    [verifiedOpportunities]
  );

  // Compact verified showcase (up to 3 items, preferring personalized profile matches)
  const featuredDiscoveryItems = useMemo(() => {
    const seen = new Set<string>();
    const combined: OpportunityItem[] = [];
    for (const item of recommendedOpportunities) {
      if (item && item.isVerified && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
      if (combined.length >= 3) break;
    }
    if (combined.length < 3) {
      for (const item of verifiedOpportunities) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          combined.push(item);
        }
        if (combined.length >= 3) break;
      }
    }
    return combined;
  }, [recommendedOpportunities, verifiedOpportunities]);

  // Build available countries map dynamically from verified catalog
  const availableCountries = useMemo(() => {
    const map = new Map<string, { name: string; flag: string; count: number }>();
    for (const item of verifiedOpportunities) {
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
  }, [verifiedOpportunities]);

  // Personalize top 5 Popular Destinations from student profile (countryOfResidence + preferredDestinations)
  const visibleDestinations = useMemo(() => {
    const preferred = [
      ...(activeUser?.profile?.preferredDestinations || []),
      ...(userResidence ? [userResidence] : []),
    ]
      .map((c) => c.trim())
      .filter(Boolean);

    const countryLookup = new Map(
      availableCountries.map((c) => [c.name.toLowerCase(), c])
    );

    const picked: DestinationItem[] = [];
    const usedQueries = new Set<string>();

    for (const countryName of preferred) {
      const normalized = countryName.toLowerCase();
      const catalogMatch = countryLookup.get(normalized);
      const defaultMatch = DEFAULT_POPULAR_DESTINATIONS.find(
        (d) =>
          d.queryValue.toLowerCase() === normalized ||
          d.label.toLowerCase() === normalized
      );

      if (catalogMatch && !usedQueries.has(catalogMatch.name.toLowerCase())) {
        usedQueries.add(catalogMatch.name.toLowerCase());
        picked.push({
          label:
            catalogMatch.name === 'United Kingdom'
              ? 'UK'
              : catalogMatch.name === 'United States'
              ? 'USA'
              : catalogMatch.name,
          queryValue: catalogMatch.name,
          flag: catalogMatch.flag,
        });
      } else if (defaultMatch && !usedQueries.has(defaultMatch.queryValue.toLowerCase())) {
        usedQueries.add(defaultMatch.queryValue.toLowerCase());
        picked.push(defaultMatch);
      }
      if (picked.length >= 5) break;
    }

    for (const def of DEFAULT_POPULAR_DESTINATIONS) {
      if (picked.length >= 5) break;
      if (!usedQueries.has(def.queryValue.toLowerCase())) {
        usedQueries.add(def.queryValue.toLowerCase());
        picked.push(def);
      }
    }

    return picked;
  }, [activeUser?.profile?.preferredDestinations, userResidence, availableCountries]);

  const filteredCountries = useMemo(() => {
    const q = countryFilter.trim().toLowerCase();
    if (!q) return availableCountries;
    return availableCountries.filter((c) => c.name.toLowerCase().includes(q));
  }, [availableCountries, countryFilter]);

  // Real In-App Opportunity Alert state (honest — never falsely claims push/email are active)
  const alertState = useMemo(() => {
    const prefs = activeUser?.profile?.notificationPreferences;
    const inAppMaster = prefs?.inAppEnabled !== false;
    const anyCategoryOn =
      prefs?.deadlineAlerts !== false ||
      prefs?.savedUpdatesAlerts !== false ||
      prefs?.trackerReminders !== false ||
      prefs?.admissionUpdates !== false;
    const inAppActive = inAppMaster && anyCategoryOn;
    const unread = notifications.filter((n) => !n.read);
    const latestUnread = unread[0] || notifications[0] || null;
    return {
      inAppActive,
      unreadCount: unread.length,
      totalCount: notifications.length,
      latestHeadline: latestUnread?.title || null,
    };
  }, [activeUser?.profile?.notificationPreferences, notifications]);

  const activeAppsCount = useMemo(
    () => Object.keys(activeApplications || {}).length,
    [activeApplications]
  );

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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleMotionChange();
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Preload upcoming campus slides so crossfades never flicker or blank
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextIndex = (activeSlideIndex + 1) % CAMPUS_BANNER_SLIDES.length;
    const indicesToPreload = [nextIndex, (nextIndex + 1) % CAMPUS_BANNER_SLIDES.length];
    indicesToPreload.forEach((idx) => {
      const preloader = new window.Image();
      preloader.src = CAMPUS_BANNER_SLIDES[idx].src;
    });
  }, [activeSlideIndex]);

  useEffect(() => {
    if (isBannerHovered || isDocumentHidden || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % CAMPUS_BANNER_SLIDES.length);
    }, BANNER_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isBannerHovered, isDocumentHidden, prefersReducedMotion]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
      {/* A. Compact Welcome Section */}
      <section
        aria-label="Student Home Welcome"
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#451EC4] via-[#5F31EC] to-[#7448FA] text-white px-4 py-4 sm:px-6 sm:py-5 shadow-[0_8px_22px_-8px_rgba(91,46,230,0.45)]"
      >
        {/* Background Campus Photography Slideshow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {CAMPUS_BANNER_SLIDES.map((slide, index) => {
            const isActive = index === activeSlideIndex && !failedSlideIndices.has(index);
            return (
              <img
                key={slide.src}
                src={slide.src}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => {
                  setFailedSlideIndices((prev) => {
                    if (prev.has(index)) return prev;
                    const next = new Set(prev);
                    next.add(index);
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

          {/* Consistent purple gradient scrim & gold accents for contrast and brand harmony */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3A17B0]/95 via-[#5329E2]/80 sm:via-[#5329E2]/74 to-[#6D41F5]/46" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3816AA]/45 via-transparent to-[#451EC4]/25" />
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#F8C555]/15 blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#F8C555]/85 via-[#F8C555]/40 to-transparent" />
        </div>

        {/* Subtle non-intrusive slide indicators anchored in top-right corner */}
        <div
          className="absolute top-3.5 right-4 sm:top-4 sm:right-6 z-20 flex items-center gap-1"
          role="group"
          aria-label="Campus banner slideshow controls"
        >
          {CAMPUS_BANNER_SLIDES.map((slide, index) => {
            const isActive = index === activeSlideIndex;
            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                aria-label={`Show campus photo ${index + 1} of ${CAMPUS_BANNER_SLIDES.length}`}
                aria-current={isActive ? 'true' : undefined}
                className="p-0.5 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8C555]"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-4 bg-[#F8C555]'
                      : 'w-1.5 bg-white/45 hover:bg-white/75'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#F8C555]">
              Student Home
            </p>
            <h2 className="font-display font-bold text-lg sm:text-2xl tracking-tight leading-snug text-white">
              Welcome, {firstName}
            </h2>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-2xl">
              {journeySummaryText
                ? `${journeySummaryText}. Ready to continue discovering verified global programs and funding.`
                : 'Add your preferred study field, degree level, and destination in Profile to personalize your discovery feed.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!journeySummaryText && (
              <button
                type="button"
                onClick={() => onNavigate('profile', 'home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap backdrop-blur-[2px]"
              >
                <UserRound className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Set Study Focus</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('universities', 'home')}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#15152F] text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-[#5D35F5]" aria-hidden="true" />
              <span>Explore Directory</span>
            </button>
          </div>
        </div>
      </section>

      {/* B. Compact Discovery Section */}
      <section aria-label="Discover universities and scholarships" className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('universities', 'home')}
            className="rounded-2xl bg-[#F4F1FF] hover:bg-[#ECE6FF] border border-[#E5DCFF] px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-all duration-150 hover:shadow-sm active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-white text-[#5B2EE6] flex items-center justify-center shadow-2xs shrink-0">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#10132D] truncate">
                  Explore Universities
                </h3>
                <p className="text-xs text-[#475569] truncate tabular-nums">
                  {verifiedOpportunities.length} verified institutions &amp; programs
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#5D35F5] shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('scholarships', 'home')}
            className="rounded-2xl bg-[#FFF8EA] hover:bg-[#FFF1D4] border border-[#F8E4BA] px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-all duration-150 hover:shadow-sm active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-white text-[#D98B14] flex items-center justify-center shadow-2xs shrink-0">
                <Award className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#10132D] truncate">
                  Scholarships &amp; Funding
                </h3>
                <p className="text-xs text-[#475569] truncate tabular-nums">
                  {scholarshipsCount} funded &amp; need-met aid options
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#B7720B] shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Compact Verified Opportunity Picks */}
        {featuredDiscoveryItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6846F5] shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-bold font-display text-[#10132D]">
                  {recommendedOpportunities.length > 0
                    ? 'Picked for Your Profile'
                    : 'Featured Verified Opportunities'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('universities', 'home')}
                className="text-xs font-bold text-[#5D35F5] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
              {featuredDiscoveryItems.map((item) => {
                const displayName = item.officialName || item.institution;
                const isSaved = savedOpportunities.has(item.id);
                const fundingLabel =
                  item.fundingDetails?.type ||
                  item.funding?.type ||
                  (item.category === 'scholarship' ? 'Scholarship' : 'Admissions');
                const deadlineInfo = evaluateOpportunityDeadline(item.deadlines);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenOpportunity(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenOpportunity(item);
                      }
                    }}
                    className="bg-white rounded-2xl border border-[#E6EAF2] p-3 flex items-center justify-between gap-2.5 hover:border-[#C4B5FD] hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UniversityLogo item={item} size="md" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs sm:text-[13px] font-bold text-[#10132D] truncate">
                            {displayName}
                          </h4>
                          {item.isVerified && (
                            <BadgeCheck
                              className="w-3.5 h-3.5 text-[#2563EB] shrink-0"
                              aria-label="Verified"
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate">
                          <span aria-hidden="true">{item.countryFlag} </span>
                          {item.country} · {fundingLabel}
                        </p>
                        <p className="text-[10.5px] text-slate-500 truncate">
                          {deadlineInfo.displayText}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id, displayName);
                      }}
                      aria-label={isSaved ? `Remove ${displayName} from saved` : `Save ${displayName}`}
                      aria-pressed={isSaved}
                      className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                        isSaved
                          ? 'bg-[#F0EDFF] text-[#6846F5]'
                          : 'text-slate-400 hover:text-[#6846F5] hover:bg-slate-100'
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-[#6846F5]" aria-hidden="true" />
                      ) : (
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* C. Popular Destinations (Personalized from Student Profile) */}
      <section aria-label="Popular Study Destinations" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6846F5] to-[#4324B5] text-white flex items-center justify-center shrink-0">
              <Globe className="w-3 h-3" aria-hidden="true" />
            </span>
            <h3 className="font-display font-bold text-sm sm:text-base text-[#10132D] tracking-tight">
              Popular Destinations
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsDestinationsModalOpen(true)}
            className="min-h-[36px] px-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#5D35F5] hover:text-[#4B22B8] cursor-pointer rounded-lg"
          >
            <span>All Countries</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 min-[375px]:grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {visibleDestinations.map((dest) => (
            <button
              key={dest.queryValue}
              type="button"
              onClick={() => onSelectDestination(dest.queryValue)}
              className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E6EAF2] hover:border-[#C4B5FD] px-2.5 py-2.5 min-h-[56px] flex items-center justify-center gap-2 shadow-2xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <span className="text-lg leading-none shrink-0" aria-hidden="true">
                {dest.flag}
              </span>
              <span className="text-xs font-semibold text-[#10132D] truncate">
                {dest.label}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsDestinationsModalOpen(true)}
            className="rounded-xl bg-white hover:bg-[#FAF9FF] border border-[#E6EAF2] hover:border-[#C4B5FD] px-2.5 py-2.5 min-h-[56px] flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
          >
            <MoreHorizontal className="w-4 h-4 text-[#5D35F5] shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold text-[#10132D]">More</span>
          </button>
        </div>
      </section>

      {/* D. Opportunity Alerts (Connected to real In-App Notification Preferences & State) */}
      <section aria-label="Opportunity Alerts">
        <div className="rounded-2xl bg-[#F3F0FF] border border-[#E5DCFF] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-white text-[#5B2EE6] flex items-center justify-center shadow-2xs shrink-0">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold font-display text-[#10132D] leading-tight">
                {alertState.inAppActive
                  ? 'In-App Opportunity Alerts Active'
                  : 'Opportunity Alerts Paused'}
              </h3>
              <p className="text-xs text-[#475569] leading-snug mt-0.5 truncate">
                {alertState.unreadCount > 0 && alertState.latestHeadline
                  ? `${alertState.unreadCount} unread alert${alertState.unreadCount === 1 ? '' : 's'}: ${alertState.latestHeadline}`
                  : alertState.inAppActive
                  ? 'Receive verified deadline reminders and admissions updates inside your portal bell.'
                  : 'Enable in-app deadline & admissions alerts in Notification Settings to stay updated.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNotificationSettings}
            className="shrink-0 min-h-[40px] px-4 py-2 rounded-full bg-[#5B2EE6] hover:bg-[#4B21CC] active:scale-[0.98] text-white text-xs font-bold shadow-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Bell className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{alertState.inAppActive ? 'Manage Alerts' : 'Turn On Alerts'}</span>
          </button>
        </div>
      </section>

      {/* E. Useful Student Shortcuts */}
      <section aria-label="Student Shortcuts" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => onNavigate('resources', 'home')}
          className="bg-white rounded-2xl border border-[#E6EAF2] hover:border-[#C4B5FD] p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#F4F0FF] text-[#6846F5] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#10132D] truncate">
                Resources
              </h4>
              <p className="text-[11px] text-[#64748B] truncate">
                SOP, CV, visa &amp; test prep guides
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('overview', 'saved')}
          className="bg-white rounded-2xl border border-[#E6EAF2] hover:border-[#C4B5FD] p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#FDF0F6] text-[#C43767] flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#10132D] truncate">
                Saved Opportunities
              </h4>
              <p className="text-[11px] text-[#64748B] truncate tabular-nums">
                {savedOpportunities.size} bookmarked item{savedOpportunities.size === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('overview', 'applications')}
          className="bg-white rounded-2xl border border-[#E6EAF2] hover:border-[#C4B5FD] p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#EEF5FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#10132D] truncate">
                Track Applications
              </h4>
              <p className="text-[11px] text-[#64748B] truncate tabular-nums">
                {activeAppsCount} active application{activeAppsCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        </button>
      </section>

      {/* Searchable All Verified Destinations Modal */}
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
          <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-base text-[#10132D]">
                  All Study Destinations
                </h3>
                <p className="text-xs text-[#64748B]">
                  {availableCountries.length} countries · {verifiedOpportunities.length} verified records
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDestinationsModalOpen(false)}
                aria-label="Close destinations"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#10132D] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
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

            <div className="flex-1 overflow-y-auto px-4 pb-5 space-y-1.5">
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
