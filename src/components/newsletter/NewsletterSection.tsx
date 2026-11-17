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
      className={`w-full bg-white py-5 sm:py-7 border-t border-slate-100 ${className}`}
    >
      <Container size="xl">
        <div className="rounded-2xl bg-gradient-to-br from-[#F7F4FF] via-[#FAF8FF] to-[#F3EEFE] border border-[#E5DCFF] p-4 sm:p-5 lg:px-7 lg:py-5 shadow-[0_6px_22px_rgba(91,46,230,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-7 items-start lg:items-center">
            {/* Left Intro Column */}
            <div className="lg:col-span-5 text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider uppercase text-[#5D35F5]">
                <BellRing className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
                <span>Opportunity Updates</span>
              </div>

              <h2
                id="newsletter-heading"
                className="text-lg sm:text-xl font-extrabold font-display tracking-tight text-[#10132D] leading-tight [text-wrap:balance]"
              >
                Never Miss an Opportunity
              </h2>

              <p className="text-xs text-[#475569] leading-relaxed max-w-md [text-wrap:pretty]">
                Choose your study interests for future admissions, fee waiver, and verified scholarship updates.
              </p>

              <div className="pt-1 hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#64748B]">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>No Spam</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5D35F5] shrink-0" aria-hidden="true" />
                  <span>Official Links</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" aria-hidden="true" />
                  <span>Unsubscribe Anytime</span>
                </span>
              </div>
            </div>

            {/* Right Compact Form / Active Subscription Card */}
            <div className="lg:col-span-7 bg-white border border-[#E5DCFF] rounded-xl p-3 sm:p-4 shadow-2xs text-left">
              {activeSubscription ? (
                /* Compact Saved Subscription Card */
                <div role="status" aria-live="polite" className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        {justConfirmed && isConfirmed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isConfirmed ? (
                          <GraduationCap className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#10132D] leading-tight">
                          {isConfirmed
                            ? justConfirmed
                              ? "You're all set!"
                              : 'Opportunity Alerts Active'
                            : confirmationEmailSent
                            ? 'Confirm Your Email Address'
                            : 'Preferences Saved'}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5 truncate">
                          {isConfirmed ? 'Active for ' : 'Saved for '}
                          <span className="font-semibold text-[#10132D]">{activeSubscription.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Saved Preference Summary */}
                  {!isEditingPreferences && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#334155]">
                      <span className="text-[#64748B]">Interests:</span>
                      {preferenceSummaryLabels.map((label, idx) => (
                        <React.Fragment key={label}>
                          <span className="inline-flex items-center gap-1 font-medium text-[#10132D]">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{label}</span>
                          </span>
                          {idx < preferenceSummaryLabels.length - 1 && (
                            <span aria-hidden="true" className="text-slate-300">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Expandable Interest Editor when updating preferences */}
                  {isEditingPreferences && (
                    <div className="rounded-xl bg-[#FAF8FF] border border-[#E5DCFF] p-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#10132D]">Choose your interests</span>
                        <span className="text-[11px] text-[#64748B] tabular-nums">{selectedInterestsSummary}</span>
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
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border select-none disabled:opacity-60 ${
                                isSelected
                                  ? 'bg-[#5D35F5] text-white border-[#5D35F5]'
                                  : 'bg-white text-[#475569] border-slate-200 hover:bg-[#F3F0FF] hover:text-[#10132D]'
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
                  <div className="flex items-start gap-2 rounded-lg bg-[#FAF8FF] border border-[#EAE4FF] px-3 py-2 text-xs text-[#475569]">
                    <Info className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
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
                      className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {noticeMessage && status !== 'error' && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{noticeMessage}</span>
                    </div>
                  )}

                  {/* Compact Action Controls */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    {isEditingPreferences ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={handleSavePreferences}
                          disabled={actionLoading !== null}
                          className="py-1.5 px-3.5 bg-[#5D35F5] hover:bg-[#4E23D4] text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
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
                          className="py-1.5 px-3 text-xs font-medium text-[#64748B] hover:text-[#10132D] rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
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
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#F3F0FF] hover:bg-[#EAE3FF] border border-[#E5DCFF] text-xs font-semibold text-[#5D35F5] cursor-pointer transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Update Preferences</span>
                        </button>

                        {!isConfirmed && emailDeliveryConfigured && (
                          <button
                            type="button"
                            onClick={handleResendConfirmation}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#5D35F5] hover:bg-[#4E23D4] text-xs font-semibold text-white cursor-pointer transition-colors disabled:opacity-60"
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
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer transition-colors disabled:opacity-60"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{actionLoading === 'unsubscribe' ? 'Unsubscribing...' : 'Unsubscribe'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Compact Subscription Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 min-w-0">
                      <label htmlFor="newsletter-email" className="sr-only">
                        Email address for opportunity updates
                      </label>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                        className={`w-full h-10 pl-9 pr-3 rounded-xl bg-[#FAF9FF] text-[#10132D] placeholder-slate-400 text-xs sm:text-sm font-medium border transition-all outline-none focus:bg-white focus:ring-2 disabled:opacity-65 disabled:cursor-not-allowed ${
                          status === 'error'
                            ? 'border-red-400 focus:ring-red-300'
                            : 'border-[#E5DCFF] focus:border-[#5D35F5] focus:ring-[#5D35F5]/20'
                        }`}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={status === 'loading' || !firestoreConfigured}
                      className="w-full sm:w-auto h-10 px-5 bg-gradient-to-r from-[#5B2EE6] via-[#6846F5] to-[#7B3FE4] hover:from-[#4E23D4] hover:to-[#6B31D6] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_4px_12px_rgba(91,46,230,0.25)] transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                  <div className="rounded-xl border border-[#EAE4FF] bg-[#FAF8FF] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsInterestsExpanded((prev) => !prev)}
                      aria-expanded={isInterestsExpanded}
                      aria-controls="newsletter-interests-panel"
                      className="w-full min-h-[38px] px-3 py-2 flex items-center justify-between gap-3 text-left hover:bg-[#F3EEFE]/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D35F5]"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#10132D] min-w-0">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#5D35F5] shrink-0" aria-hidden="true" />
                        <span className="truncate">Choose your study interests</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-medium text-[#64748B] tabular-nums">
                          {selectedInterestsSummary}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
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
                          ? 'grid-rows-[1fr] opacity-100 border-t border-[#EAE4FF]'
                          : 'grid-rows-[0fr] opacity-0 invisible'
                      }`}
                      aria-hidden={!isInterestsExpanded}
                    >
                      <div className="overflow-hidden">
                        <div className="p-2.5 flex flex-wrap gap-1.5 bg-white/70">
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
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer border select-none disabled:opacity-60 ${
                                  isSelected
                                    ? 'bg-[#5D35F5] text-white border-[#5D35F5] shadow-2xs'
                                    : 'bg-white text-[#475569] border-slate-200 hover:bg-[#F3F0FF] hover:text-[#10132D]'
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
                      className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Unsubscribe / Info Notice */}
                  {noticeMessage && status !== 'error' && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{noticeMessage}</span>
                    </div>
                  )}

                  {/* Honest Disabled / Paused Delivery Notice */}
                  {(!emailDeliveryConfigured || !firestoreConfigured) && (
                    <p className="text-[11px] text-[#64748B] flex items-start sm:items-center gap-1.5 pt-0.5 leading-snug">
                      <Info className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
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
          </div>
        </div>
      </Container>
    </section>
  );
};
