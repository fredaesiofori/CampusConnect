/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  ShieldCheck,
  BellRing,
  Clock,
  AlertCircle,
  Check,
  SlidersHorizontal,
  LogOut,
  Info,
  GraduationCap,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import {
  getCurrentUserIdToken,
  syncScholarshipAlertToFirestore,
} from '../../services/firebase';

export interface NewsletterSectionProps {
  className?: string;
  onSubscribed?: (email: string, preferences: string[]) => void;
}

const PREFERENCE_OPTIONS = [
  { id: 'all', label: 'All Opportunities', icon: '🎓' },
  { id: 'admissions', label: 'University Admissions', icon: '🏫' },
  { id: 'fully-funded', label: 'Fully Funded Scholarships', icon: '💰' },
  { id: 'partial-aid', label: 'Partial Aid & Grants', icon: '🏅' },
  { id: 'fee-waiver', label: 'Free Apps & Fee Waivers', icon: '⚡' },
  { id: 'sat-optional', label: 'SAT-Free & Test-Optional', icon: '📜' },
  { id: 'international', label: 'International Study', icon: '🌍' },
  { id: 'graduate', label: 'Postgraduate & Grants', icon: '🏛️' },
  { id: 'deadlines', label: 'Upcoming Deadlines', icon: '⏰' },
] as const;

const SPECIFIC_PREFERENCE_IDS = PREFERENCE_OPTIONS.filter((p) => p.id !== 'all').map((p) => p.id);
const ALL_PREFERENCE_IDS = PREFERENCE_OPTIONS.map((p) => p.id);

const LOCAL_STORAGE_KEY = 'campusconnect_newsletter_subscription';

interface StoredSubscriptionMeta {
  manageToken: string;
  email: string;
}

interface ActiveSubscription {
  email: string;
  preferences: string[];
  consentStatus?: 'pending' | 'confirmed' | 'unsubscribed';
  subscribedAt?: string;
  confirmedAt?: string;
  updatedAt?: string;
}

function getStoredSubscriptionMeta(): StoredSubscriptionMeta | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.manageToken === 'string' &&
      parsed.manageToken.length >= 16 &&
      typeof parsed.email === 'string'
    ) {
      return { manageToken: parsed.manageToken, email: parsed.email };
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

function saveStoredSubscriptionMeta(meta: StoredSubscriptionMeta | null): void {
  try {
    if (meta) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meta));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota issues
  }
}

