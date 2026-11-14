/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs/promises';
import path from 'path';
import { getApps, initializeApp, cert, App as FirebaseAdminApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth as FirebaseAdminAuth } from 'firebase-admin/auth';
import firebaseConfigData from '../../firebase-applet-config.json';
import {
  AlertDeliveryLogRecord,
  AlertFrequency,
  AlertPreferenceId,
  ConsentStatus,
  generateSecureToken,
  hashEmail,
  hashToken,
  normalizeEmail,
  normalizePreferences,
  OpportunitySubscriberRecord,
} from './types';

export interface SubscriberStorageAdapter {
  isConfigured(): boolean;
  getSubscriberByEmailHash(emailHash: string): Promise<OpportunitySubscriberRecord | null>;
  findSubscriberByManageTokenHash(tokenHash: string): Promise<OpportunitySubscriberRecord | null>;
  findSubscriberByConfirmTokenHash(tokenHash: string): Promise<OpportunitySubscriberRecord | null>;
  findSubscriberByUnsubscribeTokenHash(tokenHash: string): Promise<OpportunitySubscriberRecord | null>;
  findSubscriberByUid(uid: string): Promise<OpportunitySubscriberRecord | null>;
  listConfirmedSubscribers(limit?: number): Promise<OpportunitySubscriberRecord[]>;
  saveSubscriber(record: OpportunitySubscriberRecord): Promise<void>;
  getDeliveryLog(logId: string): Promise<AlertDeliveryLogRecord | null>;
  saveDeliveryLog(log: AlertDeliveryLogRecord): Promise<void>;
  verifyIdToken?(idToken: string): Promise<{ uid: string; email?: string } | null>;
  syncUserAlertMirror?(
    uid: string,
    payload: {
      subscribed: boolean;
      email: string;
      preferences: AlertPreferenceId[];
      consentStatus: ConsentStatus;
      frequency?: AlertFrequency;
      confirmedAt?: string;
      unsubscribedAt?: string;
      updatedAt: string;
    }
  ): Promise<void>;
}

const SUBSCRIBERS_COLLECTION = 'opportunitySubscribers';
const DELIVERY_LOGS_COLLECTION = 'alertDeliveryLogs';

function parseServiceAccountFromEnv(env: NodeJS.ProcessEnv): ServiceAccount | null {
  const raw =
    env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ||
    env.FIREBASE_SERVICE_ACCOUNT?.trim() ||
    '';
  if (!raw) return null;

  try {
    const jsonString = raw.startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonString);
    if (parsed && parsed.project_id && parsed.client_email && parsed.private_key) {
      return parsed as ServiceAccount;
    }
    return null;
  } catch {
    return null;
  }
}

export class FirebaseAdminFirestoreAdapter implements SubscriberStorageAdapter {
  private app: FirebaseAdminApp | null = null;
  private db: Firestore | null = null;
  private adminAuth: FirebaseAdminAuth | null = null;
  private configured: boolean = false;
  private initAttempted: boolean = false;
  private initError: string | null = null;

  constructor(private readonly env: NodeJS.ProcessEnv = process.env) {
    this.initialize();
  }

  private initialize(): void {
    if (this.initAttempted) return;
    this.initAttempted = true;

    const serviceAccount = parseServiceAccountFromEnv(this.env);
    const hasCredFile = Boolean(this.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());

    if (!serviceAccount && !hasCredFile) {
      this.configured = false;
      this.initError = 'Missing FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.';
      return;
    }

    try {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else if (serviceAccount) {
        this.app = initializeApp({
          credential: cert(serviceAccount),
          projectId: firebaseConfigData.projectId,
        });
      } else {
        this.app = initializeApp({
          projectId: firebaseConfigData.projectId,
        });
      }

      const databaseId = firebaseConfigData.firestoreDatabaseId;
      this.db = databaseId ? getFirestore(this.app, databaseId) : getFirestore(this.app);
      this.adminAuth = getAuth(this.app);
      this.configured = true;
      this.initError = null;
    } catch (err: any) {
      this.configured = false;
      this.initError = err?.message || 'Failed to initialize Firebase Admin SDK.';
      console.error('[Alerts/Firestore] Admin SDK init error:', this.initError);
    }
  }

