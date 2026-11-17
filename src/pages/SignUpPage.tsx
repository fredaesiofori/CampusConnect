/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Globe,
  User as UserIcon,
} from 'lucide-react';
import { AuthSplitLayout, GoogleIcon } from '../components/auth/AuthSplitLayout';
import { CountrySelect } from '../components/ui/CountrySelect';
import { authService, User, validatePasswordPolicy } from '../services/auth';

export interface SignUpPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onSuccess: (user: User) => void;
  searchContext?: { query?: string; destination?: string } | null;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
  onSuccess,
  searchContext,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(
    searchContext?.destination &&
      searchContext.destination !== 'Any Destination' &&
      searchContext.destination !== 'Ghana & Global Destinations'
      ? searchContext.destination
      : 'Ghana'
  );
  const [degreeLevel, setDegreeLevel] = useState<'Undergraduate' | "Master's" | 'PhD'>(
    'Undergraduate'
  );
  const [studyField, setStudyField] = useState(
    searchContext?.query && searchContext.query !== 'all study fields' ? searchContext.query : ''
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [requiresExistingLoginLink, setRequiresExistingLoginLink] = useState(false);

  const isBusy = isSubmitting || isGoogleSubmitting;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Too short', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full legal name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const pwdCheck = validatePasswordPolicy(password);
    if (!pwdCheck.valid) {
      newErrors.password = pwdCheck.error || 'Password does not meet requirements.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!country) {
      newErrors.country = 'Please select your country of origin.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service to create an account.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setRequiresExistingLoginLink(false);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await authService.register({
        fullName,
        email,
        password,
        country,
        degreeLevel,
        studyField: studyField.trim() || 'General Studies',
      });

      if (!result.success || !result.user) {
        setGeneralError(result.error || 'Failed to register account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      onSuccess(result.user);
    } catch {
      setGeneralError('An unexpected error occurred during account creation. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) return;
    setGeneralError(null);
    setRequiresExistingLoginLink(false);
    setErrors({});
    setIsGoogleSubmitting(true);

    try {
      const result = await authService.loginWithGoogle(true);

      if (result.success && result.user) {
        onSuccess(result.user);
        return;
      }

      if (result.requiresAccountLinking) {
        setRequiresExistingLoginLink(true);
        setGeneralError(
          result.pendingEmail
            ? `An account already exists for ${result.pendingEmail} with email and password. Please log in with your password to connect Google.`
            : 'An account already exists with this email. Please log in with your password to connect Google.'
        );
        setIsGoogleSubmitting(false);
        return;
      }

      if (!result.cancelled) {
        setGeneralError(
          result.error || 'Unable to continue with Google right now. Please try again.'
        );
      }
      setIsGoogleSubmitting(false);
    } catch {
      setGeneralError('An unexpected error occurred during Google sign-in. Please try again.');
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      onNavigateHome={onNavigateHome}
      headlineLine1="Start Your"
      headlineLine2="Journey"
      mobileTitle="Start Your Journey"
      description="Create your free Campus Connect account and discover universities, scholarships, and global study opportunities tailored for you."
      cardMaxWidthClass="max-w-[500px]"
    >
      {/* Card Heading */}
      <div className="text-center mb-4">
        <h2 className="font-display font-bold text-2xl sm:text-[26px] text-[#10132D] tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5">
          Join Campus Connect and unlock global opportunities
        </p>
      </div>

      {/* Contextual Search Banner if navigated from Hero Search */}
      {searchContext && (
        <div className="mb-3.5 px-3 py-2.5 rounded-xl bg-[#F4F0FF] border border-[#DDD6FE] text-[#3E1CA8] text-xs flex items-start gap-2">
          <Globe className="w-4 h-4 text-[#5B2EE6] shrink-0 mt-0.5" />
          <p className="leading-snug">
            Matches for{' '}
            <strong className="font-semibold">
              &ldquo;{searchContext.query || 'all study fields'}&rdquo;
            </strong>{' '}
            in{' '}
            <strong className="font-semibold">
              &ldquo;{searchContext.destination || 'Ghana & Global'}&rdquo;
            </strong>{' '}
            unlock right after sign-up.
          </p>
        </div>
      )}

      {/* General Error Banner */}
      {generalError && (
        <div
          role="alert"
          className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1.5"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
          {requiresExistingLoginLink && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs font-bold text-[#5B2EE6] hover:underline cursor-pointer pl-6"
            >
              Go to Log In to Link Google Account →
            </button>
          )}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="signup-fullname" className="block text-xs font-bold text-[#10132D] mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <UserIcon
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="signup-fullname"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder="Enter your full name"
              className={`w-full min-h-[42px] h-[42px] pl-10 pr-3.5 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                errors.fullName
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                  : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-bold text-[#10132D] mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="Enter your email"
              className={`w-full min-h-[42px] h-[42px] pl-10 pr-3.5 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                  : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
            </p>
          )}
        </div>

        {/* Country of Origin & Target Degree Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <CountrySelect
              id="signup-country"
              label="Country of Origin"
              value={country}
              onChange={(val) => {
                setCountry(val);
                if (errors.country) setErrors((prev) => ({ ...prev, country: '' }));
              }}
              required
              error={errors.country}
              buttonClassName="min-h-[42px] h-[42px]"
              placeholder="Search country..."
            />
          </div>

          <div>
            <label htmlFor="signup-degree" className="block text-xs font-bold text-[#10132D] mb-1">
              Target Degree Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="signup-degree"
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value as any)}
              className="w-full min-h-[42px] h-[42px] px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/15"
            >
              <option value="Undergraduate">Undergraduate (Bachelor&apos;s)</option>
              <option value="Master's">Master&apos;s Degree</option>
              <option value="PhD">Doctorate / PhD</option>
            </select>
          </div>
        </div>

        {/* Primary Field of Study */}
        <div>
          <label htmlFor="signup-field" className="block text-xs font-bold text-[#10132D] mb-1">
            Primary Field of Study
          </label>
          <input
            id="signup-field"
            type="text"
            value={studyField}
            onChange={(e) => setStudyField(e.target.value)}
            placeholder="e.g. Computer Science, Medicine, Engineering"
            className="w-full min-h-[42px] h-[42px] px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] placeholder:text-slate-400 focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/15"
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label htmlFor="signup-password" className="block text-xs font-bold text-[#10132D] mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Create a password"
                className={`w-full min-h-[42px] h-[42px] pl-9 pr-10 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                  errors.password
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                    : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-bold text-[#10132D] mb-1"
            >
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirm your password"
                className={`w-full min-h-[42px] h-[42px] pl-9 pr-10 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                    : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Password Strength Meter */}
        {password && (
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center gap-1.5">
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength.score >= 1 ? strength.color : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength.score >= 2 ? strength.color : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength.score >= 3 ? strength.color : 'bg-slate-200'
                }`}
              />
            </div>
            <span className="block text-[11px] text-[#64748B]">
              Password strength: <strong className="font-semibold">{strength.label}</strong> (min. 8
              chars with letters &amp; numbers)
            </span>
          </div>
        )}

        {/* Terms of Service Consent Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#6846F5] accent-[#6846F5] focus:ring-[#6846F5] cursor-pointer shrink-0"
            />
            <span className="text-[11.5px] text-[#64748B] leading-snug">
              I agree to the <strong className="text-[#10132D]">Terms of Service</strong> and
              acknowledge that scholarship eligibility is governed by official university policies.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errors.agreeTerms}
            </p>
          )}
        </div>

        {/* Primary CTA */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isBusy}
            className="w-full min-h-[44px] h-11 rounded-xl bg-gradient-to-r from-[#5B2EE6] to-[#6846F5] hover:from-[#4F25D4] hover:to-[#5835E5] active:scale-[0.99] text-white text-sm font-bold shadow-[0_8px_22px_rgba(91,46,230,0.38)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6846F5]"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Subtle "or" Divider */}
      <div className="relative my-3.5 flex items-center">
        <div className="flex-grow border-t border-[#E2E8F0]" />
        <span className="px-3 text-xs font-medium text-[#64748B]">or</span>
        <div className="flex-grow border-t border-[#E2E8F0]" />
      </div>

      {/* Continue with Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
        className="w-full min-h-[44px] h-11 rounded-xl bg-white hover:bg-[#F8FAFC] active:scale-[0.99] border border-[#CBD5E1] text-[#10132D] text-sm font-semibold shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6846F5]"
      >
        <GoogleIcon className="w-[18px] h-[18px] shrink-0" />
        <span>{isGoogleSubmitting ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* Bottom Log In Link */}
      <div className="mt-4 text-center text-xs sm:text-[13px] text-[#475569]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="font-bold text-[#6846F5] hover:text-[#5230D8] hover:underline cursor-pointer py-1"
        >
          Log In
        </button>
      </div>
    </AuthSplitLayout>
  );
};
