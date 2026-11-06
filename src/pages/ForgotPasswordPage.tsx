/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
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
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sentEmailNotice, setSentEmailNotice] = useState<string | null>(null);

  // Step 1: Request reset code or email
  const handleRequestCode = async (e: React.FormEvent) => {
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
      await authService.initDefaultDemoUser();
      const res = await authService.requestPasswordReset(email);

      if (!res.success) {
        setError(res.error || 'No registered scholar account exists with this email address.');
        setIsSubmitting(false);
        return;
      }

      if (res.sentEmail) {
        setSentEmailNotice(
          res.message ||
            `An official password reset link has been dispatched to ${email}. Check your email inbox to choose a new password.`
        );
        setStep('success');
        setIsSubmitting(false);
        return;
      }

      if (res.code) {
        setGeneratedCode(res.code);
        setVerificationCode(res.code);
        setStep('reset');
        setIsSubmitting(false);
        return;
      }

      setStep('success');
      setIsSubmitting(false);
    } catch {
      setError('Failed to initiate password recovery. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword(email, verificationCode, newPassword);

      if (!res.success) {
        setError(res.error || 'Failed to update password. Please check your verification code.');
        setIsSubmitting(false);
        return;
      }

      setStep('success');
      setIsSubmitting(false);
    } catch {
      setError('Failed to reset password. Please try again.');
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
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
                    Enter your registered scholar email address and we&apos;ll generate a secure verification code to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRequestCode} className="space-y-4">
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
                        placeholder="e.g. scholar.ghana@campusconnect.edu"
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
                      {isSubmitting ? 'Verifying Account...' : 'Send Verification Code →'}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto border border-[#A7F3D0]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold font-display text-[#10132D]">
                    Set New Password
                  </h1>
                  <p className="text-xs text-[#64748B]">
                    A 6-digit security code was issued for <strong className="text-[#10132D]">{email}</strong>.
                  </p>
                </div>

                {/* Secure Code Simulation Box */}
                {generatedCode && (
                  <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-[#10132D] to-[#1A1F45] text-white border border-[#2D336B] shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#E7B75C] uppercase tracking-wider">
                        Security Verification Code
                      </span>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-[#252B61] px-2 py-0.5 rounded cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="mt-2 text-2xl font-mono font-bold tracking-widest text-center text-white bg-[#0A0C1E] py-2 rounded-lg border border-[#303875]">
                      {generatedCode}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400 text-center">
                      Valid for 15 minutes for your secure account update.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. 123456"
                      required
                      className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-center font-mono text-base tracking-widest text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#10132D]">
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-[#6846F5] hover:underline flex items-center gap-1 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
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
                      {isSubmitting ? 'Updating Password...' : 'Save New Password & Continue →'}
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
                  {sentEmailNotice ? 'Password Reset Email Sent!' : 'Password Reset Complete!'}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {sentEmailNotice ||
                    'Your scholar account password has been securely updated. You can now log in with your new credentials.'}
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
