/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  Mail,
  MapPin,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  SquarePen,
  Target,
  UserRound,
  Zap,
} from 'lucide-react';
import {
  PASSWORD_MIN_LENGTH,
  User,
  authService,
  validatePasswordPolicy,
} from '../../services/auth';
import { Button } from '../ui/Button';
import { CountryMultiSelect, CountrySelect } from '../ui/CountrySelect';
import { getStudentInitials } from '../ui/StudentInitialsAvatar';

export type ProfileSubTab =
  | 'overview'
  | 'personal'
  | 'academic'
  | 'preferences'
  | 'security';

export interface ProfileCompletionSummary {
  percentage: number;
  completedCount: number;
  totalCount: number;
  missingFields: {
    id: string;
    label: string;
    category: string;
    completed: boolean;
  }[];
}

export interface ProfileViewProps {
  activeUser: User | null;
  profileCompletion: ProfileCompletionSummary;
  profFullName: string;
  setProfFullName: (val: string) => void;
  profPhone: string;
  setProfPhone: (val: string) => void;
  profNationality: string;
  setProfNationality: (val: string) => void;
  profResidence: string;
  setProfResidence: (val: string) => void;
  profCurrentSchool: string;
  setProfCurrentSchool: (val: string) => void;
  profEduLevel: string;
  setProfEduLevel: (val: string) => void;
  profGraduationYear: string;
  setProfGraduationYear: (val: string) => void;
  profIntendedDegree: string;
  setProfIntendedDegree: (val: string) => void;
  profFieldOfStudy: string;
  setProfFieldOfStudy: (val: string) => void;
  profFundingPreference: string;
  setProfFundingPreference: (val: string) => void;
  profTestPreference: string;
  setProfTestPreference: (val: string) => void;
  profDestinations: string[];
  setProfDestinations: (vals: string[]) => void;
  isSavingProfile: boolean;
  profileSaveFeedback: {
    type: 'success' | 'error' | 'info';
    text: string;
  } | null;
  onSaveProfile: (e: React.FormEvent) => Promise<void> | void;
  onBackToOverview: () => void;
  onOpenSecuritySettings?: () => void;
  onShowToast?: (message: string, isError?: boolean) => void;
}

