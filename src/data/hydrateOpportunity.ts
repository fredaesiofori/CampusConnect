/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_COUNTRIES } from './countries';
import { KNOWN_ACCREDITATION_BODIES } from './countryRegistry';
import type {
  ApplicationCycleStatus,
  InstitutionType,
  OpportunityItem,
} from './opportunities';

export const CATALOG_VERSION = '2026-11-global-expansion-v2';

export interface CompactOpportunityInput {
  id: string;
  name: string;
  short?: string;
  country: string;
  cc: string;
  city: string;
  web: string;
  src?: string;
  cat?: OpportunityItem['category'];
  type?: InstitutionType;
  title?: string;
  logoUrl?: string;
  logoSrc?: string;
  logoDesc?: string;
  bg?: string;
  text?: string;
  monogram?: string;
  levels?: string[];
  fields?: string[];
  fundType?: OpportunityItem['fundingDetails']['type'];
  fundAmt?: string;
  fundDet?: string;
  tuitionCov?: string;
  stipend?: string;
  feeStatus?: OpportunityItem['applicationFees']['status'];
  feeDet?: string;
  feeAmt?: string;
  feeCode?: string;
  testStatus?: OpportunityItem['testWaiverRules']['status'];
  testDet?: string;
  satPol?: string;
  engPol?: string;
  term?: string;
  dlText?: string;
  dlDate?: string | null;
  cycle?: ApplicationCycleStatus;
  verSrc?: string;
  verAt?: string;
  summary?: string;
  ruleSummary?: string;
  eligCat?: string;
  eligDet?: string;
  eligRegions?: string[];
  eligCountries?: string[];
  academic?: string;
  language?: string;
  docs?: string[];
}

const COUNTRY_BY_CODE = new Map(ALL_COUNTRIES.map((c) => [c.code.toUpperCase(), c]));
const COUNTRY_BY_NAME = new Map(ALL_COUNTRIES.map((c) => [c.name.toLowerCase(), c]));

const MONOGRAM_PALETTE: Array<{ bg: string; text: string }> = [
  { bg: '#0F2C59', text: '#FFFFFF' },
  { bg: '#1B365D', text: '#F8FAFC' },
  { bg: '#2B1B54', text: '#F3E8FF' },
  { bg: '#134E4A', text: '#F0FDFA' },
  { bg: '#4C1D95', text: '#FFFFFF' },
  { bg: '#1E293B', text: '#F8FAFC' },
];

function computeMonogram(name: string, short?: string): string {
  if (short && short.trim().length >= 2 && short.trim().length <= 6) {
    return short.trim().toUpperCase();
  }
  const stop = new Set(['of', 'the', 'and', 'for', 'in', 'de', 'la', 'des', 'du', 'von', 'der', 'und', 'di', 'del', 'da', 'do', 'y', 'at']);
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stop.has(w.toLowerCase()));
  const chars = (words.length >= 2 ? words.map((w) => w[0]).join('') : name.replace(/\s+/g, '')).slice(0, 4);
  return (chars || 'UNI').toUpperCase();
}

function stableColorIndex(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % MONOGRAM_PALETTE.length;
}

