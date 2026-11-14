/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { evaluateOpportunityDeadline, OpportunityItem } from '../data/opportunities';
import {
  ALL_REMINDER_INTERVALS,
  ActiveApplicationItem,
  DEFAULT_MATCHING_PREFERENCES,
  NotificationPreferences,
  ReminderIntervalDays,
  TargetListItem,
  User,
  normalizeNotificationPreferences,
} from './auth';
import {
  StudentNotificationCategory,
  StudentNotificationPriority,
  StudentNotificationRecord,
} from './firebase';

export type { StudentNotificationRecord, StudentNotificationCategory, StudentNotificationPriority };

export interface OpportunityCatalogBaseline {
  initializedAt: string;
  signatures: Record<string, string>;
}

export interface NotificationGenerationInput {
  user: User;
  opportunities: OpportunityItem[];
  existingNotifications: StudentNotificationRecord[];
  dismissedIds?: Set<string>;
  baseline?: OpportunityCatalogBaseline | null;
  now?: Date;
}

export interface NotificationGenerationOutput {
  newNotifications: StudentNotificationRecord[];
  nextBaseline: OpportunityCatalogBaseline;
  baselineWasSeeded: boolean;
}

const BASELINE_STORAGE_PREFIX = 'cc_notif_baseline_v1_';
const DISMISSED_STORAGE_PREFIX = 'cc_notif_dismissed_v1_';

function simpleStableHash(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function makeSafeNotificationId(prefix: string, ...parts: string[]): string {
  const raw = [prefix, ...parts].join('_');
  const sanitized = raw.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
  if (sanitized.length <= 120) return sanitized;
  return `${prefix}_${simpleStableHash(raw)}`.slice(0, 120);
}

export function computeDaysUntilUtcDate(dateStr?: string | null, now: Date = new Date()): number | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  let targetMidnightMs: number;
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]) - 1;
    const day = Number(ymdMatch[3]);
    targetMidnightMs = Date.UTC(year, month, day);
  } else {
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return null;
    targetMidnightMs = Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    );
  }

  if (Number.isNaN(targetMidnightMs)) return null;
  const todayMidnightMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((targetMidnightMs - todayMidnightMs) / 86_400_000);
}

export function getRequiredTasksForOpportunity(item: OpportunityItem): string[] {
  const rawDocs = item.admissionsRequirements?.documents?.length
    ? item.admissionsRequirements.documents
    : item.admissionsRequirements?.documentsRequired;
  const docs =
    rawDocs && rawDocs.length > 0
      ? rawDocs
      : ['Official Academic Transcripts', 'Identification / Passport', 'Personal Statement / Motivation Letter'];
  const uniqueDocs = Array.from(new Set(docs.map((d) => d.trim()).filter(Boolean)));
  const finalStep = 'Submit Official Online Application';
  if (!uniqueDocs.some((d) => d.toLowerCase().includes('submit official'))) {
    uniqueDocs.push(finalStep);
  }
  return uniqueDocs;
}

export function buildOpportunityRequirementSignature(item: OpportunityItem): string {
  const docs = getRequiredTasksForOpportunity(item).join('|');
  const payload = [
    item.deadlines?.deadlineDate || '',
    item.deadlines?.deadlineText || '',
    item.applicationFees?.status || item.applicationFee?.status || '',
    item.testWaiverRules?.status || item.testPolicy?.status || '',
    item.fundingDetails?.type || item.funding?.type || '',
    item.admissionsRequirements?.academic || '',
    item.admissionsRequirements?.language || '',
    docs,
  ].join('::');
  return simpleStableHash(payload);
}

export function buildBaselineFromCatalog(
  opportunities: OpportunityItem[],
  now: Date = new Date()
): OpportunityCatalogBaseline {
  const signatures: Record<string, string> = {};
  for (const opp of opportunities) {
    if (opp && opp.id && opp.isVerified && opp.linkStatus !== 'needs-review') {
      signatures[opp.id] = buildOpportunityRequirementSignature(opp);
    }
  }
  return {
    initializedAt: now.toISOString(),
    signatures,
  };
}

export function loadStoredCatalogBaseline(userId: string): OpportunityCatalogBaseline | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(`${BASELINE_STORAGE_PREFIX}${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.signatures === 'object') {
      return parsed as OpportunityCatalogBaseline;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredCatalogBaseline(userId: string, baseline: OpportunityCatalogBaseline): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined' || !userId) return;
  try {
    localStorage.setItem(`${BASELINE_STORAGE_PREFIX}${userId}`, JSON.stringify(baseline));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadDismissedNotificationIds(userId: string): Set<string> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined' || !userId) {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(`${DISMISSED_STORAGE_PREFIX}${userId}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((id): id is string => typeof id === 'string'));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

