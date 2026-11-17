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
  ShieldCheck,
  Link2,
} from 'lucide-react';
import { OAuthCredential } from 'firebase/auth';
import { AuthSplitLayout, GoogleIcon } from '../components/auth/AuthSplitLayout';
import { authService, User } from '../services/auth';

export interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
  onSuccess: (user: User) => void;
  notificationMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onNavigateSignUp,
  onNavigateForgotPassword,
  onSuccess,
  notificationMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<OAuthCredential | null>(
    null
  );
  const [pendingGoogleEmail, setPendingGoogleEmail] = useState<string | null>(null);

  const isBusy = isSubmitting || isGoogleSubmitting;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (pendingGoogleCredential) {
        const linkRes = await authService.completeGoogleAccountLinking({
          email,
          password,
          pendingCredential: pendingGoogleCredential,
          rememberMe,
        });

        if (!linkRes.success || !linkRes.user) {
          setLoginError(
            linkRes.error || 'Could not link your Google account. Please verify your password.'
          );
          setIsSubmitting(false);
          return;
        }

        setPendingGoogleCredential(null);
        setPendingGoogleEmail(null);
        onSuccess(linkRes.user);
        return;
      }

      const result = await authService.login(email, password, rememberMe);

      if (!result.success || !result.user) {
        setLoginError(
          result.error || 'Invalid credentials. Please verify your email and password.'
        );
        setIsSubmitting(false);
        return;
      }

      onSuccess(result.user);
    } catch {
      setLoginError('An unexpected authentication error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) return;
    setLoginError(null);
    setErrors({});
    setIsGoogleSubmitting(true);

    try {
      const result = await authService.loginWithGoogle(rememberMe);

      if (result.success && result.user) {
        setPendingGoogleCredential(null);
        setPendingGoogleEmail(null);
        onSuccess(result.user);
        return;
      }

      if (result.requiresAccountLinking && result.pendingCredential) {
        setPendingGoogleCredential(result.pendingCredential);
        if (result.pendingEmail) {
          setPendingGoogleEmail(result.pendingEmail);
          setEmail(result.pendingEmail);
        }
        setLoginError(
          result.error ||
            'An account already exists with this email. Enter your existing password below to link Google Sign-In.'
        );
        setIsGoogleSubmitting(false);
        return;
      }

      if (!result.cancelled) {
        setLoginError(
          result.error || 'Unable to sign in with Google right now. Please try again.'
        );
      }
      setIsGoogleSubmitting(false);
    } catch {
      setLoginError('An unexpected error occurred during Google sign-in. Please try again.');
      setIsGoogleSubmitting(false);
    }
  };

  const handleCancelLinking = () => {
    setPendingGoogleCredential(null);
    setPendingGoogleEmail(null);
    setLoginError(null);
    setPassword('');
  };

  return (
    <AuthSplitLayout
      onNavigateHome={onNavigateHome}
      headlineLine1="Access Your"
      headlineLine2="Student Hub"
      mobileTitle="Access Your Student Hub"
      description="Log in to explore universities, scholarships, track applications, and manage your study journey all in one place."
      cardMaxWidthClass="max-w-[460px]"
    >
      {/* Card Heading */}
      <div className="text-center mb-5">
        <h2 className="font-display font-bold text-2xl sm:text-[28px] text-[#10132D] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-[13.5px] text-[#64748B] mt-1">
          Log in to your Campus Connect account
        </p>
      </div>

      {/* Redirect Notice */}
      {notificationMessage && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Account Linking Notice */}
      {pendingGoogleCredential && (
        <div className="mb-4 p-3 rounded-xl bg-[#F4F0FF] border border-[#DDD6FE] text-[#3E1CA8] text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <Link2 className="w-4 h-4 text-[#5B2EE6] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Link Google Sign-In to Your Account</p>
              <p className="text-[11.5px] text-[#4C1D95]/90 mt-0.5">
                Enter the password for{' '}
                <span className="font-semibold">{pendingGoogleEmail || email}</span> to verify
                ownership and link Google Sign-In.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancelLinking}
            className="text-[11px] font-semibold text-[#5B2EE6] hover:underline cursor-pointer pl-6"
          >
            Cancel linking and sign in differently
          </button>
        </div>
      )}

      {/* Error Banner */}
      {loginError && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{loginError}</span>
        </div>
      )}

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" noValidate>
        {/* Email Address */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-[#10132D] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              readOnly={Boolean(pendingGoogleCredential && pendingGoogleEmail)}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="Enter your email"
              className={`w-full min-h-[44px] h-11 pl-10 pr-3.5 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                  : pendingGoogleCredential && pendingGoogleEmail
                  ? 'border-[#DDD6FE] bg-slate-50 text-slate-700'
                  : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold text-[#10132D]">
              Password
            </label>
            <button
              type="button"
              onClick={onNavigateForgotPassword}
              className="text-xs text-[#6846F5] hover:text-[#5230D8] hover:underline font-semibold cursor-pointer py-0.5"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
              className={`w-full min-h-[44px] h-11 pl-10 pr-11 rounded-xl border text-sm text-[#10132D] placeholder:text-slate-400 transition-all focus:outline-none ${
                errors.password
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                  : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/15'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password}
            </p>
          )}
        </div>

        {/* Remember This Device */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none min-h-[32px]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#6846F5] accent-[#6846F5] focus:ring-[#6846F5] cursor-pointer"
            />
            <span className="text-xs font-medium text-[#475569]">Remember This Device</span>
          </label>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={isBusy}
          className="w-full min-h-[46px] h-12 rounded-xl bg-gradient-to-r from-[#5B2EE6] to-[#6846F5] hover:from-[#4F25D4] hover:to-[#5835E5] active:scale-[0.99] text-white text-sm font-bold shadow-[0_8px_22px_rgba(91,46,230,0.38)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6846F5]"
        >
          <span>
            {isSubmitting
              ? pendingGoogleCredential
                ? 'Verifying & Linking...'
                : 'Logging In...'
              : pendingGoogleCredential
              ? 'Verify Password & Link Google'
              : 'Log In to Student Hub'}
          </span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>

      {/* Subtle "or" Divider */}
      <div className="relative my-4 sm:my-5 flex items-center">
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

      {/* Bottom Create Free Account Link */}
      <div className="mt-5 text-center text-xs sm:text-[13px] text-[#475569]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onNavigateSignUp}
          className="font-bold text-[#6846F5] hover:text-[#5230D8] hover:underline cursor-pointer py-1"
        >
          Create Free Account
        </button>
      </div>
    </AuthSplitLayout>
  );
};
