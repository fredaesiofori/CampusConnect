/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile as updateFirebaseProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  OAuthCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { authenticOpportunities, OpportunityItem } from '../data/opportunities';
import { StudentProfile } from './auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Warning/Notice: ', JSON.stringify(errInfo));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively omits `undefined` object keys and array entries before writing
 * to Cloud Firestore so optional fields never trigger `Unsupported field value: undefined`.
 * Preserves `null`, empty strings `""`, booleans, numbers, arrays, and non-plain objects.
 */
export function sanitizeFirestoreData<T>(value: T): T {
  if (value === undefined) {
    return undefined as unknown as T;
  }
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => sanitizeFirestoreData(item))
      .filter((item) => item !== undefined);
    return cleanedArray as unknown as T;
  }
  if (isPlainObject(value)) {
    const cleanedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined) continue;
      const sanitizedVal = sanitizeFirestoreData(val);
      if (sanitizedVal !== undefined) {
        cleanedObj[key] = sanitizedVal;
      }
    }
    return cleanedObj as T;
  }
  return value;
}

export interface FirebaseConnectionStatus {
  isConnected: boolean;
  projectId: string;
  databaseId: string;
  error?: string;
}

// 1. Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfigData);
} else {
  app = getApp();
}

// 2. Initialize Firebase Authentication & Cloud Firestore with robust Long-Polling
// experimentalForceLongPolling avoids WebChannel streaming timeouts in iframe/proxy environments
export const auth: Auth = getAuth(app);

export const db: Firestore = (() => {
  try {
    return firebaseConfigData.firestoreDatabaseId
      ? initializeFirestore(
          app,
          {
            experimentalAutoDetectLongPolling: true,
          },
          firebaseConfigData.firestoreDatabaseId
        )
      : initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
        });
  } catch {
    // If initializeFirestore was already called on this app instance during HMR
    return firebaseConfigData.firestoreDatabaseId
      ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export const currentFirebaseProjectId = firebaseConfigData.projectId;
export const currentFirestoreDatabaseId = firebaseConfigData.firestoreDatabaseId;

let connectionTested = false;
let isDbOnline = false;

// 3. Test Connection with Guarded Timeout
export async function testFirestoreConnection(): Promise<FirebaseConnectionStatus> {
  if (connectionTested) {
    return {
      isConnected: isDbOnline,
      projectId: currentFirebaseProjectId,
      databaseId: currentFirestoreDatabaseId,
    };
  }

  try {
    // Probe connection using getDoc on opportunities collection with 5s timeout
    const probePromise = getDoc(doc(db, 'opportunities', 'probe-connection'));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection probe timed out')), 5000)
    );
    await Promise.race([probePromise, timeoutPromise]);
    connectionTested = true;
    isDbOnline = true;
    return {
      isConnected: true,
      projectId: currentFirebaseProjectId,
      databaseId: currentFirestoreDatabaseId,
    };
  } catch (error) {
    connectionTested = true;
    const msg = error instanceof Error ? error.message : String(error);
    const isActuallyReachable =
      msg.includes('permission-denied') || msg.includes('not-found');
    isDbOnline = isActuallyReachable;
    return {
      isConnected: isActuallyReachable,
      projectId: currentFirebaseProjectId,
      databaseId: currentFirestoreDatabaseId,
      error: msg,
    };
  }
}

// 4. Return Active Firebase User Session
export async function ensureFirebaseAuth(): Promise<FirebaseUser | null> {
  return auth.currentUser;
}

// 5. Firebase Email/Password Authentication API
export async function registerWithFirebase(
  email: string,
  pass: string,
  fullName?: string
): Promise<{ userCredential?: UserCredential; error?: any }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (fullName && cred.user) {
      try {
        await updateFirebaseProfile(cred.user, { displayName: fullName });
      } catch (profileErr) {
        console.warn('Could not update Firebase displayName:', profileErr);
      }
    }
    return { userCredential: cred };
  } catch (err: any) {
    return { error: err };
  }
}

export async function applyFirebaseAuthPersistence(rememberMe: boolean): Promise<void> {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  } catch (err) {
    console.warn('Firebase auth persistence fallback notice:', err);
  }
}

export async function loginWithFirebase(
  email: string,
  pass: string,
  rememberMe = true
): Promise<{ userCredential?: UserCredential; error?: any }> {
  try {
    await applyFirebaseAuthPersistence(rememberMe);
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { userCredential: cred };
  } catch (err: any) {
    return { error: err };
  }
}

export async function loginWithGoogleFirebase(rememberMe = true): Promise<{
  userCredential?: UserCredential;
  error?: any;
  pendingCredential?: OAuthCredential | null;
  pendingEmail?: string;
}> {
  try {
    await applyFirebaseAuthPersistence(rememberMe);
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return { userCredential: cred };
  } catch (err: any) {
    const code = err?.code || '';
    let pendingCredential: OAuthCredential | null = null;
    let pendingEmail: string | undefined;
    if (code === 'auth/account-exists-with-different-credential') {
      pendingCredential = GoogleAuthProvider.credentialFromError(err);
      pendingEmail =
        typeof err?.customData?.email === 'string'
          ? err.customData.email
          : undefined;
    }
    return {
      error: err,
      pendingCredential,
      pendingEmail,
    };
  }
}

