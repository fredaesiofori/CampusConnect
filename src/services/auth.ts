/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  auth,
  registerWithFirebase,
  loginWithFirebase,
  loginWithGoogleFirebase,
  linkPendingCredentialWithPasswordFirebase,
  logoutFromFirebase,
  sendFirebasePasswordReset,
  changeFirebasePassword,
  getFirebaseActiveSessionInfo,
  refreshFirebaseSessionToken,
  saveStudentProfileToFirestore,
  saveStudentProfileWithStatusToFirestore,
  syncStudentDashboardListsToFirestore,
  fetchStudentProfileFromFirestore,
  fetchStudentProfileDocFromFirestore,
  subscribeToFirebaseAuthState,
  updateFirebaseUserEmail,
  updateFirebaseDisplayName,
  checkCurrentUserIsAdmin,
} from './firebase';
import { getCountryByName } from '../data/countries';
import { User as FirebaseUser, OAuthCredential } from 'firebase/auth';

export type ReminderIntervalDays = 30 | 14 | 7 | 3 | 1 | 0;

export const ALL_REMINDER_INTERVALS: ReminderIntervalDays[] = [30, 14, 7, 3, 1, 0];

export interface NotificationMatchingPreferences {
  matchByNationality: boolean;
  matchByDestination: boolean;
  matchByDegree: boolean;
  matchByFieldOfStudy: boolean;
  matchByFunding: boolean;
  matchByFeeWaiver: boolean;
  matchByTestOptional: boolean;
}

export const DEFAULT_MATCHING_PREFERENCES: NotificationMatchingPreferences = {
  matchByNationality: true,
  matchByDestination: true,
  matchByDegree: true,
  matchByFieldOfStudy: true,
  matchByFunding: true,
  matchByFeeWaiver: true,
  matchByTestOptional: true,
};

export interface NotificationPreferences {
  deadlineAlerts: boolean; // Scholarship and application deadlines
  savedUpdatesAlerts: boolean; // Saved university and scholarship requirement updates
  trackerReminders: boolean; // Application progress, checklist & follow-up reminders
  admissionUpdates: boolean; // Personalized new/updated opportunities matching profile
  nonUrgentUpdates?: boolean; // Weekly digests and general guidance updates
  scholarshipAlerts?: boolean;
  waiverAlerts?: boolean;
  weeklyDigest?: boolean;
  reminderIntervals?: ReminderIntervalDays[];
  matchingPreferences?: NotificationMatchingPreferences;
  inAppEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  deadlineAlerts: true,
  savedUpdatesAlerts: true,
  trackerReminders: true,
  admissionUpdates: true,
  nonUrgentUpdates: true,
  scholarshipAlerts: true,
  waiverAlerts: true,
  weeklyDigest: false,
  reminderIntervals: [30, 14, 7, 3, 1, 0],
  matchingPreferences: { ...DEFAULT_MATCHING_PREFERENCES },
  inAppEnabled: true,
  emailNotificationsEnabled: false,
  pushNotificationsEnabled: false,
};

export function normalizeNotificationPreferences(
  raw?: Partial<NotificationPreferences> | null
): NotificationPreferences {
  const validIntervals = new Set<ReminderIntervalDays>(ALL_REMINDER_INTERVALS);
  const rawIntervals = Array.isArray(raw?.reminderIntervals)
    ? Array.from(
        new Set(
          raw!.reminderIntervals.filter(
            (n): n is ReminderIntervalDays =>
              typeof n === 'number' && validIntervals.has(n as ReminderIntervalDays)
          )
        )
      ).sort((a, b) => b - a)
    : [...ALL_REMINDER_INTERVALS];

  return {
    deadlineAlerts: raw?.deadlineAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.deadlineAlerts,
    savedUpdatesAlerts:
      raw?.savedUpdatesAlerts ?? raw?.scholarshipAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.savedUpdatesAlerts,
    trackerReminders: raw?.trackerReminders ?? DEFAULT_NOTIFICATION_PREFERENCES.trackerReminders,
    admissionUpdates:
      raw?.admissionUpdates ?? raw?.waiverAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.admissionUpdates,
    nonUrgentUpdates: raw?.nonUrgentUpdates ?? DEFAULT_NOTIFICATION_PREFERENCES.nonUrgentUpdates,
    scholarshipAlerts:
      raw?.scholarshipAlerts ?? raw?.savedUpdatesAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.scholarshipAlerts,
    waiverAlerts:
      raw?.waiverAlerts ?? raw?.admissionUpdates ?? DEFAULT_NOTIFICATION_PREFERENCES.waiverAlerts,
    weeklyDigest: raw?.weeklyDigest ?? DEFAULT_NOTIFICATION_PREFERENCES.weeklyDigest,
    reminderIntervals: raw?.reminderIntervals !== undefined ? rawIntervals : [...ALL_REMINDER_INTERVALS],
    matchingPreferences: {
      ...DEFAULT_MATCHING_PREFERENCES,
      ...(raw?.matchingPreferences || {}),
    },
    inAppEnabled: raw?.inAppEnabled ?? true,
    emailNotificationsEnabled: raw?.emailNotificationsEnabled ?? false,
    pushNotificationsEnabled: raw?.pushNotificationsEnabled ?? false,
  };
}

export interface StudentProfile {
  nationality: string;
  countryOfResidence: string;
  preferredDestinations: string[];
  educationLevel: string;
  intendedDegree: string;
  fieldOfStudy: string;
  graduationYear: string;
  onboardingCompleted: boolean;
  phone?: string;
  currentSchool?: string;
  fundingPreference?: string;
  testPreference?: string;
  studyModePreference?: 'on-campus' | 'online' | 'hybrid' | string;
  fundingTypePreference?: 'fully_funded' | 'partially_funded' | 'self_funded' | 'all' | string;
  preferredFieldsOfStudy?: string[];
  notificationPreferences?: NotificationPreferences;
  dismissedNotificationIds?: string[];
}

export type TargetPriority = 'High' | 'Medium' | 'Low';

export interface TargetListItem {
  opportunityId: string;
  priority: TargetPriority;
  intakeYear: string;
  personalGoal: string;
  addedAt: string;
  updatedAt: string;
}

export type ActiveApplicationStage = 'preparing' | 'submitted' | 'accepted';

export interface ActiveApplicationItem {
  opportunityId: string;
  stage: ActiveApplicationStage;
  completedTasks: string[];
  notes?: string;
  followUpDate?: string;
  requirementSnapshot?: string;
  startedAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // Firebase Auth UID
  fullName: string;
  email: string;
  country: string;
  countryCode: string;
  degreeLevel: string;
  studyField: string;
  createdAt: string;
  savedOpportunities: string[];
  applicationTracker: Record<string, 'saved' | 'preparing' | 'submitted' | 'accepted'>;
  targetList?: Record<string, TargetListItem>;
  activeApplications?: Record<string, ActiveApplicationItem>;
  profile?: StudentProfile;
  isAdmin?: boolean;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  country: string;
  degreeLevel: string;
  studyField: string;
}

export const PASSWORD_MIN_LENGTH = 8;

export function validatePasswordPolicy(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
    };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password cannot exceed 128 characters.' };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must include both letters and numbers.',
    };
  }
  return { valid: true };
}

const CACHED_USER_KEY = 'campus_connect_cached_active_user';
const SESSION_STORAGE_KEY = 'campus_connect_active_session_user_id';
const LEGACY_STORAGE_KEY = 'campus_connect_registered_users';
const LEGACY_RESET_TOKENS_STORAGE_KEY = 'campus_connect_pwd_reset_tokens';