  isConfigured(): boolean {
    return this.configured && Boolean(this.db);
  }

  getInitError(): string | null {
    return this.initError;
  }

  private requireDb(): Firestore {
    if (!this.db) {
      throw new Error(
        this.initError ||
          'Firebase Admin Firestore is not configured. Provide FIREBASE_SERVICE_ACCOUNT_JSON.'
      );
    }
    return this.db;
  }

  async getSubscriberByEmailHash(emailHash: string): Promise<OpportunitySubscriberRecord | null> {
    const snap = await this.requireDb().collection(SUBSCRIBERS_COLLECTION).doc(emailHash).get();
    if (!snap.exists) return null;
    return snap.data() as OpportunitySubscriberRecord;
  }

  async findSubscriberByManageTokenHash(
    tokenHash: string
  ): Promise<OpportunitySubscriberRecord | null> {
    const snap = await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where('manageTokenHash', '==', tokenHash)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as OpportunitySubscriberRecord;
  }

  async findSubscriberByConfirmTokenHash(
    tokenHash: string
  ): Promise<OpportunitySubscriberRecord | null> {
    const snap = await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where('confirmTokenHash', '==', tokenHash)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as OpportunitySubscriberRecord;
  }

  async findSubscriberByUnsubscribeTokenHash(
    tokenHash: string
  ): Promise<OpportunitySubscriberRecord | null> {
    const snap = await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where('unsubscribeTokenHash', '==', tokenHash)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as OpportunitySubscriberRecord;
  }

  async findSubscriberByUid(uid: string): Promise<OpportunitySubscriberRecord | null> {
    const snap = await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where('uid', '==', uid)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as OpportunitySubscriberRecord;
  }

  async listConfirmedSubscribers(limitCount = 500): Promise<OpportunitySubscriberRecord[]> {
    const snap = await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where('consentStatus', '==', 'confirmed')
      .limit(limitCount)
      .get();
    return snap.docs.map((docSnap) => docSnap.data() as OpportunitySubscriberRecord);
  }

  async saveSubscriber(record: OpportunitySubscriberRecord): Promise<void> {
    const cleanRecord: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      if (value !== undefined) {
        cleanRecord[key] = value;
      }
    }
    await this.requireDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .doc(record.emailHash)
      .set(cleanRecord, { merge: false });
  }

  async getDeliveryLog(logId: string): Promise<AlertDeliveryLogRecord | null> {
    const snap = await this.requireDb().collection(DELIVERY_LOGS_COLLECTION).doc(logId).get();
    if (!snap.exists) return null;
    return snap.data() as AlertDeliveryLogRecord;
  }

  async saveDeliveryLog(log: AlertDeliveryLogRecord): Promise<void> {
    const cleanLog: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(log)) {
      if (value !== undefined) {
        cleanLog[key] = value;
      }
    }
    await this.requireDb().collection(DELIVERY_LOGS_COLLECTION).doc(log.id).set(cleanLog);
  }

  async verifyIdToken(idToken: string): Promise<{ uid: string; email?: string } | null> {
    if (!this.adminAuth) return null;
    try {
      const decoded = await this.adminAuth.verifyIdToken(idToken);
      return { uid: decoded.uid, email: decoded.email };
    } catch {
      return null;
    }
  }

  async syncUserAlertMirror(
    uid: string,
    payload: {
      subscribed: boolean;
      email: string;
      preferences: AlertPreferenceId[];
      consentStatus: ConsentStatus;
      frequency?: AlertFrequency;
      confirmedAt?: string;
      unsubscribedAt?: string;
      updatedAt: string;
    }
  ): Promise<void> {
    if (!this.db || !uid) return;
    const alertObj: Record<string, unknown> = {
      subscribed: payload.subscribed,
      email: payload.email,
      preferences: payload.preferences,
      consentStatus: payload.consentStatus,
      updatedAt: payload.updatedAt,
    };
    if (payload.frequency) alertObj.frequency = payload.frequency;
    if (payload.confirmedAt) alertObj.confirmedAt = payload.confirmedAt;
    if (payload.unsubscribedAt) alertObj.unsubscribedAt = payload.unsubscribedAt;

    await this.db
      .collection('users')
      .doc(uid)
      .set({ scholarshipAlerts: alertObj, updatedAt: payload.updatedAt }, { merge: true });
  }
}