export async function linkPendingCredentialWithPasswordFirebase(
  email: string,
  password: string,
  pendingCredential: OAuthCredential,
  rememberMe = true
): Promise<{ userCredential?: UserCredential; error?: any }> {
  try {
    await applyFirebaseAuthPersistence(rememberMe);
    const existingCred = await signInWithEmailAndPassword(auth, email, password);
    const linkedCred = await linkWithCredential(existingCred.user, pendingCredential);
    return { userCredential: linkedCred };
  } catch (err: any) {
    return { error: err };
  }
}

export async function logoutFromFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut notice:', err);
  }
}

export async function sendFirebasePasswordReset(
  email: string
): Promise<{ success: boolean; error?: any }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Verifies whether the currently authenticated user holds a server-minted
 * Firebase Auth custom claim (`admin === true`). Never checks email strings
 * or client-side mutable flags.
 */
export async function checkCurrentUserIsAdmin(forceRefresh = false): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      return false;
    }
    const tokenResult = await user.getIdTokenResult(forceRefresh);
    return tokenResult?.claims?.admin === true;
  } catch {
    return false;
  }
}

export function subscribeToFirebaseAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function updateFirebaseUserEmail(
  newEmail: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const user = auth.currentUser;
    if (user && !user.isAnonymous && user.email !== newEmail) {
      await updateEmail(user, newEmail);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function updateFirebaseDisplayName(
  displayName: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const user = auth.currentUser;
    if (user && !user.isAnonymous) {
      await updateFirebaseProfile(user, { displayName });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function changeFirebasePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
  try {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      return {
        success: false,
        error: 'No active authenticated account session found. Please sign in to update your password.',
      };
    }

    if (!user.email) {
      return {
        success: false,
        error: 'This account does not have a registered email address for password credentials.',
      };
    }

    // 1. Re-authenticate user with current password
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (reauthErr: any) {
      const code = reauthErr?.code || '';
      if (
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-login-credentials'
      ) {
        return {
          success: false,
          error: 'The current password you entered is incorrect. Please check and try again.',
        };
      }
      if (code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many attempts. Access is temporarily restricted. Please try again later.',
        };
      }
      console.warn('Password reauthentication error:', reauthErr);
      return {
        success: false,
        error: 'Could not verify your current password. Please check and try again.',
      };
    }

    // 2. Perform password update with Firebase Auth
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/requires-recent-login') {
      return {
        success: false,
        requiresReauth: true,
        error: 'For security reasons, please sign out and sign back in to confirm this password change.',
      };
    }
    if (code === 'auth/weak-password') {
      return {
        success: false,
        error: 'The new password must be at least 8 characters long and include both letters and numbers.',
      };
    }
    console.warn('Password update error:', err);
    return {
      success: false,
      error: 'Failed to update password. Please try again.',
    };
  }
}

export async function getFirebaseActiveSessionInfo(): Promise<{
  creationTime: string | null;
  lastSignInTime: string | null;
  emailVerified: boolean;
  providerId: string;
  isTokenValid: boolean;
}> {
  const user = auth.currentUser;
  if (!user) {
    return {
      creationTime: null,
      lastSignInTime: null,
      emailVerified: false,
      providerId: 'None',
      isTokenValid: false,
    };
  }

  return {
    creationTime: user.metadata.creationTime || null,
    lastSignInTime: user.metadata.lastSignInTime || null,
    emailVerified: user.emailVerified || false,
    providerId: user.providerData?.map((p) => p.providerId).join(', ') || 'password',
    isTokenValid: true,
  };
}

export async function refreshFirebaseSessionToken(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No active student session found.' };
    }
    await user.getIdToken(true);
    return { success: true };
  } catch (err: any) {
    console.warn('Session refresh error:', err);
    return { success: false, error: 'Failed to refresh your active session.' };
  }
}