export function recordDismissedNotificationIds(userId: string, ids: string[]): Set<string> {
  const current = loadDismissedNotificationIds(userId);
  for (const id of ids) {
    if (id) current.add(id);
  }
  const bounded = Array.from(current).slice(-400);
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && userId) {
    try {
      localStorage.setItem(`${DISMISSED_STORAGE_PREFIX}${userId}`, JSON.stringify(bounded));
    } catch {
      // Ignore quota errors
    }
  }
  return new Set(bounded);
}

export function matchOpportunityToStudent(
  opp: OpportunityItem,
  user: User,
  prefs: NotificationPreferences,
  now: Date = new Date()
): { matched: boolean; reasons: string[]; score: number } {
  if (!opp.isVerified || opp.linkStatus === 'needs-review') {
    return { matched: false, reasons: [], score: 0 };
  }

  const evalDeadline = evaluateOpportunityDeadline(opp.deadlines, now);
  if (evalDeadline.isExpired) {
    return { matched: false, reasons: [], score: 0 };
  }

  const profile = user.profile;
  const matching = {
    ...DEFAULT_MATCHING_PREFERENCES,
    ...(prefs.matchingPreferences || {}),
  };
  const reasons: string[] = [];
  let score = 0;

  // 1. Nationality check (if enabled and set)
  if (matching.matchByNationality && profile?.nationality) {
    const nat = profile.nationality.toLowerCase();
    const regions = (opp.nationalityEligibility?.eligibleRegions || []).join(' ').toLowerCase();
    const natCat = (opp.nationalityEligibility?.category || '').toLowerCase();
    const isGlobal =
      natCat.includes('all international') ||
      natCat.includes('all nationalities') ||
      regions.includes('international') ||
      regions.includes('global');
    const directMatch =
      (nat.includes('ghana') && (natCat.includes('ghana') || natCat.includes('african') || regions.includes('ghana') || regions.includes('africa'))) ||
      regions.includes(nat);
    if (directMatch || isGlobal) {
      if (directMatch) {
        score += 20;
        reasons.push(`Eligible for ${profile.nationality} applicants`);
      }
    } else if (opp.nationalityEligibility?.eligibleRegions?.length) {
      return { matched: false, reasons: [], score: 0 };
    }
  }

  // 2. Destination match
  if (matching.matchByDestination) {
    const destinations = [
      ...(profile?.preferredDestinations || []),
      profile?.countryOfResidence || user.country || '',
    ]
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    const oppCountry = (opp.country || '').trim().toLowerCase();
    const oppCode = (opp.countryCode || '').trim().toLowerCase();
    const destHit = Boolean(oppCountry) && destinations.some(
      (d) =>
        oppCountry === d ||
        oppCountry.includes(d) ||
        d.includes(oppCountry) ||
        ((d === 'usa' || d === 'us' || d === 'united states') && oppCode === 'us') ||
        ((d === 'uk' || d === 'united kingdom') && oppCode === 'gb')
    );
    if (destHit) {
      score += 30;
      reasons.push(`Located in ${opp.country}`);
    }
  }

  // 3. Degree level match
  if (matching.matchByDegree) {
    const targetDeg = (profile?.intendedDegree || user.degreeLevel || '').toLowerCase();
    const levels = (opp.degreeLevels || []).map((l) => l.toLowerCase());
    if (targetDeg && levels.length > 0) {
      const isUg = targetDeg.includes('undergrad') || targetDeg.includes('bachelor');
      const isPg = targetDeg.includes('master') || targetDeg.includes('postgrad');
      const isPhd = targetDeg.includes('phd') || targetDeg.includes('doctor');
      const degHit = levels.some(
        (l) =>
          (isUg && (l.includes('undergrad') || l.includes('bachelor'))) ||
          (isPg && (l.includes('master') || l.includes('postgrad'))) ||
          (isPhd && (l.includes('phd') || l.includes('doctor')))
      );
      if (degHit) {
        score += 20;
        reasons.push(`Offers ${profile?.intendedDegree || user.degreeLevel}`);
      }
    }
  }

  // 4. Field of study match
  if (matching.matchByFieldOfStudy) {
    const targetFields = [
      ...(profile?.preferredFieldsOfStudy || []),
      profile?.fieldOfStudy || user.studyField || '',
    ]
      .map((f) => f.trim().toLowerCase())
      .filter(Boolean);
    const oppFields = (opp.studyFields || []).map((f) => f.toLowerCase());
    const fieldHit = targetFields.some((tf) =>
      oppFields.some((of) => {
        const words = tf.split(/[\s&,/-]+/).filter((w) => w.length >= 4);
        return of.includes(tf) || tf.includes(of) || words.some((w) => of.includes(w));
      })
    );
    if (fieldHit) {
      score += 20;
      reasons.push('Matches your academic field');
    }
  }

  // 5. Funding preference
  if (matching.matchByFunding) {
    const fundingPref = (profile?.fundingTypePreference || profile?.fundingPreference || '').toLowerCase();
    const fType = (opp.fundingDetails?.type || opp.funding?.type || '').toLowerCase();
    if (
      (fundingPref.includes('fully') && (fType.includes('fully') || fType.includes('100% need-met'))) ||
      (fundingPref.includes('partial') && (fType.includes('partial') || fType.includes('merit') || fType.includes('waiver')))
    ) {
      score += 15;
      reasons.push(opp.fundingDetails?.type || opp.funding?.type || 'Funding available');
    }
  }

  // 6. Fee waiver / $0 application fee
  if (matching.matchByFeeWaiver) {
    const feeStatus = (opp.applicationFees?.status || opp.applicationFee?.status || '').toLowerCase();
    if (feeStatus.includes('free') || feeStatus.includes('$0') || feeStatus.includes('waiver')) {
      score += 10;
      reasons.push(opp.applicationFees?.status || opp.applicationFee?.status || 'Fee Waiver');
    }
  }

  // 7. Test-optional / SAT-free
  if (matching.matchByTestOptional) {
    const testPref = (profile?.testPreference || '').toLowerCase();
    const testStatus = (opp.testWaiverRules?.status || opp.testPolicy?.status || '').toLowerCase();
    if (
      testStatus.includes('test-free') ||
      testStatus.includes('test-optional') ||
      (testPref.includes('no sat') && !testStatus.includes('required'))
    ) {
      score += 10;
      reasons.push(opp.testWaiverRules?.status || opp.testPolicy?.status || 'Test-Optional');
    }
  }

  return {
    matched: score >= 30 && reasons.length > 0,
    reasons,
    score,
  };
}