const PROFILE_TABS: {
  id: ProfileSubTab;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'personal',
    label: 'Personal Information',
    icon: <UserRound className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'academic',
    label: 'Academic Information',
    icon: <GraduationCap className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'preferences',
    label: 'Study Preferences',
    icon: <Target className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'security',
    label: 'Account & Security',
    icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
  },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeUser,
  profileCompletion,
  profFullName,
  setProfFullName,
  profPhone,
  setProfPhone,
  profNationality,
  setProfNationality,
  profResidence,
  setProfResidence,
  profCurrentSchool,
  setProfCurrentSchool,
  profEduLevel,
  setProfEduLevel,
  profGraduationYear,
  setProfGraduationYear,
  profIntendedDegree,
  setProfIntendedDegree,
  profFieldOfStudy,
  setProfFieldOfStudy,
  profFundingPreference,
  setProfFundingPreference,
  profTestPreference,
  setProfTestPreference,
  profDestinations,
  setProfDestinations,
  isSavingProfile,
  profileSaveFeedback,
  onSaveProfile,
  onBackToOverview,
  onOpenSecuritySettings,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('overview');
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

  // Account & Security state (Firebase Auth password + provider-aware handling)
  const [sessionInfo, setSessionInfo] = useState<{
    userId: string;
    email: string;
    providerId: string;
    creationTime: string | null;
    lastSignInTime: string | null;
    emailVerified: boolean;
    isTokenValid: boolean;
    deviceSummary: string;
  } | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Focus a specific form control smoothly after switching tabs
  useEffect(() => {
    if (!pendingFocusId) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(pendingFocusId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      setPendingFocusId(null);
    }, 60);
    return () => clearTimeout(timer);
  }, [activeSubTab, pendingFocusId]);

  // Load current Firebase Authentication provider/session details on Account & Security tab
  useEffect(() => {
    if (activeSubTab !== 'security') return;
    let active = true;
    setIsLoadingSession(true);
    authService
      .getActiveSessionDetails()
      .then((details) => {
        if (active) setSessionInfo(details);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoadingSession(false);
      });
    return () => {
      active = false;
    };
  }, [activeSubTab, activeUser?.id]);

  // Derived student display values strictly from authenticated profile (no fake fallbacks)
  const displayName =
    profFullName.trim() ||
    activeUser?.fullName?.trim() ||
    activeUser?.email?.split('@')[0] ||
    'Not provided';

  const initials = getStudentInitials(
    profFullName.trim() || activeUser?.fullName,
    activeUser?.email
  );

  const displayCurrentLevel = profEduLevel.trim() || '';
  const displayFieldOfStudy =
    profFieldOfStudy.trim() || activeUser?.studyField?.trim() || '';
  const displayResidence =
    profResidence.trim() || activeUser?.country?.trim() || '';
  const displayGradYear = profGraduationYear.trim() || '';
  const displayIntendedDegree =
    profIntendedDegree.trim() || activeUser?.degreeLevel?.trim() || '';
  const displayFunding =
    profFundingPreference.trim() ||
    activeUser?.profile?.fundingTypePreference?.replace(/_/g, ' ') ||
    '';
  const displayTestPref = profTestPreference.trim() || '';

  // Read existing biography safely if stored on profile document (never fabricate one)
  const savedBiography = useMemo(() => {
    const rawProfile = activeUser?.profile as
      | (NonNullable<User['profile']> & { bio?: string; biography?: string; aboutMe?: string })
      | undefined;
    const rawBio = rawProfile?.bio || rawProfile?.biography || rawProfile?.aboutMe || '';
    return typeof rawBio === 'string' ? rawBio.trim() : '';
  }, [activeUser?.profile]);

  const bannerSubtitle = useMemo(() => {
    if (displayFieldOfStudy && displayCurrentLevel) {
      return `${displayFieldOfStudy} · ${displayCurrentLevel}`;
    }
    if (displayFieldOfStudy) return displayFieldOfStudy;
    if (displayCurrentLevel) return displayCurrentLevel;
    return 'Academic details not provided';
  }, [displayFieldOfStudy, displayCurrentLevel]);

  // Checklist completion state driven dynamically by profileCompletion checks
  const checklistItems = useMemo(() => {
    const missingByCategory = {
      Personal: profileCompletion.missingFields.filter((f) => f.category === 'Personal'),
      Academic: profileCompletion.missingFields.filter((f) => f.category === 'Academic'),
      'Study Preferences': profileCompletion.missingFields.filter(
        (f) => f.category === 'Study Preferences'
      ),
    };

    const firstMissing = profileCompletion.missingFields[0];
    const firstMissingTab: ProfileSubTab =
      firstMissing?.category === 'Academic'
        ? 'academic'
        : firstMissing?.category === 'Study Preferences'
        ? 'preferences'
        : 'personal';

    return [
      {
        id: 'checklist-personal',
        label: 'Add personal information',
        completed: missingByCategory.Personal.length === 0,
        targetTab: 'personal' as ProfileSubTab,
        focusFieldId: missingByCategory.Personal[0]?.id || 'prof-fullname',
      },
      {
        id: 'checklist-academic',
        label: 'Add academic information',
        completed: missingByCategory.Academic.length === 0,
        targetTab: 'academic' as ProfileSubTab,
        focusFieldId: missingByCategory.Academic[0]?.id || 'prof-school',
      },
      {
        id: 'checklist-preferences',
        label: 'Set study preferences',
        completed: missingByCategory['Study Preferences'].length === 0,
        targetTab: 'preferences' as ProfileSubTab,
        focusFieldId:
          missingByCategory['Study Preferences'][0]?.id || 'prof-intended-degree',
      },
      {
        id: 'checklist-overall',
        label:
          profileCompletion.percentage === 100
            ? 'Profile complete'
            : 'Complete your profile',
        completed: profileCompletion.percentage === 100,
        targetTab: firstMissingTab,
        focusFieldId: firstMissing?.id || 'prof-fullname',
      },
    ];
  }, [profileCompletion]);

  const openSectionForEdit = (tab: ProfileSubTab, focusId?: string) => {
    setActiveSubTab(tab);
    if (focusId) {
      setPendingFocusId(focusId);
    }
  };

  // Provider classification for Account & Security tab
  const providerTokens = (sessionInfo?.providerId || '')
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const usesPasswordProvider =
    providerTokens.length === 0 || providerTokens.includes('password');
  const isFederatedOnlyAccount =
    providerTokens.length > 0 && !providerTokens.includes('password');

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    const pwdCheck = validatePasswordPolicy(newPassword);
    if (!pwdCheck.valid) {
      setPasswordError(
        pwdCheck.error || 'New password does not meet security requirements.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        'Your new password must be different from your current password.'
      );
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (!res.success) {
        setPasswordError(
          res.error || 'Failed to update password. Please verify your credentials.'
        );
        return;
      }

      setPasswordSuccess('Your password has been updated securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast?.('Password updated securely.');
    } catch (err: any) {
      setPasswordError(
        err?.message || 'An unexpected error occurred while updating your password.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSendPasswordReset = async () => {
    setResetError(null);
    setResetSuccess(null);
    const targetEmail = (activeUser?.email || sessionInfo?.email || '').trim();
    if (!targetEmail) {
      setResetError('No account email address found for password recovery.');
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await authService.requestPasswordReset(targetEmail);
      if (res.success) {
        setResetSuccess(
          res.message ||
            `Password reset email sent to ${targetEmail}. Check your inbox and spam folder.`
        );
        onShowToast?.('Password reset link sent.');
      } else {
        setResetError(
          res.error || 'Unable to send password reset email right now.'
        );
      }
    } catch (err: any) {
      setResetError(err?.message || 'Failed to contact authentication service.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Page Title & Navigation Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-[28px] font-bold font-display text-[#10132D] tracking-tight leading-tight">
            My Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#475569]">
            Manage your information and study preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToOverview}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6846F5] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* 1. Large Purple Profile Header Banner */}
      <section
        aria-label="Student profile summary"
        className="relative overflow-hidden rounded-[20px] sm:rounded-[22px] bg-gradient-to-r from-[#2A0E72] via-[#5422D0] to-[#7448FA] text-white shadow-[0_14px_34px_rgba(74,28,185,0.22)] px-5 py-6 sm:px-8 sm:py-7"
      >
        {/* Subtle luminous curved background waves matching reference */}
        <svg
          viewBox="0 0 800 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="none"
          className="pointer-events-none select-none absolute inset-0 w-full h-full opacity-55"
        >
          <path
            d="M420 0C510 55 550 150 640 220H800V0H420Z"
            fill="url(#profBannerWave1)"
          />
          <path
            d="M520 220C590 120 695 95 800 35V220H520Z"
            fill="url(#profBannerWave2)"
          />
          <defs>
            <linearGradient
              id="profBannerWave1"
              x1="460"
              y1="0"
              x2="800"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A78BFA" stopOpacity="0.28" />
              <stop offset="1" stopColor="#4C1D95" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="profBannerWave2"
              x1="540"
              y1="220"
              x2="800"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C4B5FD" stopOpacity="0.24" />
              <stop offset="1" stopColor="#3B0764" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Circular Initials Badge + Student Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
            <div className="relative self-start sm:self-center shrink-0">
              <div
                role="img"
                aria-label={`${displayName} initials badge (${initials})`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#3D1A94] to-[#210A5C] border-[2.5px] border-white/95 shadow-[0_10px_24px_rgba(17,6,51,0.38)] flex items-center justify-center font-display font-bold text-2xl sm:text-3xl tracking-tight text-white select-none"
              >
                {initials}
              </div>
              <button
                type="button"
                onClick={() => openSectionForEdit('personal', 'prof-fullname')}
                title="Edit personal identity"
                aria-label="Edit personal identity"
                className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-white text-[#5B2EE6] hover:bg-[#F5F2FF] hover:scale-105 active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="hidden sm:block w-px h-14 bg-white/25 shrink-0" />

            <div className="min-w-0 space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight truncate">
                {displayName}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 truncate">
                {bannerSubtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/90 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-white/85 shrink-0" />
                <span className="truncate">
                  {displayResidence || 'Location not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-14 bg-white/25 shrink-0" />

          {/* Middle & Right: Profile Completion Progress + Edit Profile CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-6 shrink-0">
            <div className="w-full sm:w-64 lg:w-60 xl:w-72 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white/95">
                <span>Profile Completion</span>
                <span className="text-[11px] font-medium text-white/75">
                  {profileCompletion.completedCount}/{profileCompletion.totalCount} fields
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-3 rounded-full bg-white/95 p-0.5 overflow-hidden shadow-inner"
                  role="progressbar"
                  aria-valuenow={profileCompletion.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Profile completion percentage"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6846F5] transition-all duration-300"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>
                <span className="text-sm sm:text-base font-bold tabular-nums text-white shrink-0">
                  {profileCompletion.percentage}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openSectionForEdit('personal', 'prof-fullname')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F5F2FF] text-[#5B2EE6] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.985] transition-all cursor-pointer min-h-[42px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Profile Navigation Tabs */}
      <nav
        aria-label="Profile sections"
        className="bg-white rounded-2xl sm:rounded-full border border-[#E7E3FA] p-1.5 shadow-[0_2px_10px_rgba(104,70,245,0.05)] overflow-x-auto"
      >
        <div
          role="tablist"
          aria-label="Profile tabs"
          className="flex items-center gap-1 min-w-max lg:w-full lg:justify-between"
        >
          {PROFILE_TABS.map((tab) => {
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveSubTab(tab.id)}
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] ${
                  isSelected
                    ? 'bg-[#EFEAFF] text-[#5D35F5] font-bold shadow-xs'
                    : 'text-[#334155] hover:text-[#10132D] hover:bg-[#F7F5FF] font-semibold'
                }`}
              >
                {tab.icon && (
                  <span className={isSelected ? 'text-[#5D35F5]' : 'text-[#475569]'}>
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3A. TAB: OVERVIEW (Two-Column Layout Matching Reference) */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in duration-150">
          {/* Left Column (~42%) */}
          <div className="lg:col-span-5 space-y-5">
            {/* About Me Card */}
            <section
              aria-label="About Me"
              className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <UserRound className="w-5 h-5 text-[#6846F5] shrink-0" />
                  <h3 className="text-base font-bold font-display text-[#10132D]">
                    About Me
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSectionForEdit('personal', 'prof-fullname')}
                  aria-label="Edit personal profile details"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6846F5] hover:bg-[#F4F0FF] transition-colors cursor-pointer"
                >
                  <SquarePen className="w-4 h-4" />
                </button>
              </div>

              {savedBiography ? (
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {savedBiography}
                </p>
              ) : (
                <div className="rounded-xl bg-[#FAF9FF] border border-[#ECE7FF] p-3.5 space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-[#334155]">
                    No biography has been added yet.
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed">
                    Your profile currently stores structured personal, academic, and destination fields. Update your details anytime in Personal Information.
                  </p>
                  <button
                    type="button"
                    onClick={() => openSectionForEdit('personal', 'prof-fullname')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer"
                  >
                    <span>Edit Personal Info</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </section>

            {/* Profile Checklist Card */}
            <section
              aria-label="Profile Checklist"
              className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="w-5 h-5 text-[#6846F5] shrink-0" />
                  <h3 className="text-base font-bold font-display text-[#10132D]">
                    Profile Checklist
                  </h3>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#6846F5] tabular-nums">
                  {profileCompletion.percentage}% Complete
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-[#EFEAFF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6846F5] transition-all duration-300"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {checklistItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openSectionForEdit(item.targetTab, item.focusFieldId)}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-[#EAEDF4] bg-white hover:border-[#C4B5FD] hover:bg-[#FAF8FF] active:scale-[0.99] transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.completed ? (
                        <CheckCircle2
                          className="w-5 h-5 text-emerald-500 fill-emerald-500 stroke-white shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="w-5 h-5 text-slate-300 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-xs sm:text-sm font-medium text-[#1E293B] truncate">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (~58%) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Academic Summary Card */}
            <section
              aria-label="Academic Summary"
              className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-[#6846F5] shrink-0" />
                  <h3 className="text-base font-bold font-display text-[#10132D]">
                    Academic Summary
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSectionForEdit('academic', 'prof-edu-level')}
                  className="text-xs sm:text-sm font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-[#EAEFF7] text-center pt-1">
                <div className="px-3 space-y-1 flex flex-col items-center">
                  <GraduationCap className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Current Level
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      displayCurrentLevel ? 'text-[#334155]' : 'text-slate-400 italic'
                    }`}
                  >
                    {displayCurrentLevel || 'Not provided'}
                  </span>
                </div>

                <div className="px-3 space-y-1 flex flex-col items-center">
                  <Layers className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Field of Study
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      displayFieldOfStudy ? 'text-[#334155]' : 'text-slate-400 italic'
                    }`}
                  >
                    {displayFieldOfStudy || 'Not provided'}
                  </span>
                </div>

                <div className="px-3 space-y-1 flex flex-col items-center">
                  <Calendar className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Graduation Year
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      displayGradYear ? 'text-[#334155]' : 'text-slate-400 italic'
                    }`}
                  >
                    {displayGradYear || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  <strong className="font-semibold text-[#1E293B]">School:</strong>{' '}
                  {profCurrentSchool.trim() ? profCurrentSchool.trim() : 'Not provided'}
                </span>
                {!profCurrentSchool.trim() && (
                  <button
                    type="button"
                    onClick={() => openSectionForEdit('academic', 'prof-school')}
                    className="text-xs font-semibold text-[#6846F5] hover:underline cursor-pointer"
                  >
                    Add school
                  </button>
                )}
              </div>
            </section>

            {/* Study Preferences Card */}
            <section
              aria-label="Study Preferences"
              className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-[#6846F5] shrink-0" />
                  <h3 className="text-base font-bold font-display text-[#10132D]">
                    Study Preferences
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSectionForEdit('preferences', 'prof-intended-degree')}
                  className="text-xs sm:text-sm font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-[#EAEFF7] text-center pt-1">
                <div className="px-3 space-y-1 flex flex-col items-center">
                  <MapPin className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Preferred Countries
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      profDestinations.length > 0
                        ? 'text-[#334155]'
                        : 'text-slate-400 italic'
                    }`}
                  >
                    {profDestinations.length > 0
                      ? profDestinations.join(', ')
                      : 'Not provided'}
                  </span>
                </div>

                <div className="px-3 space-y-1 flex flex-col items-center">
                  <Layers className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Target Degree
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      displayIntendedDegree ? 'text-[#334155]' : 'text-slate-400 italic'
                    }`}
                  >
                    {displayIntendedDegree || 'Not provided'}
                  </span>
                </div>

                <div className="px-3 space-y-1 flex flex-col items-center">
                  <GraduationCap className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-[11px] font-bold text-[#10132D] pt-0.5">
                    Field of Interest
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      displayFieldOfStudy ? 'text-[#334155]' : 'text-slate-400 italic'
                    }`}
                  >
                    {displayFieldOfStudy || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
                <span>
                  <strong className="font-semibold text-[#1E293B]">Funding:</strong>{' '}
                  {displayFunding || 'Not provided'}
                </span>
                <span>
                  <strong className="font-semibold text-[#1E293B]">Testing:</strong>{' '}
                  {displayTestPref || 'Not provided'}
                </span>
              </div>
            </section>

            {/* Quick Actions Card */}
            <section
              aria-label="Quick Actions"
              className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3.5"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#6846F5] shrink-0" />
                <h3 className="text-base font-bold font-display text-[#10132D]">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => openSectionForEdit('personal', 'prof-fullname')}
                  className="rounded-xl bg-[#F4F0FF] hover:bg-[#ECE5FF] border border-[#E6DCFF] px-4 py-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                >
                  <Pencil className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                    Edit Profile
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openSectionForEdit('preferences', 'prof-intended-degree')}
                  className="rounded-xl bg-[#F4F0FF] hover:bg-[#ECE5FF] border border-[#E6DCFF] px-4 py-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                >
                  <Target className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                    Update Preferences
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('security')}
                  className="rounded-xl bg-[#F4F0FF] hover:bg-[#ECE5FF] border border-[#E6DCFF] px-4 py-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                >
                  <Lock className="w-5 h-5 text-[#6846F5]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                    Change Password
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 3B. TAB: PERSONAL INFORMATION */}
      {activeSubTab === 'personal' && (
        <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
          {profileSaveFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                profileSaveFeedback.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : profileSaveFeedback.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {profileSaveFeedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{profileSaveFeedback.text}</span>
            </div>
          )}

          <form onSubmit={onSaveProfile} className="space-y-6 max-w-3xl">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold font-display text-[#10132D]">
                Personal Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your legal identity, contact number, citizenship, and current country of residence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prof-fullname"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Full Legal Name
                </label>
                <input
                  id="prof-fullname"
                  type="text"
                  value={profFullName}
                  onChange={(e) => setProfFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                  Account Email Address
                </label>
                <input
                  type="email"
                  value={activeUser?.email || ''}
                  disabled
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="prof-phone"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Phone / WhatsApp Number
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  placeholder="e.g. +233 24 000 0000"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                />
              </div>

              <CountrySelect
                id="prof-nationality"
                label="Nationality / Citizenship"
                mode="nationality"
                value={profNationality}
                onChange={setProfNationality}
              />

              <CountrySelect
                id="prof-residence"
                label="Current Country of Residence"
                mode="country"
                value={profResidence}
                onChange={setProfResidence}
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingProfile}
                rightIcon={<Save className="w-4 h-4" />}
                className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md"
              >
                {isSavingProfile ? 'Saving...' : 'Save Personal Information'}
              </Button>
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3C. TAB: ACADEMIC INFORMATION */}
      {activeSubTab === 'academic' && (
        <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
          {profileSaveFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                profileSaveFeedback.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : profileSaveFeedback.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {profileSaveFeedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{profileSaveFeedback.text}</span>
            </div>
          )}

          <form onSubmit={onSaveProfile} className="space-y-6 max-w-3xl">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold font-display text-[#10132D]">
                Academic Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your current or previous institution, completed/current level, and graduation year.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="prof-school"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Current / Previous School
                </label>
                <input
                  id="prof-school"
                  type="text"
                  value={profCurrentSchool}
                  onChange={(e) => setProfCurrentSchool(e.target.value)}
                  placeholder="e.g. University / High School"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="prof-edu-level"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Current Education Level
                </label>
                <select
                  id="prof-edu-level"
                  value={profEduLevel}
                  onChange={(e) => setProfEduLevel(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="">Select education level...</option>
                  <option value="Senior High School / WASSCE">Senior High School / WASSCE</option>
                  <option value="Senior High School (WASSCE / SSSCE / WAEC)">
                    Senior High School (WASSCE / SSSCE / WAEC)
                  </option>
                  <option value="Cambridge A-Levels / International Baccalaureate (IB)">
                    Cambridge A-Levels / IB
                  </option>
                  <option value="HND / Polytechnic / Diploma">HND / Polytechnic / Diploma</option>
                  <option value="Undergraduate (Currently Enrolled Student)">
                    Undergraduate (Currently Enrolled)
                  </option>
                  <option value="Bachelor's Degree (Completed / Graduate)">
                    Bachelor&apos;s Degree (Completed)
                  </option>
                  <option value="Master's Degree (Completed / In Progress)">
                    Master&apos;s Degree
                  </option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="prof-grad-year"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Expected / Completed Graduation Year
                </label>
                <select
                  id="prof-grad-year"
                  value={profGraduationYear}
                  onChange={(e) => setProfGraduationYear(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="">Select year...</option>
                  <option value="2022">2022</option>
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

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingProfile}
                rightIcon={<Save className="w-4 h-4" />}
                className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md"
              >
                {isSavingProfile ? 'Saving...' : 'Save Academic Information'}
              </Button>
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3D. TAB: STUDY PREFERENCES */}
      {activeSubTab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
          {profileSaveFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                profileSaveFeedback.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : profileSaveFeedback.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {profileSaveFeedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{profileSaveFeedback.text}</span>
            </div>
          )}

          <form onSubmit={onSaveProfile} className="space-y-6 max-w-3xl">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold font-display text-[#10132D]">
                Study Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your target degree, academic field, destinations, funding, and standardized testing plan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prof-intended-degree"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Intended Degree Level
                </label>
                <select
                  id="prof-intended-degree"
                  value={profIntendedDegree}
                  onChange={(e) => setProfIntendedDegree(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="">Select degree...</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Undergraduate (Bachelor's)">
                    Undergraduate (Bachelor&apos;s)
                  </option>
                  <option value="Master's (Postgraduate)">Master&apos;s Degree</option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                  <option value="Direct PhD (Post-Bachelor's)">
                    Direct PhD (Post-Bachelor&apos;s)
                  </option>
                  <option value="Professional Degree (Pre-Med, Law, MBA)">
                    Professional Degree (Pre-Med, Law, MBA)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="prof-field"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Field of Study
                </label>
                <input
                  id="prof-field"
                  type="text"
                  value={profFieldOfStudy}
                  onChange={(e) => setProfFieldOfStudy(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prof-funding"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Funding Preference
                </label>
                <select
                  id="prof-funding"
                  value={profFundingPreference}
                  onChange={(e) => setProfFundingPreference(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="">Select funding preference...</option>
                  <option value="Fully Funded Only">Fully Funded Only</option>
                  <option value="Partial & Merit Scholarships">
                    Partial &amp; Merit Scholarships
                  </option>
                  <option value="Self-Funded / Standard Tuition">
                    Self-Funded / Standard Tuition
                  </option>
                  <option value="All Funding Types">All Funding Types</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="prof-test"
                  className="block text-xs font-semibold text-[#10132D] mb-1.5"
                >
                  Standardized Test Preference
                </label>
                <select
                  id="prof-test"
                  value={profTestPreference}
                  onChange={(e) => setProfTestPreference(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="">Select test preference...</option>
                  <option value="Test-Optional / Waiver Preferred">
                    Test-Optional / Waiver Preferred
                  </option>
                  <option value="WAEC / WASSCE English Accepted">
                    WAEC / WASSCE English Accepted
                  </option>
                  <option value="Taking SAT / ACT">Taking SAT / ACT</option>
                  <option value="Taking GRE / GMAT">Taking GRE / GMAT</option>
                  <option value="IELTS / TOEFL Completed">
                    IELTS / TOEFL Completed
                  </option>
                </select>
              </div>
            </div>

            <div id="prof-destinations" tabIndex={-1} className="focus:outline-none">
              <CountryMultiSelect
                label="Preferred Study Destinations"
                selectedCountries={profDestinations}
                onChange={setProfDestinations}
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingProfile}
                rightIcon={<Save className="w-4 h-4" />}
                className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md"
              >
                {isSavingProfile ? 'Saving...' : 'Save Study Preferences'}
              </Button>
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3E. TAB: ACCOUNT & SECURITY */}
      {activeSubTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in duration-150">
          {/* Left: Account & Session Overview */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-[#6846F5]" />
              <h3 className="text-base font-bold font-display text-[#10132D]">
                Account Identity &amp; Security
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-[#FAF9FF] border border-[#ECE7FF] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6846F5]">
                  Registered Email
                </span>
                <p className="font-semibold text-[#10132D] break-all">
                  {activeUser?.email || sessionInfo?.email || 'Not provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Sign-In Method
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block">
                    {isLoadingSession
                      ? 'Checking...'
                      : isFederatedOnlyAccount
                      ? sessionInfo?.providerId || 'Federated Provider'
                      : 'Email & Password'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Email Status
                  </span>
                  <span
                    className={`text-xs font-bold block ${
                      sessionInfo?.emailVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {isLoadingSession
                      ? 'Checking...'
                      : sessionInfo?.emailVerified
                      ? 'Verified'
                      : 'Pending / Standard'}
                  </span>
                </div>
              </div>
            </div>

            {onOpenSecuritySettings && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onOpenSecuritySettings}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F0FF] hover:bg-[#ECE5FF] text-[#5B2EE6] text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Full Security &amp; Privacy Centre
                </button>
              </div>
            )}
          </div>

          {/* Right: Password Management (Provider-Aware) */}
          <div className="lg:col-span-7 space-y-5">
            {usesPasswordProvider ? (
              <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F0FF] text-[#6846F5] flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-[#10132D]">
                      Change Account Password
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      For your protection, updating your password re-authenticates your session with your current password first.
                    </p>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="prof-current-pwd"
                      className="block text-xs font-semibold text-[#10132D] mb-1.5"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="prof-current-pwd"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        aria-label={
                          showCurrentPassword
                            ? 'Hide current password'
                            : 'Show current password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="prof-new-pwd"
                        className="block text-xs font-semibold text-[#10132D] mb-1.5"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="prof-new-pwd"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={PASSWORD_MIN_LENGTH}
                          autoComplete="new-password"
                          placeholder="Min. 8 chars, letters & numbers"
                          className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label={
                            showNewPassword ? 'Hide new password' : 'Show new password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="prof-confirm-pwd"
                        className="block text-xs font-semibold text-[#10132D] mb-1.5"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="prof-confirm-pwd"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={PASSWORD_MIN_LENGTH}
                          autoComplete="new-password"
                          placeholder="Re-enter new password"
                          className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirm password'
                              : 'Show confirm password'
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isChangingPassword}
                      className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md"
                    >
                      {isChangingPassword ? (
                        <span className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Updating Password...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={handleSendPasswordReset}
                      disabled={isSendingReset}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#6846F5]" />
                      <span>
                        {isSendingReset
                          ? 'Sending Reset Email...'
                          : 'Send Password Reset Email'}
                      </span>
                    </button>
                  </div>
                </form>

                {resetError && (
                  <p className="text-xs text-rose-600 font-medium">{resetError}</p>
                )}
                {resetSuccess && (
                  <p className="text-xs text-emerald-700 font-medium">{resetSuccess}</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F0FF] text-[#6846F5] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold font-display text-[#10132D]">
                      External Provider Sign-In ({sessionInfo?.providerId})
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Your Campus Connect account signs in via an external identity provider rather than a local password. Password changes are managed directly through your sign-in provider.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
