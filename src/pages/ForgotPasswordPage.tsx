/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';

export interface ForgotPasswordPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
}) => {
  const [step, setStep] = useState<'request' | 'success'>('request');
  const [email, setEmail] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sentEmailNotice, setSentEmailNotice] = useState<string | null>(null);

  // Request Firebase Authentication password reset email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSentEmailNotice(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.requestPasswordReset(email);

      if (!res.success) {
        setError(res.error || 'Failed to send password reset email. Please check your email address.');
        setIsSubmitting(false);
        return;
      }

      setSentEmailNotice(
        res.message ||
          `An official password reset link has been sent to ${email.trim().toLowerCase()}. Check your email inbox and spam folder to choose a new password.`
      );
      setStep('success');
      setIsSubmitting(false);
    } catch {
      setError('Failed to initiate password recovery. Please try again.');
      setIsSubmitting(false);
    }
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

          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Log In</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4 sm:p-8 md:p-10">
            {step === 'request' && (
              <>
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#6846F5] flex items-center justify-center mx-auto border border-[#DDD6FE]">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold font-display text-[#10132D]">
                    Password Recovery
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748B]">
                    Enter your registered scholar email address and we&apos;ll send an official password reset link to your inbox.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.edu"
                        required
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                    >
                      {isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link →'}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto border border-[#A7F3D0]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold font-display text-[#10132D]">
                  Password Reset Email Sent!
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {sentEmailNotice ||
                    'An official password reset link has been sent to your email address. Follow the link in your inbox to set a new password.'}
                </p>
                <div className="pt-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onNavigateLogin}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white"
                  >
                    Proceed to Scholar Log In
                  </Button>
                </div>
              </div>
            )}

            {step !== 'success' && (
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-bold text-[#6846F5] hover:underline cursor-pointer"
                >
                  Return to Log In
                </button>
              </div>
            )}
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
            <button type="button" onClick={onNavigateLogin} className="hover:text-[#10132D] transition-colors">
              Log In
            </button>
            <span>•</span>
            <span className="text-slate-400">Secure Student Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
