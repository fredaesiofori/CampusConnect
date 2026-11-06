/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  auth,
  registerWithFirebase,
  loginWithFirebase,
  logoutFromFirebase,
  sendFirebasePasswordReset,
  changeFirebasePassword,
  getFirebaseActiveSessionInfo,
  refreshFirebaseSessionToken,
  saveStudentProfileToFirestore,
  syncSavedOpportunitiesToFirestore,
  fetchStudentProfileFromFirestore,
  subscribeToFirebaseAuthState,
  updateFirebaseUserEmail,
  updateFirebaseDisplayName,
  deleteStudentAccountFromFirebase,
} from './firebase';
import { getCountryByName } from '../data/countries';
import { User as FirebaseUser } from 'firebase/auth';

export interface NotificationPreferences {
  deadlineAlerts: boolean; // Scholarship and application deadlines
  savedUpdatesAlerts: boolean; // Saved university and scholarship updates
  trackerReminders: boolean; // Application tracker reminders
  admissionUpdates: boolean; // Important university admission updates
  scholarshipAlerts?: boolean;
  waiverAlerts?: boolean;
  weeklyDigest?: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  deadlineAlerts: true,
  savedUpdatesAlerts: true,
  trackerReminders: true,
  admissionUpdates: true,
  scholarshipAlerts: true,
  waiverAlerts: true,
  weeklyDigest: false,
};

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
  profile?: StudentProfile;
  isDemo?: boolean;
  role?: 'student' | 'admin';
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  country: string;
  degreeLevel: string;
  studyField: string;
}

export interface PasswordResetToken {
  email: string;
  code: string;
  expiresAt: number;
}

const CACHED_USER_KEY = 'campus_connect_cached_active_user';
const SESSION_STORAGE_KEY = 'campus_connect_active_session_user_id';
const LEGACY_STORAGE_KEY = 'campus_connect_registered_users';
const RESET_TOKENS_STORAGE_KEY = 'campus_connect_pwd_reset_tokens';

// Security: Strip legacy password hashes and salts from local storage
export function cleanupLegacyLocalStorage(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: User | null): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_STORAGE_KEY, user.id);
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set cached user:', e);
  }
}