// Security: Strip legacy password hashes, reset tokens, and deprecated demo sessions from local storage
export function cleanupLegacyLocalStorage(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_RESET_TOKENS_STORAGE_KEY);

    const cachedRaw = localStorage.getItem(CACHED_USER_KEY);
    if (cachedRaw) {
      const parsedCached = JSON.parse(cachedRaw);
      if (
        !parsedCached ||
        parsedCached.isDemo === true ||
        parsedCached.id === 'usr_demo_kwame_mensah' ||
        parsedCached.email === 'scholar.ghana@campusconnect.edu'
      ) {
        localStorage.removeItem(CACHED_USER_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strip passwordHash and salt from all cached user objects
        const sanitized = parsed.map((u: any) => {
          const { passwordHash, salt, ...rest } = u;
          return rest;
        });
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(sanitized));
      }
    }
  } catch (e) {
    console.info('Legacy local storage cleanup notice:', e);
  }
}

// Run cleanup immediately on module load
cleanupLegacyLocalStorage();

function getCachedUser(): User | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.isDemo === true ||
      parsed.id === 'usr_demo_kwame_mensah' ||
      parsed.email === 'scholar.ghana@campusconnect.edu'
    ) {
      localStorage.removeItem(CACHED_USER_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    // Never trust cached admin flags from localStorage; always derive from verified Firebase custom claims
    const { isAdmin: _ignoredAdmin, role: _ignoredRole, isDemo: _ignoredDemo, ...safeUser } = parsed;
    return safeUser as User;
  } catch {
    return null;
  }
}

function setCachedUser(user: User | null): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    if (user) {
      // Never persist privilege flags to localStorage
      const { isAdmin: _ignoredAdmin, ...cacheableUser } = user;
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(cacheableUser));
      localStorage.setItem(SESSION_STORAGE_KEY, user.id);
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set cached user:', e);
  }
}

function hydrateTargetList(rawTargets?: Record<string, any>): Record<string, TargetListItem> {
  const result: Record<string, TargetListItem> = {};
  if (!rawTargets || typeof rawTargets !== 'object') return result;

  Object.entries(rawTargets).forEach(([oppId, val]) => {
    if (!oppId || !val || typeof val !== 'object') return;
    const priority: TargetPriority =
      val.priority === 'High' || val.priority === 'Medium' || val.priority === 'Low'
        ? val.priority
        : 'Medium';
    result[oppId] = {
      opportunityId: val.opportunityId || oppId,
      priority,
      intakeYear: typeof val.intakeYear === 'string' && val.intakeYear.trim() ? val.intakeYear.trim() : '2026',
      personalGoal: typeof val.personalGoal === 'string' ? val.personalGoal : '',
      addedAt: typeof val.addedAt === 'string' ? val.addedAt : new Date().toISOString(),
      updatedAt: typeof val.updatedAt === 'string' ? val.updatedAt : new Date().toISOString(),
    };
  });

  return result;
}

function normalizeActiveApplicationEntry(
  oppId: string,
  val: Record<string, any>
): ActiveApplicationItem {
  const stage: ActiveApplicationStage =
    val.stage === 'submitted' || val.stage === 'accepted' ? val.stage : 'preparing';
  const entry: ActiveApplicationItem = {
    opportunityId: val.opportunityId || oppId,
    stage,
    completedTasks: Array.isArray(val.completedTasks)
      ? Array.from(new Set(val.completedTasks.filter((t: unknown): t is string => typeof t === 'string')))
      : [],
    startedAt: typeof val.startedAt === 'string' ? val.startedAt : new Date().toISOString(),
    updatedAt: typeof val.updatedAt === 'string' ? val.updatedAt : new Date().toISOString(),
  };

  if (typeof val.notes === 'string') {
    entry.notes = val.notes;
  }
  if (typeof val.followUpDate === 'string' && val.followUpDate.trim()) {
    entry.followUpDate = val.followUpDate.trim();
  }
  if (typeof val.requirementSnapshot === 'string') {
    entry.requirementSnapshot = val.requirementSnapshot;
  }

  return entry;
}

function hydrateActiveApplications(
  rawActive?: Record<string, any>,
  legacyTracker?: Record<string, any>
): Record<string, ActiveApplicationItem> {
  const result: Record<string, ActiveApplicationItem> = {};

  if (rawActive && typeof rawActive === 'object') {
    Object.entries(rawActive).forEach(([oppId, val]) => {
      if (!oppId || !val || typeof val !== 'object') return;
      result[oppId] = normalizeActiveApplicationEntry(oppId, val);
    });
  }

  // Preserve existing started applications stored in legacy applicationTracker
  // Strictly exclude 'saved' bookmarks!
  if (legacyTracker && typeof legacyTracker === 'object') {
    Object.entries(legacyTracker).forEach(([oppId, stage]) => {
      if (!oppId || result[oppId]) return;
      if (stage === 'preparing' || stage === 'submitted' || stage === 'accepted') {
        const now = new Date().toISOString();
        result[oppId] = {
          opportunityId: oppId,
          stage,
          completedTasks: [],
          startedAt: now,
          updatedAt: now,
        };
      }
    });
  }

  return result;
}