export class OpportunitySubscriberStore {
  constructor(public readonly adapter: SubscriberStorageAdapter) {}

  isConfigured(): boolean {
    return this.adapter.isConfigured();
  }

  async subscribeOrPrepareDoubleOptIn(input: {
    email: string;
    preferences: AlertPreferenceId[];
    emailDeliveryConfigured: boolean;
    uid?: string;
    preferredDestinations?: string[];
    intendedDegree?: string;
    fieldOfStudy?: string;
    frequency?: AlertFrequency;
  }): Promise<
    | { status: 'duplicate'; existing: OpportunitySubscriberRecord }
    | {
        status: 'pending-resend' | 'created' | 'reactivated';
        record: OpportunitySubscriberRecord;
        manageToken: string;
        confirmToken: string;
        unsubscribeToken: string;
      }
  > {
    const email = normalizeEmail(input.email);
    const eHash = hashEmail(email);
    const existing = await this.adapter.getSubscriberByEmailHash(eHash);

    if (existing && existing.consentStatus === 'confirmed') {
      return { status: 'duplicate', existing };
    }

    const now = new Date().toISOString();
    const manageToken = generateSecureToken();
    const confirmToken = generateSecureToken();
    const unsubscribeToken = generateSecureToken();

    const record: OpportunitySubscriberRecord = {
      email,
      emailHash: eHash,
      preferences: input.preferences,
      // Require confirmation when email delivery is configured (or when pending); never mark active without confirmation if email delivery is active
      consentStatus: 'pending',
      frequency: input.frequency || existing?.frequency || 'weekly',
      uid: input.uid || existing?.uid,
      preferredDestinations: input.preferredDestinations ?? existing?.preferredDestinations,
      intendedDegree: input.intendedDegree ?? existing?.intendedDegree,
      fieldOfStudy: input.fieldOfStudy ?? existing?.fieldOfStudy,
      manageTokenHash: hashToken(manageToken),
      confirmTokenHash: hashToken(confirmToken),
      unsubscribeTokenHash: hashToken(unsubscribeToken),
      subscribedAt: existing?.subscribedAt || now,
      updatedAt: now,
      deliveryErrorCount: existing?.deliveryErrorCount || 0,
    };

    await this.adapter.saveSubscriber(record);

    if (record.uid && this.adapter.syncUserAlertMirror) {
      await this.adapter
        .syncUserAlertMirror(record.uid, {
          subscribed: false,
          email: record.email,
          preferences: record.preferences,
          consentStatus: 'pending',
          frequency: record.frequency,
          updatedAt: now,
        })
        .catch(() => {});
    }

    const status = existing
      ? existing.consentStatus === 'pending'
        ? 'pending-resend'
        : 'reactivated'
      : 'created';

    return {
      status,
      record,
      manageToken,
      confirmToken,
      unsubscribeToken,
    };
  }

