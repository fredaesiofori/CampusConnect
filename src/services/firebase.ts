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
  deleteUser,
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
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
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
            experimentalForceLongPolling: true,
          },
          firebaseConfigData.firestoreDatabaseId
        )
      : initializeFirestore(app, {
          experimentalForceLongPolling: true,
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
// 3. Test Connection
export async function testFirestoreConnection(): Promise<FirebaseConnectionStatus> {
  if (connectionTested) {
    return {
      isConnected: isDbOnline,
      projectId: currentFirebaseProjectId,
      databaseId: currentFirestoreDatabaseId,
    };
  }

  try {
    // Probe connection using getDoc on opportunities collection
    await getDoc(doc(db, 'opportunities', 'probe-connection'));
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

export async function loginWithFirebase(
  email: string,
  pass: string
): Promise<{ userCredential?: UserCredential; error?: any }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { userCredential: cred };
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
      return {
        success: false,
        error: reauthErr?.message || 'Authentication failed with the provided current password.',
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
        error: 'For security reasons, please re-authenticate to confirm this password change.',
      };
    }
    if (code === 'auth/weak-password') {
      return {
        success: false,
        error: 'The new password must be at least 6 characters long.',
      };
    }
    return {
      success: false,
      error: err?.message || 'Failed to update password. Please try again.',
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
      return { success: false, error: 'No active Firebase session found.' };
    }
    await user.getIdToken(true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to refresh session token.' };
  }
}

// 6. Seed Verified Real Opportunities into Cloud Firestore
// Uses writeBatch for high-speed atomic upload (single HTTP request per batch)
export async function seedVerifiedOpportunitiesToFirestore(): Promise<number> {
  try {
    const fbUser = await ensureFirebaseAuth();
    if (!fbUser) {
      return 0;
    }
    let seededCount = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < authenticOpportunities.length; i += BATCH_SIZE) {
      const chunk = authenticOpportunities.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const docRef = doc(db, 'opportunities', item.id);
        batch.set(
          docRef,
          {
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
          },
          { merge: true }
        );
      }

      await batch.commit();
      seededCount += chunk.length;
    }

    return seededCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'opportunities');
    return 0;
  }
}

// 7. Fetch Verified Opportunities from Cloud Firestore
export async function fetchVerifiedOpportunitiesFromFirestore(): Promise<OpportunityItem[]> {
  try {
    const oppCol = collection(db, 'opportunities');
    const snapshot = await getDocs(oppCol);

    if (snapshot.empty) {
      // Seed asynchronously in background without blocking initial rendering
      seedVerifiedOpportunitiesToFirestore().catch((err) => {
        console.info('Background opportunities seed status:', err);
      });
      return authenticOpportunities;
    }

    const firestoreItems: OpportunityItem[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<OpportunityItem>;
      if (data && data.isVerified && data.officialName) {
        const normName = data.officialName.toLowerCase().trim();
        const docId = data.id || docSnap.id;
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
            isVerified: true,
            verificationSource: data.verificationSource || 'Official Accreditation',
            verifiedAt: data.verifiedAt || 'Academic Year 2026/2027',
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
              academic: 'High school diploma or bachelor degree depending on level.',
              language: 'English proficiency or WAEC/WASSCE accepted.',
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

    return firestoreItems.length > 0 ? firestoreItems : authenticOpportunities;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'opportunities');
    return authenticOpportunities;
  }
}

// 8. Student Profile Firestore Operations (Private & Secure per User)
export async function saveStudentProfileToFirestore(
  userId: string,
  userEmail: string,
  profile: StudentProfile,
  fullName?: string
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || userId.startsWith('kwame-') || userId === 'demo-scholar') {
    return false;
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(
      userDocRef,
      {
        uid: targetUid,
        email: userEmail || fbUser.email || '',
        ...(fullName ? { fullName } : {}),
        profile,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchStudentProfileFromFirestore(
  userId: string
): Promise<{ profile?: StudentProfile; savedOpportunities?: string[]; applicationTracker?: Record<string, any> } | null> {
  const fbUser = auth.currentUser;
  if (!fbUser || userId.startsWith('kwame-') || userId === 'demo-scholar') {
    return null;
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as any;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// 9. Saved Opportunities and Application Tracker Firestore Persistence
export async function syncSavedOpportunitiesToFirestore(
  userId: string,
  userEmail: string,
  savedOpportunities: string[],
  applicationTracker: Record<string, string>
): Promise<boolean> {
  const fbUser = auth.currentUser;
  if (!fbUser || userId.startsWith('kwame-') || userId === 'demo-scholar') {
    return false;
  }
  const targetUid = fbUser.uid;
  const path = `users/${targetUid}`;
  try {
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(
      userDocRef,
      {
        uid: targetUid,
        email: userEmail || fbUser.email || '',
        savedOpportunities,
        applicationTracker,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// 10. Student Account Permanent Deletion (Right to Erasure)
export async function deleteStudentAccountFromFirebase(
  userId: string
): Promise<{ success: boolean; error?: string; requiresReauth?: boolean }> {
  const path = `users/${userId}`;
  try {
    const user = auth.currentUser;

    // 1. Delete student Firestore record under users/{userId} if authenticated
    if (user && user.uid === userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
      } catch (fsErr) {
        console.warn('Firestore user doc delete notice:', fsErr);
      }
    }

    // 2. Delete Firebase Auth account if user is signed in
    if (user && user.uid === userId) {
      try {
        await deleteUser(user);
      } catch (authErr: any) {
        const code = authErr?.code || '';
        if (code === 'auth/requires-recent-login') {
          return {
            success: false,
            requiresReauth: true,
            error:
              'For security, your credentials have expired. Please sign out and sign back in to confirm permanent account deletion.',
          };
        }
        return {
          success: false,
          error: authErr?.message || 'Failed to delete authentication credentials.',
        };
      }
    }

    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: 'Failed to complete student account deletion.' };
  }
}
