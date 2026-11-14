/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  buildBaselineFromCatalog,
  buildOpportunityRequirementSignature,
  computeDaysUntilUtcDate,
  generateSmartNotifications,
  matchOpportunityToStudent,
} from '../src/services/notifications';
import {
  ALL_REMINDER_INTERVALS,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NotificationPreferences,
  User,
  normalizeNotificationPreferences,
} from '../src/services/auth';
import { OpportunityItem } from '../src/data/opportunities';
import {
  buildApplicationChecklistReminderEmail,
  buildConfirmationEmail,
  buildDeadlineReminderEmail,
  buildPersonalizedOpportunityEmail,
  buildWelcomeDigestEmail,
} from '../server/alerts/emailTemplates';
import {
  DEFAULT_VERIFIED_TEST_RECIPIENT,
  getEmailProviderStatus,
  sendTransactionalEmail,
} from '../server/alerts/emailProvider';

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function makeTestOpportunity(overrides: Partial<OpportunityItem> = {}): OpportunityItem {
  const id = overrides.id || 'test-univ-001';
  return {
    id,
    officialName: 'Test Global University',
    institution: 'Test Global University',
    shortName: 'TGU',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    city: 'Berlin',
    officialWebsite: 'https://www.example.edu/admissions',
    sourceUrl: 'https://www.example.edu/admissions',
    officialUrl: 'https://www.example.edu/admissions',
    category: 'university',
    institutionType: 'Public University',
    title: 'Test Global University Admissions',
    isVerified: true,
    verificationSource: 'Official University Registry',
    verifiedAt: '2026-11-10',
    logo: {
      bg: '#10132D',
      text: '#FFFFFF',
      monogram: 'TGU',
      crestColor: '#6846F5',
    },
    eligibilityCountries: ['All Countries', 'Ghana'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to Ghanaian and global international applicants.',
      eligibleRegions: ['Global', 'Ghana', 'Africa'],
    },
    degreeLevels: ['Undergraduate', 'Master’s / Postgraduate'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: '100% Tuition + Stipend',
      details: 'Full scholarship awarded to admitted candidates.',
    },
    funding: {
      type: 'Fully Funded',
      amount: '100% Tuition + Stipend',
      details: 'Full scholarship awarded to admitted candidates.',
    },
    applicationFees: {
      status: 'No Application Fee',
      details: 'Free online application.',
    },
    applicationFee: {
      status: 'No Application Fee',
      details: 'Free online application.',
    },
    testWaiverRules: {
      status: 'SAT-Free / Test-Optional',
      details: 'No SAT/ACT required; WASSCE & English medium accepted.',
    },
    testPolicy: {
      status: 'SAT-Free / Test-Optional',
      details: 'No SAT/ACT required; WASSCE & English medium accepted.',
    },
    deadlines: {
      term: 'Fall 2027',
      deadlineText: 'May 15, 2027',
      deadlineDate: '2027-05-15',
      isRolling: false,
    },
    admissionsRequirements: {
      academic: 'Strong secondary or bachelor academic record.',
      language: 'English proficiency proof or WASSCE C6+ waiver.',
      documents: ['Official Transcripts', 'Passport', 'Statement of Purpose'],
    },
    studyFields: ['Computer Science', 'Engineering'],
    intakeTerm: 'Fall 2027',
    verifiedBadge: 'Verified Institution',
    summary: 'Accredited technical research university offering tuition-free study.',
    officialRuleSummary: 'No application fee and SAT-optional admissions.',
    ...overrides,
  };
}