  async confirmByToken(rawToken: string): Promise<{
    confirmed: boolean;
    alreadyConfirmed?: boolean;
    record?: OpportunitySubscriberRecord;
    manageToken?: string;
    unsubscribeToken?: string;
  }> {
    if (!rawToken || rawToken.trim().length < 16) {
      return { confirmed: false };
    }
    const tokenHash = hashToken(rawToken.trim());
    const match = await this.adapter.findSubscriberByConfirmTokenHash(tokenHash);
    if (!match) {
      return { confirmed: false };
    }

    if (match.consentStatus === 'confirmed') {
      return { confirmed: true, alreadyConfirmed: true, record: match };
    }

    const now = new Date().toISOString();
    const manageToken = generateSecureToken();
    const unsubscribeToken = generateSecureToken();

    const updated: OpportunitySubscriberRecord = {
      ...match,
      consentStatus: 'confirmed',
      confirmedAt: now,
      updatedAt: now,
      confirmTokenHash: '',
      manageTokenHash: hashToken(manageToken),
      unsubscribeTokenHash: hashToken(unsubscribeToken),
    };

    await this.adapter.saveSubscriber(updated);

    if (updated.uid && this.adapter.syncUserAlertMirror) {
      await this.adapter
        .syncUserAlertMirror(updated.uid, {
          subscribed: true,
          email: updated.email,
          preferences: updated.preferences,
          consentStatus: 'confirmed',
          frequency: updated.frequency,
          confirmedAt: now,
          updatedAt: now,
        })
        .catch(() => {});
    }

    return {
      confirmed: true,
      alreadyConfirmed: false,
      record: updated,
      manageToken,
      unsubscribeToken,
    };
  }

  async findByManageToken(rawToken: string): Promise<OpportunitySubscriberRecord | null> {
    if (!rawToken || rawToken.trim().length < 16) return null;
    const match = await this.adapter.findSubscriberByManageTokenHash(hashToken(rawToken.trim()));
    if (!match || match.consentStatus === 'unsubscribed') return null;
    return match;
  }

  async findByAuthenticatedUser(uid: string, email?: string): Promise<OpportunitySubscriberRecord | null> {
    const byUid = await this.adapter.findSubscriberByUid(uid);
    if (byUid) return byUid;
    if (email) {
      return this.adapter.getSubscriberByEmailHash(hashEmail(normalizeEmail(email)));
    }
    return null;
  }

  async updatePreferences(input: {
    record: OpportunitySubscriberRecord;
    preferences: AlertPreferenceId[];
    frequency?: AlertFrequency;
    preferredDestinations?: string[];
    intendedDegree?: string;
    fieldOfStudy?: string;
  }): Promise<OpportunitySubscriberRecord> {
    const now = new Date().toISOString();
    const updated: OpportunitySubscriberRecord = {
      ...input.record,
      preferences: input.preferences,
      frequency: input.frequency || input.record.frequency || 'weekly',
      preferredDestinations:
        input.preferredDestinations !== undefined
          ? input.preferredDestinations
          : input.record.preferredDestinations,
      intendedDegree:
        input.intendedDegree !== undefined ? input.intendedDegree : input.record.intendedDegree,
      fieldOfStudy:
        input.fieldOfStudy !== undefined ? input.fieldOfStudy : input.record.fieldOfStudy,
      updatedAt: now,
    };

    await this.adapter.saveSubscriber(updated);

    if (updated.uid && this.adapter.syncUserAlertMirror) {
      await this.adapter
        .syncUserAlertMirror(updated.uid, {
          subscribed: updated.consentStatus === 'confirmed',
          email: updated.email,
          preferences: updated.preferences,
          consentStatus: updated.consentStatus,
          frequency: updated.frequency,
          confirmedAt: updated.confirmedAt,
          updatedAt: now,
        })
        .catch(() => {});
    }

    return updated;
  }

  async unsubscribeByToken(rawToken: string): Promise<OpportunitySubscriberRecord | null> {
    if (!rawToken || rawToken.trim().length < 16) return null;
    const tHash = hashToken(rawToken.trim());

    let match = await this.adapter.findSubscriberByManageTokenHash(tHash);
    if (!match) {
      match = await this.adapter.findSubscriberByUnsubscribeTokenHash(tHash);
    }
    if (!match || match.consentStatus === 'unsubscribed') {
      return null;
    }

    return this.markUnsubscribed(match);
  }

