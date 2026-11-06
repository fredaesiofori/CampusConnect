/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Globe,
  GraduationCap,
  BookOpen,
  Calendar,
  Compass,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { authService, User, StudentProfile } from '../../services/auth';
import { CountrySelect, CountryMultiSelect } from '../ui/CountrySelect';

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onProfileUpdated: (updatedUser: User) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const existingProfile = currentUser?.profile;

  const [nationality, setNationality] = useState<string>(
    existingProfile?.nationality || (currentUser?.country === 'Ghana' ? 'Ghanaian' : 'Ghanaian')
  );
  const [countryOfResidence, setCountryOfResidence] = useState<string>(
    existingProfile?.countryOfResidence || currentUser?.country || 'Ghana'
  );
  const [preferredDestinations, setPreferredDestinations] = useState<string[]>(
    existingProfile?.preferredDestinations || ['Ghana', 'United States', 'United Kingdom', 'Canada']
  );
  const [educationLevel, setEducationLevel] = useState<string>(
    existingProfile?.educationLevel || 'Senior High School (WASSCE / SSSCE / WAEC)'
  );
  const [intendedDegree, setIntendedDegree] = useState<string>(
    existingProfile?.intendedDegree || currentUser?.degreeLevel || "Undergraduate (Bachelor's)"
  );
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    existingProfile?.fieldOfStudy || currentUser?.studyField || 'Computer Science & Software Engineering'
  );
  const [graduationYear, setGraduationYear] = useState<string>(
    existingProfile?.graduationYear || '2026'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const updatedUser = authService.updateProfile({
        nationality,
        countryOfResidence,
        preferredDestinations,
        educationLevel,
        intendedDegree,
        fieldOfStudy,
        graduationYear,
        onboardingCompleted: true,
      });

      if (!updatedUser) {
        setFeedback('Failed to update profile. Please try again.');
        setIsSubmitting(false);
        return;
      }

      onProfileUpdated(updatedUser);
      setIsSubmitting(false);
      onClose();
    } catch {
      setFeedback('An error occurred while saving your preferences.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#10132D]/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-4 sm:p-7 md:p-8 animate-in zoom-in-95 duration-150 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0] gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6846F5]">
              Account Preferences
            </span>
            <h2 id="profile-edit-modal-title" className="text-xl sm:text-2xl font-bold font-display text-[#10132D] mt-1 leading-snug">
              Edit Scholar Profile &amp; Preferences
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Update your academic goals and destinations anytime to refine your opportunity matches.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 pt-5">
          {/* 1. Nationality & Residence (Complete global country selection with search) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <CountrySelect
                id="profile-nationality-select"
                label="Nationality / Citizenship"
                mode="nationality"
                value={nationality}
                onChange={setNationality}
                placeholder="Search nationality (e.g. Ghanaian)..."
              />
            </div>

            <div>
              <CountrySelect
                id="profile-residence-select"
                label="Current Country of Residence"
                mode="country"
                value={countryOfResidence}
                onChange={setCountryOfResidence}
                placeholder="Search country (e.g. Ghana)..."
              />
            </div>
          </div>

          {/* 2. Preferred Study Destinations (Worldwide searchable multi-select) */}
          <div>
            <CountryMultiSelect
              label="Preferred Study Destinations"
              selectedCountries={preferredDestinations}
              onChange={setPreferredDestinations}
            />
          </div>

          {/* 3. Education Level & Intended Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                Current Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
              >
                <option value="Senior High School (WASSCE / SSSCE / WAEC)">Senior High School (WASSCE / SSSCE / WAEC)</option>
                <option value="Cambridge A-Levels / International Baccalaureate (IB)">Cambridge A-Levels / IB</option>
                <option value="Undergraduate (Currently Enrolled Student)">Undergraduate Student (In Progress)</option>
                <option value="Bachelor's Degree (Completed / Graduate)">Bachelor&apos;s Degree (Completed)</option>
                <option value="Master's Degree (Completed / In Progress)">Master&apos;s Degree</option>
                <option value="Doctorate / PhD">Doctorate / PhD</option>
                <option value="HND / Polytechnic / Diploma">HND / Polytechnic / Diploma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                Intended Degree
              </label>
              <select
                value={intendedDegree}
                onChange={(e) => setIntendedDegree(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
              >
                <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor&apos;s Degree)</option>
                <option value="Master's (Postgraduate)">Master&apos;s (Postgraduate Degree)</option>
                <option value="Doctorate / PhD">Doctorate / PhD (Fully Funded)</option>
                <option value="Direct PhD (Post-Bachelor's)">Direct PhD (Post-Bachelor&apos;s)</option>
                <option value="Professional Degree (Pre-Med, Law, MBA)">Professional Degree (Pre-Med, Law, MBA)</option>
              </select>
            </div>
          </div>

          {/* 4. Field of Study & Graduation Year */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                Field of Study
              </label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Science, Public Health, Mechanical Engineering"
                required
                className="w-full h-10 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                Graduation Year
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
              >
                <option value="2023">2023</option>
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-center min-h-[44px] sm:min-h-0"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              rightIcon={<Save className="w-4 h-4" />}
              className="bg-[#6846F5] hover:bg-[#5835E5] text-white min-h-[44px] sm:min-h-0 justify-center"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