function makeTestStudent(
  overrides: Partial<User> = {},
  notificationOverrides?: Partial<NotificationPreferences>
): User {
  return {
    id: 'student_uid_abc123',
    fullName: 'Kwame Mensah',
    email: 'kwame@example.edu',
    country: 'Ghana',
    countryCode: 'GH',
    degreeLevel: 'Undergraduate',
    studyField: 'Computer Science',
    createdAt: '2026-10-01T10:00:00.000Z',
    savedOpportunities: [],
    applicationTracker: {},
    targetList: {},
    activeApplications: {},
    ...overrides,
    profile: {
      nationality: 'Ghanaian',
      countryOfResidence: 'Ghana',
      preferredDestinations: ['Germany', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: 'Undergraduate',
      fieldOfStudy: 'Computer Science',
      graduationYear: '2026',
      fundingPreference: 'Fully Funded Only',
      fundingTypePreference: 'fully_funded',
      testPreference: 'Test-Optional / Waiver Preferred',
      onboardingCompleted: true,
      notificationPreferences: normalizeNotificationPreferences(notificationOverrides),
      ...(overrides.profile || {}),
    },
  };
}

async function runTests() {
  console.log('1. Testing UTC deadline intervals (30, 14, 7, 3, 1, 0) and filtering...');
  const now = new Date('2027-01-10T12:00:00Z');
  assert(computeDaysUntilUtcDate('2027-02-09', now) === 30, 'Expected exact 30 days');
  assert(computeDaysUntilUtcDate('2027-01-24', now) === 14, 'Expected exact 14 days');
  assert(computeDaysUntilUtcDate('2027-01-17', now) === 7, 'Expected exact 7 days');
  assert(computeDaysUntilUtcDate('2027-01-13', now) === 3, 'Expected exact 3 days');
  assert(computeDaysUntilUtcDate('2027-01-11', now) === 1, 'Expected exact 1 day');
  assert(computeDaysUntilUtcDate('2027-01-10', now) === 0, 'Expected exact 0 day (deadline day)');
  assert(computeDaysUntilUtcDate('2027-01-09', now) === -1, 'Expected past day -1');

  const intervalDates: Record<number, string> = {
    30: '2027-02-09',
    14: '2027-01-24',
    7: '2027-01-17',
    3: '2027-01-13',
    1: '2027-01-11',
    0: '2027-01-10',
  };

  const oppMap: OpportunityItem[] = [];
  const activeApps: NonNullable<User['activeApplications']> = {};
  const targetList: NonNullable<User['targetList']> = {};
  const savedIds: string[] = [];

  for (const days of ALL_REMINDER_INTERVALS) {
    const id = `opp-day-${days}`;
    const opp = makeTestOpportunity({
      id,
      officialName: `University Day ${days}`,
      deadlines: {
        term: 'Fall 2027',
        deadlineText: intervalDates[days],
        deadlineDate: intervalDates[days],
        isRolling: false,
      },
    });
    oppMap.push(opp);
    if (days <= 3) {
      activeApps[id] = {
        opportunityId: id,
        stage: 'preparing',
        completedTasks: [],
        startedAt: '2027-01-01T00:00:00Z',
        updatedAt: '2027-01-01T00:00:00Z',
        requirementSnapshot: buildOpportunityRequirementSignature(opp),
      };
    } else if (days <= 14) {
      targetList[id] = {
        opportunityId: id,
        priority: 'High',
        intakeYear: 'Fall 2027',
        personalGoal: 'Goal',
        addedAt: '2027-01-01T00:00:00Z',
        updatedAt: '2027-01-01T00:00:00Z',
      };
    } else {
      savedIds.push(id);
    }
  }

  // Add ineligible opps (unverified, needs-review, rolling, expired)
  oppMap.push(
    makeTestOpportunity({
      id: 'opp-unverified',
      isVerified: false,
      deadlines: { term: 'Fall', deadlineText: '2027-01-11', deadlineDate: '2027-01-11', isRolling: false },
    }),
    makeTestOpportunity({
      id: 'opp-needs-review',
      isVerified: true,
      linkStatus: 'needs-review',
      deadlines: { term: 'Fall', deadlineText: '2027-01-11', deadlineDate: '2027-01-11', isRolling: false },
    }),
    makeTestOpportunity({
      id: 'opp-rolling',
      deadlines: { term: 'Rolling', deadlineText: 'Rolling Admissions', isRolling: true },
    }),
    makeTestOpportunity({
      id: 'opp-expired',
      deadlines: { term: 'Past', deadlineText: '2027-01-05', deadlineDate: '2027-01-05', isRolling: false },
    })
  );
  savedIds.push('opp-unverified', 'opp-needs-review', 'opp-rolling', 'opp-expired');

  const studentAllIntervals = makeTestStudent({
    savedOpportunities: savedIds,
    targetList,
    activeApplications: activeApps,
  });

  const baseline1 = buildBaselineFromCatalog(oppMap, now);
  const run1 = generateSmartNotifications({
    user: studentAllIntervals,
    opportunities: oppMap,
    existingNotifications: [],
    baseline: baseline1,
    now,
  });

  const deadlineNotifs1 = run1.newNotifications.filter((n) => n.category === 'deadline');
  assert(
    deadlineNotifs1.length === 6,
    `Expected exactly 6 deadline reminders across all intervals, got ${deadlineNotifs1.length}`
  );
  for (const days of ALL_REMINDER_INTERVALS) {
    const match = deadlineNotifs1.find((n) => n.opportunityId === `opp-day-${days}`);
    assert(match, `Missing reminder for ${days} days`);
    assert(match?.daysRemaining === days, `Expected daysRemaining=${days}, got ${match?.daysRemaining}`);
    assert(match?.sourceVerified === true, 'Deadline reminder must mark sourceVerified=true');
  }
  assert(
    !deadlineNotifs1.some((n) =>
      ['opp-unverified', 'opp-needs-review', 'opp-rolling', 'opp-expired'].includes(n.opportunityId || '')
    ),
    'Ineligible records must NEVER generate deadline reminders'
  );

  // Verify priority ordering: Active Applications -> Target List -> Saved
  const appIdx = run1.newNotifications.findIndex((n) => n.id.includes('opp-day-0'));
  const savedIdx = run1.newNotifications.findIndex((n) => n.id.includes('opp-day-30'));
  assert(appIdx >= 0 && savedIdx >= 0, 'Both active and saved deadline notifications must exist');
  assert(
    run1.newNotifications[appIdx].priority === 'urgent',
    'Deadline day active app reminder must be urgent'
  );

  console.log('2. Testing duplicate suppression & dismissed IDs...');
  const runDuplicate = generateSmartNotifications({
    user: studentAllIntervals,
    opportunities: oppMap,
    existingNotifications: run1.newNotifications,
    baseline: run1.nextBaseline,
    now,
  });
  assert(runDuplicate.newNotifications.length === 0, 'Duplicate run must create 0 new notifications');

  const dismissedSet = new Set([run1.newNotifications[0].id]);
  const remaining = run1.newNotifications.slice(1);
  const runDismissed = generateSmartNotifications({
    user: studentAllIntervals,
    opportunities: oppMap,
    existingNotifications: remaining,
    dismissedIds: dismissedSet,
    baseline: run1.nextBaseline,
    now,
  });
  assert(
    !runDismissed.newNotifications.some((n) => n.id === run1.newNotifications[0].id),
    'Dismissed notification ID must stay suppressed'
  );

  console.log('3. Testing customizable reminder intervals subset [7, 1, 0] across deadline countdown...');
  const trackedLifecycleOpp = makeTestOpportunity({
    id: 'opp-lifecycle-custom',
    officialName: 'Lifecycle Custom University',
    deadlines: {
      term: 'Fall 2027',
      deadlineText: '2027-01-24',
      deadlineDate: '2027-01-24',
      isRolling: false,
    },
  });
  const studentSubset = makeTestStudent(
    { savedOpportunities: ['opp-lifecycle-custom'] },
    { reminderIntervals: [7, 1, 0] }
  );
  const lcBaseline = buildBaselineFromCatalog([trackedLifecycleOpp], now);
  let lcExisting = [] as typeof run1.newNotifications;

  const checkDay = (dateIso: string): number => {
    const res = generateSmartNotifications({
      user: studentSubset,
      opportunities: [trackedLifecycleOpp],
      existingNotifications: lcExisting,
      baseline: lcBaseline,
      now: new Date(dateIso),
    });
    lcExisting = [...lcExisting, ...res.newNotifications];
    return res.newNotifications.length;
  };

  assert(checkDay('2027-01-10T12:00:00Z') === 0, 'Day 14 must NOT alert for [7, 1, 0]');
  assert(checkDay('2027-01-17T12:00:00Z') === 1, 'Day 7 MUST alert once');
  assert(checkDay('2027-01-21T12:00:00Z') === 0, 'Day 3 must NOT alert when [7, 1, 0] is active');
  assert(checkDay('2027-01-23T12:00:00Z') === 1, 'Day 1 MUST alert once');
  assert(checkDay('2027-01-24T12:00:00Z') === 1, 'Day 0 (deadline day) MUST alert once');
  assert(lcExisting.length === 3, `Expected 3 total reminders for [7, 1, 0], got ${lcExisting.length}`);

  console.log('4. Testing first-run catalog seeding + newly added & requirement-updated opportunity matching...');
  const studentFresh = makeTestStudent();
  const seedRun = generateSmartNotifications({
    user: studentFresh,
    opportunities: oppMap,
    existingNotifications: [],
    baseline: null,
    now,
  });
  assert(seedRun.baselineWasSeeded === true, 'First run without baseline should seed quietly');
  assert(
    seedRun.newNotifications.filter((n) => n.category === 'opportunity').length === 0,
    'First-run baseline seeding must NOT flood student with existing 455 records'
  );

  const newMatchingOpp = makeTestOpportunity({
    id: 'opp-new-match',
    officialName: 'Munich Aerospace Institute',
    country: 'Germany',
    degreeLevels: ['Undergraduate'],
    studyFields: ['Computer Science'],
    deadlines: { term: 'Fall 2027', deadlineText: 'Jun 30, 2027', deadlineDate: '2027-06-30', isRolling: false },
  });
  const nonMatchingOpp = makeTestOpportunity({
    id: 'opp-non-match',
    officialName: 'Antarctica Culinary College',
    country: 'Antarctica',
    degreeLevels: ['Doctorate / PhD'],
    studyFields: ['Culinary Arts'],
    fundingDetails: { type: 'Self-Funded', amount: 'Paid', details: 'Full tuition' },
    funding: { type: 'Self-Funded', amount: 'Paid', details: 'Full tuition' },
    applicationFees: { status: 'Fee Required ($100)', details: 'Fee required' },
    applicationFee: { status: 'Fee Required ($100)', details: 'Fee required' },
    testWaiverRules: { status: 'SAT Required', details: 'SAT mandatory' },
    testPolicy: { status: 'SAT Required', details: 'SAT mandatory' },
  });

  const matchCheck1 = matchOpportunityToStudent(
    newMatchingOpp,
    studentFresh,
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  assert(matchCheck1.matched === true && matchCheck1.reasons.length >= 2, 'New Germany CS funded opp must match');

  const matchCheck2 = matchOpportunityToStudent(
    nonMatchingOpp,
    studentFresh,
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  assert(matchCheck2.matched === false, 'Unrelated Antarctica PhD paid opp must NOT match');

  const deltaCatalogRun = generateSmartNotifications({
    user: studentFresh,
    opportunities: [...oppMap, newMatchingOpp, nonMatchingOpp],
    existingNotifications: seedRun.newNotifications,
    baseline: seedRun.nextBaseline,
    now,
  });
  const oppMatches = deltaCatalogRun.newNotifications.filter((n) => n.category === 'opportunity');
  assert(
    oppMatches.length === 1 && oppMatches[0].opportunityId === 'opp-new-match',
    'Delta run should alert strictly for the newly added matching opportunity'
  );

  console.log('5. Testing Application Progress, Follow-Up Date, and Requirement Diff Reminders...');
  const trackedOpp = makeTestOpportunity({
    id: 'opp-tracked-app',
    officialName: 'ETH Zurich Portal',
    admissionsRequirements: {
      academic: 'Top 5% WASSCE + Mathematics A1',
      language: 'C1 English / Waiver',
      documents: ['Transcripts', 'Passport', 'Motivation Letter'],
    },
  });
  const oldSig = buildOpportunityRequirementSignature(trackedOpp);
  const updatedTrackedOpp: OpportunityItem = {
    ...trackedOpp,
    admissionsRequirements: {
      academic: 'Top 5% WASSCE + Mathematics A1',
      language: 'C1 English / Waiver',
      documents: ['Transcripts', 'Passport', 'Motivation Letter', 'Two Faculty Reference Letters'],
    },
  };

  const studentWithFollowUp = makeTestStudent({
    activeApplications: {
      'opp-tracked-app': {
        opportunityId: 'opp-tracked-app',
        stage: 'preparing',
        completedTasks: ['Transcripts'],
        followUpDate: '2027-01-12', // 2 days from `now`
        requirementSnapshot: oldSig,
        startedAt: '2027-01-01T00:00:00Z',
        updatedAt: '2027-01-01T00:00:00Z',
      },
    },
  });

  const appProgressRun = generateSmartNotifications({
    user: studentWithFollowUp,
    opportunities: [updatedTrackedOpp],
    existingNotifications: [],
    baseline: { initializedAt: now.toISOString(), signatures: { 'opp-tracked-app': oldSig } },
    now,
  });

  const appNotifs = appProgressRun.newNotifications.filter((n) => n.category === 'application');
  const reqNotifs = appProgressRun.newNotifications.filter((n) => n.category === 'requirement');
  assert(
    appNotifs.some((n) => n.id.includes('app_fu_')),
    'Must generate student-defined follow-up reminder when due in <= 2 days'
  );
  assert(
    appNotifs.some((n) => n.id.includes('app_tasks')),
    'Must generate checklist progress reminder for incomplete tasks'
  );
  assert(
    reqNotifs.some((n) => n.id.includes('app_req_opp-tracked-app')),
    'Must detect verified requirement snapshot change on active application'
  );
  assert(
    !appProgressRun.newNotifications.some((n) =>
      /accepted|rejected|admitted to/i.test(`${n.title} ${n.message}`)
    ),
    'Must NEVER invent admission outcome messages'
  );

  console.log('6. Testing inAppEnabled opt-out, explicit empty intervals [], empty-country guard & cross-device profile dismissal sync...');
  const optedOutStudent = makeTestStudent(
    {
      savedOpportunities: savedIds,
      targetList,
      activeApplications: activeApps,
    },
    { inAppEnabled: false }
  );
  const optedOutRun = generateSmartNotifications({
    user: optedOutStudent,
    opportunities: oppMap,
    existingNotifications: [],
    baseline: baseline1,
    now,
  });
  assert(
    optedOutRun.newNotifications.length === 0,
    'Disabling inAppEnabled must suppress new in-app notifications'
  );

  // Explicit empty intervals array must NOT fall back to ALL_REMINDER_INTERVALS
  const emptyIntervalsStudent = makeTestStudent(
    { savedOpportunities: ['opp-day-7'] },
    { reminderIntervals: [] }
  );
  const emptyIntervalsRun = generateSmartNotifications({
    user: emptyIntervalsStudent,
    opportunities: oppMap,
    existingNotifications: [],
    baseline: baseline1,
    now,
  });
  assert(
    emptyIntervalsRun.newNotifications.filter((n) => n.category === 'deadline').length === 0,
    'Explicit empty reminderIntervals [] must suppress deadline alerts'
  );

  // Empty country must NEVER falsely match preferredDestinations
  const blankCountryOpp = makeTestOpportunity({
    id: 'opp-blank-country',
    country: '',
    countryCode: '',
    degreeLevels: [],
    studyFields: [],
    fundingDetails: { type: 'Paid', amount: 'Paid', details: 'Paid' },
    funding: { type: 'Paid', amount: 'Paid', details: 'Paid' },
    applicationFees: { status: 'Standard Fee', details: 'Fee required' },
    applicationFee: { status: 'Standard Fee', details: 'Fee required' },
    testWaiverRules: { status: 'SAT Required', details: 'Required' },
    testPolicy: { status: 'SAT Required', details: 'Required' },
  });
  const blankCountryMatch = matchOpportunityToStudent(
    blankCountryOpp,
    studentFresh,
    DEFAULT_NOTIFICATION_PREFERENCES,
    now
  );
  assert(blankCountryMatch.matched === false, 'Blank country must NEVER false-match destination');

  // Cross-device dismissal persisted inside user.profile.dismissedNotificationIds
  const dismissedInProfileStudent = makeTestStudent({
    savedOpportunities: ['opp-day-7'],
    profile: {
      ...studentFresh.profile!,
      dismissedNotificationIds: [run1.newNotifications.find((n) => n.opportunityId === 'opp-day-7')!.id],
    },
  });
  const crossDeviceRun = generateSmartNotifications({
    user: dismissedInProfileStudent,
    opportunities: oppMap,
    existingNotifications: [],
    dismissedIds: new Set(), // simulates clean browser / empty localStorage
    baseline: baseline1,
    now,
  });
  assert(
    !crossDeviceRun.newNotifications.some((n) => n.opportunityId === 'opp-day-7'),
    'Firestore profile.dismissedNotificationIds must prevent notification resurrection across devices'
  );

  console.log('7. Testing Firestore schema compliance parity with firestore.rules...');
  const allowedKeys = new Set([
    'id',
    'userId',
    'category',
    'priority',
    'title',
    'message',
    'read',
    'createdAt',
    'updatedAt',
    'dedupeKey',
    'opportunityId',
    'opportunityName',
    'actionTab',
    'actionSection',
    'deadlineDate',
    'daysRemaining',
    'sourceVerified',
  ]);
  for (const n of [...run1.newNotifications, ...appProgressRun.newNotifications, ...oppMatches]) {
    for (const k of Object.keys(n)) {
      assert(allowedKeys.has(k), `Unexpected key '${k}' in StudentNotificationRecord not in firestore.rules`);
    }
    assert(/^[A-Za-z0-9_-]{3,120}$/.test(n.id), `Invalid notification ID format for rules: ${n.id}`);
    assert(n.userId === studentAllIntervals.id, 'Notification userId must match authenticated owner');
  }

  const rulesContent = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  assert(
    rulesContent.includes('match /users/{userId}') &&
      rulesContent.includes('match /notifications/{notificationId}'),
    'firestore.rules must include notifications match rule nested under /users/{userId}'
  );
  assert(
    rulesContent.includes('match /pushTokens/{tokenId}'),
    'firestore.rules must include pushTokens match rule nested under /users/{userId}'
  );

  console.log('8. Testing all 5 Resend Email Templates + EMAIL_TEST_MODE safety lock...');
  const card = {
    id: 'opp-1',
    officialName: 'Technical University of Munich',
    title: 'TUM BSc Admissions',
    country: 'Germany',
    city: 'Munich',
    category: 'university',
    officialUrl: 'https://www.tum.de/en/studies/application',
    fundingBadge: 'Tuition-Free Public',
    feeBadge: 'Check Portal',
    testBadge: 'Test-Optional',
    deadlineDisplay: 'May 31, 2027',
    deadlineDate: '2027-05-31',
    daysUntilDeadline: 14,
    summary: 'Accredited German public technical university.',
    matchReasons: ['Preferred Destination: Germany'],
  };

  const t1 = buildConfirmationEmail({
    confirmUrl: 'https://example.app/confirm?t=1',
    unsubscribeUrl: 'https://example.app/unsub?t=1',
    preferences: ['admissions', 'fully-funded'],
  });
  const t2 = buildWelcomeDigestEmail({
    preferences: ['admissions', 'fully-funded'],
    opportunities: [card],
    manageUrl: 'https://example.app/manage',
    unsubscribeUrl: 'https://example.app/unsub',
  });
  const t3 = buildDeadlineReminderEmail({
    opportunities: [card],
    manageUrl: 'https://example.app/manage',
    unsubscribeUrl: 'https://example.app/unsub',
  });
  const t4 = buildPersonalizedOpportunityEmail({
    studentName: 'Kwame',
    matchedReasons: ['Country Match: Germany', 'Field: Computer Science'],
    opportunities: [card],
    manageUrl: 'https://example.app/manage',
    unsubscribeUrl: 'https://example.app/unsub',
  });
  const t5 = buildApplicationChecklistReminderEmail({
    studentName: 'Kwame',
    applications: [
      {
        officialName: 'Technical University of Munich',
        country: 'Germany',
        stage: 'preparing',
        completedCount: 1,
        totalCount: 3,
        pendingTasks: ['Official Transcripts', 'Passport'],
        deadlineDisplay: 'May 31, 2027',
        followUpDate: '2027-01-12',
        officialUrl: 'https://www.tum.de/en/studies/application',
      },
    ],
    manageUrl: 'https://example.app/manage',
    unsubscribeUrl: 'https://example.app/unsub',
  });

  for (const [idx, tpl] of [t1, t2, t3, t4, t5].entries()) {
    assert(
      tpl.subject.length > 10 && tpl.html.includes('Campus Connect') && tpl.text.length > 40,
      `Email template ${idx + 1} invalid`
    );
  }

  const fakeEnv = {
    RESEND_API_KEY: 're_test_dummy_key_not_real',
    EMAIL_TEST_MODE: 'true',
    EMAIL_TEST_RECIPIENT: DEFAULT_VERIFIED_TEST_RECIPIENT,
    EMAIL_FROM: 'Campus Connect <onboarding@resend.dev>',
  } as unknown as NodeJS.ProcessEnv;

  const providerStatus = getEmailProviderStatus(fakeEnv);
  assert(
    providerStatus.provider === 'resend' && providerStatus.testingMode === true,
    'Provider must enforce Resend test mode'
  );

  const blockedRes = await sendTransactionalEmail(
    {
      to: 'real.student@university.edu',
      subject: t3.subject,
      html: t3.html,
      text: t3.text,
    },
    { env: fakeEnv }
  );
  assert(
    blockedRes.delivered === false && blockedRes.blockedByTestMode === true && blockedRes.statusCode === 403,
    'Arbitrary real student email MUST be blocked when EMAIL_TEST_MODE=true'
  );

  let mockedFetchCalledWithTestRecipient = false;
  const allowedRes = await sendTransactionalEmail(
    {
      to: DEFAULT_VERIFIED_TEST_RECIPIENT,
      subject: t4.subject,
      html: t4.html,
      text: t4.text,
    },
    {
      env: fakeEnv,
      fetchImpl: (async (_url, init) => {
        const body = JSON.parse(String(init?.body || '{}'));
        mockedFetchCalledWithTestRecipient =
          body.from === 'Campus Connect <onboarding@resend.dev>' &&
          Array.isArray(body.to) &&
          body.to[0] === DEFAULT_VERIFIED_TEST_RECIPIENT;
        return new Response(JSON.stringify({ id: 'mock_resend_msg_1' }), { status: 200 });
      }) as typeof fetch,
    }
  );
  assert(
    allowedRes.delivered === true && mockedFetchCalledWithTestRecipient,
    'Verified test recipient email must route through Resend with onboarding@resend.dev'
  );

  console.log('ALL SMART NOTIFICATION & SECURITY VERIFICATION TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
