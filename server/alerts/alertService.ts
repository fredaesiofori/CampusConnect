/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import {
  AlertDeliveryLogRecord,
  AlertFrequency,
  AlertPreferenceId,
  EmailProviderStatus,
  isValidEmailAddress,
  normalizeEmail,
  normalizePreferences,
  OpportunitySubscriberRecord,
} from './types';
import { OpportunitySubscriberStore } from './firestoreStore';
import {
  getAllowedTestRecipient,
  getEmailProviderStatus,
  sendTransactionalEmail,
  TransactionalEmailPayload,
} from './emailProvider';
import {
  buildConfirmationEmail,
  buildDeadlineReminderEmail,
  buildWelcomeDigestEmail,
} from './emailTemplates';
import {
  findPersonalizedOpportunities,
  findUpcomingDeadlineMatches,
  MatchedOpportunityCard,
} from './opportunityMatcher';
import { OpportunityItem } from '../../src/data/opportunities';

export interface AlertServiceDependencies {
  store: OpportunitySubscriberStore;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  catalog?: OpportunityItem[];
  appUrl?: string;
}

export interface DeadlineCronSummary {
  executed: boolean;
  reason?: string;
  confirmedSubscribersChecked: number;
  emailsAttempted: number;
  emailsSent: number;
  emailsFailed: number;
  skippedAlreadyNotified: number;
  skippedNoUpcomingMatches: number;
  errors: Array<{ emailHash: string; error: string }>;
}