async function hydrateAuthenticatedUser(
  fbUser: FirebaseUser,
  options: {
    persistIfMissingProfile: boolean;
    forceAdminRefresh?: boolean;
    fallbackEmail?: string;
  }
): Promise<{ user: User; isNewStudent: boolean }> {
  const uid = fbUser.uid;
  const resolvedEmail = (fbUser.email || options.fallbackEmail || '').trim().toLowerCase();

  const [fsResult, isAdminClaim] = await Promise.all([
    fetchStudentProfileDocFromFirestore(uid),
    checkCurrentUserIsAdmin(Boolean(options.forceAdminRefresh)),
  ]);

  const cachedSameUser = (() => {
    const cached = getCachedUser();
    return cached && cached.id === uid ? cached : null;
  })();

  const firestoreData = fsResult.data;
  const hasStoredProfile = Boolean(fsResult.exists && firestoreData && firestoreData.profile);

  let resolvedProfile: StudentProfile;
  let resolvedSaved: string[] = [];
  let resolvedTracker: Record<string, 'saved' | 'preparing' | 'submitted' | 'accepted'> = {};
  let resolvedTargets: Record<string, TargetListItem> = {};
  let resolvedActiveApps: Record<string, ActiveApplicationItem> = {};
  let resolvedFullName = (fbUser.displayName || '').trim() || 'Scholar';
  let isNewStudent = false;

  if (hasStoredProfile && firestoreData?.profile) {
    resolvedFullName =
      (firestoreData.fullName && firestoreData.fullName.trim()) ||
      (fbUser.displayName && fbUser.displayName.trim()) ||
      'Scholar';
    resolvedProfile = {
      ...firestoreData.profile,
      notificationPreferences: normalizeNotificationPreferences(
        firestoreData.profile.notificationPreferences
      ),
      ...(Array.isArray(firestoreData.profile.dismissedNotificationIds)
        ? {
            dismissedNotificationIds: Array.from(
              new Set(
                firestoreData.profile.dismissedNotificationIds.filter(
                  (id): id is string => typeof id === 'string' && id.length > 0
                )
              )
            ).slice(-150),
          }
        : {}),
    };
    resolvedSaved = Array.from(new Set(firestoreData.savedOpportunities || []));
    resolvedTracker = firestoreData.applicationTracker || {};
    resolvedTargets = hydrateTargetList(firestoreData.targetList);
    resolvedActiveApps = hydrateActiveApplications(
      firestoreData.activeApplications,
      resolvedTracker
    );
    isNewStudent = !resolvedProfile.onboardingCompleted;
  } else if (fsResult.failed && cachedSameUser) {
    resolvedFullName =
      cachedSameUser.fullName || (fbUser.displayName && fbUser.displayName.trim()) || 'Scholar';
    resolvedProfile = cachedSameUser.profile || {
      nationality: 'Ghanaian',
      countryOfResidence: 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: 'Undergraduate',
      fieldOfStudy: 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: false,
      notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    };
    resolvedSaved = Array.from(new Set(cachedSameUser.savedOpportunities || []));
    resolvedTracker = cachedSameUser.applicationTracker || {};
    resolvedTargets = hydrateTargetList(cachedSameUser.targetList);
    resolvedActiveApps = hydrateActiveApplications(
      cachedSameUser.activeApplications,
      resolvedTracker
    );
    isNewStudent = !resolvedProfile.onboardingCompleted;
  } else {
    resolvedFullName =
      (firestoreData?.fullName && firestoreData.fullName.trim()) ||
      (fbUser.displayName && fbUser.displayName.trim()) ||
      'Scholar';
    resolvedProfile = {
      nationality: 'Ghanaian',
      countryOfResidence: 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: 'Undergraduate',
      fieldOfStudy: 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: false,
      notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    };
    resolvedSaved = Array.from(new Set(firestoreData?.savedOpportunities || []));
    resolvedTracker = firestoreData?.applicationTracker || {};
    resolvedTargets = hydrateTargetList(firestoreData?.targetList);
    resolvedActiveApps = hydrateActiveApplications(
      firestoreData?.activeApplications,
      resolvedTracker
    );
    isNewStudent = true;

    // Only write initial profile if Firestore confirmed the profile does not exist yet
    if (options.persistIfMissingProfile && !fsResult.failed) {
      await saveStudentProfileToFirestore(
        uid,
        resolvedEmail,
        resolvedProfile,
        resolvedFullName
      ).catch(() => {});
    }
  }

  const hydratedUser: User = {
    id: uid,
    fullName: resolvedFullName,
    email: resolvedEmail,
    country: resolvedProfile.countryOfResidence || 'Ghana',
    countryCode: getCountryByName(resolvedProfile.countryOfResidence || '')?.code || 'GH',
    degreeLevel: resolvedProfile.intendedDegree || 'Undergraduate',
    studyField: resolvedProfile.fieldOfStudy || 'Computer Science & Engineering',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    savedOpportunities: resolvedSaved,
    applicationTracker: resolvedTracker,
    targetList: resolvedTargets,
    activeApplications: resolvedActiveApps,
    profile: resolvedProfile,
    isAdmin: isAdminClaim,
  };

  return { user: hydratedUser, isNewStudent };
}

let activeInMemoryUser: User | null = null;

