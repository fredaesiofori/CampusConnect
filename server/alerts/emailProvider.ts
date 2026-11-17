/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailProviderStatus, EmailSendResult, isValidEmailAddress, normalizeEmail } from './types';

export const RESEND_TEST_SENDER = 'Campus Connect <onboarding@resend.dev>';
export const DEFAULT_VERIFIED_TEST_RECIPIENT = 'fredaesiofori905@gmail.com';

export interface TransactionalEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

const REQUEST_TIMEOUT_MS = 15_000;

export function getAllowedTestRecipient(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.EMAIL_TEST_RECIPIENT?.trim() || DEFAULT_VERIFIED_TEST_RECIPIENT;
  const normalized = normalizeEmail(configured);
  return isValidEmailAddress(normalized) ? normalized : DEFAULT_VERIFIED_TEST_RECIPIENT;
}

export function resolveEffectiveSender(env: NodeJS.ProcessEnv = process.env): {
  from: string;
  testingMode: boolean;
  explicitFromConfigured: boolean;
} {
  const resendKey = env.RESEND_API_KEY?.trim() || '';
  const explicitFrom = env.EMAIL_FROM?.trim() || '';
  const rawTestMode = env.EMAIL_TEST_MODE?.trim().toLowerCase();

  // Respect explicit EMAIL_TEST_MODE="false" ONLY when a custom verified domain sender is configured
  const explicitlyDisabledTestMode = rawTestMode === 'false';
  const explicitlyEnabledTestMode = rawTestMode === 'true';

  if (explicitFrom) {
    const usesResendSandboxDomain = /@resend\.dev\b/i.test(explicitFrom);
    // Safety guard: never allow real-student sending if using onboarding@resend.dev even if EMAIL_TEST_MODE=false
    const testingMode = usesResendSandboxDomain
      ? true
      : explicitlyEnabledTestMode || !explicitlyDisabledTestMode;

    return {
      from: explicitFrom,
      testingMode,
      explicitFromConfigured: true,
    };
  }

  if (resendKey) {
    return {
      from: RESEND_TEST_SENDER,
      testingMode: true,
      explicitFromConfigured: false,
    };
  }

  return {
    from: '',
    testingMode: rawTestMode !== 'false',
    explicitFromConfigured: false,
  };
}

export function getEmailProviderStatus(env: NodeJS.ProcessEnv = process.env): EmailProviderStatus {
  const resendKey = env.RESEND_API_KEY?.trim() || '';
  const sender = resolveEffectiveSender(env);
  const provider: 'resend' | null = resendKey ? 'resend' : null;

  const missingRequirements: string[] = [];
  if (!provider) {
    missingRequirements.push('RESEND_API_KEY');
  }
  if (!sender.from) {
    missingRequirements.push('EMAIL_FROM (verified sender email address)');
  }

  return {
    configured: Boolean(provider && sender.from),
    provider,
    fromAddressConfigured: Boolean(sender.from),
    senderIdentity: sender.from || null,
    testingMode: sender.testingMode,
    missingRequirements,
  };
}

function sanitizeProviderError(raw: string): string {
  return raw.replace(/re_[a-zA-Z0-9_]+/g, '[REDACTED_KEY]').slice(0, 300);
}

async function sendViaResend(
  apiKey: string,
  from: string,
  replyTo: string | undefined,
  payload: TransactionalEmailPayload,
  fetchImpl: typeof fetch
): Promise<EmailSendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    };
    if (replyTo) {
      body.reply_to = replyTo;
    }
    if (payload.headers && Object.keys(payload.headers).length > 0) {
      body.headers = payload.headers;
    }

    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({} as Record<string, any>));

    if (res.ok && data?.id) {
      return {
        delivered: true,
        provider: 'resend',
        messageId: String(data.id),
        statusCode: res.status,
      };
    }

    const rateLimited = res.status === 429;
    const rawProviderMsg =
      data?.message || data?.error?.message || `Email provider returned HTTP ${res.status}`;
    console.warn('[Alerts/Email] Delivery returned non-OK:', rawProviderMsg);
    const errMsg = sanitizeProviderError('Unable to deliver email right now. Please try again shortly.');

    return {
      delivered: false,
      provider: 'resend',
      statusCode: res.status,
      rateLimited,
      error: errMsg,
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    console.warn('[Alerts/Email] Delivery network/timeout error:', err?.message || err);
    return {
      delivered: false,
      provider: 'resend',
      statusCode: isAbort ? 504 : 502,
      error: isAbort
        ? 'Email delivery request timed out.'
        : 'Unable to deliver email right now. Please try again shortly.',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function sendTransactionalEmail(
  payload: TransactionalEmailPayload,
  options: { env?: NodeJS.ProcessEnv; fetchImpl?: typeof fetch } = {}
): Promise<EmailSendResult> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const status = getEmailProviderStatus(env);

  if (!status.configured || !status.provider || !status.senderIdentity) {
    console.warn('[Alerts/Email] Missing server configuration:', status.missingRequirements.join(', '));
    return {
      delivered: false,
      provider: 'none',
      statusCode: 503,
      error: 'Email delivery is temporarily unavailable right now.',
    };
  }

  if (status.testingMode) {
    const allowedRecipient = getAllowedTestRecipient(env);
    const requestedRecipient = normalizeEmail(payload.to || '');
    if (requestedRecipient !== allowedRecipient) {
      return {
        delivered: false,
        provider: 'resend',
        statusCode: 403,
        blockedByTestMode: true,
        error:
          'Outbound email alerts are currently restricted while email verification is being completed.',
      };
    }
  }

  const apiKey = env.RESEND_API_KEY!.trim();
  const from = status.senderIdentity;
  const replyTo = env.EMAIL_REPLY_TO?.trim() || undefined;

  let result = await sendViaResend(apiKey, from, replyTo, payload, fetchImpl);

  // Single bounded retry on transient 5xx (never on 4xx or 429)
  if (!result.delivered && result.statusCode && result.statusCode >= 500 && result.statusCode < 600) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    result = await sendViaResend(apiKey, from, replyTo, payload, fetchImpl);
  }

  return result;
}
