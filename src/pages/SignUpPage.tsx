/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  FileCheck,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { CountrySelect } from '../components/ui/CountrySelect';
import { authService, User } from '../services/auth';

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
    searchContext?.destination && searchContext.destination !== 'Any Destination' && searchContext.destination !== 'Ghana & Global Destinations'
      ? searchContext.destination
      : 'Ghana'
  );
  const [degreeLevel, setDegreeLevel] = useState<'Undergraduate' | "Master's" | 'PhD'>('Undergraduate');
  const [studyField, setStudyField] = useState(searchContext?.query && searchContext.query !== 'all study fields' ? searchContext.query : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

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

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
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
              Already have a scholar account?
            </span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs sm:text-sm font-semibold text-white bg-[#1E2452] hover:bg-[#28306E] border border-[#374187] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-colors cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Value Proposition & Membership Benefits */}
          <div className="lg:col-span-5 space-y-6 lg:pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EDFF] text-[#6846F5] text-xs font-semibold border border-[#DDD6FE]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL STUDENT REGISTRATION</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#10132D] tracking-tight leading-tight">
                Create Your Free Scholar Account
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
                Join thousands of students across Ghana and Africa finding verified international universities, full tuition coverage, and application fee waivers.
              </p>
            </div>

            {/* Contextual Search Banner if user searched in Hero */}
            {searchContext && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#10132D] to-[#1A1F45] text-white border border-[#2D336B] shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E7B75C]">
                  <Globe className="w-4 h-4" />
                  <span>Personalized Search Unlocked</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Matches for <strong className="text-white font-semibold">&ldquo;{searchContext.query || 'all study fields'}&rdquo;</strong> in <strong className="text-white font-semibold">&ldquo;{searchContext.destination || 'Ghana & Global'}&rdquo;</strong> are ready to view upon sign-up.
                </p>
              </div>
            )}

            {/* Feature Checklist */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0EDFF] text-[#6846F5] flex items-center justify-center shrink-0 mt-0.5 border border-[#DDD6FE]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#10132D]">Verified Higher Education Directory</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Accredited universities in Ghana, North America, UK, Europe, and Asia with official requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5 border border-[#A7F3D0]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#10132D]">$0 Application Fees &amp; Test Waivers</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Discover institutions with zero application fees or verified SAT/ACT and English language test waivers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 border border-[#FDE68A]">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#10132D]">Application Tracker &amp; Target List</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Save top opportunities and manage deadlines directly in your private student dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Note */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-[#64748B] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Campus Connect never sells your academic data. Free forever for students.</span>
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4 sm:p-8 md:p-10">
              <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-[#10132D]">
                  Student Account Information
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Fill in your details to create your secure scholar profile.
                </p>
              </div>

              {/* General Error Banner */}
              {generalError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Kwame Mensah"
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="kwame.mensah@example.com"
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Country of Origin & Degree Level (Two Columns on sm) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country of Origin / Citizenship */}
                  <div>
                    <CountrySelect
                      id="signup-country"
                      label="Country of Origin / Citizenship"
                      value={country}
                      onChange={(val) => {
                        setCountry(val);
                        if (errors.country) setErrors((prev) => ({ ...prev, country: '' }));
                      }}
                      required
                      placeholder="Search country (e.g. Ghana)..."
                    />
                  </div>

                  {/* Degree Level */}
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Target Degree Level <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                    >
                      <option value="Undergraduate">Undergraduate (Bachelor&apos;s)</option>
                      <option value="Master's">Master&apos;s Degree</option>
                      <option value="PhD">Doctorate / PhD</option>
                    </select>
                  </div>
                </div>

                {/* Desired Field of Study */}
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Primary Field of Study or Interest
                  </label>
                  <input
                    type="text"
                    value={studyField}
                    onChange={(e) => setStudyField(e.target.value)}
                    placeholder="e.g. Computer Science, Public Health, Mechanical Engineering"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                  />
                  <p className="mt-1 text-[11px] text-[#64748B]">
                    Used to highlight recommended departments and course-specific grants.
                  </p>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#10132D]">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-[#6846F5] hover:underline flex items-center gap-1 focus:outline-none"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-3 h-3" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" /> Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="Min. 8 characters"
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.password
                            ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                            : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                        }`}
                      />
                    </div>
                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                          <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                          <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                        </div>
                        <span className="text-[11px] text-[#64748B]">
                          Strength: <strong className="font-semibold">{strength.label}</strong>
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Re-enter password"
                      className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                        errors.confirmPassword
                          ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                          : 'border-[#CBD5E1] bg-white focus:border-[#6846F5] focus:ring-2 focus:ring-[#6846F5]/10'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                      }}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-[#6846F5] focus:ring-[#6846F5]"
                    />
                    <span className="text-xs text-[#64748B] leading-relaxed">
                      I agree to the <strong className="text-[#10132D]">Terms of Service</strong> and acknowledge that all scholarship eligibility decisions are strictly governed by official university policies.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.agreeTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-[0_4px_16px_rgba(104,70,245,0.4)]"
                  >
                    {isSubmitting ? 'Creating Scholar Profile...' : 'Complete Sign Up & Open Dashboard →'}
                  </Button>
                </div>
              </form>

              {/* Bottom Login Link */}
              <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-bold text-[#6846F5] hover:underline cursor-pointer"
                >
                  Log In to Scholar Portal
                </button>
              </div>
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