// 6. Seed Verified Real Opportunities into Cloud Firestore (Admin Custom Claim Required)
// Uses writeBatch for high-speed atomic upload (single HTTP request per batch)
export async function seedVerifiedOpportunitiesToFirestore(): Promise<number> {
  const fbUser = await ensureFirebaseAuth();
  if (!fbUser) {
    throw new Error('Authentication required to synchronize university directory records.');
  }

  const hasAdminClaim = await checkCurrentUserIsAdmin(true);
  if (!hasAdminClaim) {
    throw new Error(
      'Administrator privileges are required to modify university and opportunity records.'
    );
  }

  try {
    let seededCount = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < authenticOpportunities.length; i += BATCH_SIZE) {
      const chunk = authenticOpportunities.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const docRef = doc(db, 'opportunities', item.id);
        batch.set(
          docRef,
          sanitizeFirestoreData({
            id: item.id,
            officialName: item.officialName,
            institution: item.institution,
            shortName: item.shortName,
            country: item.country,
            countryCode: item.countryCode,
            countryFlag: item.countryFlag,
            city: item.city,
            officialWebsite: item.officialWebsite,
            sourceUrl: item.sourceUrl,
            category: item.category,
            institutionType: item.institutionType,
            title: item.title,
            isVerified: item.isVerified,
            verificationSource: item.verificationSource,
            verifiedAt: item.verifiedAt,
            eligibilityCountries: item.eligibilityCountries || ['All Countries', 'International Worldwide'],
            nationalityEligibility: item.nationalityEligibility,
            degreeLevels: item.degreeLevels || ['Undergraduate'],
            fundingDetails: item.fundingDetails || item.funding,
            funding: item.funding || item.fundingDetails,
            applicationFees: item.applicationFees || item.applicationFee,
            applicationFee: item.applicationFee || item.applicationFees,
            testWaiverRules: item.testWaiverRules || item.testPolicy,
            testPolicy: item.testPolicy || item.testWaiverRules,
            deadlines: item.deadlines,
            admissionsRequirements: item.admissionsRequirements,
            studyFields: item.studyFields || [],
            intakeTerm: item.intakeTerm,
            verifiedBadge: item.verifiedBadge,
            summary: item.summary,
            officialRuleSummary: item.officialRuleSummary,
            officialUrl: item.officialUrl || item.sourceUrl || item.officialWebsite,
            logo: item.logo,
            lastSyncedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }

      await batch.commit();
      seededCount += chunk.length;
    }

    return seededCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'opportunities');
    throw error;
  }
}

const DATA_REVISION_ISO = '2026-11-19T03:00:00.000Z';

// 7. Fetch Verified Opportunities from Cloud Firestore (Read-Only for Students)
export async function fetchVerifiedOpportunitiesFromFirestore(): Promise<OpportunityItem[]> {
  try {
    const oppCol = collection(db, 'opportunities');
    const fetchPromise = getDocs(oppCol);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore fetch timeout - falling back to verified registry')), 6000)
    );
    const snapshot = await Promise.race([fetchPromise, timeoutPromise]);

    if (snapshot.empty) {
      return authenticOpportunities;
    }

    const curatedById = new Map<string, OpportunityItem>(
      authenticOpportunities.map((item) => [item.id, item])
    );

    const firestoreItems: OpportunityItem[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<OpportunityItem> & { lastSyncedAt?: string };
      if (data && data.officialName) {
        const docId = data.id || docSnap.id;
        const curated = curatedById.get(docId);

        // Prefer freshly audited curated data if the Firestore document predates the latest audit
        if (curated && (!data.lastSyncedAt || data.lastSyncedAt < DATA_REVISION_ISO)) {
          const normCuratedName = curated.officialName.toLowerCase().trim();
          if (!seenIds.has(curated.id) && !seenNames.has(normCuratedName)) {
            seenIds.add(curated.id);
            seenNames.add(normCuratedName);
            firestoreItems.push(curated);
          }
          return;
        }

        if (!data.isVerified && !curated) {
          return;
        }

        const normName = data.officialName.toLowerCase().trim();
        if (!seenIds.has(docId) && !seenNames.has(normName)) {
          seenIds.add(docId);
          seenNames.add(normName);

          const fundingObj = data.funding || data.fundingDetails || {
            type: 'Tuition Waiver',
            amount: 'See Official Website',
            details: 'Financial aid and tuition options available upon admission.',
          };
          const appFeeObj = data.applicationFee || data.applicationFees || {
            status: 'Fee Waiver Available',
            details: 'Contact the admissions office or verify on the official application portal.',
          };
          const testPolicyObj = data.testPolicy || data.testWaiverRules || {
            status: 'Test-Optional',
            details: 'Standardized testing requirements vary by faculty; verify directly on official portal.',
          };

          const normalizedItem: OpportunityItem = {
            id: docId,
            officialName: data.officialName,
            institution: data.institution || data.officialName,
            shortName: data.shortName || data.officialName,
            country: data.country || '',
            countryCode: data.countryCode || '',
            countryFlag: data.countryFlag || '🌐',
            city: data.city || '',
            officialWebsite: data.officialWebsite || '',
            sourceUrl: data.sourceUrl || data.officialUrl || data.officialWebsite || '',
            officialUrl: data.officialUrl || data.sourceUrl || data.officialWebsite || '',
            category: data.category || 'university',
            institutionType: data.institutionType || 'Public University',
            title: data.title || `${data.officialName} Admissions`,
            isVerified: Boolean(data.isVerified),
            verificationSource: data.verificationSource || 'Official Accreditation',
            verifiedAt: data.verifiedAt || 'Academic Year 2026/2027',
            linkStatus: data.linkStatus,
            reviewNote: data.reviewNote,
            logo: data.logo || {
              bg: '#1E293B',
              text: '#FFFFFF',
              monogram: (data.officialName || 'CC').substring(0, 3).toUpperCase(),
              crestColor: '#6846F5',
            },
            eligibilityCountries: data.eligibilityCountries || ['All Countries', 'International Worldwide'],
            nationalityEligibility: data.nationalityEligibility || {
              category: 'All International Citizens',
              details: 'Open to all international students worldwide.',
              eligibleRegions: ['International / Global', 'Ghana', 'Africa'],
            },
            degreeLevels: data.degreeLevels || ['Undergraduate', 'Postgraduate'],
            fundingDetails: data.fundingDetails || fundingObj,
            funding: data.funding || fundingObj,
            applicationFees: data.applicationFees || appFeeObj,
            applicationFee: data.applicationFee || appFeeObj,
            testWaiverRules: data.testWaiverRules || testPolicyObj,
            testPolicy: data.testPolicy || testPolicyObj,
            deadlines: data.deadlines || {
              term: 'Upcoming Intake',
              deadlineText: 'Rolling Admissions',
              isRolling: true,
            },
            admissionsRequirements: data.admissionsRequirements || {
              academic: 'Specific academic cutoffs vary by faculty — verify on official portal.',
              language: 'Confirm language requirements on official admissions portal.',
              documents: ['Official Academic Transcripts', 'Identification / Passport'],
            },
            studyFields: data.studyFields || ['General Studies', 'Science & Technology'],
            intakeTerm: data.intakeTerm || 'Upcoming Intake',
            verifiedBadge: data.verifiedBadge || 'Verified Institution',
            summary: data.summary || `${data.officialName} is an accredited university.`,
            officialRuleSummary: data.officialRuleSummary || 'Admissions open for international candidates.',
          };

          firestoreItems.push(normalizedItem);
        }
      }
    });

    // Include any curated records not yet present in Firestore
    for (const curated of authenticOpportunities) {
      const normName = curated.officialName.toLowerCase().trim();
      if (!seenIds.has(curated.id) && !seenNames.has(normName)) {
        seenIds.add(curated.id);
        seenNames.add(normName);
        firestoreItems.push(curated);
      }
    }

    return firestoreItems.length > 0 ? firestoreItems : authenticOpportunities;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'opportunities');
    return authenticOpportunities;
  }
}

