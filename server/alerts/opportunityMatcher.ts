/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  authenticOpportunities,
  evaluateOpportunityDeadline,
  OpportunityItem,
} from '../../src/data/opportunities';
import { AlertPreferenceId } from './types';

export interface MatchedOpportunityCard {
  id: string;
  officialName: string;
  title: string;
  country: string;
  city: string;
  category: string;
  officialUrl: string;
  fundingBadge: string;
  feeBadge: string;
  testBadge: string;
  deadlineDisplay: string;
  deadlineDate?: string | null;
  daysUntilDeadline?: number;
  summary: string;
  matchReasons: string[];
}

export interface MatcherSubscriberContext {
  preferences: AlertPreferenceId[];
  preferredDestinations?: string[];
  intendedDegree?: string;
  fieldOfStudy?: string;
}

export function isOpportunityAlertEligible(
  item: OpportunityItem,
  now: Date = new Date()
): boolean {
  if (!item || item.isVerified !== true) return false;
  if (item.linkStatus === 'needs-review') return false;
  const portalUrl = (item.officialWebsite || item.officialUrl || item.sourceUrl || '').trim();
  if (!portalUrl || !/^https?:\/\//i.test(portalUrl)) return false;

  const deadlineEval = evaluateOpportunityDeadline(item.deadlines, now);
  if (deadlineEval.isExpired) return false;

  return true;
}

export function parseUpcomingDaysRemaining(
  deadlineDate?: string | null,
  now: Date = new Date()
): number | null {
  if (!deadlineDate) return null;
  const trimmed = deadlineDate.trim();
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T23:59:59Z` : trimmed;
  const target = new Date(normalized);
  if (isNaN(target.getTime())) return null;

  const diffMs = target.getTime() - now.getTime();
  if (diffMs < 0) return null;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function classifyOpportunityReasons(
  item: OpportunityItem,
  prefs: Set<AlertPreferenceId>,
  now: Date
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const category = (item.category || '').toLowerCase();
  const fundingType = (item.fundingDetails?.type || '').toLowerCase();
  const fundingDetails = (item.fundingDetails?.details || '').toLowerCase();
  const feeStatus = (item.applicationFees?.status || '').toLowerCase();
  const testStatus = (item.testWaiverRules?.status || '').toLowerCase();
  const degrees = (item.degreeLevels || []).map((d) => d.toLowerCase());
  const nationality = (item.nationalityEligibility?.category || '').toLowerCase();
  const daysLeft = parseUpcomingDaysRemaining(item.deadlines?.deadlineDate, now);

  const includeAll = prefs.has('all');

  if (includeAll || prefs.has('admissions')) {
    if (category === 'university' || category === 'admissions' || item.deadlines?.cycleStatus === 'open') {
      score += 4;
      reasons.push('Verified Admissions');
    }
  }

  if (includeAll || prefs.has('fully-funded')) {
    if (
      category === 'scholarship' ||
      fundingType.includes('fully funded') ||
      fundingType.includes('100%') ||
      fundingDetails.includes('full tuition')
    ) {
      score += 8;
      reasons.push('Fully Funded / Full Aid');
    }
  }

  if (includeAll || prefs.has('partial-aid')) {
    if (
      fundingType.includes('partial') ||
      fundingType.includes('merit') ||
      fundingType.includes('tuition waiver') ||
      fundingType.includes('government aid')
    ) {
      score += 6;
      reasons.push('Scholarship & Financial Aid');
    }
  }

  if (includeAll || prefs.has('fee-waiver')) {
    if (feeStatus.includes('free') || feeStatus.includes('$0') || feeStatus.includes('waiver')) {
      score += 8;
      reasons.push(item.applicationFees?.status || 'Fee Waiver');
    }
  }

  if (includeAll || prefs.has('sat-optional')) {
    if (
      testStatus.includes('test-free') ||
      testStatus.includes('test-optional') ||
      testStatus.includes('waec') ||
      testStatus.includes('waiver')
    ) {
      score += 7;
      reasons.push(item.testWaiverRules?.status || 'Test-Optional');
    }
  }

  if (includeAll || prefs.has('graduate')) {
    if (
      degrees.some(
        (d) => d.includes('master') || d.includes('postgraduate') || d.includes('phd') || d.includes('doctorate')
      )
    ) {
      score += 6;
      reasons.push('Postgraduate Eligible');
    }
  }

  if (includeAll || prefs.has('international')) {
    if (
      nationality.includes('international') ||
      nationality.includes('all') ||
      nationality.includes('african') ||
      nationality.includes('ghanaian')
    ) {
      score += 5;
      reasons.push('International Study');
    }
  }

  if ((includeAll || prefs.has('deadlines')) && daysLeft !== null && daysLeft <= 30) {
    score += 9;
    reasons.push(`Deadline in ${daysLeft}d`);
  }

  return { score, reasons };
}

function toMatchedCard(
  item: OpportunityItem,
  reasons: string[],
  now: Date
): MatchedOpportunityCard {
  const deadlineEval = evaluateOpportunityDeadline(item.deadlines, now);
  const daysLeft = parseUpcomingDaysRemaining(item.deadlines?.deadlineDate, now);
  return {
    id: item.id,
    officialName: item.officialName,
    title: item.title || item.officialName,
    country: item.country,
    city: item.city,
    category: item.category,
    officialUrl: item.officialWebsite || item.officialUrl || item.sourceUrl,
    fundingBadge: item.fundingDetails?.type || 'Institutional Aid',
    feeBadge: item.applicationFees?.status || 'Standard Fee',
    testBadge: item.testWaiverRules?.status || 'Standard Testing',
    deadlineDisplay: deadlineEval.displayText || item.deadlines?.deadlineText || 'Check Official Portal',
    deadlineDate: item.deadlines?.deadlineDate || null,
    daysUntilDeadline: daysLeft ?? undefined,
    summary: item.summary || item.officialRuleSummary || '',
    matchReasons: Array.from(new Set(reasons)),
  };
}

export function findPersonalizedOpportunities(
  ctx: MatcherSubscriberContext,
  options: { limit?: number; now?: Date; catalog?: OpportunityItem[] } = {}
): MatchedOpportunityCard[] {
  const now = options.now ?? new Date();
  const limit = options.limit ?? 6;
  const catalog = options.catalog ?? authenticOpportunities;
  const prefs = new Set<AlertPreferenceId>(
    ctx.preferences && ctx.preferences.length > 0 ? ctx.preferences : ['all']
  );

  const preferredCountries = (ctx.preferredDestinations || []).map((c) => c.trim().toLowerCase()).filter(Boolean);
  const intendedDegree = (ctx.intendedDegree || '').trim().toLowerCase();
  const fieldOfStudy = (ctx.fieldOfStudy || '').trim().toLowerCase();

  const scored: Array<{ card: MatchedOpportunityCard; score: number }> = [];

  for (const item of catalog) {
    if (!isOpportunityAlertEligible(item, now)) continue;

    const { score: prefScore, reasons } = classifyOpportunityReasons(item, prefs, now);
    if (prefScore === 0) continue;

    let totalScore = prefScore;
    const countryLower = (item.country || '').toLowerCase();
    const degreesLower = (item.degreeLevels || []).map((d) => d.toLowerCase());
    const fieldsLower = (item.studyFields || []).map((f) => f.toLowerCase());

    if (
      preferredCountries.length > 0 &&
      preferredCountries.some((pc) => countryLower.includes(pc) || pc.includes(countryLower))
    ) {
      totalScore += 10;
      reasons.unshift(`${item.country} Match`);
    }

    if (intendedDegree && degreesLower.some((d) => d.includes(intendedDegree) || intendedDegree.includes(d))) {
      totalScore += 5;
    }

    if (fieldOfStudy && fieldsLower.some((f) => f.includes(fieldOfStudy) || fieldOfStudy.includes(f))) {
      totalScore += 5;
    }

    scored.push({
      card: toMatchedCard(item, reasons, now),
      score: totalScore,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.card);
}

export function findUpcomingDeadlineMatches(
  ctx: MatcherSubscriberContext,
  options: { windowDays?: number; limit?: number; now?: Date; catalog?: OpportunityItem[] } = {}
): MatchedOpportunityCard[] {
  const now = options.now ?? new Date();
  const windowDays = options.windowDays ?? 21;
  const limit = options.limit ?? 5;
  const catalog = options.catalog ?? authenticOpportunities;
  const prefs = new Set<AlertPreferenceId>(
    ctx.preferences && ctx.preferences.length > 0 ? ctx.preferences : ['all']
  );

  const preferredCountries = (ctx.preferredDestinations || []).map((c) => c.trim().toLowerCase()).filter(Boolean);
  const candidates: Array<{ card: MatchedOpportunityCard; daysLeft: number; prefScore: number }> = [];

  for (const item of catalog) {
    if (!isOpportunityAlertEligible(item, now)) continue;

    const daysLeft = parseUpcomingDaysRemaining(item.deadlines?.deadlineDate, now);
    if (daysLeft === null || daysLeft < 0 || daysLeft > windowDays) continue;

    const { score: prefScore, reasons } = classifyOpportunityReasons(item, prefs, now);
    // For deadline alerts, ensure either preference matches or subscriber explicitly opted into deadlines/all
    if (prefScore === 0 && !prefs.has('deadlines') && !prefs.has('all')) continue;

    let adjustedScore = prefScore;
    const countryLower = (item.country || '').toLowerCase();
    if (
      preferredCountries.length > 0 &&
      preferredCountries.some((pc) => countryLower.includes(pc) || pc.includes(countryLower))
    ) {
      adjustedScore += 10;
      reasons.unshift(`${item.country} Match`);
    }

    const urgencyLabel =
      daysLeft <= 2
        ? 'Closing Within 48 Hours'
        : daysLeft <= 7
        ? `Closing in ${daysLeft} Days`
        : `Deadline in ${daysLeft} Days`;

    candidates.push({
      card: toMatchedCard(item, [urgencyLabel, ...reasons], now),
      daysLeft,
      prefScore: adjustedScore,
    });
  }

  // Sort soonest deadlines first, breaking ties by preference relevance score
  candidates.sort((a, b) => {
    if (a.daysLeft !== b.daysLeft) return a.daysLeft - b.daysLeft;
    return b.prefScore - a.prefScore;
  });

  return candidates.slice(0, limit).map((c) => c.card);
}