export function resolveAppBaseUrl(env: NodeJS.ProcessEnv = process.env, requestOrigin?: string): string {
  const configured = env.APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, '');
  }
  if (requestOrigin && /^https?:\/\//i.test(requestOrigin)) {
    return requestOrigin.replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

export class AlertNotificationService {
  private readonly env: NodeJS.ProcessEnv;
  private readonly fetchImpl?: typeof fetch;
  private readonly catalog?: OpportunityItem[];

  constructor(private readonly deps: AlertServiceDependencies) {
    this.env = deps.env ?? process.env;
    this.fetchImpl = deps.fetchImpl;
    this.catalog = deps.catalog;
  }

  getHealthStatus(): {
    firestoreConfigured: boolean;
    emailDeliveryConfigured: boolean;
    testingMode: boolean;
    senderIdentity: string | null;
    providerStatus: EmailProviderStatus;
    envStatus: {
      RESEND_API_KEY: boolean;
      SENDGRID_API_KEY: boolean;
      EMAIL_FROM: boolean;
      FIREBASE_SERVICE_ACCOUNT_JSON: boolean;
      ALERT_CRON_SECRET: boolean;
      APP_URL: boolean;
      GEMINI_API_KEY: boolean;
    };
  } {
    const providerStatus = getEmailProviderStatus(this.env);
    return {
      firestoreConfigured: this.deps.store.isConfigured(),
      emailDeliveryConfigured: providerStatus.configured,
      testingMode: providerStatus.testingMode,
      senderIdentity: providerStatus.senderIdentity,
      providerStatus,
      envStatus: {
        RESEND_API_KEY: Boolean(this.env.RESEND_API_KEY?.trim()),
        SENDGRID_API_KEY: Boolean(this.env.SENDGRID_API_KEY?.trim()),
        EMAIL_FROM: Boolean(this.env.EMAIL_FROM?.trim()),
        FIREBASE_SERVICE_ACCOUNT_JSON: Boolean(
          this.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ||
            this.env.FIREBASE_SERVICE_ACCOUNT?.trim() ||
            this.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()
        ),
        ALERT_CRON_SECRET: Boolean(this.env.ALERT_CRON_SECRET?.trim()),
        APP_URL: Boolean(this.env.APP_URL?.trim()),
        GEMINI_API_KEY: Boolean(this.env.GEMINI_API_KEY?.trim()),
      },
    };
  }

  private async sendAndLogEmail(params: {
    emailHash: string;
    alertType: AlertDeliveryLogRecord['alertType'];
    payload: TransactionalEmailPayload;
    opportunityIds?: string[];
    dedupeLogId?: string;
    dedupeKey?: string;
  }) {
    const result = await sendTransactionalEmail(params.payload, {
      env: this.env,
      fetchImpl: this.fetchImpl,
    });

    const logId =
      params.dedupeLogId && result.delivered
        ? params.dedupeLogId
        : `${params.emailHash.slice(0, 16)}_${params.alertType}_${Date.now()}_${crypto
            .randomBytes(4)
            .toString('hex')}`;

    if (this.deps.store.isConfigured()) {
      await this.deps.store
        .recordDeliveryAttempt({
          id: logId,
          emailHash: params.emailHash,
          alertType: params.alertType,
          opportunityIds: params.opportunityIds || [],
          dedupeKey: params.dedupeKey,
          provider: result.provider,
          providerMessageId: result.messageId,
          status: result.delivered ? 'sent' : 'failed',
          errorMessage: result.error,
          createdAt: new Date().toISOString(),
        })
        .catch((err) => {
          console.error('[Alerts] Failed to write delivery log:', err?.message);
        });
    }

    return result;
  }

  async subscribe(input: {
    email: unknown;
    preferences: unknown;
    uid?: string;
    preferredDestinations?: string[];
    intendedDegree?: string;
    fieldOfStudy?: string;
    frequency?: AlertFrequency;
    requestOrigin?: string;
  }) {
    const providerStatus = getEmailProviderStatus(this.env);
    const firestoreConfigured = this.deps.store.isConfigured();

    if (typeof input.email !== 'string' || !input.email.trim()) {
      return {
        statusCode: 400,
        body: {
          error: 'Please enter your email address.',
          firestoreConfigured,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const emailNormalized = normalizeEmail(input.email);
    if (!isValidEmailAddress(emailNormalized)) {
      return {
        statusCode: 400,
        body: {
          error: 'Please enter a valid email address (e.g., student@university.edu).',
          firestoreConfigured,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const normalizedPrefs = normalizePreferences(input.preferences);
    if (normalizedPrefs.length === 0) {
      return {
        statusCode: 400,
        body: {
          error: 'Please select at least one opportunity preference.',
          firestoreConfigured,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    if (!firestoreConfigured) {
      return {
        statusCode: 503,
        body: {
          error:
            'Persistent Firestore storage is not configured on the server yet (missing FIREBASE_SERVICE_ACCOUNT_JSON).',
          code: 'FIRESTORE_UNCONFIGURED',
          firestoreConfigured: false,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const prep = await this.deps.store.subscribeOrPrepareDoubleOptIn({
      email: emailNormalized,
      preferences: normalizedPrefs,
      emailDeliveryConfigured: providerStatus.configured,
      uid: input.uid,
      preferredDestinations: input.preferredDestinations,
      intendedDegree: input.intendedDegree,
      fieldOfStudy: input.fieldOfStudy,
      frequency: input.frequency,
    });

    if (prep.status === 'duplicate') {
      return {
        statusCode: 409,
        body: {
          alreadySubscribed: true,
          consentStatus: prep.existing.consentStatus,
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
          error:
            'This email is already confirmed for Campus Connect opportunity alerts. No duplicate subscription was created.',
        },
      };
    }

    const baseUrl = this.deps.appUrl || resolveAppBaseUrl(this.env, input.requestOrigin);
    const confirmUrl = `${baseUrl}/?alertAction=confirm&token=${encodeURIComponent(prep.confirmToken)}#newsletter`;
    const unsubscribeUrl = `${baseUrl}/?alertAction=unsubscribe&token=${encodeURIComponent(
      prep.unsubscribeToken
    )}#newsletter`;

    let confirmationEmailSent = false;
    let deliveryError: string | undefined;

    if (providerStatus.configured) {
      const template = buildConfirmationEmail({
        confirmUrl,
        unsubscribeUrl,
        preferences: prep.record.preferences,
      });

      const sendResult = await this.sendAndLogEmail({
        emailHash: prep.record.emailHash,
        alertType: 'confirmation',
        payload: {
          to: prep.record.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        },
      });

      confirmationEmailSent = sendResult.delivered;
      if (!sendResult.delivered) {
        deliveryError = sendResult.error || 'Failed to send confirmation email.';
        await this.deps.store.adapter.saveSubscriber({
          ...prep.record,
          lastDeliveryStatus: 'failed',
          lastDeliveryError: deliveryError,
          deliveryErrorCount: (prep.record.deliveryErrorCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await this.deps.store.adapter.saveSubscriber({
          ...prep.record,
          lastDeliveryStatus: 'sent',
          lastDeliveryError: '',
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return {
      statusCode: prep.status === 'created' ? 201 : 200,
      body: {
        success: true,
        alreadySubscribed: false,
        reactivated: prep.status === 'reactivated',
        pendingConfirmation: true,
        consentStatus: prep.record.consentStatus,
        confirmationEmailSent,
        deliveryError,
        manageToken: prep.manageToken,
        firestoreConfigured: true,
        emailDeliveryConfigured: providerStatus.configured,
        testingMode: providerStatus.testingMode,
        emailProvider: providerStatus.provider,
        subscription: {
          email: prep.record.email,
          preferences: prep.record.preferences,
          consentStatus: prep.record.consentStatus,
          frequency: prep.record.frequency,
          subscribedAt: prep.record.subscribedAt,
          updatedAt: prep.record.updatedAt,
        },
        message: !providerStatus.configured
          ? 'Preferences saved to Firestore, but email delivery is not active yet because provider credentials are not configured.'
          : confirmationEmailSent
          ? 'Confirmation email sent! Please check your inbox and click the confirmation link to activate opportunity alerts.'
          : deliveryError
          ? `Preferences saved, but confirmation email was not delivered: ${deliveryError}`
          : 'Preferences saved, but confirmation email could not be sent.',
      },
    };
  }

  async confirmByToken(rawToken: string, requestOrigin?: string) {
    const providerStatus = getEmailProviderStatus(this.env);
    const firestoreConfigured = this.deps.store.isConfigured();

    if (!firestoreConfigured) {
      return {
        statusCode: 503,
        body: {
          confirmed: false,
          error: 'Persistent Firestore storage is not configured.',
          firestoreConfigured: false,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const result = await this.deps.store.confirmByToken(rawToken);
    if (!result.confirmed || !result.record) {
      return {
        statusCode: 404,
        body: {
          confirmed: false,
          error: 'Confirmation link is invalid or has already been used.',
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    let welcomeEmailSent = false;
    let deliveryError: string | undefined;

    if (!result.alreadyConfirmed && providerStatus.configured && result.manageToken && result.unsubscribeToken) {
      const baseUrl = this.deps.appUrl || resolveAppBaseUrl(this.env, requestOrigin);
      const manageUrl = `${baseUrl}/?alertAction=manage#newsletter`;
      const unsubscribeUrl = `${baseUrl}/?alertAction=unsubscribe&token=${encodeURIComponent(
        result.unsubscribeToken
      )}#newsletter`;

      const matched = findPersonalizedOpportunities(
        {
          preferences: result.record.preferences,
          preferredDestinations: result.record.preferredDestinations,
          intendedDegree: result.record.intendedDegree,
          fieldOfStudy: result.record.fieldOfStudy,
        },
        { limit: 5, catalog: this.catalog }
      );

      const template = buildWelcomeDigestEmail({
        preferences: result.record.preferences,
        opportunities: matched,
        manageUrl,
        unsubscribeUrl,
      });

      const sendResult = await this.sendAndLogEmail({
        emailHash: result.record.emailHash,
        alertType: 'welcome',
        opportunityIds: matched.map((m) => m.id),
        payload: {
          to: result.record.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        },
      });

      welcomeEmailSent = sendResult.delivered;
      if (!sendResult.delivered) {
        deliveryError = sendResult.error;
      }
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        confirmed: true,
        alreadyConfirmed: Boolean(result.alreadyConfirmed),
        welcomeEmailSent,
        deliveryError,
        manageToken: result.manageToken,
        firestoreConfigured: true,
        emailDeliveryConfigured: providerStatus.configured,
        subscription: {
          email: result.record.email,
          preferences: result.record.preferences,
          consentStatus: result.record.consentStatus,
          frequency: result.record.frequency,
          subscribedAt: result.record.subscribedAt,
          confirmedAt: result.record.confirmedAt,
          updatedAt: result.record.updatedAt,
        },
        message: 'Email confirmed! Your Campus Connect opportunity alerts are now active.',
      },
    };
  }

  async lookupSubscription(params: { manageToken?: string; uid?: string; email?: string }) {
    const providerStatus = getEmailProviderStatus(this.env);
    const firestoreConfigured = this.deps.store.isConfigured();

    if (!firestoreConfigured) {
      return {
        statusCode: 200,
        body: {
          subscribed: false,
          firestoreConfigured: false,
          emailDeliveryConfigured: providerStatus.configured,
          provider: providerStatus.provider,
        },
      };
    }

    let match: OpportunitySubscriberRecord | null = null;
    if (params.manageToken) {
      match = await this.deps.store.findByManageToken(params.manageToken);
    } else if (params.uid) {
      match = await this.deps.store.findByAuthenticatedUser(params.uid, params.email);
      if (match && match.consentStatus === 'unsubscribed') {
        match = null;
      }
    }

    if (!match) {
      return {
        statusCode: 200,
        body: {
          subscribed: false,
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
          provider: providerStatus.provider,
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        subscribed: true,
        firestoreConfigured: true,
        emailDeliveryConfigured: providerStatus.configured,
        provider: providerStatus.provider,
        subscription: {
          email: match.email,
          preferences: match.preferences,
          consentStatus: match.consentStatus,
          frequency: match.frequency,
          preferredDestinations: match.preferredDestinations || [],
          intendedDegree: match.intendedDegree || '',
          fieldOfStudy: match.fieldOfStudy || '',
          subscribedAt: match.subscribedAt,
          confirmedAt: match.confirmedAt,
          updatedAt: match.updatedAt,
          lastDeliveryStatus: match.lastDeliveryStatus,
          lastDeliveryError: match.lastDeliveryError,
        },
      },
    };
  }

  async updatePreferences(input: {
    manageToken?: string;
    uid?: string;
    email?: string;
    preferences: unknown;
    frequency?: AlertFrequency;
    preferredDestinations?: string[];
    intendedDegree?: string;
    fieldOfStudy?: string;
  }) {
    const providerStatus = getEmailProviderStatus(this.env);
    const firestoreConfigured = this.deps.store.isConfigured();

    if (!firestoreConfigured) {
      return {
        statusCode: 503,
        body: {
          error: 'Persistent Firestore storage is not configured.',
          firestoreConfigured: false,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const normalizedPrefs = normalizePreferences(input.preferences);
    if (normalizedPrefs.length === 0) {
      return {
        statusCode: 400,
        body: {
          error: 'Please select at least one opportunity preference.',
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    let match: OpportunitySubscriberRecord | null = null;
    if (input.manageToken) {
      match = await this.deps.store.findByManageToken(input.manageToken);
    } else if (input.uid) {
      match = await this.deps.store.findByAuthenticatedUser(input.uid, input.email);
      if (match && match.consentStatus === 'unsubscribed') {
        match = null;
      }
    }

    if (!match) {
      return {
        statusCode: 404,
        body: {
          error: 'Active subscription not found. Please subscribe again.',
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    const updated = await this.deps.store.updatePreferences({
      record: match,
      preferences: normalizedPrefs,
      frequency: input.frequency,
      preferredDestinations: input.preferredDestinations,
      intendedDegree: input.intendedDegree,
      fieldOfStudy: input.fieldOfStudy,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        firestoreConfigured: true,
        emailDeliveryConfigured: providerStatus.configured,
        subscription: {
          email: updated.email,
          preferences: updated.preferences,
          consentStatus: updated.consentStatus,
          frequency: updated.frequency,
          preferredDestinations: updated.preferredDestinations || [],
          intendedDegree: updated.intendedDegree || '',
          fieldOfStudy: updated.fieldOfStudy || '',
          subscribedAt: updated.subscribedAt,
          confirmedAt: updated.confirmedAt,
          updatedAt: updated.updatedAt,
        },
        message: 'Opportunity preferences updated.',
      },
    };
  }

  async unsubscribe(input: { token?: string; uid?: string; email?: string }) {
    const providerStatus = getEmailProviderStatus(this.env);
    const firestoreConfigured = this.deps.store.isConfigured();

    if (!firestoreConfigured) {
      return {
        statusCode: 503,
        body: {
          error: 'Persistent Firestore storage is not configured.',
          firestoreConfigured: false,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    let unsubscribedRecord: OpportunitySubscriberRecord | null = null;

    if (input.token) {
      unsubscribedRecord = await this.deps.store.unsubscribeByToken(input.token);
    } else if (input.uid) {
      const existing = await this.deps.store.findByAuthenticatedUser(input.uid, input.email);
      if (existing && existing.consentStatus !== 'unsubscribed') {
        unsubscribedRecord = await this.deps.store.markUnsubscribed(existing);
      }
    }

    if (!unsubscribedRecord) {
      return {
        statusCode: 404,
        body: {
          error: 'No active subscription found to unsubscribe.',
          firestoreConfigured: true,
          emailDeliveryConfigured: providerStatus.configured,
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        firestoreConfigured: true,
        emailDeliveryConfigured: providerStatus.configured,
        email: unsubscribedRecord.email,
        consentStatus: 'unsubscribed',
        message: 'You have been unsubscribed from Campus Connect opportunity alerts.',
      },
    };
  }

  async runDeadlineReminderJob(options: {
    now?: Date;
    windowDays?: number;
    dryRun?: boolean;
  } = {}): Promise<DeadlineCronSummary> {
    const now = options.now ?? new Date();
    const windowDays = options.windowDays ?? 21;
    const providerStatus = getEmailProviderStatus(this.env);

    const summary: DeadlineCronSummary = {
      executed: false,
      confirmedSubscribersChecked: 0,
      emailsAttempted: 0,
      emailsSent: 0,
      emailsFailed: 0,
      skippedAlreadyNotified: 0,
      skippedNoUpcomingMatches: 0,
      errors: [],
    };

    if (!this.deps.store.isConfigured()) {
      summary.reason = 'Firestore Admin storage is not configured.';
      return summary;
    }

    if (!providerStatus.configured && !options.dryRun) {
      summary.reason = `Email delivery provider is not configured (${providerStatus.missingRequirements.join(
        ', '
      )}).`;
      return summary;
    }

    summary.executed = true;
    const subscribers = await this.deps.store.adapter.listConfirmedSubscribers(500);
    summary.confirmedSubscribersChecked = subscribers.length;

    const baseUrl = this.deps.appUrl || resolveAppBaseUrl(this.env);
    const allowedTestRecipient = providerStatus.testingMode ? getAllowedTestRecipient(this.env) : null;

    for (const sub of subscribers) {
      if (sub.consentStatus !== 'confirmed') continue;
      if (allowedTestRecipient && normalizeEmail(sub.email) !== allowedTestRecipient) {
        continue;
      }

      const upcoming = findUpcomingDeadlineMatches(
        {
          preferences: sub.preferences,
          preferredDestinations: sub.preferredDestinations,
          intendedDegree: sub.intendedDegree,
          fieldOfStudy: sub.fieldOfStudy,
        },
        {
          windowDays,
          limit: 5,
          now,
          catalog: this.catalog,
        }
      );

      if (upcoming.length === 0) {
        summary.skippedNoUpcomingMatches++;
        continue;
      }

      // Deduplicate per subscriber + opportunity + deadlineDate cycle
      const unnotified: MatchedOpportunityCard[] = [];
      for (const card of upcoming) {
        const cycleStamp = (card.deadlineDate || 'open').replace(/[^a-zA-Z0-9-]/g, '');
        const dedupeKey = `${sub.emailHash.slice(0, 24)}__deadline__${card.id}__${cycleStamp}`;
        const alreadySent = await this.deps.store.hasDeadlineBeenNotified(dedupeKey);
        if (!alreadySent) {
          unnotified.push(card);
        }
      }

      if (unnotified.length === 0) {
        summary.skippedAlreadyNotified++;
        continue;
      }

      if (options.dryRun) {
        summary.emailsAttempted++;
        continue;
      }

      const freshUnsubToken = await this.deps.store.rotateUnsubscribeToken(sub);
      const manageUrl = `${baseUrl}/#newsletter`;
      const unsubscribeUrl = `${baseUrl}/?alertAction=unsubscribe&token=${encodeURIComponent(
        freshUnsubToken
      )}#newsletter`;

      const template = buildDeadlineReminderEmail({
        opportunities: unnotified,
        manageUrl,
        unsubscribeUrl,
      });

      summary.emailsAttempted++;
      const sendResult = await sendTransactionalEmail(
        {
          to: sub.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        },
        { env: this.env, fetchImpl: this.fetchImpl }
      );

      const nowIso = new Date().toISOString();
      if (sendResult.delivered) {
        summary.emailsSent++;
        // Record per-opportunity dedupe log so each opportunity deadline is only notified once per cycle
        for (const card of unnotified) {
          const cycleStamp = (card.deadlineDate || 'open').replace(/[^a-zA-Z0-9-]/g, '');
          const dedupeKey = `${sub.emailHash.slice(0, 24)}__deadline__${card.id}__${cycleStamp}`;
          await this.deps.store.recordDeliveryAttempt({
            id: dedupeKey,
            emailHash: sub.emailHash,
            alertType: 'deadline-reminder',
            opportunityIds: [card.id],
            dedupeKey,
            provider: sendResult.provider,
            providerMessageId: sendResult.messageId,
            status: 'sent',
            createdAt: nowIso,
          });
        }
      } else {
        summary.emailsFailed++;
        const errMsg = sendResult.error || 'Email delivery failed';
        summary.errors.push({ emailHash: sub.emailHash.slice(0, 12), error: errMsg });
        await this.deps.store.recordDeliveryAttempt({
          id: `${sub.emailHash.slice(0, 16)}_deadline_err_${Date.now()}`,
          emailHash: sub.emailHash,
          alertType: 'deadline-reminder',
          opportunityIds: unnotified.map((c) => c.id),
          provider: sendResult.provider,
          status: 'failed',
          errorMessage: errMsg,
          createdAt: nowIso,
        });
      }
    }

    return summary;
  }
}