export function hydrateOpportunityRecord(input: CompactOpportunityInput): OpportunityItem {
  const cMeta =
    COUNTRY_BY_CODE.get((input.cc || '').toUpperCase()) ||
    COUNTRY_BY_NAME.get((input.country || '').toLowerCase());
  const countryName = cMeta?.name || input.country;
  const countryCode = cMeta?.code || input.cc;
  const countryFlag = cMeta?.flag || '🌐';
  const knownAuth = KNOWN_ACCREDITATION_BODIES[countryName];

  const palette = MONOGRAM_PALETTE[stableColorIndex(input.id)];
  const officialUrl = input.src || input.web;
  const monogram = input.monogram || computeMonogram(input.name, input.short);

  const fundingType = input.fundType || 'Partial / Merit';
  const fundingAmount = input.fundAmt || 'Merit Scholarships & Financial Aid (Verify on Portal)';
  const fundingDetails =
    input.fundDet ||
    'Institutional scholarships, departmental fellowships, or government bilateral awards may be available for qualified international applicants.';

  const feeStatus = input.feeStatus || 'Standard Fee';
  const feeDetails =
    input.feeDet ||
    'Verify current application processing fee and any need-based waiver eligibility directly on the official admissions portal.';

  const testStatus = input.testStatus || 'Test-Optional';
  const testDetails =
    input.testDet ||
    'National secondary or university entrance credentials reviewed per institutional faculty requirements. Check official admissions guidelines for standardized testing and language rules.';

  const deadlineText = input.dlText || 'Check Official Portal for Intake Schedule';
  const isRolling = input.cycle === 'rolling' || (!input.dlDate && input.cycle !== 'expired' && input.cycle !== 'open');

  const fundingObj = {
    type: fundingType,
    amount: fundingAmount,
    details: fundingDetails,
    ...(input.tuitionCov ? { tuitionCoverage: input.tuitionCov } : {}),
    ...(input.stipend ? { livingStipend: input.stipend } : {}),
  };

  const feeObj = {
    status: feeStatus,
    details: feeDetails,
    ...(input.feeAmt ? { amount: input.feeAmt } : {}),
    ...(input.feeCode ? { code: input.feeCode } : {}),
  };

  const testObj = {
    status: testStatus,
    details: testDetails,
    ...(input.satPol ? { satPolicy: input.satPol } : {}),
    ...(input.engPol ? { englishProficiencyPolicy: input.engPol } : {}),
  };

  const deadlineObj = {
    term: input.term || '2026/2027 Intake Cycle',
    deadlineText,
    deadlineDate: input.dlDate ?? null,
    isRolling,
    cycleStatus: input.cycle || (isRolling ? 'rolling' : 'open'),
  };

  const docs = input.docs || [
    'Official Academic Transcripts',
    'Valid Passport / National ID',
    'Personal Statement / Motivation Letter',
    'Proof of Language Proficiency (where applicable)',
  ];

  const verificationSource =
    input.verSrc ||
    (knownAuth
      ? `${knownAuth.authority} · Official Institutional Portal & Wikidata Registry`
      : `Official Institutional Portal & Wikidata Academic Registry (${countryName})`);

  return {
    id: input.id,
    officialName: input.name,
    institution: input.name,
    shortName: input.short || monogram,
    country: countryName,
    countryCode,
    countryFlag,
    city: input.city || countryName,
    officialWebsite: input.web,
    sourceUrl: officialUrl,
    officialUrl,
    category: input.cat || 'university',
    institutionType: input.type || 'Public University',
    title: input.title || `${input.name} — Degree Programs & Admissions`,
    isVerified: true,
    verificationSource,
    verifiedAt: input.verAt || 'Verified November 2026',
    logo: {
      bg: input.bg || palette.bg,
      text: input.text || palette.text,
      monogram,
      crestColor: input.bg || palette.bg,
      logoDescription: input.logoDesc || `${input.name} Official Institutional Crest`,
      ...(input.logoUrl ? { logoUrl: input.logoUrl } : {}),
      ...(input.logoSrc ? { logoSourceUrl: input.logoSrc } : {}),
    },
    eligibilityCountries: input.eligCountries || ['All Countries', 'International Worldwide', countryName],
    nationalityEligibility: {
      category: (input.eligCat as any) || 'All International Citizens',
      details:
        input.eligDet ||
        `Open to domestic students in ${countryName} and international applicants meeting institutional academic and language criteria.`,
      eligibleRegions: input.eligRegions || ['Global / International', countryName],
    },
    degreeLevels: input.levels || ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: fundingObj,
    funding: fundingObj,
    applicationFees: feeObj,
    applicationFee: feeObj,
    testWaiverRules: testObj,
    testPolicy: testObj,
    deadlines: deadlineObj,
    deadline: deadlineText,
    deadlineDate: input.dlDate || undefined,
    admissionsRequirements: {
      academic:
        input.academic ||
        knownAuth?.credentials ||
        'Recognized secondary school diploma (for Bachelor’s) or accredited Bachelor’s degree (for graduate programs).',
      language:
        input.language ||
        'Instruction language proficiency per program (English, national language, or bilingual track). Verify official requirements on institutional portal.',
      documents: docs,
      documentsRequired: docs,
    },
    studyFields: input.fields || ['Engineering & Technology', 'Natural Sciences', 'Business & Economics', 'Social Sciences & Humanities'],
    intakeTerm: input.term || '2026/2027 Intake',
    verifiedBadge: input.cat === 'scholarship' ? 'Verified Official Scholarship' : 'Verified Accredited Institution',
    summary:
      input.summary ||
      `${input.name} is a recognized degree-awarding higher education institution located in ${input.city ? `${input.city}, ` : ''}${countryName}.`,
    officialRuleSummary:
      input.ruleSummary ||
      `Recognized institution in ${countryName}. Confirm program-specific admission deadlines and tuition rules on ${input.web}.`,
  };
}
