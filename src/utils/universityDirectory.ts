/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_COUNTRIES } from '../data/countries';
import { OpportunityItem } from '../data/opportunities';
import { User } from '../services/auth';

/**
 * Curated map of well-known verified institutions per country for the
 * Explore Universities Featured University Banner.
 *
 * Selection rule:
 * 1. Only selects institutions that already exist and have `isVerified === true`
 *    in the verified university catalog (never invents records).
 * 2. Prioritizes institutions with verified official crests (`logo.logoUrl`) and
 *    recognized degree-granting status (`category === 'university'`).
 * 3. Falls back deterministically to the highest-scoring verified institution in
 *    that country so all countries represented in the catalog are supported.
 */
const FLAGSHIP_INSTITUTION_IDS_BY_COUNTRY: Record<string, string> = {
  canada: 'mcgill-university-canada',
  'united states': 'harvard-university-usa',
  'united kingdom': 'oxford-rhodes-uk',
  australia: 'unimelb-australia',
  ghana: 'ug-legon-ghana',
  germany: 'tum-germany-daad',
  japan: 'u-tokyo-japan',
  'south africa': 'uct-south-africa',
  nigeria: 'unilag-nigeria',
  kenya: 'ku-kenya',
  india: 'iit-bombay-india',
  rwanda: 'univ-rwanda',
  france: 'sciences-po-france',
  netherlands: 'tu-delft-netherlands',
  switzerland: 'eth-zurich-switzerland',
  singapore: 'nus-singapore',
  china: 'tsinghua-university-china',
  'south korea': 'kaist-south-korea',
  argentina: 'universidad-de-buenos-aires-argentina',
  belgium: 'ku-leuven-belgium',
  egypt: 'american-university-in-cairo-egypt',
  'hong kong': 'university-of-hong-kong-hku',
  ireland: 'trinity-college-dublin-ireland',
  italy: 'politecnico-di-milano-italy',
  mexico: 'tecnologico-de-monterrey-mexico',
  'new zealand': 'university-of-auckland-new-zealand',
  qatar: 'georgetown-university-qatar',
  sweden: 'karolinska-institutet-sweden',
  turkey: 'koc-university-turkey',
  'united arab emirates': 'nyu-abu-dhabi-uae',
};

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  us: 'United States',
  usa: 'United States',
  'u.s.': 'United States',
  'u.s.a.': 'United States',
  america: 'United States',
  'united states of america': 'United States',
  uk: 'United Kingdom',
  gb: 'United Kingdom',
  'u.k.': 'United Kingdom',
  britain: 'United Kingdom',
  'great britain': 'United Kingdom',
  england: 'United Kingdom',
  uae: 'United Arab Emirates',
  'u.a.e.': 'United Arab Emirates',
  korea: 'South Korea',
  'republic of korea': 'South Korea',
};

/**
 * Resolve a student's saved country strictly from their profile/account data.
 * Never defaults to Ghana or any single country when none is saved.
 */
export function resolveStudentProfileCountry(user: User | null | undefined): string {
  if (!user) return '';
  const candidates = [
    user.profile?.countryOfResidence,
    user.country,
    user.profile?.nationality,
  ];

  for (const raw of candidates) {
    const val = (raw || '').trim();
    if (!val) continue;
    // Normalize nationality demonyms (e.g. "Ghanaian" -> "Ghana", "Canadian" -> "Canada")
    const matchedCountry = ALL_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === val.toLowerCase() ||
        c.nationality.toLowerCase() === val.toLowerCase() ||
        c.code.toLowerCase() === val.toLowerCase()
    );
    if (matchedCountry) {
      return matchedCountry.name;
    }
    const alias = COUNTRY_NAME_ALIASES[val.toLowerCase()];
    if (alias) return alias;
    return val;
  }

  return '';
}

export function normalizeCountryName(rawCountry: string): string {
  const cleaned = rawCountry.trim().toLowerCase();
  if (!cleaned) return '';
  if (COUNTRY_NAME_ALIASES[cleaned]) {
    return COUNTRY_NAME_ALIASES[cleaned];
  }
  const matched = ALL_COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === cleaned ||
      c.code.toLowerCase() === cleaned ||
      c.nationality.toLowerCase() === cleaned
  );
  return matched ? matched.name : rawCountry.trim();
}