function formatPreferenceLabels(prefIds: string[]): string[] {
  const withoutAll = prefIds.filter((id) => id !== 'all');
  if (
    prefIds.includes('all') ||
    SPECIFIC_PREFERENCE_IDS.every((id) => withoutAll.includes(id))
  ) {
    return ['All Opportunities'];
  }
  return withoutAll
    .map((id): string | undefined => PREFERENCE_OPTIONS.find((opt) => opt.id === id)?.label)
    .filter((label): label is string => typeof label === 'string');
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  className = '',
  onSubscribed,
}) => {
  const [email, setEmail] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'admissions',
    'fully-funded',
    'fee-waiver',
  ]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  const [manageToken, setManageToken] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isInterestsExpanded, setIsInterestsExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState<'preferences' | 'unsubscribe' | 'resend' | null>(null);
  const [emailDeliveryConfigured, setEmailDeliveryConfigured] = useState<boolean>(false);
  const [firestoreConfigured, setFirestoreConfigured] = useState<boolean>(true);

  // Handle URL double opt-in confirm / one-click unsubscribe links + verify saved session
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const alertAction = searchParams.get('alertAction');
      const actionToken = searchParams.get('token');

      if (alertAction === 'confirm' && actionToken) {
        try {
          const confirmRes = await fetch('/api/newsletter/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: actionToken }),
          });
          const confirmData = await confirmRes.json().catch(() => null);
          if (isMounted && confirmData) {
            if (typeof confirmData.emailDeliveryConfigured === 'boolean') {
              setEmailDeliveryConfigured(confirmData.emailDeliveryConfigured);
            }
            if (typeof confirmData.firestoreConfigured === 'boolean') {
              setFirestoreConfigured(confirmData.firestoreConfigured);
            }
            if (confirmRes.ok && confirmData.confirmed && confirmData.subscription) {
              if (confirmData.manageToken) {
                saveStoredSubscriptionMeta({
                  manageToken: confirmData.manageToken,
                  email: confirmData.subscription.email,
                });
                setManageToken(confirmData.manageToken);
              }
              setActiveSubscription(confirmData.subscription);
              setSelectedPreferences(
                Array.isArray(confirmData.subscription.preferences) &&
                  confirmData.subscription.preferences.length > 0
                  ? confirmData.subscription.preferences
                  : ['admissions', 'fully-funded', 'fee-waiver']
              );
              setJustConfirmed(true);
              setNoticeMessage(confirmData.message || 'Email confirmed! Your opportunity alerts are now active.');
              await syncScholarshipAlertToFirestore({
                subscribed: true,
                email: confirmData.subscription.email,
                preferences: confirmData.subscription.preferences,
                consentStatus: 'confirmed',
                confirmedAt: confirmData.subscription.confirmedAt,
              }).catch(() => {});
            } else {
              setStatus('error');
              setErrorMessage(
                confirmData.error || 'Confirmation link is invalid or has already been used.'
              );
            }
          }
        } catch {
          if (isMounted) {
            setStatus('error');
            setErrorMessage('Could not verify your confirmation link right now.');
          }
        } finally {
          window.history.replaceState({}, '', `${window.location.pathname}#newsletter`);
        }
        return;
      }

      if (alertAction === 'unsubscribe' && actionToken) {
        try {
          const unsubRes = await fetch('/api/newsletter/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: actionToken }),
          });
          const unsubData = await unsubRes.json().catch(() => null);
          if (isMounted) {
            if (unsubRes.ok && unsubData?.success) {
              saveStoredSubscriptionMeta(null);
              setManageToken(null);
              setActiveSubscription(null);
              setJustConfirmed(false);
              setNoticeMessage(
                unsubData.message || 'You have been unsubscribed from Campus Connect opportunity alerts.'
              );
              if (unsubData.email) {
                await syncScholarshipAlertToFirestore({
                  subscribed: false,
                  email: unsubData.email,
                  preferences: selectedPreferences,
                  consentStatus: 'unsubscribed',
                }).catch(() => {});
              }
            } else {
              setStatus('error');
              setErrorMessage(
                unsubData?.error || 'Could not process this unsubscribe link. It may have already been used.'
              );
            }
          }
        } catch {
          if (isMounted) {
            setStatus('error');
            setErrorMessage('Unable to complete unsubscribe right now.');
          }
        } finally {
          window.history.replaceState({}, '', `${window.location.pathname}#newsletter`);
        }
        return;
      }

      const stored = getStoredSubscriptionMeta();
      const idToken = await getCurrentUserIdToken();
      const headers: Record<string, string> = {};
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      try {
        if (!stored && !idToken) {
          const statusRes = await fetch('/api/newsletter/status');
          if (statusRes.ok && isMounted) {
            const statusData = await statusRes.json().catch(() => null);
            if (typeof statusData?.emailDeliveryConfigured === 'boolean') {
              setEmailDeliveryConfigured(statusData.emailDeliveryConfigured);
            }
            if (typeof statusData?.firestoreConfigured === 'boolean') {
              setFirestoreConfigured(statusData.firestoreConfigured);
            }
          }
          return;
        }

        const queryStr = stored ? `?token=${encodeURIComponent(stored.manageToken)}` : '';
        const res = await fetch(`/api/newsletter/subscription${queryStr}`, { headers });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (!isMounted || !data) return;

        if (typeof data.emailDeliveryConfigured === 'boolean') {
          setEmailDeliveryConfigured(data.emailDeliveryConfigured);
        }
        if (typeof data.firestoreConfigured === 'boolean') {
          setFirestoreConfigured(data.firestoreConfigured);
        }

        if (data.subscribed && data.subscription) {
          if (stored?.manageToken) {
            setManageToken(stored.manageToken);
          }
          setActiveSubscription(data.subscription);
          setSelectedPreferences(
            Array.isArray(data.subscription.preferences) && data.subscription.preferences.length > 0
              ? data.subscription.preferences
              : ['admissions', 'fully-funded', 'fee-waiver']
          );
          setJustConfirmed(false);
        } else if (stored) {
          saveStoredSubscriptionMeta(null);
          setManageToken(null);
          setActiveSubscription(null);
        }
      } catch {
        // Leave default form visible on verification check errors
      }
    };

    void initialize();
    return () => {
      isMounted = false;
    };
  }, []);

  const togglePreference = (id: string) => {
    setErrorMessage('');
    if (status === 'error') setStatus('idle');

    if (activeSubscription && !isEditingPreferences) {
      setIsEditingPreferences(true);
      setNoticeMessage('');
    }

    if (id === 'all') {
      setSelectedPreferences((prev) =>
        prev.includes('all') ? [] : [...ALL_PREFERENCE_IDS]
      );
      return;
    }

    setSelectedPreferences((prev) => {
      const withoutAll = prev.filter((p) => p !== 'all');
      const exists = withoutAll.includes(id);
      const updated = exists
        ? withoutAll.filter((p) => p !== id)
        : [...withoutAll, id];
      const allSpecificSelected = SPECIFIC_PREFERENCE_IDS.every((specId) =>
        updated.includes(specId)
      );
      return allSpecificSelected ? [...ALL_PREFERENCE_IDS] : updated;
    });
  };

  const submitSubscription = async (targetEmail: string, isResend = false) => {
    const idToken = await getCurrentUserIdToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    }

    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: targetEmail,
        preferences: selectedPreferences,
      }),
    });

    const data = await response.json().catch(() => null);

    if (typeof data?.emailDeliveryConfigured === 'boolean') {
      setEmailDeliveryConfigured(data.emailDeliveryConfigured);
    }
    if (typeof data?.firestoreConfigured === 'boolean') {
      setFirestoreConfigured(data.firestoreConfigured);
    }

    if (!response.ok || !data?.success || !data?.manageToken || !data?.subscription) {
      setStatus('error');
      setErrorMessage(
        data?.error || 'Unable to save your subscription right now. Please try again.'
      );
      return;
    }

    saveStoredSubscriptionMeta({
      manageToken: data.manageToken,
      email: data.subscription.email,
    });

    await syncScholarshipAlertToFirestore({
      subscribed: data.subscription.consentStatus === 'confirmed',
      email: data.subscription.email,
      preferences: data.subscription.preferences,
      consentStatus: data.subscription.consentStatus || 'pending',
    }).catch(() => {});

    setManageToken(data.manageToken);
    setActiveSubscription(data.subscription);
    setSelectedPreferences(data.subscription.preferences);
    setJustConfirmed(data.subscription.consentStatus === 'confirmed');
    setConfirmationEmailSent(Boolean(data.confirmationEmailSent));
    setIsEditingPreferences(false);
    setStatus('idle');
    setEmail('');

    if (isResend && data.confirmationEmailSent) {
      setNoticeMessage('Confirmation link re-sent to your inbox.');
    } else if (data.message) {
      setNoticeMessage(data.message);
    }

    if (onSubscribed) {
      onSubscribed(data.subscription.email, data.subscription.preferences);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setNoticeMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      setStatus('error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(trimmedEmail) || trimmedEmail.length > 254) {
      setErrorMessage('Please enter a valid email address (e.g., student@university.edu).');
      setStatus('error');
      return;
    }

    if (selectedPreferences.length === 0) {
      setErrorMessage('Please select at least one opportunity preference above.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await submitSubscription(trimmedEmail, false);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err?.message || 'Unable to connect to the server. Please try again.'
      );
    }
  };

  const handleResendConfirmation = async () => {
    if (!activeSubscription) return;
    setErrorMessage('');
    setNoticeMessage('');
    setActionLoading('resend');
    try {
      await submitSubscription(activeSubscription.email, true);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Unable to resend confirmation email right now.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePreferences = async () => {
    setErrorMessage('');
    setNoticeMessage('');

    if (!activeSubscription) {
      setErrorMessage('Active subscription session not found. Please subscribe again.');
      setStatus('error');
      return;
    }

    if (selectedPreferences.length === 0) {
      setErrorMessage('Please select at least one opportunity preference.');
      setStatus('error');
      return;
    }

    setActionLoading('preferences');

    try {
      const idToken = await getCurrentUserIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/newsletter/preferences', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          token: manageToken || undefined,
          preferences: selectedPreferences,
        }),
      });

      const data = await res.json().catch(() => null);

      if (typeof data?.emailDeliveryConfigured === 'boolean') {
        setEmailDeliveryConfigured(data.emailDeliveryConfigured);
      }

      if (!res.ok || !data?.success || !data?.subscription) {
        if (res.status === 404) {
          saveStoredSubscriptionMeta(null);
          setManageToken(null);
          setActiveSubscription(null);
          setIsEditingPreferences(false);
        }
        setStatus('error');
        setErrorMessage(data?.error || 'Could not update your preferences. Please try again.');
        return;
      }

      await syncScholarshipAlertToFirestore({
        subscribed: data.subscription.consentStatus === 'confirmed',
        email: data.subscription.email,
        preferences: data.subscription.preferences,
        consentStatus: data.subscription.consentStatus,
      }).catch(() => {});

      setActiveSubscription(data.subscription);
      setSelectedPreferences(data.subscription.preferences);
      setIsEditingPreferences(false);
      setStatus('idle');
      setNoticeMessage('Opportunity preferences updated.');
    } catch {
      setStatus('error');
      setErrorMessage('Unable to update preferences right now. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelEditPreferences = () => {
    if (activeSubscription) {
      setSelectedPreferences(activeSubscription.preferences);
    }
    setIsEditingPreferences(false);
    setErrorMessage('');
    setStatus('idle');
  };

  const handleUnsubscribe = async () => {
    setErrorMessage('');
    setNoticeMessage('');

    if (!activeSubscription) {
      saveStoredSubscriptionMeta(null);
      setManageToken(null);
      setActiveSubscription(null);
      setJustConfirmed(false);
      return;
    }

    setActionLoading('unsubscribe');

    try {
      const idToken = await getCurrentUserIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers,
        body: JSON.stringify({ token: manageToken || undefined }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok && res.status !== 404) {
        setStatus('error');
        setErrorMessage(data?.error || 'Could not complete unsubscribe. Please try again.');
        return;
      }

      await syncScholarshipAlertToFirestore({
        subscribed: false,
        email: activeSubscription.email,
        preferences: activeSubscription.preferences,
        consentStatus: 'unsubscribed',
      }).catch(() => {});

      saveStoredSubscriptionMeta(null);
      setManageToken(null);
      setActiveSubscription(null);
      setJustConfirmed(false);
      setIsEditingPreferences(false);
      setStatus('idle');
      setEmail('');
      setNoticeMessage('You have been unsubscribed from opportunity updates.');
    } catch {
      setStatus('error');
      setErrorMessage('Unable to connect to the server to unsubscribe. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const preferenceSummaryLabels = activeSubscription
    ? formatPreferenceLabels(activeSubscription.preferences)
    : [];

  const specificSelectedCount = selectedPreferences.filter((id) => id !== 'all').length;
  const allSpecificSelected =
    selectedPreferences.includes('all') ||
    specificSelectedCount === SPECIFIC_PREFERENCE_IDS.length;
  const selectedInterestsSummary = allSpecificSelected
    ? 'All interests selected'
    : specificSelectedCount === 0
    ? 'No interests selected'
    : `${specificSelectedCount} ${specificSelectedCount === 1 ? 'interest' : 'interests'} selected`;

  const isConfirmed = activeSubscription?.consentStatus === 'confirmed';

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#15152F] via-[#10132D] to-[#0F0F23] py-10 sm:py-12 lg:py-14 text-white border-t border-[#232348] ${className}`}
    >
      {/* Subtle ambient background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#6846F5]/20 blur-[90px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E7B75C]/12 blur-[90px]" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Compact Eyebrow */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#DDD6FE] mb-2.5">
            <BellRing className="w-3.5 h-3.5 text-[#E7B75C]" aria-hidden="true" />
            <span>Opportunity Updates</span>
          </div>

          {/* Heading */}
          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white leading-tight [text-wrap:balance]"
          >
            Never Miss an Opportunity
          </h2>

          {/* Single concise supporting sentence */}
          <p className="mt-2.5 text-xs sm:text-sm text-[#CBD5E1] max-w-lg mx-auto leading-relaxed [text-wrap:pretty]">
            Choose your study interests to get timely updates on admissions, fee waivers, and verified scholarships.
          </p>

          {/* Compact Signup / Active Subscription Card */}
          <div className="mt-5 sm:mt-6 bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
            {activeSubscription ? (
              /* Compact Saved Subscription Card */
              <div
                role="status"
                aria-live="polite"
                className="space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                        isConfirmed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {justConfirmed && isConfirmed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isConfirmed ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {isConfirmed
                          ? justConfirmed
                            ? "You're all set!"
                            : 'Opportunity Alerts Active'
                          : confirmationEmailSent
                          ? 'Confirm Your Email Address'
                          : 'Preferences Saved'}
                      </h3>
                      <p className="text-xs text-[#CBD5E1] mt-0.5 truncate">
                        {isConfirmed ? 'Active for ' : 'Saved for '}
                        <span className="font-semibold text-white">{activeSubscription.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Saved Preference Summary */}
                {!isEditingPreferences && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#E2E8F0]">
                    <span className="text-[#94A3B8]">Interests:</span>
                    {preferenceSummaryLabels.map((label, idx) => (
                      <React.Fragment key={label}>
                        <span className="inline-flex items-center gap-1 font-medium text-white">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{label}</span>
                        </span>
                        {idx < preferenceSummaryLabels.length - 1 && (
                          <span aria-hidden="true" className="text-white/25">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Expandable Interest Editor when updating preferences */}
                {isEditingPreferences && (
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">Choose your interests</span>
                      <span className="text-[11px] text-[#CBD5E1] tabular-nums">{selectedInterestsSummary}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PREFERENCE_OPTIONS.map((pref) => {
                        const isSelected = selectedPreferences.includes(pref.id);
                        return (
                          <button
                            key={pref.id}
                            type="button"
                            onClick={() => togglePreference(pref.id)}
                            aria-pressed={isSelected}
                            disabled={status === 'loading' || actionLoading !== null}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border select-none disabled:opacity-60 ${
                              isSelected
                                ? 'bg-[#6846F5] text-white border-[#8B5CF6]'
                                : 'bg-white/5 text-[#CBD5E1] border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{pref.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Honest Delivery Status Note */}
                <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-[#CBD5E1]">
                  <Info className="w-3.5 h-3.5 text-[#E7B75C] shrink-0 mt-0.5" />
                  <span>
                    {!emailDeliveryConfigured
                      ? 'Your email and interests are saved. Outbound email alerts are temporarily paused until delivery is enabled.'
                      : isConfirmed
                      ? 'Your subscription is confirmed. You will receive matched verified opportunities and upcoming deadline reminders.'
                      : confirmationEmailSent
                      ? 'We sent a confirmation link to your email. Click that link to activate opportunity digests and deadline reminders.'
                      : 'Confirmation emails are temporarily paused. Use Resend Confirmation once email delivery is available.'}
                  </span>
                </div>

                {/* Update / Error Notices */}
                {status === 'error' && errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {noticeMessage && status !== 'error' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/50 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{noticeMessage}</span>
                  </div>
                )}

                {/* Compact Action Controls */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/10">
                  {isEditingPreferences ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleSavePreferences}
                        disabled={actionLoading !== null}
                        className="py-1.5 px-3.5 bg-[#6846F5] hover:bg-[#5b3adb] text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        {actionLoading === 'preferences' ? (
                          <span>Saving...</span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Preferences</span>
                          </>
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={handleCancelEditPreferences}
                        disabled={actionLoading !== null}
                        className="py-1.5 px-3 text-xs font-medium text-[#CBD5E1] hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPreferences(true);
                          setNoticeMessage('');
                          setErrorMessage('');
                        }}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#DDD6FE]" />
                        <span>Update Preferences</span>
                      </button>

                      {!isConfirmed && emailDeliveryConfigured && (
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#6846F5]/80 hover:bg-[#6846F5] border border-[#8B5CF6]/50 text-xs font-semibold text-white cursor-pointer transition-colors disabled:opacity-60"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${actionLoading === 'resend' ? 'animate-spin' : ''}`}
                          />
                          <span>
                            {actionLoading === 'resend' ? 'Sending...' : 'Resend Confirmation'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={actionLoading !== null}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 cursor-pointer transition-colors disabled:opacity-60"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{actionLoading === 'unsubscribe' ? 'Unsubscribing...' : 'Unsubscribe'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Compact Subscription Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {/* Clean Email + Get Updates Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 min-w-0">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address for opportunity updates
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage('');
                        }
                        if (noticeMessage) {
                          setNoticeMessage('');
                        }
                      }}
                      placeholder="Enter your email address..."
                      autoComplete="email"
                      required
                      disabled={status === 'loading' || !firestoreConfigured}
                      className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium border shadow-inner transition-all outline-none focus:ring-2 disabled:opacity-65 disabled:cursor-not-allowed ${
                        status === 'error'
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-200 focus:border-[#6846F5] focus:ring-[#6846F5]/40'
                      }`}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={status === 'loading' || !firestoreConfigured}
                    className="w-full sm:w-auto h-11 px-5 bg-[#6846F5] hover:bg-[#5b3adb] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Updates</span>
                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Compact Expandable Interests Control (Collapsed by Default) */}
                <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsInterestsExpanded((prev) => !prev)}
                    aria-expanded={isInterestsExpanded}
                    aria-controls="newsletter-interests-panel"
                    className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-white min-w-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#E7B75C] shrink-0" aria-hidden="true" />
                      <span className="truncate">Choose your interests</span>
                    </span>

                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-[#CBD5E1] tabular-nums">
                        {selectedInterestsSummary}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#CBD5E1] transition-transform duration-200 ${
                          isInterestsExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {/* Smooth Expandable Preferences Panel */}
                  <div
                    id="newsletter-interests-panel"
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isInterestsExpanded
                        ? 'grid-rows-[1fr] opacity-100 border-t border-white/10'
                        : 'grid-rows-[0fr] opacity-0 invisible'
                    }`}
                    aria-hidden={!isInterestsExpanded}
                  >
                    <div className="overflow-hidden">
                      <div className="p-3 pt-2.5 flex flex-wrap gap-1.5">
                        {PREFERENCE_OPTIONS.map((pref) => {
                          const isSelected = selectedPreferences.includes(pref.id);
                          return (
                            <button
                              key={pref.id}
                              type="button"
                              tabIndex={isInterestsExpanded ? 0 : -1}
                              onClick={() => togglePreference(pref.id)}
                              aria-pressed={isSelected}
                              disabled={status === 'loading' || actionLoading !== null}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer border select-none disabled:opacity-60 ${
                                isSelected
                                  ? 'bg-[#6846F5] text-white border-[#8B5CF6] shadow-2xs'
                                  : 'bg-white/5 text-[#CBD5E1] border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <span>{pref.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-white shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Error Announcement */}
                {status === 'error' && errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Unsubscribe / Info Notice */}
                {noticeMessage && status !== 'error' && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/50 rounded-lg px-3 py-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{noticeMessage}</span>
                  </div>
                )}

                {/* Friendly Disabled / Paused Notice (No technical details exposed) */}
                {(!emailDeliveryConfigured || !firestoreConfigured) && (
                  <p className="text-[11px] text-[#CBD5E1]/80 flex items-center gap-1.5 pt-0.5 leading-snug">
                    <Info className="w-3.5 h-3.5 text-[#E7B75C] shrink-0" aria-hidden="true" />
                    <span>
                      {!firestoreConfigured
                        ? 'Email updates are temporarily paused while we finish setting up delivery. Check back soon or explore opportunities in the portal.'
                        : 'Email alerts are currently paused while delivery is being finalized.'}
                    </span>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Quiet Trust Row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-y-1.5 gap-x-5 text-[11px] text-[#94A3B8]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Strict No-Spam Policy</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
              <span>Official University &amp; Scholarship Links</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E7B75C] shrink-0" aria-hidden="true" />
              <span>Update or Unsubscribe Anytime</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