  async markUnsubscribed(record: OpportunitySubscriberRecord): Promise<OpportunitySubscriberRecord> {
    const now = new Date().toISOString();
    const updated: OpportunitySubscriberRecord = {
      ...record,
      consentStatus: 'unsubscribed',
      unsubscribedAt: now,
      updatedAt: now,
      manageTokenHash: '',
      confirmTokenHash: '',
      unsubscribeTokenHash: '',
    };

    await this.adapter.saveSubscriber(updated);

    if (updated.uid && this.adapter.syncUserAlertMirror) {
      await this.adapter
        .syncUserAlertMirror(updated.uid, {
          subscribed: false,
          email: updated.email,
          preferences: updated.preferences,
          consentStatus: 'unsubscribed',
          frequency: updated.frequency,
          unsubscribedAt: now,
          updatedAt: now,
        })
        .catch(() => {});
    }

    return updated;
  }

  async rotateUnsubscribeToken(record: OpportunitySubscriberRecord): Promise<string> {
    const token = generateSecureToken();
    const updated: OpportunitySubscriberRecord = {
      ...record,
      unsubscribeTokenHash: hashToken(token),
      updatedAt: new Date().toISOString(),
    };
    await this.adapter.saveSubscriber(updated);
    return token;
  }

  async recordDeliveryAttempt(log: AlertDeliveryLogRecord): Promise<void> {
    await this.adapter.saveDeliveryLog(log);
  }

  async hasDeadlineBeenNotified(dedupeKey: string): Promise<boolean> {
    const existing = await this.adapter.getDeliveryLog(dedupeKey);
    return Boolean(existing && existing.status === 'sent');
  }

  async migrateLegacyJsonFileIfPresent(legacyFilePath?: string): Promise<number> {
    if (!this.isConfigured()) return 0;
    const targetPath =
      legacyFilePath || path.resolve(process.cwd(), '.data', 'scholarship-subscribers.json');

    try {
      const content = await fs.readFile(targetPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 0;

      let migratedCount = 0;
      for (const rawRecord of Object.values(parsed as Record<string, any>)) {
        if (!rawRecord || typeof rawRecord.email !== 'string') continue;
        const cleanEmail = normalizeEmail(rawRecord.email);
        const eHash = hashEmail(cleanEmail);
        const existing = await this.adapter.getSubscriberByEmailHash(eHash);
        if (existing) continue;

        const consentStatus: ConsentStatus =
          rawRecord.status === 'unsubscribed'
            ? 'unsubscribed'
            : rawRecord.status === 'active'
            ? 'pending' // Require confirmation before emailing legacy unconfirmed entries
            : 'pending';

        const now = new Date().toISOString();
        const migrated: OpportunitySubscriberRecord = {
          email: cleanEmail,
          emailHash: eHash,
          preferences: normalizePreferences(rawRecord.preferences),
          consentStatus,
          frequency: 'weekly',
          manageTokenHash: typeof rawRecord.manageTokenHash === 'string' ? rawRecord.manageTokenHash : '',
          subscribedAt: typeof rawRecord.subscribedAt === 'string' ? rawRecord.subscribedAt : now,
          updatedAt: typeof rawRecord.updatedAt === 'string' ? rawRecord.updatedAt : now,
          unsubscribedAt: typeof rawRecord.unsubscribedAt === 'string' ? rawRecord.unsubscribedAt : undefined,
        };
        await this.adapter.saveSubscriber(migrated);
        migratedCount++;
      }

      if (migratedCount > 0) {
        await fs.rename(targetPath, `${targetPath}.migrated-${Date.now()}`).catch(() => {});
      }
      return migratedCount;
    } catch (err: any) {
      if (err?.code === 'ENOENT') return 0;
      console.warn('[Alerts/Migration] Could not read legacy subscriber file:', err?.message);
      return 0;
    }
  }
}