export function doesOpportunityMatchCountry(
  item: OpportunityItem,
  targetCountry: string
): boolean {
  if (!item || !targetCountry) return false;
  const target = targetCountry.toLowerCase().trim();
  const normalizedTarget = normalizeCountryName(targetCountry).toLowerCase();
  const cName = (item.country || '').toLowerCase().trim();
  const cCode = (item.countryCode || '').toLowerCase().trim();

  if (
    cName === target ||
    cName === normalizedTarget ||
    (target.length >= 2 && cCode === target)
  ) {
    return true;
  }

  if (
    target.length >= 4 &&
    (cName.includes(target) ||
      target.includes(cName) ||
      cName.includes(normalizedTarget))
  ) {
    return true;
  }

  return false;
}

function hasAcceptableBranding(item: OpportunityItem): boolean {
  if (!item.isVerified) return false;
  const hasName = Boolean((item.officialName || item.institution || '').trim());
  const hasLogoOrMonogram = Boolean(
    item.logo?.logoUrl || (item.logo?.monogram && item.logo.monogram.trim().length > 0)
  );
  return hasName && hasLogoOrMonogram;
}

function scoreFeaturedCandidate(item: OpportunityItem): number {
  let score = 0;
  if (item.logo?.logoUrl) score += 100;
  if (item.category === 'university') score += 40;
  if (
    item.institutionType === 'Public University' ||
    item.institutionType === 'Technical University' ||
    item.institutionType === 'Private University'
  ) {
    score += 15;
  }
  if (item.verificationSource) score += 5;
  if (item.officialWebsite || item.sourceUrl) score += 5;
  return score;
}

/**
 * Selects ONE verified featured university for a given country from the existing catalog.
 * Returns null if no suitably verified & branded institution exists.
 */
export function selectFeaturedUniversityForCountry(
  opportunities: OpportunityItem[],
  countryName: string
): OpportunityItem | null {
  const normalizedCountry = normalizeCountryName(countryName);
  if (!normalizedCountry) return null;

  const countryRecords = opportunities.filter(
    (o) =>
      o &&
      o.isVerified &&
      doesOpportunityMatchCountry(o, normalizedCountry) &&
      hasAcceptableBranding(o)
  );

  if (countryRecords.length === 0) return null;

  const flagshipId =
    FLAGSHIP_INSTITUTION_IDS_BY_COUNTRY[normalizedCountry.toLowerCase()];
  if (flagshipId) {
    const flagship = countryRecords.find((r) => r.id === flagshipId);
    if (flagship) return flagship;
  }

  const sorted = [...countryRecords].sort((a, b) => {
    const diff = scoreFeaturedCandidate(b) - scoreFeaturedCandidate(a);
    if (diff !== 0) return diff;
    return (a.officialName || '').localeCompare(b.officialName || '');
  });

  return sorted[0] || null;
}

export interface ExploreBannerResolution {
  opportunity: OpportunityItem;
  mode: 'country' | 'university';
  countryLabel?: string;
}

const AMBIGUOUS_SEARCH_TERMS = new Set([
  'university',
  'universities',
  'college',
  'institute',
  'school',
  'academy',
  'public',
  'private',
  'technical',
  'international',
  'scholarship',
  'scholarships',
  'funding',
  'free',
  'waiver',
  'computer',
  'engineering',
  'medicine',
  'business',
  'science',
  'technology',
  'master',
  'bachelor',
  'phd',
]);

/**
 * Resolves whether to display a verified banner on Explore Universities:
 * - Selected country filter -> shows that country's featured verified university
 * - Search matching a country -> shows that country's featured verified university
 * - Search identifying a specific university -> shows that university's verified banner
 * - Default (no filter/search) or broad/ambiguous search -> null (no banner)
 */
