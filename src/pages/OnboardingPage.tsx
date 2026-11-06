/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
  Building2,
  FileCheck,
  Check,
  AlertCircle,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { CountrySelect, CountryMultiSelect } from '../components/ui/CountrySelect';
import { authService, User } from '../services/auth';
import { saveStudentProfileToFirestore } from '../services/firebase';
import { CovaAssistant } from '../components/assistant/CovaAssistant';

export interface OnboardingPageProps {
  currentUser: User | null;
  onComplete: (updatedUser: User) => void;
  onSkip: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  currentUser,
  onComplete,
  onSkip,
}) => {
  const existingProfile = currentUser?.profile;

  // Wizard active step (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // 1. Nationality & Residence
  const [nationality, setNationality] = useState<string>(
    existingProfile?.nationality || (currentUser?.country === 'Ghana' ? 'Ghanaian' : 'Ghanaian')
  );
  const [countryOfResidence, setCountryOfResidence] = useState<string>(
    existingProfile?.countryOfResidence || currentUser?.country || 'Ghana'
  );

  // 2. Academic Profile
  const [intendedDegree, setIntendedDegree] = useState<string>(
    existingProfile?.intendedDegree || currentUser?.degreeLevel || "Undergraduate (Bachelor's)"
  );
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    existingProfile?.fieldOfStudy || currentUser?.studyField || 'Computer Science & Software Engineering'
  );
  const [graduationYear, setGraduationYear] = useState<string>(
    existingProfile?.graduationYear || '2026'
  );
  const [educationLevel, setEducationLevel] = useState<string>(
    existingProfile?.educationLevel || 'Senior High School (WASSCE / SSSCE / WAEC)'
  );

  // 3. Destinations
  const [preferredDestinations, setPreferredDestinations] = useState<string[]>(
    existingProfile?.preferredDestinations && existingProfile.preferredDestinations.length > 0
      ? existingProfile.preferredDestinations
      : ['Ghana', 'United States', 'United Kingdom', 'Canada']
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleNextFromStep1 = () => {
    setFormError(null);
    if (!nationality.trim()) {
      setFormError('Please select your nationality.');
      return;
    }
    if (!countryOfResidence.trim()) {
      setFormError('Please select your current country of residence.');
      return;
    }
    if (!fieldOfStudy.trim()) {
      setFormError('Please specify your primary field of study.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleNextFromStep2 = () => {
    setFormError(null);
    if (preferredDestinations.length === 0) {
      setFormError('Please select at least one preferred study destination.');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    setIsSubmitting(true);
    try {
      const updatedUser = authService.updateProfile({
        nationality,
        countryOfResidence,
        preferredDestinations,
        educationLevel,
        intendedDegree,
        fieldOfStudy: fieldOfStudy.trim() || 'General Studies',
        graduationYear,
        onboardingCompleted: true,
      });

      if (!updatedUser) {
        setFormError('Failed to save your preferences. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Persist to Cloud Firestore private student record
      try {
        await saveStudentProfileToFirestore(
          updatedUser.id,
          updatedUser.email,
          {
            nationality,
            countryOfResidence,
            preferredDestinations,
            educationLevel,
            intendedDegree,
            fieldOfStudy: fieldOfStudy.trim() || 'General Studies',
            graduationYear,
            onboardingCompleted: true,
          },
          updatedUser.fullName
        );
      } catch (err) {
        console.warn('Firestore profile persist notice:', err);
      }

      onComplete(updatedUser);
    } catch {
      setFormError('An unexpected error occurred while saving your profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-between selection:bg-[#6846F5] selection:text-white">
      {/* Top Header */}
      <header className="w-full bg-[#10132D] border-b border-[#20254D] py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" variant="dark" showWordmark={true} />
            <span className="hidden sm:inline-block text-xs font-semibold text-[#8065FF] border-l border-[#20254D] pl-3">
              Scholar Profile Setup
            </span>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#2D336B] bg-[#161B3D] transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Header Title & Subtitle matching showcase */}
          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#10132D] tracking-tight">
              Complete Your Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              This helps us find the best opportunities for you.
            </p>
          </div>

          {/* 3-Step Wizard Navigation Stepper matching showcase */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-xl mx-auto relative">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-[#6846F5] text-white ring-4 ring-[#6846F5]/20 shadow-sm'
                      : currentStep > 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    currentStep === 1 ? 'text-[#10132D]' : 'text-slate-500'
                  }`}
                >
                  Academic Profile
                </span>
              </button>

              {/* Connecting Bar 1 */}
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors ${
                  currentStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  if (currentStep >= 2 || (nationality && countryOfResidence && fieldOfStudy)) {
                    setCurrentStep(2);
                  }
                }}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-[#6846F5] text-white ring-4 ring-[#6846F5]/20 shadow-sm'
                      : currentStep > 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    currentStep === 2 ? 'text-[#10132D]' : 'text-slate-500'
                  }`}
                >
                  Destination Preferences
                </span>
              </button>

              {/* Connecting Bar 2 */}
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors ${
                  currentStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  if (preferredDestinations.length > 0 && nationality && countryOfResidence) {
                    setCurrentStep(3);
                  }
                }}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 3
                      ? 'bg-[#6846F5] text-white ring-4 ring-[#6846F5]/20 shadow-sm'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    currentStep === 3 ? 'text-[#10132D]' : 'text-slate-500'
                  }`}
                >
                  Confirmation
                </span>
              </button>
            </div>
          </div>

          {/* Form Error Alert */}
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Wizard Card Body */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-8 md:p-10 space-y-6">
            {/* ========================================================= */}
            {/* STEP 1: Academic Profile */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h2 className="text-lg font-bold font-display text-[#10132D]">
                    Step 1: Academic Profile
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your citizenship, target degree, and academic focus determine official eligibility.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Row 1: Nationality & Country of Residence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CountrySelect
                        id="onboarding-step1-nationality"
                        label="Nationality / Citizenship"
                        mode="nationality"
                        value={nationality}
                        onChange={setNationality}
                        required
                        placeholder="Select your nationality (e.g. Ghanaian)..."
                      />
                    </div>

                    <div>
                      <CountrySelect
                        id="onboarding-step1-residence"
                        label="Country of Residence"
                        mode="country"
                        value={countryOfResidence}
                        onChange={setCountryOfResidence}
                        required
                        placeholder="Select your country of residence..."
                      />
                    </div>
                  </div>

                  {/* Row 2: Target Degree Level & Field of Study */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                        Target Degree Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={intendedDegree}
                        onChange={(e) => setIntendedDegree(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                      >
                        <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor&apos;s)</option>
                        <option value="Master's (Postgraduate)">Master&apos;s Degree</option>
                        <option value="Doctorate / PhD">Doctorate / PhD</option>
                        <option value="Direct PhD (Post-Bachelor's)">Direct PhD (Post-Bachelor&apos;s)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                        Field of Study <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        placeholder="e.g. Computer Science, Public Health..."
                        className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                      />
                    </div>
                  </div>

                  {/* Row 3: Expected Graduation Year */}
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Expected Graduation Year
                    </label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full sm:w-1/2 h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                      <option value="2030+">2030+</option>
                    </select>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onSkip}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors min-h-[44px] px-3 flex items-center"
                  >
                    Skip for now
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleNextFromStep1}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md min-h-[44px]"
                  >
                    Next Step →
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: Destination Preferences */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h2 className="text-lg font-bold font-display text-[#10132D]">
                    Step 2: Destination Preferences
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select where you would like to study to filter opportunities worldwide.
                  </p>
                </div>

                <div className="space-y-5">
                  <CountryMultiSelect
                    label="Preferred Study Destinations"
                    selectedCountries={preferredDestinations}
                    onChange={setPreferredDestinations}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Current Highest Education Level
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none focus:ring-2 focus:ring-[#6846F5]/10"
                    >
                      <option value="Senior High School (WASSCE / SSSCE / WAEC)">Senior High School (WASSCE / SSSCE / WAEC)</option>
                      <option value="Cambridge A-Levels / International Baccalaureate (IB)">Cambridge A-Levels / IB</option>
                      <option value="Undergraduate Student (In Progress)">Undergraduate Student (In Progress)</option>
                      <option value="Bachelor's Degree (Completed)">Bachelor&apos;s Degree (Completed)</option>
                      <option value="Master's Degree (Completed / In Progress)">Master&apos;s Degree</option>
                      <option value="Doctorate / PhD">Doctorate / PhD</option>
                    </select>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors min-h-[44px] px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleNextFromStep2}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md min-h-[44px]"
                  >
                    Next Step →
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3: Confirmation & Profile Summary */}
            {/* ========================================================= */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h2 className="text-lg font-bold font-display text-[#10132D]">
                    Step 3: Confirmation
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your scholar preferences before entering the directory.
                  </p>
                </div>

                {/* Profile Review Card */}
                <div className="p-5 rounded-2xl bg-[#F8F9FD] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6846F5]">
                    <UserCheck className="w-4 h-4" />
                    <span>Scholar Profile Overview</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[11px] font-medium">Citizenship &amp; Residence</span>
                      <strong className="text-[#10132D] font-bold text-sm">
                        {nationality} (in {countryOfResidence})
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[11px] font-medium">Target Degree</span>
                      <strong className="text-[#10132D] font-bold text-sm">
                        {intendedDegree} ({graduationYear})
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[11px] font-medium">Primary Field</span>
                      <strong className="text-[#10132D] font-bold text-sm truncate block">
                        {fieldOfStudy}
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[11px] font-medium">Target Destinations</span>
                      <strong className="text-[#6846F5] font-bold text-sm truncate block">
                        {preferredDestinations.join(', ')}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your preferences are protected and saved to your private student profile.</span>
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors min-h-[44px] px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md min-h-[44px]"
                  >
                    {isSubmitting ? 'Saving Profile...' : 'Save & Open Dashboard →'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E2E8F0] py-6 px-4 text-center text-xs text-[#64748B]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Campus Connect. All rights reserved.</p>
          <p className="text-slate-400">Verified Student Profile Standards</p>
        </div>
      </footer>

      {/* COVA AI Virtual Assistant */}
      <CovaAssistant
        userName={currentUser?.fullName}
        studentProfile={currentUser?.profile}
      />
    </div>
  );
};
