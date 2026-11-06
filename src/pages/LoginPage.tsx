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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
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
  const [loginError, setLoginError] = useState<string | null>(null);

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
      // Ensure default demo account exists if testing with demo
      await authService.initDefaultDemoUser();

      const result = await authService.login(email, password);

      if (!result.success || !result.user) {
        setLoginError(
          result.error ||
            'Invalid credentials. Please verify your email and password.'
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

  const handleFillDemoScholar = () => {
    setEmail('scholar.ghana@campusconnect.edu');
    setPassword('Scholar2026!');
    setErrors({});
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-between selection:bg-[#6846F5] selection:text-white">
      {/* Top Header */}
      <header className="w-full bg-[#10132D] border-b border-[#20254D] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <Logo size="md" variant="dark" showWordmark={true} />
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-300">
              Don&apos;t have an account yet?
            </span>
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="text-xs sm:text-sm font-semibold text-white bg-[#6846F5] hover:bg-[#5835E5] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="max-w-md w-full space-y-6">
          {/* Notification Message if redirected from a protected route */}
          {notificationMessage && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm animate-in fade-in duration-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{notificationMessage}</span>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4 sm:p-8 md:p-10">
            {/* Header Badge & Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EDFF] text-[#6846F5] text-xs font-semibold border border-[#DDD6FE]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>STUDENT PORTAL ACCESS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#10132D] tracking-tight">
                Log In to Campus Connect
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Access your personalized university matches, $0 fee waivers, and application target list.
              </p>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="you@domain.edu"
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#10132D]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateForgotPassword}
                    className="text-xs text-[#6846F5] hover:underline font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••••••"
                    className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm transition-all focus:outline-none ${
                      errors.password
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#6846F5] focus:ring-[#6846F5]"
                  />
                  <span className="text-xs text-[#64748B]">Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-[0_4px_16px_rgba(104,70,245,0.4)]"
                >
                  {isSubmitting ? 'Authenticating...' : 'Log In to Student Hub →'}
                </Button>
              </div>
            </form>

            {/* Quick Demo Scholar Account Fill */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
              <div className="p-3.5 rounded-xl bg-[#F8F9FD] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6846F5] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Demo Scholar Account
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDemoScholar}
                    className="text-xs font-semibold text-[#6846F5] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#DDD6FE]"
                  >
                    1-Click Auto Fill
                  </button>
                </div>
                <div className="text-[11px] text-[#64748B] space-y-0.5">
                  <p><strong className="text-[#10132D]">Scholar:</strong> Kwame Mensah (Ghana 🇬🇭)</p>
                  <p><strong className="text-[#10132D]">Email:</strong> scholar.ghana@campusconnect.edu</p>
                  <p><strong className="text-[#10132D]">Password:</strong> Scholar2026!</p>
                </div>
              </div>
            </div>

            {/* Bottom Sign-Up Link */}
            <div className="mt-5 text-center text-xs text-[#64748B]">
              New to Campus Connect?{' '}
              <button
                type="button"
                onClick={onNavigateSignUp}
                className="font-bold text-[#6846F5] hover:underline cursor-pointer"
              >
                Create a Free Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E2E8F0] py-6 px-4 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Campus Connect Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onNavigateHome} className="hover:text-[#10132D] transition-colors">
              Home
            </button>
            <span>•</span>
            <button type="button" onClick={onNavigateSignUp} className="hover:text-[#10132D] transition-colors">
              Sign Up
            </button>
            <span>•</span>
            <span className="text-slate-400">Secure Student Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
