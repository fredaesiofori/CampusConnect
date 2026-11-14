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
  const forcedTestMode = env.EMAIL_TEST_MODE?.trim().toLowerCase() === 'true';

  if (explicitFrom) {
    const usesResendSandboxDomain = /@resend\.dev\b/i.test(explicitFrom);
    return {
      from: explicitFrom,
      testingMode: forcedTestMode || usesResendSandboxDomain,
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
    testingMode: forcedTestMode,
    explicitFromConfigured: false,
  };
}

export function getEmailProviderStatus(env: NodeJS.ProcessEnv = process.env): EmailProviderStatus {
  const resendKey = env.RESEND_API_KEY?.trim() || '';
  const sendgridKey = env.SENDGRID_API_KEY?.trim() || '';
  const sender = resolveEffectiveSender(env);

  const provider: 'resend' | 'sendgrid' | null = resendKey
    ? 'resend'
    : sendgridKey
    ? 'sendgrid'
    : null;

  const missingRequirements: string[] = [];
  if (!provider) {
    missingRequirements.push('RESEND_API_KEY or SENDGRID_API_KEY');
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

function parseFromHeader(rawFrom: string): { email: string; name?: string } {
  const match = rawFrom.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, ''),
      email: match[2].trim(),
    };
  }
  return { email: rawFrom.trim() };
}

function sanitizeProviderError(raw: string): string {
  // Never reflect Bearer tokens or API keys in error logs/responses
  return raw
    .replace(/re_[a-zA-Z0-9_]+/g, '[REDACTED_KEY]')
    .replace(/SG\.[a-zA-Z0-9_.-]+/g, '[REDACTED_KEY]')
    .slice(0, 300);
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
    const errMsg = sanitizeProviderError(
      data?.message || data?.error?.message || `Resend API returned HTTP ${res.status}`
    );

    return {
      delivered: false,
      provider: 'resend',
      statusCode: res.status,
      rateLimited,
      error: errMsg,
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return {
      delivered: false,
      provider: 'resend',
      statusCode: isAbort ? 504 : 502,
      error: isAbort
        ? 'Email delivery request to Resend timed out.'
        : sanitizeProviderError(err?.message || 'Network error sending via Resend.'),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function sendViaSendGrid(
  apiKey: string,
  fromRaw: string,
  replyToRaw: string | undefined,
  payload: TransactionalEmailPayload,
  fetchImpl: typeof fetch
): Promise<EmailSendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const fromParsed = parseFromHeader(fromRaw);
    const body: Record<string, unknown> = {
      personalizations: [{ to: [{ email: payload.to }] }],
      from: fromParsed,
      subject: payload.subject,
      content: [
        { type: 'text/plain', value: payload.text },
        { type: 'text/html', value: payload.html },
      ],
    };

    if (replyToRaw) {
      body.reply_to = parseFromHeader(replyToRaw);
    }
    if (payload.headers && Object.keys(payload.headers).length > 0) {
      body.headers = payload.headers;
    }

    const res = await fetchImpl('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (res.ok) {
      const msgId = res.headers.get('x-message-id') || `sg_${Date.now()}`;
      return {
        delivered: true,
        provider: 'sendgrid',
        messageId: msgId,
        statusCode: res.status,
      };
    }

    const data = await res.json().catch(() => ({} as Record<string, any>));
    const rateLimited = res.status === 429;
    const firstErr = Array.isArray(data?.errors) ? data.errors[0]?.message : undefined;

    return {
      delivered: false,
      provider: 'sendgrid',
      statusCode: res.status,
      rateLimited,
      error: sanitizeProviderError(firstErr || `SendGrid API returned HTTP ${res.status}`),
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return {
      delivered: false,
      provider: 'sendgrid',
      statusCode: isAbort ? 504 : 502,
      error: isAbort
        ? 'Email delivery request to SendGrid timed out.'
        : sanitizeProviderError(err?.message || 'Network error sending via SendGrid.'),
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
    return {
      delivered: false,
      provider: 'none',
      statusCode: 503,
      error: `Email delivery is not configured on the server. Missing: ${status.missingRequirements.join(', ')}.`,
    };
  }

  if (status.testingMode) {
    const allowedRecipient = getAllowedTestRecipient(env);
    const requestedRecipient = normalizeEmail(payload.to || '');
    if (requestedRecipient !== allowedRecipient) {
      return {
        delivered: false,
        provider: status.provider,
        statusCode: 403,
        blockedByTestMode: true,
        error:
          'Testing mode is active (onboarding@resend.dev): emails can only be sent to your verified Resend account email address. Real student emails are blocked.',
      };
    }
  }

  const from = status.senderIdentity;
  const replyTo = env.EMAIL_REPLY_TO?.trim() || undefined;

  const attemptSend = async (): Promise<EmailSendResult> => {
    if (status.provider === 'resend') {
      return sendViaResend(env.RESEND_API_KEY!.trim(), from, replyTo, payload, fetchImpl);
    }
    return sendViaSendGrid(env.SENDGRID_API_KEY!.trim(), from, replyTo, payload, fetchImpl);
  };

  let result = await attemptSend();

  // Single bounded retry on transient 5xx (not on 4xx or 429 rate-limits without delay)
  if (!result.delivered && result.statusCode && result.statusCode >= 500 && result.statusCode < 600) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    result = await attemptSend();
  }

  return result;
}