export const authService = {
  // 1. User Registration with Firebase Auth
  async register(input: RegisterInput): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    isConsoleSetupRequired?: boolean;
  }> {
    cleanupLegacyLocalStorage();
    const normalizedEmail = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();

    const pwdCheck = validatePasswordPolicy(input.password);
    if (!pwdCheck.valid) {
      return {
        success: false,
        error: pwdCheck.error || 'Password does not meet security requirements.',
      };
    }

    // Call real Firebase Auth API
    const { userCredential, error: fbError } = await registerWithFirebase(
      normalizedEmail,
      input.password,
      fullName
    );

    if (fbError || !userCredential) {
      const code = fbError?.code || '';
      if (code === 'auth/operation-not-allowed') {
        return {
          success: false,
          isConsoleSetupRequired: true,
          error:
            'Email and password registration is temporarily unavailable. Please contact the platform administrator.',
        };
      }
      if (code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'An account with this email address already exists. Please log in or request a password reset.',
        };
      }
      if (code === 'auth/weak-password') {
        return {
          success: false,
          error: 'Password is too weak. Please use at least 8 characters including both letters and numbers.',
        };
      }
      if (code === 'auth/invalid-email') {
        return {
          success: false,
          error: 'Please enter a valid email address.',
        };
      }
      console.warn('Registration failed:', fbError);
      return {
        success: false,
        error: 'Registration could not be completed. Please check your details and internet connection.',
      };
    }

    const fbUser = userCredential.user;
    const uid = fbUser.uid;
    const isAdminClaim = await checkCurrentUserIsAdmin(false);

    const matchedCountry = getCountryByName(input.country);
    const countryCode = matchedCountry?.code || 'GH';
    const resolvedCountry = matchedCountry?.name || input.country || 'Ghana';
    const resolvedNationality =
      matchedCountry?.nationality ||
      (resolvedCountry === 'Ghana' ? 'Ghanaian' : `${resolvedCountry} Citizen`);

    const newProfile: StudentProfile = {
      nationality: resolvedNationality,
      countryOfResidence: resolvedCountry,
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: input.degreeLevel || 'Undergraduate',
      fieldOfStudy: input.studyField.trim() || 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: false,
      notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    };

    const newUser: User = {
      id: uid,
      fullName: fullName || fbUser.displayName || 'Scholar',
      email: normalizedEmail,
      country: resolvedCountry,
      countryCode,
      degreeLevel: input.degreeLevel || 'Undergraduate',
      studyField: input.studyField.trim() || 'Computer Science & Engineering',
      createdAt: new Date().toISOString(),
      savedOpportunities: [],
      applicationTracker: {},
      targetList: {},
      activeApplications: {},
      profile: newProfile,
      isAdmin: isAdminClaim,
    };

    // Link and persist Firestore user data strictly to authenticated user's UID
    await saveStudentProfileToFirestore(uid, normalizedEmail, newProfile, newUser.fullName).catch(
      (err) => console.warn('Firestore initial profile sync notice:', err)
    );

    activeInMemoryUser = newUser;
    setCachedUser(newUser);

    return { success: true, user: newUser };
  },

  // 2. User Login with Firebase Auth
  async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    isConsoleSetupRequired?: boolean;
  }> {
    cleanupLegacyLocalStorage();
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return {
        success: false,
        error: 'Please enter both your email address and password.',
      };
    }

    // Call real Firebase Auth API
    const { userCredential, error: fbError } = await loginWithFirebase(
      normalizedEmail,
      password,
      rememberMe
    );

    if (fbError || !userCredential) {
      const code = fbError?.code || '';

      if (code === 'auth/operation-not-allowed') {
        return {
          success: false,
          isConsoleSetupRequired: true,
          error:
            'Email and password sign-in is temporarily unavailable. Please try again shortly or contact support.',
        };
      }
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-login-credentials'
      ) {
        return {
          success: false,
          error:
            'Invalid credentials. No registered scholar account found with this email, or password was incorrect.',
        };
      }
      if (code === 'auth/wrong-password') {
        return {
          success: false,
          error: 'Incorrect password. Please verify your password or use password recovery.',
        };
      }
      if (code === 'auth/too-many-requests') {
        return {
          success: false,
          error:
            'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again in a few moments.',
        };
      }
      if (code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Network error while signing in. Please check your internet connection and try again.',
        };
      }
      console.warn('Login failed:', fbError);
      return {
        success: false,
        error: 'Sign-in could not be completed. Please verify your email and password and try again.',
      };
    }

    const { user: loggedInUser } = await hydrateAuthenticatedUser(userCredential.user, {
      persistIfMissingProfile: true,
      forceAdminRefresh: true,
      fallbackEmail: normalizedEmail,
    });

    activeInMemoryUser = loggedInUser;
    setCachedUser(loggedInUser);

    return { success: true, user: loggedInUser };
  },

  // 2b. Google Sign-In with Firebase Auth (Popup flow for iframe & web compatibility)
  async loginWithGoogle(rememberMe = true): Promise<{
    success: boolean;
    user?: User;
    isNewStudent?: boolean;
    error?: string;
    cancelled?: boolean;
    isConsoleSetupRequired?: boolean;
    requiresAccountLinking?: boolean;
    pendingCredential?: OAuthCredential | null;
    pendingEmail?: string;
  }> {
    cleanupLegacyLocalStorage();

    const { userCredential, error: fbError, pendingCredential, pendingEmail } =
      await loginWithGoogleFirebase(rememberMe);

    if (fbError || !userCredential) {
      const code = fbError?.code || '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return {
          success: false,
          cancelled: true,
          error: 'Google sign-in was cancelled before completion.',
        };
      }

      if (code === 'auth/popup-blocked') {
        return {
          success: false,
          error:
            'Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.',
        };
      }

      if (code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          requiresAccountLinking: Boolean(pendingCredential),
          pendingCredential: pendingCredential || null,
          pendingEmail,
          error: pendingEmail
            ? `An account already exists for ${pendingEmail} with an email and password. Enter your password below to sign in and link Google Sign-In.`
            : 'An account already exists with this email using email and password. Enter your password below to verify and link Google Sign-In.',
        };
      }

      if (code === 'auth/operation-not-allowed') {
        return {
          success: false,
          isConsoleSetupRequired: true,
          error:
            'Google Sign-In is temporarily unavailable. Please sign in with your email and password or contact support.',
        };
      }

      if (code === 'auth/unauthorized-domain') {
        return {
          success: false,
          isConsoleSetupRequired: true,
          error:
            'Google Sign-In is temporarily unavailable on this preview link. Please sign in with your email and password.',
        };
      }

      if (code === 'auth/network-request-failed') {
        return {
          success: false,
          error:
            'Network error while connecting to Google. Please check your connection and try again.',
        };
      }

      console.warn('Google sign-in failed:', fbError);
      return {
        success: false,
        error: 'Google sign-in could not be completed right now. Please try again.',
      };
    }

    const { user: loggedInUser, isNewStudent } = await hydrateAuthenticatedUser(
      userCredential.user,
      {
        persistIfMissingProfile: true,
        forceAdminRefresh: true,
      }
    );

    activeInMemoryUser = loggedInUser;
    setCachedUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
      isNewStudent,
    };
  },

  // 2c. Complete secure account linking when Google sign-in matches an existing Email/Password account
  async completeGoogleAccountLinking(params: {
    email: string;
    password: string;
    pendingCredential: OAuthCredential;
    rememberMe?: boolean;
  }): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    cleanupLegacyLocalStorage();
    const normalizedEmail = (params.email || '').trim().toLowerCase();
    if (!normalizedEmail || !params.password) {
      return {
        success: false,
        error: 'Please enter your existing account email and password to link Google Sign-In.',
      };
    }

    const { userCredential, error: fbError } = await linkPendingCredentialWithPasswordFirebase(
      normalizedEmail,
      params.password,
      params.pendingCredential,
      params.rememberMe ?? true
    );

    if (fbError || !userCredential) {
      const code = fbError?.code || '';
      if (
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-login-credentials'
      ) {
        return {
          success: false,
          error: 'Incorrect password. Please enter the password for your existing Campus Connect account to link Google.',
        };
      }
      if (code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many verification attempts. Please wait a moment or use Forgot Password.',
        };
      }
      console.warn('Google linking failed:', fbError);
      return {
        success: false,
        error: 'Could not link your Google account right now. Please try again.',
      };
    }

    const { user: linkedUser } = await hydrateAuthenticatedUser(userCredential.user, {
      persistIfMissingProfile: true,
      forceAdminRefresh: true,
      fallbackEmail: normalizedEmail,
    });

    activeInMemoryUser = linkedUser;
    setCachedUser(linkedUser);

    return { success: true, user: linkedUser };
  },

  // 3. User Logout
  async logout(): Promise<void> {
    await logoutFromFirebase();
    activeInMemoryUser = null;
    setCachedUser(null);
  },

  // 4. Get Current Active User
  getCurrentUser(): User | null {
    if (activeInMemoryUser) return activeInMemoryUser;
    const cached = getCachedUser();
    if (cached) {
      activeInMemoryUser = cached;
      return cached;
    }
    return null;
  },

  // 5. Password Recovery via Firebase sendPasswordResetEmail
  async requestPasswordReset(email: string): Promise<{
    success: boolean;
    sentEmail?: boolean;
    message?: string;
    error?: string;
  }> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return {
        success: false,
        error: 'Please provide a valid email address.',
      };
    }

    // Call real Firebase sendPasswordResetEmail
    const { success, error } = await sendFirebasePasswordReset(normalizedEmail);

    if (success) {
      return {
        success: true,
        sentEmail: true,
        message: `An official password reset link has been sent to ${normalizedEmail}. Please check your inbox and spam folder to set a new password.`,
      };
    }

    const code = error?.code || '';
    if (code === 'auth/operation-not-allowed') {
      return {
        success: false,
        error:
          'Password reset service is temporarily unavailable. Please try again shortly or contact support.',
      };
    }

    if (code === 'auth/user-not-found') {
      return {
        success: false,
        error: 'No registered student account was found with this email address.',
      };
    }

    if (code === 'auth/invalid-email') {
      return {
        success: false,
        error: 'Please provide a valid email address.',
      };
    }

    if (code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Too many password reset requests. Please wait a few moments and try again.',
      };
    }

    console.warn('Password reset dispatch failed:', error);
    return {
      success: false,
      error: 'Unable to send password reset email right now. Please try again shortly.',
    };
  },

  // 5a. Password Reset Alias
  sendPasswordReset(email: string) {
    return this.requestPasswordReset(email);
  },

  // 5b. Change Password via Firebase Authentication
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
    if (!currentPassword) {
      return { success: false, error: 'Please enter your current password.' };
    }

    const pwdCheck = validatePasswordPolicy(newPassword);
    if (!pwdCheck.valid) {
      return {
        success: false,
        error: pwdCheck.error || 'New password does not meet security requirements.',
      };
    }

    if (newPassword === currentPassword) {
      return {
        success: false,
        error: 'The new password must be different from your current password.',
      };
    }

    const currentUser = this.getCurrentUser();
    if (!currentUser || !auth.currentUser) {
      return { success: false, error: 'No active authenticated session found. Please sign in.' };
    }

    // Call real Firebase Authentication API
    return await changeFirebasePassword(currentPassword, newPassword);
  },

  // 5c. Retrieve Active Session Details
  async getActiveSessionDetails(): Promise<{
    userId: string;
    email: string;
    providerId: string;
    creationTime: string | null;
    lastSignInTime: string | null;
    emailVerified: boolean;
    isTokenValid: boolean;
    deviceSummary: string;
  }> {
    const fbSession = await getFirebaseActiveSessionInfo();
    const currentUser = this.getCurrentUser();

    let deviceSummary = 'Web Browser (Standard)';
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const browser = ua.includes('Firefox')
        ? 'Firefox'
        : ua.includes('Edg')
        ? 'Microsoft Edge'
        : ua.includes('Chrome')
        ? 'Google Chrome'
        : ua.includes('Safari')
        ? 'Safari'
        : 'Web Browser';
      const os = ua.includes('Mac')
        ? 'macOS'
        : ua.includes('Windows')
        ? 'Windows'
        : ua.includes('Linux')
        ? 'Linux'
        : ua.includes('Android')
        ? 'Android'
        : ua.includes('iPhone') || ua.includes('iPad')
        ? 'iOS'
        : 'Operating System';
      deviceSummary = `${browser} on ${os}${isMobile ? ' (Mobile)' : ''}`;
    }

    return {
      userId: currentUser?.id || 'active-scholar',
      email: currentUser?.email || 'scholar@campusconnect.edu',
      providerId: fbSession.providerId,
      creationTime: fbSession.creationTime || currentUser?.createdAt || null,
      lastSignInTime: fbSession.lastSignInTime || new Date().toISOString(),
      emailVerified: fbSession.emailVerified,
      isTokenValid: fbSession.isTokenValid,
      deviceSummary,
    };
  },

  // 5d. Refresh Session Token
  async refreshSessionToken(): Promise<{ success: boolean; error?: string }> {
    return await refreshFirebaseSessionToken();
  },

  // 7. Toggle Saved Opportunity (Personal Bookmark ONLY — never modifies Target List or Applications)
  toggleSavedOpportunity(opportunityId: string): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const saved = new Set(currentUser.savedOpportunities || []);
    if (saved.has(opportunityId)) {
      saved.delete(opportunityId);
    } else {
      saved.add(opportunityId);
    }

    currentUser.savedOpportunities = Array.from(saved);
    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // Sync saved opportunities to Cloud Firestore under authenticated user's UID
    syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      savedOpportunities: currentUser.savedOpportunities,
    }).catch(() => {});

    return currentUser;
  },

  async toggleSavedOpportunitySynced(opportunityId: string): Promise<{
    success: boolean;
    persistedToCloud: boolean;
    isSaved: boolean;
    user?: User;
    error?: string;
  }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, isSaved: false, error: 'No active student session.' };
    }

    const prevSaved = [...(currentUser.savedOpportunities || [])];
    const saved = new Set(prevSaved);
    let nowSaved: boolean;
    if (saved.has(opportunityId)) {
      saved.delete(opportunityId);
      nowSaved = false;
    } else {
      saved.add(opportunityId);
      nowSaved = true;
    }

    const nextSaved = Array.from(saved);
    currentUser.savedOpportunities = nextSaved;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      savedOpportunities: nextSaved,
    });

    if (!syncRes.success) {
      // Revert optimistic update on Firestore error
      currentUser.savedOpportunities = prevSaved;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        isSaved: !nowSaved,
        user: activeInMemoryUser,
        error: 'Could not save this bookmark to your account right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      isSaved: nowSaved,
      user: activeInMemoryUser,
    };
  },

  // 8. Update Application Tracker status (legacy / COVA compatibility)
  updateApplicationStatus(
    opportunityId: string,
    status: 'saved' | 'preparing' | 'submitted' | 'accepted'
  ): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    if (!currentUser.applicationTracker) {
      currentUser.applicationTracker = {};
    }
    currentUser.applicationTracker[opportunityId] = status;

    if (status === 'preparing' || status === 'submitted' || status === 'accepted') {
      const now = new Date().toISOString();
      const cleanedPrevApps: Record<string, ActiveApplicationItem> = {};
      Object.entries(currentUser.activeApplications || {}).forEach(([id, entry]) => {
        if (entry && typeof entry === 'object') {
          cleanedPrevApps[id] = normalizeActiveApplicationEntry(id, entry);
        }
      });

      const existing = cleanedPrevApps[opportunityId];
      const nextAppItem: ActiveApplicationItem = {
        opportunityId,
        stage: status,
        completedTasks: existing?.completedTasks || [],
        startedAt: existing?.startedAt || now,
        updatedAt: now,
      };
      if (typeof existing?.notes === 'string') {
        nextAppItem.notes = existing.notes;
      }
      if (typeof existing?.followUpDate === 'string' && existing.followUpDate.trim()) {
        nextAppItem.followUpDate = existing.followUpDate.trim();
      }
      if (typeof existing?.requirementSnapshot === 'string') {
        nextAppItem.requirementSnapshot = existing.requirementSnapshot;
      }

      currentUser.activeApplications = {
        ...cleanedPrevApps,
        [opportunityId]: nextAppItem,
      };
    }

    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      applicationTracker: currentUser.applicationTracker,
      activeApplications: currentUser.activeApplications || {},
    }).catch(() => {});

    return currentUser;
  },

  // 8b. Refresh hydrated user state directly from Firestore
  async refreshCurrentUserFromFirestore(): Promise<User | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !auth.currentUser) {
      return currentUser;
    }

    const [firestoreData, isAdminClaim] = await Promise.all([
      fetchStudentProfileFromFirestore(auth.currentUser.uid),
      checkCurrentUserIsAdmin(false),
    ]);
    if (!firestoreData) {
      return { ...currentUser, isAdmin: isAdminClaim };
    }

    const mergedProfile: StudentProfile = {
      ...(currentUser.profile || {
        nationality: 'Ghanaian',
        countryOfResidence: 'Ghana',
        preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
        educationLevel: 'Senior High School / WASSCE',
        intendedDegree: 'Undergraduate',
        fieldOfStudy: 'Computer Science & Engineering',
        graduationYear: '2026',
        onboardingCompleted: false,
      }),
      ...(firestoreData.profile || {}),
      notificationPreferences: normalizeNotificationPreferences({
        ...(currentUser.profile?.notificationPreferences || {}),
        ...(firestoreData.profile?.notificationPreferences || {}),
      }),
      dismissedNotificationIds: Array.from(
        new Set([
          ...(currentUser.profile?.dismissedNotificationIds || []),
          ...(Array.isArray(firestoreData.profile?.dismissedNotificationIds)
            ? firestoreData.profile.dismissedNotificationIds
            : []),
        ].filter((id): id is string => typeof id === 'string' && id.length > 0))
      ).slice(-150),
    };

    const hydrated: User = {
      ...currentUser,
      fullName: firestoreData.fullName || auth.currentUser.displayName || currentUser.fullName,
      country: mergedProfile.countryOfResidence || currentUser.country,
      degreeLevel: mergedProfile.intendedDegree || currentUser.degreeLevel,
      studyField: mergedProfile.fieldOfStudy || currentUser.studyField,
      savedOpportunities: Array.from(new Set(firestoreData.savedOpportunities || [])),
      applicationTracker: firestoreData.applicationTracker || {},
      targetList: hydrateTargetList(firestoreData.targetList),
      activeApplications: hydrateActiveApplications(
        firestoreData.activeApplications,
        firestoreData.applicationTracker
      ),
      profile: mergedProfile,
      isAdmin: isAdminClaim,
    };

    activeInMemoryUser = hydrated;
    setCachedUser(hydrated);
    return hydrated;
  },

  // 8c. Dashboard Profile Save (awaits Firestore and reports exact persistence outcome)
  async saveDashboardProfile(params: {
    fullName: string;
    profileData: Partial<StudentProfile>;
  }): Promise<{ success: boolean; persistedToCloud: boolean; user?: User; error?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const trimmedName = (params.fullName || '').trim();
    if (!trimmedName || trimmedName.length < 2) {
      return {
        success: false,
        persistedToCloud: false,
        error: 'Please enter your full name (at least 2 characters).',
      };
    }

    const existingProfile: StudentProfile = currentUser.profile || {
      nationality: '',
      countryOfResidence: '',
      preferredDestinations: [],
      educationLevel: '',
      intendedDegree: '',
      fieldOfStudy: '',
      graduationYear: '',
      onboardingCompleted: false,
    };

    const updatedProfile: StudentProfile = {
      ...existingProfile,
      ...params.profileData,
      onboardingCompleted: true,
    };

    const prevUser = { ...currentUser, profile: currentUser.profile ? { ...currentUser.profile } : undefined };

    currentUser.fullName = trimmedName;
    currentUser.profile = updatedProfile;
    if (updatedProfile.countryOfResidence) currentUser.country = updatedProfile.countryOfResidence;
    if (updatedProfile.intendedDegree) currentUser.degreeLevel = updatedProfile.intendedDegree;
    if (updatedProfile.fieldOfStudy) currentUser.studyField = updatedProfile.fieldOfStudy;

    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    if (auth.currentUser && trimmedName !== prevUser.fullName) {
      await updateFirebaseDisplayName(trimmedName).catch(() => {});
    }

    const fsRes = await saveStudentProfileWithStatusToFirestore(
      currentUser.id,
      currentUser.email,
      updatedProfile,
      trimmedName
    );

    if (!fsRes.success) {
      activeInMemoryUser = prevUser;
      setCachedUser(prevUser);
      return {
        success: false,
        persistedToCloud: false,
        user: prevUser,
        error: 'Failed to save your profile changes right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: fsRes.persistedToCloud,
      user: activeInMemoryUser,
    };
  },

  // 8d. Target List CRUD (Future Study Goals — completely independent from Saved & Applications)
  async upsertTargetListItem(input: {
    opportunityId: string;
    priority: TargetPriority;
    intakeYear: string;
    personalGoal: string;
  }): Promise<{ success: boolean; persistedToCloud: boolean; user?: User; error?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const prevTargets = { ...(currentUser.targetList || {}) };
    const existing = prevTargets[input.opportunityId];
    const now = new Date().toISOString();

    const nextTargets: Record<string, TargetListItem> = {
      ...prevTargets,
      [input.opportunityId]: {
        opportunityId: input.opportunityId,
        priority: input.priority,
        intakeYear: input.intakeYear.trim() || '2026',
        personalGoal: input.personalGoal.trim().slice(0, 500),
        addedAt: existing?.addedAt || now,
        updatedAt: now,
      },
    };

    currentUser.targetList = nextTargets;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      targetList: nextTargets,
    });

    if (!syncRes.success) {
      currentUser.targetList = prevTargets;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        user: activeInMemoryUser,
        error: 'Could not save this Target List item right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      user: activeInMemoryUser,
    };
  },

  async removeTargetListItem(opportunityId: string): Promise<{
    success: boolean;
    persistedToCloud: boolean;
    user?: User;
    error?: string;
  }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const prevTargets = { ...(currentUser.targetList || {}) };
    const nextTargets = { ...prevTargets };
    delete nextTargets[opportunityId];

    currentUser.targetList = nextTargets;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      targetList: nextTargets,
    });

    if (!syncRes.success) {
      currentUser.targetList = prevTargets;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        user: activeInMemoryUser,
        error: 'Could not remove this target right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      user: activeInMemoryUser,
    };
  },

  // 8e. Active Applications CRUD (Started Applications ONLY — excludes bookmarks & unstarted targets)
  async startActiveApplication(
    opportunityId: string,
    initialStage: ActiveApplicationStage = 'preparing'
  ): Promise<{
    success: boolean;
    persistedToCloud: boolean;
    alreadyExists?: boolean;
    user?: User;
    error?: string;
  }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const prevApps = { ...(currentUser.activeApplications || {}) };
    const prevTracker = { ...(currentUser.applicationTracker || {}) };

    // Prevent duplicates
    if (prevApps[opportunityId]) {
      return {
        success: true,
        persistedToCloud: true,
        alreadyExists: true,
        user: currentUser,
      };
    }

    const now = new Date().toISOString();
    const nextApps: Record<string, ActiveApplicationItem> = {
      ...prevApps,
      [opportunityId]: {
        opportunityId,
        stage: initialStage,
        completedTasks: [],
        startedAt: now,
        updatedAt: now,
      },
    };
    const nextTracker: Record<string, 'saved' | 'preparing' | 'submitted' | 'accepted'> = {
      ...prevTracker,
      [opportunityId]: initialStage,
    };

    currentUser.activeApplications = nextApps;
    currentUser.applicationTracker = nextTracker;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      activeApplications: nextApps,
      applicationTracker: nextTracker,
    });

    if (!syncRes.success) {
      currentUser.activeApplications = prevApps;
      currentUser.applicationTracker = prevTracker;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        user: activeInMemoryUser,
        error: 'Could not start this application right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      alreadyExists: false,
      user: activeInMemoryUser,
    };
  },

  async updateActiveApplication(
    opportunityId: string,
    patch: {
      stage?: ActiveApplicationStage;
      completedTasks?: string[];
      notes?: string;
      followUpDate?: string | null;
      requirementSnapshot?: string;
    }
  ): Promise<{ success: boolean; persistedToCloud: boolean; user?: User; error?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const prevApps = { ...(currentUser.activeApplications || {}) };
    const cleanedApps: Record<string, ActiveApplicationItem> = {};
    Object.entries(prevApps).forEach(([id, entry]) => {
      if (entry && typeof entry === 'object') {
        cleanedApps[id] = normalizeActiveApplicationEntry(id, entry);
      }
    });
    const prevTracker = { ...(currentUser.applicationTracker || {}) };
    const existing = cleanedApps[opportunityId];
    const now = new Date().toISOString();

    const resolvedFollowUp =
      patch.followUpDate === null
        ? undefined
        : typeof patch.followUpDate === 'string'
        ? patch.followUpDate.trim() || undefined
        : existing?.followUpDate;

    const resolvedSnapshot =
      typeof patch.requirementSnapshot === 'string'
        ? patch.requirementSnapshot
        : existing?.requirementSnapshot;

    const resolvedNotes =
      typeof patch.notes === 'string'
        ? patch.notes
        : typeof existing?.notes === 'string'
        ? existing.notes
        : undefined;

    const nextStage: ActiveApplicationStage = patch.stage || existing?.stage || 'preparing';
    const nextItem: ActiveApplicationItem = {
      opportunityId,
      stage: nextStage,
      completedTasks:
        patch.completedTasks !== undefined
          ? Array.from(new Set(patch.completedTasks))
          : existing?.completedTasks || [],
      startedAt: existing?.startedAt || now,
      updatedAt: now,
    };
    if (resolvedNotes !== undefined) {
      nextItem.notes = resolvedNotes;
    }
    if (resolvedFollowUp !== undefined) {
      nextItem.followUpDate = resolvedFollowUp;
    }
    if (resolvedSnapshot !== undefined) {
      nextItem.requirementSnapshot = resolvedSnapshot;
    }

    const nextApps = { ...cleanedApps, [opportunityId]: nextItem };
    const nextTracker = { ...prevTracker, [opportunityId]: nextStage };

    currentUser.activeApplications = nextApps;
    currentUser.applicationTracker = nextTracker;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      activeApplications: nextApps,
      applicationTracker: nextTracker,
    });

    if (!syncRes.success) {
      currentUser.activeApplications = prevApps;
      currentUser.applicationTracker = prevTracker;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        user: activeInMemoryUser,
        error: 'Could not save application updates right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      user: activeInMemoryUser,
    };
  },

  async removeActiveApplication(opportunityId: string): Promise<{
    success: boolean;
    persistedToCloud: boolean;
    user?: User;
    error?: string;
  }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, persistedToCloud: false, error: 'No active student session found.' };
    }

    const prevApps = { ...(currentUser.activeApplications || {}) };
    const prevTracker = { ...(currentUser.applicationTracker || {}) };

    const nextApps = { ...prevApps };
    delete nextApps[opportunityId];

    const nextTracker = { ...prevTracker };
    if (
      nextTracker[opportunityId] === 'preparing' ||
      nextTracker[opportunityId] === 'submitted' ||
      nextTracker[opportunityId] === 'accepted'
    ) {
      delete nextTracker[opportunityId];
    }

    currentUser.activeApplications = nextApps;
    currentUser.applicationTracker = nextTracker;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    const syncRes = await syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      activeApplications: nextApps,
      applicationTracker: nextTracker,
    });

    if (!syncRes.success) {
      currentUser.activeApplications = prevApps;
      currentUser.applicationTracker = prevTracker;
      activeInMemoryUser = { ...currentUser };
      setCachedUser(activeInMemoryUser);
      return {
        success: false,
        persistedToCloud: false,
        user: activeInMemoryUser,
        error: 'Could not remove this application right now. Please try again.',
      };
    }

    return {
      success: true,
      persistedToCloud: syncRes.persistedToCloud,
      user: activeInMemoryUser,
    };
  },


  // 10. Update Student Profile & Preferences
  updateProfile(profileData: Partial<StudentProfile>, fullName?: string): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    if (fullName && fullName.trim()) {
      currentUser.fullName = fullName.trim();
    }

    const currentProfile: StudentProfile = currentUser.profile || {
      nationality: currentUser.country === 'Ghana' ? 'Ghanaian' : `${currentUser.country} Citizen`,
      countryOfResidence: currentUser.country || 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: currentUser.degreeLevel || 'Undergraduate',
      fieldOfStudy: currentUser.studyField || 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: false,
    };

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      ...profileData,
      onboardingCompleted: true,
    };

    currentUser.profile = updatedProfile;

    if (profileData.intendedDegree) currentUser.degreeLevel = profileData.intendedDegree;
    if (profileData.fieldOfStudy) currentUser.studyField = profileData.fieldOfStudy;
    if (profileData.countryOfResidence) currentUser.country = profileData.countryOfResidence;

    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // Persist updated profile to Cloud Firestore under authenticated user's UID
    saveStudentProfileToFirestore(
      currentUser.id,
      currentUser.email,
      updatedProfile,
      currentUser.fullName
    ).catch(() => {});

    return currentUser;
  },

  // 10b. Update Account & Profile with validation, email update, and Firestore synchronization
  async updateAccountAndProfile(params: {
    fullName?: string;
    email?: string;
    profileData: Partial<StudentProfile>;
  }): Promise<{ success: boolean; user?: User; error?: string; warning?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No active authenticated student session found.' };
    }

    // 1. Validate full name
    const rawFullName = params.fullName !== undefined ? params.fullName : currentUser.fullName;
    const trimmedFullName = (rawFullName || '').trim();
    if (!trimmedFullName || trimmedFullName.length < 2) {
      return { success: false, error: 'Please enter your full legal name (at least 2 characters).' };
    }

    // 2. Validate email
    const rawEmail = params.email !== undefined ? params.email : currentUser.email;
    const trimmedEmail = (rawEmail || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 3. Validate profile fields
    const existingProfile: StudentProfile = currentUser.profile || {
      nationality: currentUser.country === 'Ghana' ? 'Ghanaian' : `${currentUser.country} Citizen`,
      countryOfResidence: currentUser.country || 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: currentUser.degreeLevel || "Undergraduate (Bachelor's)",
      fieldOfStudy: currentUser.studyField || 'Computer Science & Software Engineering',
      graduationYear: '2026',
      onboardingCompleted: true,
    };

    const targetNationality = (params.profileData.nationality ?? existingProfile.nationality ?? '').trim();
    if (!targetNationality) {
      return { success: false, error: 'Please specify your nationality / citizenship.' };
    }

    const targetResidence = (params.profileData.countryOfResidence ?? existingProfile.countryOfResidence ?? '').trim();
    if (!targetResidence) {
      return { success: false, error: 'Please specify your current country of residence.' };
    }

    const targetDegree = (params.profileData.intendedDegree ?? existingProfile.intendedDegree ?? '').trim();
    if (!targetDegree) {
      return { success: false, error: 'Please select your target degree level.' };
    }

    const targetField = (params.profileData.fieldOfStudy ?? existingProfile.fieldOfStudy ?? '').trim();
    if (!targetField || targetField.length < 2) {
      return { success: false, error: 'Please enter your academic field of study.' };
    }

    const targetGradYear = (params.profileData.graduationYear ?? existingProfile.graduationYear ?? '').trim();
    if (!targetGradYear) {
      return { success: false, error: 'Please specify your expected graduation year.' };
    }

    const targetDestinations = params.profileData.preferredDestinations ?? existingProfile.preferredDestinations ?? [];
    if (!Array.isArray(targetDestinations) || targetDestinations.length === 0) {
      return { success: false, error: 'Please select at least one preferred study destination.' };
    }

    let authWarning: string | undefined;

    // 4. Update Email in Firebase Auth where supported
    if (trimmedEmail !== currentUser.email) {
      const emailRes = await updateFirebaseUserEmail(trimmedEmail);
      if (!emailRes.success) {
        const errCode = emailRes.error?.code || '';
        if (errCode === 'auth/requires-recent-login') {
          authWarning = 'Contact email updated in your profile. To update your login password credentials, please sign in again.';
        } else if (errCode === 'auth/email-already-in-use') {
          return { success: false, error: 'This email address is already in use by another account.' };
        }
      }
      currentUser.email = trimmedEmail;
    }

    // 5. Update Full Name in Firebase Auth display name where supported
    if (trimmedFullName !== currentUser.fullName) {
      await updateFirebaseDisplayName(trimmedFullName);
      currentUser.fullName = trimmedFullName;
    }

    // 6. Merge updated profile preserving all existing fields (phone, currentSchool, notification preferences)
    const mergedProfile: StudentProfile = {
      ...existingProfile,
      ...params.profileData,
      nationality: targetNationality,
      countryOfResidence: targetResidence,
      intendedDegree: targetDegree,
      fieldOfStudy: targetField,
      graduationYear: targetGradYear,
      preferredDestinations: targetDestinations,
      onboardingCompleted: true,
    };

    currentUser.profile = mergedProfile;
    currentUser.country = targetResidence;
    currentUser.degreeLevel = targetDegree;
    currentUser.studyField = targetField;

    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // 7. Persist updated profile to Cloud Firestore under authenticated user's UID
    try {
      await saveStudentProfileToFirestore(
        currentUser.id,
        currentUser.email,
        mergedProfile,
        currentUser.fullName
      );
    } catch (fsErr) {
      console.warn('Firestore profile persist notice:', fsErr);
    }

    return { success: true, user: currentUser, warning: authWarning };
  },

  // 10c. Update Student Notification Preferences with Firestore synchronization
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No active authenticated session found. Please sign in.' };
    }

    const currentProfile: StudentProfile = currentUser.profile || {
      nationality: currentUser.country === 'Ghana' ? 'Ghanaian' : `${currentUser.country} Citizen`,
      countryOfResidence: currentUser.country || 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: currentUser.degreeLevel || "Undergraduate (Bachelor's)",
      fieldOfStudy: currentUser.studyField || 'Computer Science & Software Engineering',
      graduationYear: '2026',
      onboardingCompleted: true,
    };

    const existingPrefs = normalizeNotificationPreferences(currentProfile.notificationPreferences);
    const mergedPreferences: NotificationPreferences = normalizeNotificationPreferences({
      ...existingPrefs,
      ...preferences,
      matchingPreferences: {
        ...(existingPrefs.matchingPreferences || DEFAULT_MATCHING_PREFERENCES),
        ...(preferences.matchingPreferences || {}),
      },
      scholarshipAlerts:
        preferences.savedUpdatesAlerts ??
        preferences.scholarshipAlerts ??
        existingPrefs.scholarshipAlerts ??
        true,
      waiverAlerts:
        preferences.admissionUpdates ??
        preferences.waiverAlerts ??
        existingPrefs.waiverAlerts ??
        true,
    });

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      notificationPreferences: mergedPreferences,
    };

    const prevProfile = currentUser.profile;
    currentUser.profile = updatedProfile;
    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // Persist to Cloud Firestore under authenticated user's UID when Firebase session is active
    if (auth.currentUser && auth.currentUser.uid === currentUser.id) {
      const saveRes = await saveStudentProfileWithStatusToFirestore(
        currentUser.id,
        currentUser.email,
        updatedProfile,
        currentUser.fullName
      );
      if (!saveRes.success) {
        currentUser.profile = prevProfile;
        activeInMemoryUser = currentUser;
        setCachedUser(currentUser);
        return {
          success: false,
          error: 'Could not save your notification preferences right now. Please try again.',
        };
      }
    }

    return { success: true, user: currentUser };
  },

  async recordDismissedNotificationIdsSynced(ids: string[]): Promise<User | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || ids.length === 0) return currentUser;

    const currentProfile: StudentProfile = currentUser.profile || {
      nationality: currentUser.country === 'Ghana' ? 'Ghanaian' : `${currentUser.country} Citizen`,
      countryOfResidence: currentUser.country || 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: currentUser.degreeLevel || "Undergraduate (Bachelor's)",
      fieldOfStudy: currentUser.studyField || 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: true,
    };

    const nextDismissed = Array.from(
      new Set([
        ...(currentProfile.dismissedNotificationIds || []),
        ...ids.filter((id) => typeof id === 'string' && id.length > 0),
      ])
    ).slice(-150);

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      dismissedNotificationIds: nextDismissed,
    };

    currentUser.profile = updatedProfile;
    activeInMemoryUser = { ...currentUser };
    setCachedUser(activeInMemoryUser);

    if (auth.currentUser && auth.currentUser.uid === currentUser.id) {
      await saveStudentProfileWithStatusToFirestore(
        currentUser.id,
        currentUser.email,
        updatedProfile,
        currentUser.fullName
      ).catch(() => {});
    }

    return activeInMemoryUser;
  },

  // 10d. Update Student Study Preferences with validation and Firestore synchronization
  async updateStudyPreferences(params: {
    preferredDestinations: string[];
    intendedDegree: string;
    fieldOfStudy: string;
    preferredFieldsOfStudy?: string[];
    studyModePreference: 'on-campus' | 'online' | 'hybrid' | string;
    fundingTypePreference: 'fully_funded' | 'partially_funded' | 'self_funded' | 'all' | string;
    priorityCountry?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No active authenticated session found. Please sign in.' };
    }

    const destinations = (params.preferredDestinations || [])
      .map((d) => (typeof d === 'string' ? d.trim() : ''))
      .filter(Boolean);

    if (destinations.length === 0) {
      return { success: false, error: 'Please select at least one preferred study destination country.' };
    }

    const degree = (params.intendedDegree || '').trim();
    if (!degree) {
      return { success: false, error: 'Please select your target degree level.' };
    }

    const mainField = (params.fieldOfStudy || '').trim();
    if (!mainField) {
      return { success: false, error: 'Please specify your preferred academic field of study.' };
    }

    const studyMode = params.studyModePreference || 'on-campus';
    const fundingType = params.fundingTypePreference || 'all';

    const currentProfile: StudentProfile = currentUser.profile || {
      nationality: currentUser.country === 'Ghana' ? 'Ghanaian' : `${currentUser.country} Citizen`,
      countryOfResidence: currentUser.country || 'Ghana',
      preferredDestinations: destinations,
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: degree,
      fieldOfStudy: mainField,
      graduationYear: '2026',
      onboardingCompleted: true,
    };

    const preferredFields =
      params.preferredFieldsOfStudy && params.preferredFieldsOfStudy.length > 0
        ? params.preferredFieldsOfStudy
        : [mainField];

    const fundingPreferenceLabel =
      fundingType === 'fully_funded'
        ? 'Fully Funded Only'
        : fundingType === 'partially_funded'
        ? 'Partial & Merit Scholarships'
        : fundingType === 'self_funded'
        ? 'Self-Funded / Standard Tuition'
        : 'All Funding Types';

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      preferredDestinations: destinations,
      intendedDegree: degree,
      fieldOfStudy: mainField,
      preferredFieldsOfStudy: preferredFields,
      studyModePreference: studyMode,
      fundingTypePreference: fundingType,
      fundingPreference: fundingPreferenceLabel,
      onboardingCompleted: true,
    };

    currentUser.profile = updatedProfile;
    currentUser.degreeLevel = degree;
    currentUser.studyField = mainField;

    if (params.priorityCountry && destinations.includes(params.priorityCountry)) {
      currentUser.country = params.priorityCountry;
    }

    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // Persist to Cloud Firestore under authenticated user's UID
    try {
      await saveStudentProfileToFirestore(
        currentUser.id,
        currentUser.email,
        updatedProfile,
        currentUser.fullName
      );
    } catch (fsErr) {
      console.warn('Firestore study preferences save notice:', fsErr);
    }

    return { success: true, user: currentUser };
  },

  // 11. Clear Saved Opportunities
  clearSavedOpportunities(): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    currentUser.savedOpportunities = [];
    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    syncStudentDashboardListsToFirestore(currentUser.id, currentUser.email, {
      savedOpportunities: [],
    }).catch(() => {});

    return currentUser;
  },

  // 12. Delete Student Account (Temporarily Disabled on Starter Tier)
  async deleteAccount(): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
    return {
      success: false,
      error: 'Account deletion is temporarily unavailable. Please contact support for assistance.',
    };
  },

  // 13. Secure Sign Out from All Supported Sessions
  async logoutAllSessions(): Promise<{ success: boolean }> {
    try {
      await logoutFromFirebase();
    } catch {}
    activeInMemoryUser = null;
    setCachedUser(null);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHED_USER_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    return { success: true };
  },

  // 14. Listen to Real-Time Firebase Auth State Changes Across Tabs & Devices
  initAuthListener(onUserChanged: (user: User | null) => void): () => void {
    return subscribeToFirebaseAuthState(async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const { user: syncedUser } = await hydrateAuthenticatedUser(fbUser, {
          persistIfMissingProfile: false,
          forceAdminRefresh: false,
        });

        activeInMemoryUser = syncedUser;
        setCachedUser(syncedUser);
        onUserChanged(syncedUser);
      } else {
        activeInMemoryUser = null;
        setCachedUser(null);
        onUserChanged(null);
      }
    });
  },
};