export interface FirestoreMutationResult {
  success: boolean;
  persistedToCloud: boolean;
  error?: string;
}

// 8. Student Profile Firestore Operations (Private & Secure per User)
export async function saveStudentProfileToFirestore(
  userId: string,
  userEmail: string,
  profile: StudentProfile,
  fullName?: string
): Promise<boolean> {
  const res = await saveStudentProfileWithStatusToFirestore(userId, userEmail, profile, fullName);
  return res.persistedToCloud;
}

export async function saveStudentProfileWithStatusToFirestore(
  userId: string,
  userEmail: string,
  profile: StudentProfile,
  fullName?: string
): Promise<FirestoreMutationResult> {
  const fbUser = auth.currentUser;
  if (!fbUser || !userId || fbUser.uid !== userId) {
    return {
      success: false,
      persistedToCloud: false,
      error: 'Please sign in again to save changes to your account.',
    };
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    const cleanProfile = sanitizeFirestoreData(profile);
    await setDoc(
      userDocRef,
      sanitizeFirestoreData({
        uid: targetUid,
        email: userEmail || fbUser.email || '',
        ...(fullName ? { fullName: fullName.slice(0, 120) } : {}),
        profile: cleanProfile,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
    return { success: true, persistedToCloud: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return {
      success: false,
      persistedToCloud: false,
      error: 'Could not save your profile changes right now. Please try again.',
    };
  }
}

export interface FirestoreStudentProfileDocResult {
  exists: boolean;
  failed: boolean;
  data: {
    fullName?: string;
    profile?: StudentProfile;
    savedOpportunities?: string[];
    applicationTracker?: Record<string, any>;
    targetList?: Record<string, any>;
    activeApplications?: Record<string, any>;
  } | null;
}

export async function fetchStudentProfileDocFromFirestore(
  userId: string
): Promise<FirestoreStudentProfileDocResult> {
  const fbUser = auth.currentUser;
  if (!fbUser || !userId || fbUser.uid !== userId) {
    return { exists: false, failed: true, data: null };
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    let docSnap;
    try {
      docSnap = await getDocFromServer(userDocRef);
    } catch {
      docSnap = await getDoc(userDocRef);
    }
    if (docSnap.exists()) {
      return { exists: true, failed: false, data: docSnap.data() as any };
    }
    return { exists: false, failed: false, data: null };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return { exists: false, failed: true, data: null };
  }
}

export async function fetchStudentProfileFromFirestore(
  userId: string
): Promise<{
  fullName?: string;
  profile?: StudentProfile;
  savedOpportunities?: string[];
  applicationTracker?: Record<string, any>;
  targetList?: Record<string, any>;
  activeApplications?: Record<string, any>;
} | null> {
  const res = await fetchStudentProfileDocFromFirestore(userId);
  return res.data;
}

// 9. Saved Opportunities, Target List, and Active Applications Firestore Persistence
export async function syncSavedOpportunitiesToFirestore(
  userId: string,
  userEmail: string,
  savedOpportunities: string[],
  applicationTracker: Record<string, string>
): Promise<boolean> {
  const res = await syncStudentDashboardListsToFirestore(userId, userEmail, {
    savedOpportunities,
    applicationTracker,
  });
  return res.persistedToCloud;
}

export async function syncStudentDashboardListsToFirestore(
  userId: string,
  userEmail: string,
  payload: {
    savedOpportunities?: string[];
    applicationTracker?: Record<string, string>;
    targetList?: Record<string, any>;
    activeApplications?: Record<string, any>;
  }
): Promise<FirestoreMutationResult> {
  const fbUser = auth.currentUser;
  if (!fbUser || !userId || fbUser.uid !== userId) {
    return {
      success: false,
      persistedToCloud: false,
      error: 'Please sign in again to sync your records.',
    };
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    const updateData: Record<string, any> = {
      uid: targetUid,
      email: userEmail || fbUser.email || '',
      updatedAt: new Date().toISOString(),
    };

    if (payload.savedOpportunities !== undefined) {
      updateData.savedOpportunities = Array.from(new Set(payload.savedOpportunities)).slice(0, 200);
    }
    if (payload.applicationTracker !== undefined) {
      updateData.applicationTracker = payload.applicationTracker;
    }
    if (payload.targetList !== undefined) {
      updateData.targetList = payload.targetList;
    }
    if (payload.activeApplications !== undefined) {
      updateData.activeApplications = payload.activeApplications;
    }

    const cleanUpdateData = sanitizeFirestoreData(updateData);
    try {
      await updateDoc(userDocRef, cleanUpdateData);
    } catch (updateErr: any) {
      if (updateErr?.code === 'not-found') {
        await setDoc(userDocRef, cleanUpdateData, { merge: true });
      } else {
        throw updateErr;
      }
    }
    return { success: true, persistedToCloud: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return {
      success: false,
      persistedToCloud: false,
      error: 'Could not save your updates right now. Please try again.',
    };
  }
}

// 10. Student Account Deletion (Temporarily Disabled on Starter Tier)
export async function deleteStudentAccountFromFirebase(
  _userId: string
): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
  return {
    success: false,
    error: 'Account deletion is temporarily unavailable. Please contact support for assistance.',
  };
}

// 11. Scholarship Alert Subscription Firestore Sync (Authenticated Students)
export interface ScholarshipAlertRecord {
  subscribed: boolean;
  email: string;
  preferences: string[];
  consentStatus?: 'pending' | 'confirmed' | 'unsubscribed';
  frequency?: 'immediate' | 'weekly';
  confirmedAt?: string;
  unsubscribedAt?: string;
  updatedAt: string;
}

export async function getCurrentUserIdToken(): Promise<string | null> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous) {
    return null;
  }
  try {
    return await fbUser.getIdToken();
  } catch {
    return null;
  }
}

export async function syncScholarshipAlertToFirestore(payload: {
  subscribed: boolean;
  email: string;
  preferences: string[];
  consentStatus?: 'pending' | 'confirmed' | 'unsubscribed';
  frequency?: 'immediate' | 'weekly';
  confirmedAt?: string;
  unsubscribedAt?: string;
}): Promise<FirestoreMutationResult> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous) {
    return { success: true, persistedToCloud: false };
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  const cleanEmail = payload.email.trim().toLowerCase().slice(0, 254);
  const cleanPrefs = Array.from(new Set(payload.preferences)).slice(0, 12);
  const updatedAt = new Date().toISOString();

  const alertData: Record<string, unknown> = {
    subscribed: Boolean(payload.subscribed),
    email: cleanEmail,
    preferences: cleanPrefs,
    updatedAt,
  };
  if (payload.consentStatus) alertData.consentStatus = payload.consentStatus;
  if (payload.frequency) alertData.frequency = payload.frequency;
  if (payload.confirmedAt) alertData.confirmedAt = payload.confirmedAt;
  if (payload.unsubscribedAt) alertData.unsubscribedAt = payload.unsubscribedAt;

  try {
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(
      userDocRef,
      sanitizeFirestoreData({
        uid: targetUid,
        email: fbUser.email || cleanEmail,
        scholarshipAlerts: alertData,
        updatedAt,
      }),
      { merge: true }
    );
    return { success: true, persistedToCloud: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return {
      success: false,
      persistedToCloud: false,
      error: 'Could not save alert settings right now. Please try again.',
    };
  }
}

export async function fetchScholarshipAlertFromFirestore(): Promise<ScholarshipAlertRecord | null> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous) {
    return null;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    let docSnap;
    try {
      docSnap = await getDocFromServer(userDocRef);
    } catch {
      docSnap = await getDoc(userDocRef);
    }
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    const alerts = data?.scholarshipAlerts;
    if (
      alerts &&
      typeof alerts === 'object' &&
      typeof alerts.subscribed === 'boolean' &&
      typeof alerts.email === 'string' &&
      Array.isArray(alerts.preferences)
    ) {
      return {
        subscribed: alerts.subscribed,
        email: alerts.email,
        preferences: alerts.preferences.filter((p: unknown): p is string => typeof p === 'string'),
        consentStatus:
          alerts.consentStatus === 'pending' ||
          alerts.consentStatus === 'confirmed' ||
          alerts.consentStatus === 'unsubscribed'
            ? alerts.consentStatus
            : undefined,
        frequency:
          alerts.frequency === 'immediate' || alerts.frequency === 'weekly'
            ? alerts.frequency
            : undefined,
        confirmedAt: typeof alerts.confirmedAt === 'string' ? alerts.confirmedAt : undefined,
        unsubscribedAt: typeof alerts.unsubscribedAt === 'string' ? alerts.unsubscribedAt : undefined,
        updatedAt: typeof alerts.updatedAt === 'string' ? alerts.updatedAt : '',
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// 12. COVA AI Conversation History Firestore Persistence (Private per Authenticated Student)
export interface FirestoreCovaMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  error?: boolean;
  errorMessage?: string;
  opportunityIds?: string[];
  trackerOpportunityIds?: string[];
  followUps?: string[];
}

export interface FirestoreCovaConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: FirestoreCovaMessage[];
}

function isValidFirestoreDocId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export async function fetchCovaConversationsFromFirestore(
  userId: string
): Promise<FirestoreCovaConversation[]> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(fbUser.uid)) {
    return [];
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/covaConversations`;
  try {
    const convCol = collection(db, 'users', targetUid, 'covaConversations');
    const q = query(convCol, where('userId', '==', targetUid));
    const fetchPromise = getDocs(q);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('COVA history Firestore fetch timed out')), 6000)
    );
    const snapshot = await Promise.race([fetchPromise, timeoutPromise]);

    const items: FirestoreCovaConversation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<FirestoreCovaConversation>;
      if (data && data.id && data.userId === targetUid && Array.isArray(data.messages)) {
        items.push({
          id: data.id,
          userId: data.userId,
          title: typeof data.title === 'string' && data.title.trim() ? data.title : 'Conversation',
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
          updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
          messages: data.messages.filter(
            (m): m is FirestoreCovaMessage =>
              Boolean(m && typeof m.id === 'string' && (m.role === 'user' || m.role === 'model'))
          ),
        });
      }
    });

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveCovaConversationToFirestore(
  userId: string,
  conversation: {
    id: string;
    userId?: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: Array<{
      id: string;
      role: 'user' | 'model';
      content: string;
      timestamp: string;
      error?: boolean;
      errorMessage?: string;
      opportunityIds?: string[];
      trackerOpportunityIds?: string[];
      opportunities?: Array<{ id: string }>;
      trackerOpportunities?: Array<{ id: string }>;
      followUps?: string[];
    }>;
  }
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId) {
    return false;
  }

  const targetUid = fbUser.uid;
  const convId = conversation.id;
  if (!isValidFirestoreDocId(targetUid) || !isValidFirestoreDocId(convId)) {
    return false;
  }

  const path = `users/${targetUid}/covaConversations/${convId}`;
  try {
    const compactMessages: FirestoreCovaMessage[] = conversation.messages
      .slice(-100)
      .map((m) => {
        const oppIds = Array.isArray(m.opportunityIds)
          ? m.opportunityIds.slice(0, 8)
          : Array.isArray(m.opportunities)
          ? m.opportunities.map((o) => o.id).filter(Boolean).slice(0, 8)
          : [];
        const trkIds = Array.isArray(m.trackerOpportunityIds)
          ? m.trackerOpportunityIds.slice(0, 8)
          : Array.isArray(m.trackerOpportunities)
          ? m.trackerOpportunities.map((o) => o.id).filter(Boolean).slice(0, 8)
          : [];

        const entry: FirestoreCovaMessage = {
          id: String(m.id || `msg_${Date.now()}`).slice(0, 80),
          role: m.role === 'user' ? 'user' : 'model',
          content: String(m.content || '').slice(0, 12000),
          timestamp: String(m.timestamp || new Date().toISOString()).slice(0, 64),
        };
        if (m.error) entry.error = true;
        if (m.errorMessage) entry.errorMessage = String(m.errorMessage).slice(0, 500);
        if (oppIds.length > 0) entry.opportunityIds = oppIds;
        if (trkIds.length > 0) entry.trackerOpportunityIds = trkIds;
        if (Array.isArray(m.followUps) && m.followUps.length > 0) {
          entry.followUps = m.followUps.filter((f) => typeof f === 'string').slice(0, 6);
        }
        return entry;
      });

    const cleanTitle = (conversation.title || 'New Conversation').trim().slice(0, 160) || 'New Conversation';
    const createdAt = String(conversation.createdAt || new Date().toISOString()).slice(0, 64);
    const updatedAt = String(conversation.updatedAt || new Date().toISOString()).slice(0, 64);

    const payload: FirestoreCovaConversation = {
      id: convId,
      userId: targetUid,
      title: cleanTitle,
      createdAt,
      updatedAt,
      messages: compactMessages,
    };

    await setDoc(
      doc(db, 'users', targetUid, 'covaConversations', convId),
      sanitizeFirestoreData(payload)
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteCovaConversationFromFirestore(
  userId: string,
  conversationId: string
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(fbUser.uid) ||
    !isValidFirestoreDocId(conversationId)
  ) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/covaConversations/${conversationId}`;
  try {
    await deleteDoc(doc(db, 'users', targetUid, 'covaConversations', conversationId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function clearAllCovaConversationsInFirestore(userId: string): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(fbUser.uid)) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/covaConversations`;
  try {
    const convCol = collection(db, 'users', targetUid, 'covaConversations');
    const q = query(convCol, where('userId', '==', targetUid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return true;

    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 100) {
      const batch = writeBatch(db);
      docs.slice(i, i + 100).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// 13. Student Smart Notifications & Browser Push Token Persistence (Private per Student)
export type StudentNotificationCategory =
  | 'deadline'
  | 'opportunity'
  | 'application'
  | 'requirement'
  | 'system';

export type StudentNotificationPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface StudentNotificationRecord {
  id: string;
  userId: string;
  category: StudentNotificationCategory;
  priority: StudentNotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  dedupeKey?: string;
  opportunityId?: string;
  opportunityName?: string;
  actionTab?:
    | 'overview'
    | 'universities'
    | 'scholarships'
    | 'tracker'
    | 'profile'
    | 'resources'
    | 'settings';
  actionSection?: 'home' | 'saved' | 'applications' | 'notifications';
  deadlineDate?: string;
  daysRemaining?: number;
  sourceVerified?: boolean;
}

export interface StudentPushTokenRecord {
  id: string;
  userId: string;
  token: string;
  platform: string;
  permissionState: 'granted' | 'denied' | 'default';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

function sanitizeNotificationForFirestore(
  userId: string,
  n: StudentNotificationRecord
): StudentNotificationRecord | null {
  if (!isValidFirestoreDocId(userId) || !isValidFirestoreDocId(n.id)) {
    return null;
  }
  const clean: StudentNotificationRecord = {
    id: n.id,
    userId,
    category: n.category,
    priority: n.priority,
    title: String(n.title || 'Campus Connect Update').trim().slice(0, 180) || 'Campus Connect Update',
    message: String(n.message || '').trim().slice(0, 600) || 'Open to view details.',
    read: Boolean(n.read),
    createdAt: String(n.createdAt || new Date().toISOString()).slice(0, 64),
    updatedAt: String(n.updatedAt || n.createdAt || new Date().toISOString()).slice(0, 64),
  };
  if (n.dedupeKey) clean.dedupeKey = String(n.dedupeKey).slice(0, 160);
  if (n.opportunityId) clean.opportunityId = String(n.opportunityId).slice(0, 128);
  if (n.opportunityName) clean.opportunityName = String(n.opportunityName).slice(0, 200);
  if (n.actionTab) clean.actionTab = n.actionTab;
  if (n.actionSection) clean.actionSection = n.actionSection;
  if (n.deadlineDate) clean.deadlineDate = String(n.deadlineDate).slice(0, 64);
  if (typeof n.daysRemaining === 'number' && Number.isFinite(n.daysRemaining)) {
    clean.daysRemaining = n.daysRemaining;
  }
  if (typeof n.sourceVerified === 'boolean') clean.sourceVerified = n.sourceVerified;
  return clean;
}

export function subscribeToUserNotifications(
  userId: string,
  onUpdate: (items: StudentNotificationRecord[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(userId)) {
    onUpdate([]);
    return () => {};
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications`;
  const colRef = collection(db, 'users', targetUid, 'notifications');
  const q = query(colRef, where('userId', '==', targetUid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: StudentNotificationRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<StudentNotificationRecord>;
        if (data && data.id && data.userId === targetUid && data.title && data.message) {
          items.push({
            id: data.id,
            userId: data.userId,
            category: data.category || 'system',
            priority: data.priority || 'normal',
            title: data.title,
            message: data.message,
            read: Boolean(data.read),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
            dedupeKey: data.dedupeKey,
            opportunityId: data.opportunityId,
            opportunityName: data.opportunityName,
            actionTab: data.actionTab,
            actionSection: data.actionSection,
            deadlineDate: data.deadlineDate,
            daysRemaining: data.daysRemaining,
            sourceVerified: data.sourceVerified,
          });
        }
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items.slice(0, 100));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onError?.(error);
    }
  );
}

export async function fetchUserNotificationsFromFirestore(
  userId: string
): Promise<StudentNotificationRecord[]> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(userId)) {
    return [];
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications`;
  try {
    const colRef = collection(db, 'users', targetUid, 'notifications');
    const q = query(colRef, where('userId', '==', targetUid));
    const snapshot = await getDocs(q);
    const items: StudentNotificationRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<StudentNotificationRecord>;
      if (data && data.id && data.userId === targetUid && data.title && data.message) {
        items.push(data as StudentNotificationRecord);
      }
    });
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items.slice(0, 100);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function batchCreateUserNotificationsInFirestore(
  userId: string,
  notifications: StudentNotificationRecord[]
): Promise<number> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(userId) ||
    notifications.length === 0
  ) {
    return 0;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications`;
  const validItems = notifications
    .map((n) => sanitizeNotificationForFirestore(targetUid, n))
    .filter((n): n is StudentNotificationRecord => Boolean(n));

  if (validItems.length === 0) return 0;

  let written = 0;
  try {
    // Check existing server/cache notification IDs for this owner so we never call `create` (`set`)
    // on an already-existing document and trigger an immutable `createdAt` update rule rejection.
    const existingSnap = await getDocs(
      query(collection(db, 'users', targetUid, 'notifications'), where('userId', '==', targetUid))
    ).catch(() => null);
    const existingIds = new Set<string>();
    if (existingSnap) {
      existingSnap.forEach((d) => existingIds.add(d.id));
    }

    const toInsert = validItems.filter((item) => !existingIds.has(item.id));
    if (toInsert.length === 0) return 0;

    for (let i = 0; i < toInsert.length; i += 50) {
      const chunk = toInsert.slice(i, i + 50);
      const batch = writeBatch(db);
      for (const item of chunk) {
        batch.set(
          doc(db, 'users', targetUid, 'notifications', item.id),
          sanitizeFirestoreData(item)
        );
      }
      await batch.commit();
      written += chunk.length;
    }
    return written;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return written;
  }
}

export async function markUserNotificationReadInFirestore(
  userId: string,
  notificationId: string,
  read: boolean
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(userId) ||
    !isValidFirestoreDocId(notificationId)
  ) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications/${notificationId}`;
  try {
    await updateDoc(doc(db, 'users', targetUid, 'notifications', notificationId), {
      read: Boolean(read),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function markAllUserNotificationsReadInFirestore(
  userId: string,
  notificationIds: string[]
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(userId)) {
    return false;
  }

  const targetUid = fbUser.uid;
  const validIds = notificationIds.filter(isValidFirestoreDocId);
  if (validIds.length === 0) return true;

  const path = `users/${targetUid}/notifications`;
  const updatedAt = new Date().toISOString();
  try {
    for (let i = 0; i < validIds.length; i += 50) {
      const chunk = validIds.slice(i, i + 50);
      const batch = writeBatch(db);
      for (const id of chunk) {
        batch.update(doc(db, 'users', targetUid, 'notifications', id), {
          read: true,
          updatedAt,
        });
      }
      await batch.commit();
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function deleteUserNotificationInFirestore(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(userId) ||
    !isValidFirestoreDocId(notificationId)
  ) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications/${notificationId}`;
  try {
    await deleteDoc(doc(db, 'users', targetUid, 'notifications', notificationId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function clearAllUserNotificationsInFirestore(
  userId: string,
  notificationIds?: string[]
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || fbUser.isAnonymous || !userId || fbUser.uid !== userId || !isValidFirestoreDocId(userId)) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/notifications`;
  try {
    let targetIds = (notificationIds || []).filter(isValidFirestoreDocId);
    if (targetIds.length === 0) {
      const colRef = collection(db, 'users', targetUid, 'notifications');
      const snapshot = await getDocs(query(colRef, where('userId', '==', targetUid)));
      targetIds = snapshot.docs.map((d) => d.id).filter(isValidFirestoreDocId);
    }
    if (targetIds.length === 0) return true;

    for (let i = 0; i < targetIds.length; i += 50) {
      const chunk = targetIds.slice(i, i + 50);
      const batch = writeBatch(db);
      for (const id of chunk) {
        batch.delete(doc(db, 'users', targetUid, 'notifications', id));
      }
      await batch.commit();
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function saveStudentPushTokenToFirestore(
  userId: string,
  record: StudentPushTokenRecord
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(userId) ||
    !isValidFirestoreDocId(record.id)
  ) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/pushTokens/${record.id}`;
  try {
    await setDoc(
      doc(db, 'users', targetUid, 'pushTokens', record.id),
      sanitizeFirestoreData({
        id: record.id,
        userId: targetUid,
        token: String(record.token).slice(0, 1024),
        platform: String(record.platform || 'web').slice(0, 64),
        permissionState: record.permissionState,
        enabled: Boolean(record.enabled),
        createdAt: String(record.createdAt || new Date().toISOString()).slice(0, 64),
        updatedAt: String(record.updatedAt || new Date().toISOString()).slice(0, 64),
      })
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteStudentPushTokenFromFirestore(
  userId: string,
  tokenId: string
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (
    !fbUser ||
    fbUser.isAnonymous ||
    !userId ||
    fbUser.uid !== userId ||
    !isValidFirestoreDocId(userId) ||
    !isValidFirestoreDocId(tokenId)
  ) {
    return false;
  }

  const targetUid = fbUser.uid;
  const path = `users/${targetUid}/pushTokens/${tokenId}`;
  try {
    await deleteDoc(doc(db, 'users', targetUid, 'pushTokens', tokenId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}