export function resolveExploreBannerOpportunity(params: {
  opportunities: OpportunityItem[];
  filteredOpportunities: OpportunityItem[];
  selectedDestination: string;
  searchQuery: string;
  isScholarshipsTab: boolean;
}): ExploreBannerResolution | null {
  const {
    opportunities,
    filteredOpportunities,
    selectedDestination,
    searchQuery,
    isScholarshipsTab,
  } = params;

  if (isScholarshipsTab) return null;

  // 1. Explicit country destination selected
  if (
    selectedDestination &&
    !selectedDestination.toLowerCase().includes('all destination')
  ) {
    const featured = selectFeaturedUniversityForCountry(
      opportunities,
      selectedDestination
    );
    if (!featured) return null;
    return {
      opportunity: featured,
      mode: 'country',
      countryLabel: normalizeCountryName(selectedDestination),
    };
  }

  // 2. Search-based banner detection
  const q = searchQuery.trim().toLowerCase();
  if (!q || q.length < 2 || AMBIGUOUS_SEARCH_TERMS.has(q)) {
    return null;
  }

  // 2a. Check if search explicitly identifies a country represented in verified catalog
  const availableCountries = Array.from(
    new Set(
      opportunities
        .filter((o) => o && o.isVerified && o.country)
        .map((o) => o.country)
    )
  );

  const matchedCountry =
    COUNTRY_NAME_ALIASES[q] &&
    availableCountries.some(
      (c) => c.toLowerCase() === COUNTRY_NAME_ALIASES[q].toLowerCase()
    )
      ? COUNTRY_NAME_ALIASES[q]
      : availableCountries.find((c) => c.toLowerCase() === q);

  if (matchedCountry) {
    const featured = selectFeaturedUniversityForCountry(
      opportunities,
      matchedCountry
    );
    if (featured) {
      return {
        opportunity: featured,
        mode: 'country',
        countryLabel: matchedCountry,
      };
    }
  }

  // 2b. Check if search specifically identifies a single verified university
  const verifiedMatches = filteredOpportunities.filter(
    (o) => o && hasAcceptableBranding(o)
  );

  if (verifiedMatches.length === 1) {
    return {
      opportunity: verifiedMatches[0],
      mode: 'university',
    };
  }

  // Exact officialName or distinctive shortName match when query >= 4 chars
  if (q.length >= 4) {
    const exactMatch = verifiedMatches.find(
      (o) =>
        (o.officialName || '').toLowerCase() === q ||
        (o.shortName || '').toLowerCase() === q ||
        (o.shortName &&
          o.shortName.trim().length >= 4 &&
          q.includes(o.shortName.toLowerCase()))
    );
    if (exactMatch) {
      return {
        opportunity: exactMatch,
        mode: 'university',
      };
    }
  }

  return null;
}

const FLAGSHIP_PRIORITY_SET = new Set(
  Object.values(FLAGSHIP_INSTITUTION_IDS_BY_COUNTRY)
);

/**
 * Default "Most Relevant" sorting for Explore Universities & Scholarships:
 * - If student has a saved country, their country's verified institutions appear first
 *   (prioritizing institutions with verified crests & flagship status cleanly), followed by worldwide institutions.
 * - If student has no saved country, uses clean worldwide directory ordering
 *   across global verified institutions without hardcoding Ghana.
 */
export function sortRelevantExploreOpportunities(
  list: OpportunityItem[],
  studentCountry: string,
  selectedDestination: string
): OpportunityItem[] {
  const activeCountryFilter =
    selectedDestination &&
    !selectedDestination.toLowerCase().includes('all destination')
      ? normalizeCountryName(selectedDestination)
      : '';

  const priorityCountry = activeCountryFilter || normalizeCountryName(studentCountry);

  const rankItem = (item: OpportunityItem): number => {
    let score = 0;
    if (priorityCountry && doesOpportunityMatchCountry(item, priorityCountry)) {
      score += 1000;
    }
    if (FLAGSHIP_PRIORITY_SET.has(item.id)) {
      score += 200;
    }
    if (item.logo?.logoUrl) {
      score += 50;
    }
    if (item.category === 'university') {
      score += 10;
    }
    return score;
  };

  return [...list].sort((a, b) => {
    const scoreDiff = rankItem(b) - rankItem(a);
    if (scoreDiff !== 0) return scoreDiff;
    return (a.officialName || '').localeCompare(b.officialName || '');
  });
}
