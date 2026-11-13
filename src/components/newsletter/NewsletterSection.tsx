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
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { syncScholarshipAlertToFirestore } from '../../services/firebase';

export interface NewsletterSectionProps {
  className?: string;
  onSubscribed?: (email: string, preferences: string[]) => void;
}

const PREFERENCE_OPTIONS = [
  { id: 'all', label: 'All Opportunities', icon: '🎓' },
  { id: 'fully-funded', label: 'Scholarships & Financial Aid', icon: '💰' },
  { id: 'fee-waiver', label: 'Free Apps & Fee Waivers', icon: '⚡' },
  { id: 'sat-optional', label: 'SAT-Free & Test-Optional', icon: '📜' },
  { id: 'graduate', label: "Postgraduate & Grants", icon: '🏛️' },
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
  subscribedAt?: string;
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
    // Remove legacy/unverified client-only entries
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
    'fully-funded',
    'fee-waiver',
  ]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  const [manageToken, setManageToken] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [actionLoading, setActionLoading] = useState<'preferences' | 'unsubscribe' | null>(null);
  const [emailDeliveryConfigured, setEmailDeliveryConfigured] = useState<boolean>(false);

  // Verify any saved subscription token with the backend on mount
  useEffect(() => {
    let isMounted = true;

    const verifySavedSubscription = async () => {
      const stored = getStoredSubscriptionMeta();
      try {
        if (!stored) {
          const statusRes = await fetch('/api/newsletter/status');
          if (statusRes.ok && isMounted) {
            const statusData = await statusRes.json().catch(() => null);
            if (typeof statusData?.emailDeliveryConfigured === 'boolean') {
              setEmailDeliveryConfigured(statusData.emailDeliveryConfigured);
            }
          }
          return;
        }

        const res = await fetch(
          `/api/newsletter/subscription?token=${encodeURIComponent(stored.manageToken)}`
        );
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (!isMounted || !data) return;

        if (typeof data.emailDeliveryConfigured === 'boolean') {
          setEmailDeliveryConfigured(data.emailDeliveryConfigured);
        }

        if (data.subscribed && data.subscription) {
          setManageToken(stored.manageToken);
          setActiveSubscription(data.subscription);
          setSelectedPreferences(
            Array.isArray(data.subscription.preferences) && data.subscription.preferences.length > 0
              ? data.subscription.preferences
              : ['fully-funded', 'fee-waiver']
          );
          setJustSubscribed(false);
        } else {
          saveStoredSubscriptionMeta(null);
          setManageToken(null);
          setActiveSubscription(null);
        }
      } catch {
        // Leave default form visible on verification check errors
      }
    };

    verifySavedSubscription();
    return () => {
      isMounted = false;
    };
  }, []);

  const togglePreference = (id: string) => {
    setErrorMessage('');
    if (status === 'error') setStatus('idle');

    // If subscribed and user clicks a preference chip directly, enter edit mode cleanly
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
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          preferences: selectedPreferences,
        }),
      });

      const data = await response.json().catch(() => null);

      if (typeof data?.emailDeliveryConfigured === 'boolean') {
        setEmailDeliveryConfigured(data.emailDeliveryConfigured);
      }

      if (!response.ok || !data?.success || !data?.manageToken || !data?.subscription) {
        setStatus('error');
        setErrorMessage(
          data?.error || 'Unable to save your subscription right now. Please try again.'
        );
        return;
      }

      // Persist token & email locally and sync to Firestore if authenticated
      saveStoredSubscriptionMeta({
        manageToken: data.manageToken,
        email: data.subscription.email,
      });

      await syncScholarshipAlertToFirestore({
        subscribed: true,
        email: data.subscription.email,
        preferences: data.subscription.preferences,
      }).catch(() => {});

      setManageToken(data.manageToken);
      setActiveSubscription(data.subscription);
      setSelectedPreferences(data.subscription.preferences);
      setJustSubscribed(true);
      setIsEditingPreferences(false);
      setStatus('idle');
      setEmail('');

      if (onSubscribed) {
        onSubscribed(data.subscription.email, data.subscription.preferences);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err?.message || 'Unable to connect to the server. Please try again.'
      );
    }
  };

  const handleSavePreferences = async () => {
    setErrorMessage('');
    setNoticeMessage('');

    if (!manageToken || !activeSubscription) {
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
      const res = await fetch('/api/newsletter/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: manageToken,
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
        subscribed: true,
        email: data.subscription.email,
        preferences: data.subscription.preferences,
      }).catch(() => {});

      setActiveSubscription(data.subscription);
      setSelectedPreferences(data.subscription.preferences);
      setIsEditingPreferences(false);
      setJustSubscribed(false);
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

    if (!manageToken || !activeSubscription) {
      saveStoredSubscriptionMeta(null);
      setManageToken(null);
      setActiveSubscription(null);
      setJustSubscribed(false);
      return;
    }

    setActionLoading('unsubscribe');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: manageToken }),
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
      }).catch(() => {});

      saveStoredSubscriptionMeta(null);
      setManageToken(null);
      setActiveSubscription(null);
      setJustSubscribed(false);
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

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#15152F] via-[#10132D] to-[#0F0F23] py-14 sm:py-18 lg:py-22 text-white border-t border-[#232348] ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#6846F5]/20 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E7B75C]/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wider uppercase text-[#DDD6FE] mb-4 shadow-2xs backdrop-blur-sm">
            <BellRing className="w-3.5 h-3.5 text-[#E7B75C]" />
            <span>OPPORTUNITY UPDATES</span>
          </div>

          {/* Heading */}
          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold font-display tracking-tight text-white leading-tight [text-wrap:balance]"
          >
            Stay informed on university and opportunity updates.
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Save your email and opportunity preferences to join our update list for global
            universities, admission cycles, fee waivers, and scholarships.
          </p>

          {/* Preference Interest Filter Pills */}
          <div className="mt-6 sm:mt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2.5">
              {activeSubscription && isEditingPreferences
                ? 'Update your opportunity preferences:'
                : 'Select your opportunity preferences:'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {PREFERENCE_OPTIONS.map((pref) => {
                const isSelected = selectedPreferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    aria-pressed={isSelected}
                    disabled={status === 'loading' || actionLoading !== null}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border select-none disabled:opacity-60 ${
                      isSelected
                        ? 'bg-[#6846F5] text-white border-[#8B5CF6] shadow-xs ring-1 ring-[#A78BFA]/30'
                        : 'bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span aria-hidden="true">{pref.icon}</span>
                    <span>{pref.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Signup / Active Subscription Container */}
          <div className="mt-7 sm:mt-8 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-xl max-w-xl mx-auto">
            {activeSubscription ? (
              /* Compact, Professional Confirmation / Saved Subscription Card */
              <div
                role="status"
                aria-live="polite"
                className="text-left space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      {justSubscribed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <GraduationCap className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {justSubscribed ? "You're all set!" : 'Opportunity Preferences Saved'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#CBD5E1] mt-0.5 truncate">
                        Saved for <span className="font-semibold text-white">{activeSubscription.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Saved Preference Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {preferenceSummaryLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-[11px] font-medium text-[#E2E8F0]"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{label}</span>
                    </span>
                  ))}
                </div>

                {/* Honest Delivery Status Note */}
                <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-[#CBD5E1]">
                  <Info className="w-3.5 h-3.5 text-[#E7B75C] shrink-0 mt-0.5" />
                  <span>
                    {emailDeliveryConfigured
                      ? 'Your opportunity preferences are saved for periodic email updates.'
                      : 'Your email and preferences are saved. Email delivery is not yet configured, so updates are not being sent yet.'}
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
              /* Default Subscription Form for Unsubscribed Visitors */
              <form onSubmit={handleSubmit} noValidate className="space-y-3 text-left">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address for opportunity updates
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
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
                      placeholder="Enter your student email..."
                      autoComplete="email"
                      required
                      disabled={status === 'loading'}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium border shadow-inner transition-all outline-none focus:ring-2 ${
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
                    disabled={status === 'loading'}
                    className="sm:w-auto w-full py-3 px-5 sm:px-6 bg-[#6846F5] hover:bg-[#5b3adb] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Updates</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Inline Error Announcement */}
                {status === 'error' && errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-center gap-2 text-xs sm:text-sm text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2"
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
                    className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-700/50 rounded-lg px-3 py-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{noticeMessage}</span>
                  </div>
                )}

                {!emailDeliveryConfigured && (
                  <p className="text-[11px] text-[#94A3B8] text-center sm:text-left pt-0.5">
                    Saves your preferences to our alert list. Email delivery is not yet active.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Trust Guarantees (Factual, No Unsupported Claims) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict No-Spam Policy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Official University &amp; Scholarship Links</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E7B75C]" />
              <span>Update or Unsubscribe Anytime</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