function selectActiveReminderInterval(
  daysRemaining: number,
  enabledIntervals: ReminderIntervalDays[]
): ReminderIntervalDays | null {
  if (daysRemaining < 0 || enabledIntervals.length === 0) return null;
  const sortedAsc = [...enabledIntervals].sort((a, b) => a - b);
  for (const interval of sortedAsc) {
    if (daysRemaining <= interval) {
      return interval;
    }
  }
  return null;
}

export function generateSmartNotifications(
  input: NotificationGenerationInput
): NotificationGenerationOutput {
  const { user, opportunities, existingNotifications, now = new Date() } = input;
  const dismissedIds = new Set<string>([
    ...(input.dismissedIds || []),
    ...(Array.isArray(user.profile?.dismissedNotificationIds)
      ? user.profile!.dismissedNotificationIds
      : []),
  ]);
  const prefs = normalizeNotificationPreferences(user.profile?.notificationPreferences);

  const nextBaseline = buildBaselineFromCatalog(opportunities, now);
  const baselineWasSeeded = !input.baseline;

  // If in-app notifications are globally disabled by the user, return no new notifications
  if (prefs.inAppEnabled === false) {
    return {
      newNotifications: [],
      nextBaseline,
      baselineWasSeeded,
    };
  }

  const existingIds = new Set(existingNotifications.map((n) => n.id));
  const newNotifications: StudentNotificationRecord[] = [];
  const createdIdsThisRun = new Set<string>();
  const nowIso = now.toISOString();

  const canAdd = (id: string) =>
    !existingIds.has(id) && !dismissedIds.has(id) && !createdIdsThisRun.has(id);

  const pushNotification = (record: StudentNotificationRecord) => {
    if (!canAdd(record.id)) return;
    if (prefs.nonUrgentUpdates === false && record.priority === 'low') return;
    createdIdsThisRun.add(record.id);
    newNotifications.push(record);
  };

  const oppMap = new Map<string, OpportunityItem>();
  for (const opp of opportunities) {
    if (opp && opp.id) {
      oppMap.set(opp.id, opp);
    }
  }

  const savedSet = new Set(user.savedOpportunities || []);
  const targetMap: Record<string, TargetListItem> = user.targetList || {};
  const activeMap: Record<string, ActiveApplicationItem> = user.activeApplications || {};

  // =========================================================================
  // 1. AUTOMATIC APPLICATION DEADLINE REMINDERS (30, 14, 7, 3, 1, 0 days)
  // =========================================================================
  if (prefs.deadlineAlerts) {
    const enabledIntervals =
      prefs.reminderIntervals !== undefined
        ? prefs.reminderIntervals
        : ALL_REMINDER_INTERVALS;

    // Prioritize Active Applications -> Target List -> Saved Opportunities
    const trackedEntries: Array<{
      opp: OpportunityItem;
      relationshipLabel: 'Active Application' | 'Target List' | 'Saved Opportunity';
      actionTab: StudentNotificationRecord['actionTab'];
      actionSection: StudentNotificationRecord['actionSection'];
    }> = [];

    const seenTrackedOppIds = new Set<string>();

    Object.values(activeMap).forEach((app) => {
      if (app.stage === 'accepted' || seenTrackedOppIds.has(app.opportunityId)) return;
      const opp = oppMap.get(app.opportunityId);
      if (opp) {
        seenTrackedOppIds.add(opp.id);
        trackedEntries.push({
          opp,
          relationshipLabel: 'Active Application',
          actionTab: 'overview',
          actionSection: 'applications',
        });
      }
    });

    Object.values(targetMap).forEach((target) => {
      if (seenTrackedOppIds.has(target.opportunityId)) return;
      const opp = oppMap.get(target.opportunityId);
      if (opp) {
        seenTrackedOppIds.add(opp.id);
        trackedEntries.push({
          opp,
          relationshipLabel: 'Target List',
          actionTab: 'tracker',
          actionSection: 'home',
        });
      }
    });

    savedSet.forEach((oppId) => {
      if (seenTrackedOppIds.has(oppId)) return;
      const opp = oppMap.get(oppId);
      if (opp) {
        seenTrackedOppIds.add(opp.id);
        trackedEntries.push({
          opp,
          relationshipLabel: 'Saved Opportunity',
          actionTab: 'overview',
          actionSection: 'saved',
        });
      }
    });

    for (const entry of trackedEntries) {
      const { opp } = entry;
      if (!opp.isVerified || opp.linkStatus === 'needs-review') continue;
      if (!opp.deadlines?.deadlineDate) continue;

      const evalDeadline = evaluateOpportunityDeadline(opp.deadlines, now);
      if (evalDeadline.isExpired || evalDeadline.status === 'rolling' || opp.deadlines.isRolling) continue;

      const daysRemaining = computeDaysUntilUtcDate(opp.deadlines.deadlineDate, now);
      if (daysRemaining === null || daysRemaining < 0) continue;

      const matchedInterval = selectActiveReminderInterval(daysRemaining, enabledIntervals);
      if (matchedInterval === null) continue;

      const safeCycle = opp.deadlines.deadlineDate.replace(/[^0-9-]/g, '').slice(0, 16) || 'cycle';
      const notifId = makeSafeNotificationId('dl', opp.id, safeCycle, `${matchedInterval}d`);

      const priority: StudentNotificationPriority =
        daysRemaining <= 3 ? 'urgent' : daysRemaining <= 14 ? 'high' : 'normal';

      const timingHeadline =
        daysRemaining === 0
          ? `Deadline Today: ${opp.officialName}`
          : daysRemaining === 1
          ? `1 Day Left: ${opp.officialName}`
          : `${daysRemaining} Days Left: ${opp.officialName}`;

      pushNotification({
        id: notifId,
        userId: user.id,
        category: 'deadline',
        priority,
        title: timingHeadline.slice(0, 180),
        message: `${entry.relationshipLabel} · Official verified deadline (${evalDeadline.displayText}) is ${
          daysRemaining === 0
            ? 'today'
            : `in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
        }. Review checklist and submit directly on the official portal.`.slice(0, 600),
        read: false,
        dedupeKey: notifId,
        opportunityId: opp.id,
        opportunityName: opp.officialName,
        actionTab: entry.actionTab,
        actionSection: entry.actionSection,
        deadlineDate: opp.deadlines.deadlineDate,
        daysRemaining,
        sourceVerified: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    }
  }

  // =========================================================================
  // 2. APPLICATION PROGRESS, FOLLOW-UP & REQUIREMENT REMINDERS
  // =========================================================================
  const requirementAlertedOppIds = new Set<string>();

  if (prefs.trackerReminders) {
    Object.values(activeMap).forEach((app) => {
      const opp = oppMap.get(app.opportunityId);
      if (!opp) return;

      // 2a. Incomplete checklist tasks for active 'preparing' applications
      if (app.stage === 'preparing') {
        const requiredTasks = getRequiredTasksForOpportunity(opp);
        const completedSet = new Set(app.completedTasks || []);
        const incompleteCount = requiredTasks.filter((t) => !completedSet.has(t)).length;

        if (incompleteCount > 0) {
          const daysRemaining = opp.deadlines?.deadlineDate
            ? computeDaysUntilUtcDate(opp.deadlines.deadlineDate, now)
            : null;
          const isApproaching = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 14;
          const notifId = makeSafeNotificationId('app_tasks', opp.id, `${incompleteCount}left`);

          pushNotification({
            id: notifId,
            userId: user.id,
            category: 'application',
            priority: isApproaching ? 'high' : 'normal',
            title: `${incompleteCount} Application Task${incompleteCount === 1 ? '' : 's'} Remaining: ${opp.officialName}`.slice(
              0,
              180
            ),
            message: isApproaching
              ? `Your active application has ${incompleteCount} incomplete checklist item${
                  incompleteCount === 1 ? '' : 's'
                } with ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left before the deadline.`
              : `Your active application is in Preparing stage with ${incompleteCount} remaining checklist item${
                  incompleteCount === 1 ? '' : 's'
                } (${requiredTasks.length - incompleteCount}/${requiredTasks.length} completed).`,
            read: false,
            dedupeKey: notifId,
            opportunityId: opp.id,
            opportunityName: opp.officialName,
            actionTab: 'overview',
            actionSection: 'applications',
            ...(opp.deadlines?.deadlineDate ? { deadlineDate: opp.deadlines.deadlineDate } : {}),
            ...(typeof daysRemaining === 'number' ? { daysRemaining } : {}),
            sourceVerified: Boolean(opp.isVerified),
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        }
      }

      // 2b. Student-defined followUpDate reminder (approaching or today)
      if (app.followUpDate) {
        const daysToFollowUp = computeDaysUntilUtcDate(app.followUpDate, now);
        if (daysToFollowUp !== null && daysToFollowUp <= 2 && daysToFollowUp >= -3) {
          const safeDate = app.followUpDate.replace(/[^0-9-]/g, '').slice(0, 16);
          const notifId = makeSafeNotificationId('app_fu', opp.id, safeDate);
          const timingText =
            daysToFollowUp < 0
              ? `Follow-Up Overdue (${Math.abs(daysToFollowUp)}d)`
              : daysToFollowUp === 0
              ? 'Scheduled Follow-Up Today'
              : `Follow-Up in ${daysToFollowUp} Day${daysToFollowUp === 1 ? '' : 's'}`;

          pushNotification({
            id: notifId,
            userId: user.id,
            category: 'application',
            priority: daysToFollowUp <= 0 ? 'urgent' : 'high',
            title: `${timingText}: ${opp.officialName}`.slice(0, 180),
            message: `Reminder for your scheduled follow-up date (${app.followUpDate}) on your ${app.stage} application for ${opp.officialName}.`,
            read: false,
            dedupeKey: notifId,
            opportunityId: opp.id,
            opportunityName: opp.officialName,
            actionTab: 'overview',
            actionSection: 'applications',
            deadlineDate: app.followUpDate,
            daysRemaining: daysToFollowUp,
            sourceVerified: Boolean(opp.isVerified),
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        }
      }

      // 2c. Stored requirement snapshot diff check (strictly factual, never invents decisions)
      const currentSig = buildOpportunityRequirementSignature(opp);
      if (app.requirementSnapshot && app.requirementSnapshot !== currentSig) {
        const notifId = makeSafeNotificationId('app_req', opp.id, currentSig);
        requirementAlertedOppIds.add(opp.id);
        pushNotification({
          id: notifId,
          userId: user.id,
          category: 'requirement',
          priority: 'high',
          title: `Requirement Details Updated: ${opp.officialName}`.slice(0, 180),
          message: `Verified deadline, fee waiver, or admissions requirement details for your active application changed since your last snapshot. Open the opportunity details to verify.`,
          read: false,
          dedupeKey: notifId,
          opportunityId: opp.id,
          opportunityName: opp.officialName,
          actionTab: 'overview',
          actionSection: 'applications',
          sourceVerified: Boolean(opp.isVerified),
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
    });
  }

  // =========================================================================
  // 3. SAVED & TRACKED REQUIREMENT UPDATES + PERSONALIZED OPPORTUNITY ALERTS
  // =========================================================================
  if (input.baseline) {
    const prevSigs = input.baseline.signatures || {};

    // 3a. Requirement updates on saved/target opportunities compared to baseline
    if (prefs.savedUpdatesAlerts) {
      const trackedSavedOrTarget = new Set<string>([...savedSet, ...Object.keys(targetMap)]);
      trackedSavedOrTarget.forEach((oppId) => {
        if (requirementAlertedOppIds.has(oppId)) return;
        const opp = oppMap.get(oppId);
        if (!opp || !opp.isVerified || opp.linkStatus === 'needs-review') return;
        const prevSig = prevSigs[opp.id];
        const currSig = nextBaseline.signatures[opp.id];
        if (prevSig && currSig && prevSig !== currSig) {
          const notifId = makeSafeNotificationId('sav_req', opp.id, currSig);
          requirementAlertedOppIds.add(opp.id);
          pushNotification({
            id: notifId,
            userId: user.id,
            category: 'requirement',
            priority: 'high',
            title: `Saved Opportunity Updated: ${opp.officialName}`.slice(0, 180),
            message: `Verified admissions requirements, fee status, or deadlines for ${opp.officialName} have been updated. Review before applying.`,
            read: false,
            dedupeKey: notifId,
            opportunityId: opp.id,
            opportunityName: opp.officialName,
            actionTab: 'overview',
            actionSection: 'saved',
            sourceVerified: true,
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        }
      });
    }

    // 3b. Newly added or updated verified opportunities matching student's profile
    if (prefs.admissionUpdates) {
      const candidates: Array<{
        opp: OpportunityItem;
        isNew: boolean;
        reasons: string[];
        score: number;
        sig: string;
      }> = [];

      for (const opp of opportunities) {
        if (!opp || !opp.id || !opp.isVerified || opp.linkStatus === 'needs-review') continue;
        const prevSig = prevSigs[opp.id];
        const currSig = nextBaseline.signatures[opp.id];
        if (!currSig) continue;

        const isNew = !prevSig;
        const isUpdated = Boolean(prevSig && prevSig !== currSig);
        if (!isNew && !isUpdated) continue;
        if (requirementAlertedOppIds.has(opp.id)) continue;

        const match = matchOpportunityToStudent(opp, user, prefs, now);
        if (match.matched) {
          candidates.push({
            opp,
            isNew,
            reasons: match.reasons,
            score: match.score,
            sig: currSig,
          });
        }
      }

      // Cap personalized match batch to top 8 highest-scoring alerts so inbox stays crisp
      candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .forEach((cand) => {
          const { opp, isNew, reasons, sig } = cand;
          const notifId = makeSafeNotificationId('opp_match', opp.id, sig);
          const fType = opp.fundingDetails?.type || opp.funding?.type || 'Verified Program';
          const feeStatus = opp.applicationFees?.status || opp.applicationFee?.status || '';
          const matchSummary = reasons.slice(0, 3).join(' · ');

          pushNotification({
            id: notifId,
            userId: user.id,
            category: 'opportunity',
            priority: opp.category === 'scholarship' || fType === 'Fully Funded' ? 'high' : 'normal',
            title: `${isNew ? 'New Match' : 'Updated Match'}: ${opp.officialName}`.slice(0, 180),
            message: `${matchSummary}. ${fType}${feeStatus ? ` · ${feeStatus}` : ''}.`.slice(0, 600),
            read: false,
            dedupeKey: notifId,
            opportunityId: opp.id,
            opportunityName: opp.officialName,
            actionTab: opp.category === 'scholarship' ? 'scholarships' : 'universities',
            actionSection: 'home',
            ...(opp.deadlines?.deadlineDate ? { deadlineDate: opp.deadlines.deadlineDate } : {}),
            sourceVerified: true,
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        });
    }
  }

  return {
    newNotifications,
    nextBaseline,
    baselineWasSeeded,
  };
}

export function formatRelativeNotificationTime(isoDate: string, now: Date = new Date()): string {
  const parsed = new Date(isoDate);
  if (isNaN(parsed.getTime())) return 'Recently';
  const diffSec = Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 1000));
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
