const TECHNICAL_PATTERNS: RegExp[] = [
  /firebase/i,
  /firestore/i,
  /gemini/i,
  /api[_ ]?key/i,
  /resend/i,
  /vapid/i,
  /custom claim/i,
  /cloud database/i,
  /database\s*id/i,
  /project\s*id/i,
  /\bauth\/[a-z0-9-]+/i,
  /permission[-_ ]?denied/i,
  /insufficient permissions/i,
  /\bfcm\b/i,
  /service[_ ]?account/i,
  /failed to fetch/i,
  /networkerror/i,
  /network request failed/i,
  /\bquota\b/i,
  /rate[-_ ]?limit/i,
  /resource[-_ ]?exhausted/i,
  /resource[-_ ]?not[-_ ]?found/i,
  /deadline[-_ ]?exceeded/i,
  /unavailable/i,
  /\bstack\b/i,
  /json/i,
  /onboarding@resend/i,
  /token/i,
];

const AUTH_FRIENDLY_MAP: Array<[RegExp, string]> = [
  [/auth\/invalid-credential|auth\/wrong-password|auth\/user-not-found/i, 'Incorrect email or password. Please check your details and try again.'],
  [/auth\/email-already-in-use/i, 'An account with this email already exists. Try logging in instead.'],
  [/auth\/weak-password/i, 'Please choose a stronger password with at least 6 characters.'],
  [/auth\/invalid-email/i, 'Please enter a valid email address.'],
  [/auth\/too-many-requests|rate[-_ ]?limit|too many/i, 'Too many attempts right now. Please wait a few minutes and try again.'],
  [/auth\/popup-closed-by-user|auth\/cancelled-popup-request/i, 'Sign-in was cancelled before finishing. Please try again.'],
  [/auth\/popup-blocked/i, 'Pop-up sign-in was blocked by your browser. Please allow pop-ups for this site and try again.'],
  [/auth\/network-request-failed|failed to fetch|networkerror|network request failed/i, 'Connection issue detected. Please check your internet connection and try again.'],
  [/auth\/requires-recent-login/i, 'For your security, please sign out and sign back in before completing this action.'],
  [/auth\/user-disabled/i, 'This account has been disabled. Please contact Campus Connect support.'],
  [/auth\/account-exists-with-different-credential/i, 'An account already exists with this email using a different sign-in method.'],
  [/auth\/expired-action-code|auth\/invalid-action-code/i, 'This link has expired or is no longer valid. Please request a new one.'],
];

/**
 * Normalizes backend, auth, or network errors into calm, student-friendly messages
 * without exposing infrastructure providers, keys, tokens, or raw internal error codes.
 */
export function getStudentFriendlyError(
  raw: unknown,
  fallback = 'Something went wrong. Please try again shortly.',
): string {
  const rawText =
    typeof raw === 'string'
      ? raw.trim()
      : raw instanceof Error
        ? raw.message.trim()
        : raw && typeof raw === 'object' && 'message' in raw && typeof (raw as { message?: unknown }).message === 'string'
          ? String((raw as { message: string }).message).trim()
          : '';

  if (!rawText) {
    return fallback;
  }

  for (const [pattern, friendly] of AUTH_FRIENDLY_MAP) {
    if (pattern.test(rawText)) {
      return friendly;
    }
  }

  for (const pattern of TECHNICAL_PATTERNS) {
    if (pattern.test(rawText)) {
      return fallback;
    }
  }

  // Strip trailing parenthetical internal error codes like "(auth/foo)" if any slipped through
  const cleaned = rawText.replace(/\s*\([^)]*(?:auth\/|error|code)[^)]*\)/gi, '').trim();
  return cleaned || fallback;
}
