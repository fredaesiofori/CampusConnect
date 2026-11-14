/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';

export const ALLOWED_PREFERENCE_IDS = [
  'all',
  'admissions',
  'fully-funded',
  'partial-aid',
  'fee-waiver',
  'sat-optional',
  'international',
  'graduate',
  'deadlines',
] as const;

export const SPECIFIC_PREFERENCE_IDS = [
  'admissions',
  'fully-funded',
  'partial-aid',
  'fee-waiver',
  'sat-optional',
  'international',
  'graduate',
  'deadlines',
] as const;

export type AlertPreferenceId = (typeof ALLOWED_PREFERENCE_IDS)[number];

export type ConsentStatus = 'pending' | 'confirmed' | 'unsubscribed';
export type AlertFrequency = 'immediate' | 'weekly';

export interface OpportunitySubscriberRecord {
  email: string;
  emailHash: string;
  preferences: AlertPreferenceId[];
  consentStatus: ConsentStatus;
  frequency: AlertFrequency;
  uid?: string;
  preferredDestinations?: string[];
  intendedDegree?: string;
  fieldOfStudy?: string;
  manageTokenHash: string;
  confirmTokenHash?: string;
  unsubscribeTokenHash?: string;
  subscribedAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  updatedAt: string;
  lastDigestSentAt?: string;
  lastDeliveryStatus?: 'sent' | 'failed';
  lastDeliveryError?: string;
  deliveryErrorCount?: number;
}

export interface AlertDeliveryLogRecord {
  id: string;
  emailHash: string;
  alertType:
    | 'confirmation'
    | 'welcome'
    | 'preferences-updated'
    | 'digest'
    | 'deadline-reminder'
    | 'personalized-opportunity'
    | 'application-checklist';
  opportunityIds: string[];
  dedupeKey?: string;
  provider: 'resend' | 'none';
  providerMessageId?: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

export interface EmailProviderStatus {
  configured: boolean;
  provider: 'resend' | null;
  fromAddressConfigured: boolean;
  senderIdentity: string | null;
  testingMode: boolean;
  missingRequirements: string[];
}

export interface EmailSendResult {
  delivered: boolean;
  provider: 'resend' | 'none';
  messageId?: string;
  statusCode?: number;
  rateLimited?: boolean;
  blockedByTestMode?: boolean;
  error?: string;
}

export const PREFERENCE_LABELS: Record<AlertPreferenceId, string> = {
  all: 'All Global Opportunities',
  admissions: 'University Admissions',
  'fully-funded': 'Fully Funded Scholarships',
  'partial-aid': 'Partial Scholarships & Financial Aid',
  'fee-waiver': 'Free Apps & Fee Waivers',
  'sat-optional': 'SAT-Free & Test-Optional',
  international: 'International Study Opportunities',
  graduate: 'Postgraduate & Research Grants',
  deadlines: 'Upcoming Application Deadlines',
};

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function hashEmail(normalizedEmail: string): string {
  return crypto.createHash('sha256').update(normalizedEmail).digest('hex');
}

export function generateSecureToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmailAddress(email: string): boolean {
  if (!email || email.length < 5 || email.length > 254) return false;
  if (email.includes('..')) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function normalizePreferences(raw: unknown): AlertPreferenceId[] {
  if (!Array.isArray(raw)) return [];
  const allowedSet = new Set<string>(ALLOWED_PREFERENCE_IDS);
  const filtered = Array.from(
    new Set(
      raw.filter(
        (item): item is AlertPreferenceId => typeof item === 'string' && allowedSet.has(item)
      )
    )
  );

  if (filtered.includes('all')) {
    return [...ALLOWED_PREFERENCE_IDS];
  }

  const hasAllSpecific = SPECIFIC_PREFERENCE_IDS.every((id) => filtered.includes(id));
  if (hasAllSpecific) {
    return [...ALLOWED_PREFERENCE_IDS];
  }

  return filtered;
}