function getStoredResetTokens(): PasswordResetToken[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESET_TOKENS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredResetTokens(tokens: PasswordResetToken[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  } catch (e) {
    console.error('Failed to save reset tokens', e);
  }
}

const DEMO_USER_ID = 'usr_demo_kwame_mensah';
const DEMO_EMAIL = 'scholar.ghana@campusconnect.edu';

export function getDemoScholar(): User {
  return {
    id: DEMO_USER_ID,
    fullName: 'Kwame Mensah',
    email: DEMO_EMAIL,
    country: 'Ghana',
    countryCode: 'GH',
    degreeLevel: 'Undergraduate',
    studyField: 'Computer Science & Engineering',
    createdAt: '2026-01-15T09:00:00.000Z',
    savedOpportunities: ['ashesi-ghana', 'berea-college-usa'],
    applicationTracker: {
      'ashesi-ghana': 'preparing',
      'berea-college-usa': 'saved',
    },
    profile: {
      nationality: 'Ghanaian',
      countryOfResidence: 'Ghana',
      preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada', 'Germany'],
      educationLevel: 'Senior High School / WASSCE',
      intendedDegree: 'Undergraduate',
      fieldOfStudy: 'Computer Science & Engineering',
      graduationYear: '2026',
      onboardingCompleted: true,
      studyModePreference: 'on-campus',
      fundingTypePreference: 'fully_funded',
      preferredFieldsOfStudy: ['Computer Science & Engineering', 'Software Engineering', 'Artificial Intelligence'],
      notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    },
    isDemo: true,
  };
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
            'Email and password registration is temporarily unavailable. Please try again shortly or use the demo scholar preview.',
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
          error: 'Password is too weak. Please use at least 6 characters (mix of uppercase, numbers, and symbols).',
        };
      }
      if (code === 'auth/invalid-email') {
        return {
          success: false,
          error: 'Please enter a valid email address.',
        };
      }
      return {
        success: false,
        error: fbError?.message || 'Registration failed. Please check your network and credentials.',
      };
    }

    const fbUser = userCredential.user;
    const uid = fbUser.uid;

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
      profile: newProfile,
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
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    isConsoleSetupRequired?: boolean;
  }> {
    cleanupLegacyLocalStorage();
    const normalizedEmail = email.trim().toLowerCase();

    // Dedicated Demo Scholar One-Click Handler
    if (normalizedEmail === DEMO_EMAIL && (password === 'Scholar2026!' || !password)) {
      const demo = getDemoScholar();
      activeInMemoryUser = demo;
      setCachedUser(demo);
      return { success: true, user: demo };
    }

    // Call real Firebase Auth API
    const { userCredential, error: fbError } = await loginWithFirebase(normalizedEmail, password);

    if (fbError || !userCredential) {
      const code = fbError?.code || '';

      if (code === 'auth/operation-not-allowed') {
        return {
          success: false,
          isConsoleSetupRequired: true,
          error:
            'Email and password sign-in is temporarily unavailable. Please try again shortly or use the demo scholar preview.',
        };
      }
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
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
      return {
        success: false,
        error: fbError?.message || 'Login failed. Please verify your credentials and network connection.',
      };
    }

    const fbUser = userCredential.user;
    const uid = fbUser.uid;

    // Fetch existing private profile, saved opportunities & tracker from Firestore
    const firestoreData = await fetchStudentProfileFromFirestore(uid);

    let resolvedProfile: StudentProfile;
    let resolvedSaved: string[] = [];
    let resolvedTracker: Record<string, 'saved' | 'preparing' | 'submitted' | 'accepted'> = {};

    if (firestoreData && firestoreData.profile) {
      resolvedProfile = {
        ...firestoreData.profile,
        notificationPreferences: {
          ...DEFAULT_NOTIFICATION_PREFERENCES,
          ...(firestoreData.profile.notificationPreferences || {}),
        },
      };
      resolvedSaved = firestoreData.savedOpportunities || [];
      resolvedTracker = firestoreData.applicationTracker || {};
    } else {
      // First-time sync for newly created Firebase user
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
      await saveStudentProfileToFirestore(
        uid,
        normalizedEmail,
        resolvedProfile,
        fbUser.displayName || 'Scholar'
      ).catch(() => {});
    }

    const loggedInUser: User = {
      id: uid,
      fullName: fbUser.displayName || 'Scholar',
      email: normalizedEmail,
      country: resolvedProfile.countryOfResidence || 'Ghana',
      countryCode: 'GH',
      degreeLevel: resolvedProfile.intendedDegree || 'Undergraduate',
      studyField: resolvedProfile.fieldOfStudy || 'Computer Science & Engineering',
      createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      savedOpportunities: resolvedSaved,
      applicationTracker: resolvedTracker,
      profile: resolvedProfile,
    };

    activeInMemoryUser = loggedInUser;
    setCachedUser(loggedInUser);

    return { success: true, user: loggedInUser };
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
    isDemo?: boolean;
    code?: string;
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

    // Demo Account Special Handler
    if (normalizedEmail === DEMO_EMAIL) {
      return {
        success: true,
        isDemo: true,
        message: 'Demo Scholar Kwame Mensah: Your account is for evaluation. The current password is "Scholar2026!".',
      };
    }

    // Call real Firebase sendPasswordResetEmail
    const { success, error } = await sendFirebasePasswordReset(normalizedEmail);

    if (success) {
      return {
        success: true,
        sentEmail: true,
        message: `An official password reset link has been dispatched to ${normalizedEmail}. Please check your inbox and spam folders to set a new password.`,
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

    return {
      success: false,
      error: error?.message || 'Failed to dispatch password reset request.',
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
    const trimmedCurrent = (currentPassword || '').trim();
    const trimmedNew = (newPassword || '').trim();

    if (!trimmedCurrent) {
      return { success: false, error: 'Please enter your current password.' };
    }

    if (!trimmedNew) {
      return { success: false, error: 'Please enter your new password.' };
    }

    if (trimmedNew.length < 6) {
      return { success: false, error: 'Your new password must be at least 6 characters long.' };
    }

    if (trimmedNew === trimmedCurrent) {
      return {
        success: false,
        error: 'The new password must be different from your current password.',
      };
    }

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No active authenticated session found. Please sign in.' };
    }

    // Demo account handling (never store passwords or hashes in localStorage or Firestore)
    if (currentUser.isDemo || currentUser.email === DEMO_EMAIL) {
      if (trimmedCurrent !== 'Scholar2026!') {
        return {
          success: false,
          error: 'Current password for demo scholar account is incorrect (default is "Scholar2026!").',
        };
      }
      return { success: true };
    }

    // Call real Firebase Authentication API
    return await changeFirebasePassword(trimmedCurrent, trimmedNew);
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

  // 6. Reset Password with Verification Code (for testing/demo fallback)
  async resetPassword(
    email: string,
    code: string,
    _newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === DEMO_EMAIL) {
      return { success: true };
    }

    const tokens = getStoredResetTokens();
    const validToken = tokens.find(
      (t) => t.email === normalizedEmail && t.code === code.trim() && t.expiresAt > Date.now()
    );

    if (!validToken) {
      return {
        success: false,
        error: 'Invalid or expired recovery code. Please request a new verification code.',
      };
    }

    // Invalidate token
    const remainingTokens = tokens.filter((t) => t.email !== normalizedEmail);
    saveStoredResetTokens(remainingTokens);

    return { success: true };
  },

  // 7. Toggle Saved Opportunity
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
    syncSavedOpportunitiesToFirestore(
      currentUser.id,
      currentUser.email,
      currentUser.savedOpportunities,
      currentUser.applicationTracker || {}
    ).catch(() => {});

    return currentUser;
  },

  // 8. Update Application Tracker status
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
    activeInMemoryUser = currentUser;
    setCachedUser(currentUser);

    // Sync tracker stage to Cloud Firestore under authenticated user's UID
    syncSavedOpportunitiesToFirestore(
      currentUser.id,
      currentUser.email,
      currentUser.savedOpportunities || [],
      currentUser.applicationTracker
    ).catch(() => {});

    return currentUser;
  },

  // 9. Initialize Default Authentic Demo Account
  async initDefaultDemoUser(): Promise<void> {
    cleanupLegacyLocalStorage();
    const cached = getCachedUser();
    if (!cached) {
      const demo = getDemoScholar();
      activeInMemoryUser = demo;
      setCachedUser(demo);
    }
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

    const existingPrefs = currentProfile.notificationPreferences || DEFAULT_NOTIFICATION_PREFERENCES;
    const mergedPreferences: NotificationPreferences = {
      ...existingPrefs,
      ...preferences,
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
    };

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      notificationPreferences: mergedPreferences,
    };

    currentUser.profile = updatedProfile;
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
      console.warn('Firestore notification preferences save notice:', fsErr);
    }

    return { success: true, user: currentUser };
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

    syncSavedOpportunitiesToFirestore(
      currentUser.id,
      currentUser.email,
      [],
      currentUser.applicationTracker || {}
    ).catch(() => {});

    return currentUser;
  },

  // 12. Delete Student Account & All Associated Records (Right to Erasure)
  async deleteAccount(): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No active student session found.' };
    }

    // Handle Demo scholar account reset
    if (currentUser.isDemo || currentUser.id === DEMO_USER_ID) {
      activeInMemoryUser = null;
      setCachedUser(null);
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHED_USER_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
      return { success: true };
    }

    // Real Firebase student account and Firestore record deletion
    const res = await deleteStudentAccountFromFirebase(currentUser.id);
    if (!res.success) {
      return res;
    }

    activeInMemoryUser = null;
    setCachedUser(null);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHED_USER_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    return { success: true };
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
        const uid = fbUser.uid;
        // Fetch fresh Firestore user data
        const firestoreData = await fetchStudentProfileFromFirestore(uid);

        let profile: StudentProfile = firestoreData?.profile || {
          nationality: 'Ghanaian',
          countryOfResidence: 'Ghana',
          preferredDestinations: ['Ghana', 'United States', 'United Kingdom', 'Canada'],
          educationLevel: 'Senior High School / WASSCE',
          intendedDegree: 'Undergraduate',
          fieldOfStudy: 'Computer Science & Engineering',
          graduationYear: '2026',
          onboardingCompleted: false,
        };

        const syncedUser: User = {
          id: uid,
          fullName: fbUser.displayName || 'Scholar',
          email: fbUser.email || '',
          country: profile.countryOfResidence || 'Ghana',
          countryCode: 'GH',
          degreeLevel: profile.intendedDegree || 'Undergraduate',
          studyField: profile.fieldOfStudy || 'Computer Science & Engineering',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          savedOpportunities: firestoreData?.savedOpportunities || [],
          applicationTracker: firestoreData?.applicationTracker || {},
          profile,
        };

        activeInMemoryUser = syncedUser;
        setCachedUser(syncedUser);
        onUserChanged(syncedUser);
      } else {
        // If not in Firebase Auth, check if currently in demo mode
        const cached = getCachedUser();
        if (cached && cached.isDemo) {
          activeInMemoryUser = cached;
          onUserChanged(cached);
        } else {
          activeInMemoryUser = null;
          setCachedUser(null);
          onUserChanged(null);
        }
      }
    });
  },
};
