/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Bell,
  Compass,
  Lock,
  Database,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  Download,
  Trash2,
  RefreshCw,
  LogOut,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Globe,
  Sliders,
  Smartphone,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Laptop,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  User,
  authService,
  StudentProfile,
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
  PASSWORD_MIN_LENGTH,
  validatePasswordPolicy,
} from '../../services/auth';
import {
  checkCurrentUserIsAdmin,
  fetchScholarshipAlertFromFirestore,
  getCurrentUserIdToken,
  syncScholarshipAlertToFirestore,
} from '../../services/firebase';
import { CountrySelect, CountryMultiSelect } from '../ui/CountrySelect';
import { Button } from '../ui/Button';

export type SettingsTab = 'account' | 'security' | 'notifications' | 'study' | 'privacy' | 'admin';

export interface StudentSettingsCentreProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onShowNotification: (msg: string) => void;
  opportunitiesCount: number;
  dbState: {
    isConnected: boolean;
    projectId: string;
    databaseId: string;
    isSyncing: boolean;
    error?: string;
  };
  onManualDbSync: () => Promise<void>;
  selectedUserCountry: string;
  onUpdateUserCountry: (country: string) => void;
  savedOpportunitiesCount: number;
  onClearSavedOpportunities?: () => void;
}

export const StudentSettingsCentre: React.FC<StudentSettingsCentreProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onShowNotification,
  opportunitiesCount,
  dbState,
  onManualDbSync,
  selectedUserCountry,
  onUpdateUserCountry,
  savedOpportunitiesCount,
  onClearSavedOpportunities,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Check admin authorization strictly via server-verified Firebase Auth custom claims (`admin === true`)
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setIsAuthorizedAdmin(false);
      return;
    }
    checkCurrentUserIsAdmin(false)
      .then((verifiedAdmin) => {
        if (active) {
          setIsAuthorizedAdmin(verifiedAdmin);
          if (!verifiedAdmin && activeTab === 'admin') {
            setActiveTab('account');
          }
        }
      })
      .catch(() => {
        if (active) {
          setIsAuthorizedAdmin(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user?.id, activeTab]);

  // =========================================================================
  // TAB 1: ACCOUNT & PROFILE STATE
  // =========================================================================
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [currentSchool, setCurrentSchool] = useState(user?.profile?.currentSchool || '');
  const [graduationYear, setGraduationYear] = useState(user?.profile?.graduationYear || '2026');
  const [nationality, setNationality] = useState(
    user?.profile?.nationality || (user?.country ? `${user.country} Citizen` : 'Ghanaian')
  );
  const [residence, setResidence] = useState(
    user?.profile?.countryOfResidence || user?.country || 'Ghana'
  );
  const [degreeLevel, setDegreeLevel] = useState(
    user?.profile?.intendedDegree || user?.degreeLevel || "Undergraduate (Bachelor's)"
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    user?.profile?.fieldOfStudy || user?.studyField || 'Computer Science & Software Engineering'
  );
  const [destinations, setDestinations] = useState<string[]>(
    user?.profile?.preferredDestinations || ['Ghana', 'United States', 'United Kingdom', 'Canada']
  );
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [copiedStudentId, setCopiedStudentId] = useState(false);

  // Clean student reference identifier (non-technical format for student view)
  const getFormattedStudentId = (id?: string) => {
    if (!id) return 'CC-2026-STU';
    const clean = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `CC-${clean.slice(0, 8)}`;
  };

  // Synchronize state with authenticated student's profile updates
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.profile?.phone || '');
      setCurrentSchool(user.profile?.currentSchool || '');
      setGraduationYear(user.profile?.graduationYear || '2026');
      setNationality(user.profile?.nationality || (user.country ? `${user.country} Citizen` : 'Ghanaian'));
      setResidence(user.profile?.countryOfResidence || user.country || 'Ghana');
      setDegreeLevel(user.profile?.intendedDegree || user.degreeLevel || "Undergraduate (Bachelor's)");
      setFieldOfStudy(user.profile?.fieldOfStudy || user.studyField || 'Computer Science & Software Engineering');
      setDestinations(user.profile?.preferredDestinations || ['Ghana', 'United States', 'United Kingdom', 'Canada']);
    }
  }, [user]);

  // =========================================================================
  // TAB 2: SECURITY STATE
  // =========================================================================
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState(user?.email || '');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const [sessionDetails, setSessionDetails] = useState<{
    userId: string;
    email: string;
    providerId: string;
    creationTime: string | null;
    lastSignInTime: string | null;
    emailVerified: boolean;
    isTokenValid: boolean;
    deviceSummary: string;
  } | null>(null);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Synchronize resetEmail when user email updates
  useEffect(() => {
    if (user?.email) {
      setResetEmail(user.email);
    }
  }, [user?.email]);

  // Load active session details when opening the Security tab
  useEffect(() => {
    if (activeTab === 'security') {
      authService.getActiveSessionDetails().then(setSessionDetails).catch(() => {});
    }
  }, [activeTab, user]);

  // =========================================================================
  // TAB 3: NOTIFICATIONS STATE
  // =========================================================================
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    deadlineAlerts: user?.profile?.notificationPreferences?.deadlineAlerts ?? true,
    savedUpdatesAlerts:
      user?.profile?.notificationPreferences?.savedUpdatesAlerts ??
      (user?.profile?.notificationPreferences?.scholarshipAlerts ?? true),
    trackerReminders: user?.profile?.notificationPreferences?.trackerReminders ?? true,
    admissionUpdates:
      user?.profile?.notificationPreferences?.admissionUpdates ??
      (user?.profile?.notificationPreferences?.waiverAlerts ?? true),
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationSuccessMessage, setNotificationSuccessMessage] = useState<string | null>(null);
  const [notificationErrorMessage, setNotificationErrorMessage] = useState<string | null>(null);

  // Synchronize notification preferences when authenticated student updates
  useEffect(() => {
    if (user?.profile?.notificationPreferences) {
      const prefs = user.profile.notificationPreferences;
      setNotificationPrefs({
        deadlineAlerts: prefs.deadlineAlerts ?? true,
        savedUpdatesAlerts: prefs.savedUpdatesAlerts ?? (prefs.scholarshipAlerts ?? true),
        trackerReminders: prefs.trackerReminders ?? true,
        admissionUpdates: prefs.admissionUpdates ?? (prefs.waiverAlerts ?? true),
      });
    }
  }, [user]);

  // Email Opportunity Alerts state (synced with backend Firestore + email provider)
  const EMAIL_ALERT_CATEGORIES = [
    { id: 'admissions', label: 'University Admissions' },
    { id: 'fully-funded', label: 'Fully Funded Scholarships' },
    { id: 'partial-aid', label: 'Partial Aid & Grants' },
    { id: 'fee-waiver', label: 'Application Fee Waivers' },
    { id: 'sat-optional', label: 'SAT-Free & Test-Optional' },
    { id: 'international', label: 'International Study' },
    { id: 'graduate', label: 'Postgraduate & Grants' },
    { id: 'deadlines', label: 'Upcoming Deadlines' },
  ] as const;

  const [emailAlertEmail, setEmailAlertEmail] = useState(user?.email || '');
  const [emailAlertCategories, setEmailAlertCategories] = useState<string[]>([
    'admissions',
    'fully-funded',
    'fee-waiver',
    'deadlines',
  ]);
  const [emailAlertFrequency, setEmailAlertFrequency] = useState<'weekly' | 'immediate'>('weekly');
  const [emailAlertConsentStatus, setEmailAlertConsentStatus] = useState<
    'none' | 'pending' | 'confirmed' | 'unsubscribed'
  >('none');
  const [emailDeliveryReady, setEmailDeliveryReady] = useState(false);
  const [firestoreAlertsReady, setFirestoreAlertsReady] = useState(true);
  const [isLoadingEmailAlerts, setIsLoadingEmailAlerts] = useState(false);
  const [isSavingEmailAlerts, setIsSavingEmailAlerts] = useState(false);
  const [emailAlertSuccess, setEmailAlertSuccess] = useState<string | null>(null);
  const [emailAlertError, setEmailAlertError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !emailAlertEmail) {
      setEmailAlertEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    let mounted = true;
    const loadEmailAlertState = async () => {
      setIsLoadingEmailAlerts(true);
      try {
        const idToken = await getCurrentUserIdToken();
        const headers: Record<string, string> = {};
        if (idToken) headers.Authorization = `Bearer ${idToken}`;
        const res = await fetch('/api/newsletter/subscription', { headers });
        const data = await res.json().catch(() => null);
        if (mounted && data) {
          setEmailDeliveryReady(Boolean(data.emailDeliveryConfigured));
          if (typeof data.firestoreConfigured === 'boolean') {
            setFirestoreAlertsReady(data.firestoreConfigured);
          }
          if (data.subscribed && data.subscription) {
            setEmailAlertEmail(data.subscription.email || user?.email || '');
            setEmailAlertCategories(
              Array.isArray(data.subscription.preferences) && data.subscription.preferences.length > 0
                ? data.subscription.preferences.filter((p: string) => p !== 'all')
                : ['admissions', 'fully-funded', 'fee-waiver', 'deadlines']
            );
            setEmailAlertFrequency(data.subscription.frequency === 'immediate' ? 'immediate' : 'weekly');
            setEmailAlertConsentStatus(data.subscription.consentStatus || 'pending');
            setIsLoadingEmailAlerts(false);
            return;
          }
        }

        // Fall back to user profile mirror if server subscription not linked yet
        const profileMirror = await fetchScholarshipAlertFromFirestore();
        if (mounted && profileMirror) {
          setEmailAlertEmail(profileMirror.email || user?.email || '');
          setEmailAlertCategories(
            profileMirror.preferences.filter((p) => p !== 'all')
          );
          if (profileMirror.frequency) setEmailAlertFrequency(profileMirror.frequency);
          setEmailAlertConsentStatus(
            profileMirror.consentStatus || (profileMirror.subscribed ? 'confirmed' : 'unsubscribed')
          );
        }
      } catch {
        // Ignore transient status fetch issues
      } finally {
        if (mounted) setIsLoadingEmailAlerts(false);
      }
    };
    void loadEmailAlertState();
    return () => {
      mounted = false;
    };
  }, [activeTab, user?.id]);

  // =========================================================================
  // TAB 4: STUDY PREFERENCES STATE
  // =========================================================================
  const [studyDestinations, setStudyDestinations] = useState<string[]>(
    user?.profile?.preferredDestinations && user.profile.preferredDestinations.length > 0
      ? user.profile.preferredDestinations
      : ['Ghana', 'United States', 'United Kingdom', 'Canada']
  );
  const [studyDegreeLevel, setStudyDegreeLevel] = useState<string>(
    user?.profile?.intendedDegree || user?.degreeLevel || "Undergraduate (Bachelor's)"
  );
  const [studyField, setStudyField] = useState<string>(
    user?.profile?.fieldOfStudy || user?.studyField || 'Computer Science & Software Engineering'
  );
  const [studyFieldsList, setStudyFieldsList] = useState<string[]>(
    user?.profile?.preferredFieldsOfStudy && user.profile.preferredFieldsOfStudy.length > 0
      ? user.profile.preferredFieldsOfStudy
      : [user?.profile?.fieldOfStudy || user?.studyField || 'Computer Science & Software Engineering']
  );
  const [studyMode, setStudyMode] = useState<'on-campus' | 'online' | 'hybrid'>(
    (user?.profile?.studyModePreference as any) || 'on-campus'
  );
  const [fundingType, setFundingType] = useState<'fully_funded' | 'partially_funded' | 'self_funded' | 'all'>(
    (user?.profile?.fundingTypePreference as any) ||
    (user?.profile?.fundingPreference?.includes('Fully')
      ? 'fully_funded'
      : user?.profile?.fundingPreference?.includes('Partial')
      ? 'partially_funded'
      : user?.profile?.fundingPreference?.includes('Self')
      ? 'self_funded'
      : 'all')
  );
  const [studyPriorityCountry, setStudyPriorityCountry] = useState<string>(
    selectedUserCountry || user?.profile?.countryOfResidence || user?.country || 'Ghana'
  );
  const [isSavingStudyPrefs, setIsSavingStudyPrefs] = useState(false);
  const [studyPrefsSuccess, setStudyPrefsSuccess] = useState<string | null>(null);
  const [studyPrefsError, setStudyPrefsError] = useState<string | null>(null);

  // Synchronize study preferences when authenticated student updates
  useEffect(() => {
    if (user?.profile) {
      if (user.profile.preferredDestinations && user.profile.preferredDestinations.length > 0) {
        setStudyDestinations(user.profile.preferredDestinations);
      }
      if (user.profile.intendedDegree) {
        setStudyDegreeLevel(user.profile.intendedDegree);
      }
      if (user.profile.fieldOfStudy) {
        setStudyField(user.profile.fieldOfStudy);
      }
      if (user.profile.preferredFieldsOfStudy && user.profile.preferredFieldsOfStudy.length > 0) {
        setStudyFieldsList(user.profile.preferredFieldsOfStudy);
      } else if (user.profile.fieldOfStudy) {
        setStudyFieldsList([user.profile.fieldOfStudy]);
      }
      if (user.profile.studyModePreference) {
        setStudyMode(user.profile.studyModePreference as any);
      }
      if (user.profile.fundingTypePreference) {
        setFundingType(user.profile.fundingTypePreference as any);
      } else if (user.profile.fundingPreference) {
        if (user.profile.fundingPreference.includes('Fully')) setFundingType('fully_funded');
        else if (user.profile.fundingPreference.includes('Partial')) setFundingType('partially_funded');
        else if (user.profile.fundingPreference.includes('Self')) setFundingType('self_funded');
        else setFundingType('all');
      }
      if (user.profile.countryOfResidence) {
        setStudyPriorityCountry(user.profile.countryOfResidence);
      }
    }
  }, [user]);

  // =========================================================================
  // TAB 5: PRIVACY & ACCOUNT MANAGEMENT STATE
  // =========================================================================
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirmStep, setShowDeleteConfirmStep] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [accountDeletionError, setAccountDeletionError] = useState<string | null>(null);
  const [accountDeletionSuccess, setAccountDeletionSuccess] = useState<string | null>(null);

  const [isSigningOutAllSessions, setIsSigningOutAllSessions] = useState(false);
  const [signOutAllSuccess, setSignOutAllSuccess] = useState<string | null>(null);
  const [signOutAllError, setSignOutAllError] = useState<string | null>(null);

  const [isExportingData, setIsExportingData] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [isPrivacyPolicyExpanded, setIsPrivacyPolicyExpanded] = useState(false);

  // Handle Copy Student Reference ID
  const handleCopyStudentId = () => {
    const formattedId = getFormattedStudentId(user?.id);
    navigator.clipboard.writeText(formattedId);
    setCopiedStudentId(true);
    setTimeout(() => setCopiedStudentId(false), 2000);
    onShowNotification('Student Reference ID copied to clipboard.');
  };

  // Handle Save Account & Profile
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);

    // 1. Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setAccountError('Please enter your full legal name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setAccountError('Please enter a valid email address.');
      return;
    }

    if (!nationality.trim()) {
      setAccountError('Please select your nationality / citizenship.');
      return;
    }

    if (!residence.trim()) {
      setAccountError('Please select your current country of residence.');
      return;
    }

    if (!degreeLevel.trim()) {
      setAccountError('Please select your target degree level.');
      return;
    }

    if (!fieldOfStudy.trim() || fieldOfStudy.trim().length < 2) {
      setAccountError('Please enter your academic field of study.');
      return;
    }

    if (!graduationYear.trim()) {
      setAccountError('Please select an expected graduation year.');
      return;
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      setAccountError('Please select at least one preferred study destination.');
      return;
    }

    setIsSavingAccount(true);
    try {
      const res = await authService.updateAccountAndProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        profileData: {
          nationality: nationality.trim(),
          countryOfResidence: residence.trim(),
          intendedDegree: degreeLevel.trim(),
          fieldOfStudy: fieldOfStudy.trim(),
          graduationYear: graduationYear.trim(),
          preferredDestinations: destinations,
          phone: phone.trim(),
          currentSchool: currentSchool.trim(),
        },
      });

      if (!res.success || !res.user) {
        setAccountError(res.error || 'Failed to update account. Please try again.');
        setIsSavingAccount(false);
        return;
      }

      onUpdateUser(res.user);
      if (res.user.profile?.countryOfResidence) {
        onUpdateUserCountry(res.user.profile.countryOfResidence);
      }

      const successMsg = res.warning
        ? `Profile updated successfully! Note: ${res.warning}`
        : 'Profile and account details saved successfully and synchronized with your cloud database.';
      setAccountSuccess(successMsg);
      onShowNotification('Account & Profile updated successfully.');
    } catch (err: any) {
      setAccountError(err?.message || 'An unexpected error occurred while saving your profile.');
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleResetAccount = () => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.profile?.phone || '');
      setCurrentSchool(user.profile?.currentSchool || '');
      setGraduationYear(user.profile?.graduationYear || '2026');
      setNationality(user.profile?.nationality || (user.country === 'Ghana' ? 'Ghanaian' : 'Ghanaian'));
      setResidence(user.profile?.countryOfResidence || user.country || 'Ghana');
      setDegreeLevel(user.profile?.intendedDegree || user.degreeLevel || "Undergraduate (Bachelor's)");
      setFieldOfStudy(user.profile?.fieldOfStudy || user.studyField || 'Computer Science & Software Engineering');
      setDestinations(user.profile?.preferredDestinations || ['Ghana', 'United States', 'United Kingdom', 'Canada']);
    }
    setAccountError(null);
    setAccountSuccess('Reverted unsaved changes to stored profile data.');
  };

  // Handle Change Password Securely
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (!currentPassword) {
      setPasswordChangeError('Please enter your current password.');
      return;
    }

    const pwdCheck = validatePasswordPolicy(newPassword);
    if (!pwdCheck.valid) {
      setPasswordChangeError(pwdCheck.error || 'New password does not meet security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New password and password confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordChangeError('Your new password must be different from your current password.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (!res.success) {
        setPasswordChangeError(res.error || 'Failed to update password. Please check your credentials.');
        return;
      }

      setPasswordChangeSuccess(
        'Password updated securely! For your safety, other active sessions have been invalidated.'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowNotification('Password successfully updated.');
    } catch (err: any) {
      setPasswordChangeError(err?.message || 'An unexpected error occurred while updating your password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Send Password Reset Link to Registered Email
  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    const targetEmail = resetEmail.trim();
    if (!targetEmail) {
      setResetError('Please enter your account email address.');
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await authService.requestPasswordReset(targetEmail);
      if (res.success) {
        setResetSuccess(
          res.message ||
            `Official password reset link sent to ${targetEmail}. Please check your inbox and spam folders.`
        );
        onShowNotification('Password reset link dispatched.');
      } else {
        setResetError(res.error || 'Unable to dispatch password reset email. Please try again.');
      }
    } catch (err: any) {
      setResetError(err?.message || 'Failed to connect to authentication recovery service.');
    } finally {
      setIsSendingReset(false);
    }
  };

  // Handle Verify & Refresh Session Token
  const handleRefreshSessionToken = async () => {
    setIsRefreshingSession(true);
    setSessionNotice(null);
    try {
      const res = await authService.refreshSessionToken();
      if (res.success) {
        const details = await authService.getActiveSessionDetails();
        setSessionDetails(details);
        setSessionNotice('Session token refreshed and verified securely.');
        onShowNotification('Session token refreshed.');
      } else {
        setSessionNotice(res.error || 'Failed to refresh session token.');
      }
    } catch (err: any) {
      setSessionNotice(err?.message || 'Failed to refresh token.');
    } finally {
      setIsRefreshingSession(false);
    }
  };

  // Handle Secure Sign Out
  const handleSecureSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authService.logout();
      onShowNotification('Signed out of student account securely.');
      onLogout();
    } catch {
      onLogout();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Handle Save Notification Preferences
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    setNotificationSuccessMessage(null);
    setNotificationErrorMessage(null);
    try {
      const res = await authService.updateNotificationPreferences(notificationPrefs);
      if (res.success && res.user) {
        onUpdateUser(res.user);
        setNotificationSuccessMessage(
          'Notification preferences saved to your student profile and synchronized with the cloud database.'
        );
        onShowNotification('Notification preferences saved successfully.');
      } else {
        setNotificationErrorMessage(res.error || 'Failed to save notification preferences.');
      }
    } catch (err: any) {
      setNotificationErrorMessage(err?.message || 'Failed to save notification preferences.');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // Handle Reset Notification Preferences to Recommended Defaults
  const handleResetNotifications = () => {
    setNotificationPrefs({
      deadlineAlerts: true,
      savedUpdatesAlerts: true,
      trackerReminders: true,
      admissionUpdates: true,
    });
    setNotificationSuccessMessage('Reset toggles to default recommended settings. Remember to click "Save Notification Preferences" to persist changes.');
  };

  const handleToggleEmailAlertCategory = (id: string) => {
    setEmailAlertError(null);
    setEmailAlertSuccess(null);
    setEmailAlertCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveEmailAlertSubscription = async () => {
    setEmailAlertError(null);
    setEmailAlertSuccess(null);

    const targetEmail = (emailAlertEmail || user?.email || '').trim().toLowerCase();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(targetEmail)) {
      setEmailAlertError('Please enter a valid email address for opportunity alerts.');
      return;
    }

    if (emailAlertCategories.length === 0) {
      setEmailAlertError('Select at least one email opportunity alert category.');
      return;
    }

    setIsSavingEmailAlerts(true);
    try {
      const idToken = await getCurrentUserIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) headers.Authorization = `Bearer ${idToken}`;

      const isAlreadyActiveOrPending =
        emailAlertConsentStatus === 'confirmed' || emailAlertConsentStatus === 'pending';

      const endpoint = isAlreadyActiveOrPending
        ? '/api/newsletter/preferences'
        : '/api/newsletter/subscribe';
      const method = isAlreadyActiveOrPending ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify({
          email: targetEmail,
          preferences: emailAlertCategories,
          frequency: emailAlertFrequency,
          preferredDestinations: destinations,
          intendedDegree: degreeLevel,
          fieldOfStudy,
        }),
      });

      const data = await res.json().catch(() => null);
      if (typeof data?.emailDeliveryConfigured === 'boolean') {
        setEmailDeliveryReady(data.emailDeliveryConfigured);
      }
      if (typeof data?.firestoreConfigured === 'boolean') {
        setFirestoreAlertsReady(data.firestoreConfigured);
      }

      if (!res.ok) {
        setEmailAlertError(data?.error || 'Could not update your email opportunity alerts right now.');
        return;
      }

      const nextConsent = data?.subscription?.consentStatus || 'pending';
      setEmailAlertConsentStatus(nextConsent);

      await syncScholarshipAlertToFirestore({
        subscribed: nextConsent === 'confirmed',
        email: targetEmail,
        preferences: emailAlertCategories,
        consentStatus: nextConsent,
        frequency: emailAlertFrequency,
      }).catch(() => {});

      setEmailAlertSuccess(
        data?.message || 'Email opportunity alert preferences updated.'
      );
      onShowNotification('Email opportunity alert preferences saved.');
    } catch (err: any) {
      setEmailAlertError(err?.message || 'Failed to update email opportunity alerts.');
    } finally {
      setIsSavingEmailAlerts(false);
    }
  };

  const handleUnsubscribeEmailAlerts = async () => {
    setEmailAlertError(null);
    setEmailAlertSuccess(null);
    setIsSavingEmailAlerts(true);
    try {
      const idToken = await getCurrentUserIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) headers.Authorization = `Bearer ${idToken}`;

      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok && res.status !== 404) {
        setEmailAlertError(data?.error || 'Unable to unsubscribe right now.');
        return;
      }

      setEmailAlertConsentStatus('unsubscribed');
      await syncScholarshipAlertToFirestore({
        subscribed: false,
        email: (emailAlertEmail || user?.email || '').trim().toLowerCase(),
        preferences: emailAlertCategories,
        consentStatus: 'unsubscribed',
        frequency: emailAlertFrequency,
      }).catch(() => {});

      setEmailAlertSuccess('You have been unsubscribed from Campus Connect email opportunity alerts.');
      onShowNotification('Unsubscribed from email opportunity alerts.');
    } catch (err: any) {
      setEmailAlertError(err?.message || 'Unable to unsubscribe right now.');
    } finally {
      setIsSavingEmailAlerts(false);
    }
  };

  // Handle Toggle Destination
  const handleToggleDestination = (countryName: string) => {
    if (destinations.includes(countryName)) {
      if (destinations.length > 1) {
        setDestinations(destinations.filter((d) => d !== countryName));
      } else {
        onShowNotification('Please select at least one study destination.');
      }
    } else {
      setDestinations([...destinations, countryName]);
    }
  };

  // Handle Save Study Preferences
  const handleSaveStudyPrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudyPrefsError(null);
    setStudyPrefsSuccess(null);

    if (!studyDestinations || studyDestinations.length === 0) {
      setStudyPrefsError('Please select at least one preferred study destination country.');
      return;
    }

    if (!studyDegreeLevel.trim()) {
      setStudyPrefsError('Please select your target degree level.');
      return;
    }

    if (!studyField.trim()) {
      setStudyPrefsError('Please specify your preferred academic field of study.');
      return;
    }

    setIsSavingStudyPrefs(true);
    try {
      const res = await authService.updateStudyPreferences({
        preferredDestinations: studyDestinations,
        intendedDegree: studyDegreeLevel.trim(),
        fieldOfStudy: studyField.trim(),
        preferredFieldsOfStudy: studyFieldsList.length > 0 ? studyFieldsList : [studyField.trim()],
        studyModePreference: studyMode,
        fundingTypePreference: fundingType,
        priorityCountry: studyPriorityCountry,
      });

      if (!res.success || !res.user) {
        setStudyPrefsError(res.error || 'Failed to save study preferences. Please try again.');
        setIsSavingStudyPrefs(false);
        return;
      }

      onUpdateUser(res.user);
      if (studyPriorityCountry) {
        onUpdateUserCountry(studyPriorityCountry);
      }

      const priorityLabel = studyPriorityCountry || studyDestinations[0];
      setStudyPrefsSuccess(
        `Study preferences saved to your student profile and synchronized with the cloud database. Universities in ${priorityLabel} and matching ${studyDegreeLevel} programs will appear first.`
      );
      onShowNotification('Study preferences saved successfully.');
    } catch (err: any) {
      setStudyPrefsError(err?.message || 'Failed to save study preferences.');
    } finally {
      setIsSavingStudyPrefs(false);
    }
  };

  // Handle Reset Study Preferences
  const handleResetStudyPrefs = () => {
    setStudyPrefsError(null);
    setStudyPrefsSuccess(null);
    if (user?.profile) {
      setStudyDestinations(
        user.profile.preferredDestinations && user.profile.preferredDestinations.length > 0
          ? user.profile.preferredDestinations
          : ['Ghana', 'United States', 'United Kingdom', 'Canada']
      );
      setStudyDegreeLevel(user.profile.intendedDegree || "Undergraduate (Bachelor's)");
      setStudyField(user.profile.fieldOfStudy || 'Computer Science & Software Engineering');
      setStudyFieldsList(
        user.profile.preferredFieldsOfStudy && user.profile.preferredFieldsOfStudy.length > 0
          ? user.profile.preferredFieldsOfStudy
          : [user.profile.fieldOfStudy || 'Computer Science & Software Engineering']
      );
      setStudyMode((user.profile.studyModePreference as any) || 'on-campus');
      if (user.profile.fundingTypePreference) {
        setFundingType(user.profile.fundingTypePreference as any);
      } else if (user.profile.fundingPreference) {
        if (user.profile.fundingPreference.includes('Fully')) setFundingType('fully_funded');
        else if (user.profile.fundingPreference.includes('Partial')) setFundingType('partially_funded');
        else if (user.profile.fundingPreference.includes('Self')) setFundingType('self_funded');
        else setFundingType('all');
      } else {
        setFundingType('all');
      }
      setStudyPriorityCountry(
        selectedUserCountry || user.profile.countryOfResidence || user.country || 'Ghana'
      );
    }
    onShowNotification('Study preferences reset to saved profile values.');
  };

  // Helper to toggle field of study tags
  const handleToggleStudyField = (field: string) => {
    if (studyFieldsList.includes(field)) {
      if (studyFieldsList.length > 1) {
        const next = studyFieldsList.filter((f) => f !== field);
        setStudyFieldsList(next);
        setStudyField(next[0]);
      } else {
        onShowNotification('Please keep at least one field of study.');
      }
    } else {
      const next = [...studyFieldsList, field];
      setStudyFieldsList(next);
      setStudyField(field);
    }
  };

  // Handle Download Student Personal Data (Data Portability)
  const handleExportData = () => {
    setIsExportingData(true);
    setExportSuccessMessage(null);
    try {
      const exportObject = {
        complianceMetadata: {
          documentTitle: 'Campus Connect - Verified Student Personal Data Archive',
          exportTimestamp: new Date().toISOString(),
          complianceStandards: [
            'GDPR Article 20 (Right to Data Portability)',
            'FERPA Student Privacy Protection',
          ],
          platform: 'Campus Connect - Official Global University Directory & Admissions Portal',
          officialWebsite: 'https://campusconnect.edu',
        },
        studentAccount: {
          studentReferenceId: getFormattedStudentId(user?.id),
          legalName: user?.fullName || 'Scholar',
          email: user?.email || '',
          accountCreatedAt: user?.createdAt || null,
          role: isAuthorizedAdmin ? 'admin' : 'student',
        },
        academicProfile: {
          nationality: user?.profile?.nationality || 'Ghanaian',
          countryOfResidence: user?.profile?.countryOfResidence || user?.country || 'Ghana',
          preferredDestinations: user?.profile?.preferredDestinations || [],
          educationLevel: user?.profile?.educationLevel || '',
          intendedDegree: user?.profile?.intendedDegree || user?.degreeLevel || '',
          fieldOfStudy: user?.profile?.fieldOfStudy || user?.studyField || '',
          preferredFieldsOfStudy: user?.profile?.preferredFieldsOfStudy || [],
          studyModePreference: user?.profile?.studyModePreference || 'on-campus',
          fundingTypePreference: user?.profile?.fundingTypePreference || 'all',
          graduationYear: user?.profile?.graduationYear || '',
          contactPhone: user?.profile?.phone || '',
          currentInstitution: user?.profile?.currentSchool || '',
          onboardingCompleted: user?.profile?.onboardingCompleted ?? true,
        },
        notificationPreferences: user?.profile?.notificationPreferences || {
          deadlineAlerts: true,
          savedUpdatesAlerts: true,
          trackerReminders: true,
          admissionUpdates: true,
        },
        portfolioRecords: {
          savedOpportunitiesCount: user?.savedOpportunities?.length || 0,
          savedOpportunityIds: user?.savedOpportunities || [],
          applicationTrackerStages: user?.applicationTracker || {},
        },
      };

      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      const safeDate = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `campus-connect-personal-data-${safeDate}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccessMessage('Complete personal data archive prepared and downloaded successfully.');
      onShowNotification('Personal data copy downloaded (JSON).');
    } catch {
      onShowNotification('Failed to generate personal data export.');
    } finally {
      setIsExportingData(false);
    }
  };

  // Handle Sign Out from All Supported Sessions
  const handleSignOutAllSessions = async () => {
    setIsSigningOutAllSessions(true);
    setSignOutAllError(null);
    setSignOutAllSuccess(null);
    try {
      await authService.logoutAllSessions();
      setSignOutAllSuccess('Signed out of all active sessions securely.');
      onShowNotification('Signed out of all active sessions.');
      onLogout();
    } catch (err: any) {
      setSignOutAllError(err?.message || 'Failed to sign out of all sessions.');
    } finally {
      setIsSigningOutAllSessions(false);
    }
  };

  // Handle Permanent Account Deletion
  const handleDeleteAccount = async () => {
    setAccountDeletionError(null);
    setAccountDeletionSuccess(null);

    if (deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') {
      setAccountDeletionError('Please type "DELETE" into the confirmation box to proceed.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await authService.deleteAccount();
      if (!res.success) {
        if (res.requiresReauth) {
          setAccountDeletionError(
            'For your security, re-authentication is required. Please sign out and sign back in to delete your account.'
          );
        } else {
          setAccountDeletionError(res.error || 'Failed to delete account. Please try again.');
        }
        setIsDeletingAccount(false);
        return;
      }

      setAccountDeletionSuccess('Your student account and all personal records have been permanently erased.');
      onShowNotification('Account permanently deleted.');
      setTimeout(() => {
        onLogout();
      }, 1500);
    } catch (err: any) {
      setAccountDeletionError(err?.message || 'Failed to delete account.');
      setIsDeletingAccount(false);
    }
  };

  // Handle Clear Target List
  const handleConfirmClearSaved = () => {
    if (onClearSavedOpportunities) {
      onClearSavedOpportunities();
    } else {
      const updated = authService.clearSavedOpportunities();
      if (updated) {
        onUpdateUser(updated);
      }
    }
    setShowClearConfirm(false);
    onShowNotification('Target list cleared.');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden animate-in fade-in duration-150">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-6 lg:p-8 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8F9FD] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-[#6846F5] bg-[#F0EDFF] border border-[#DDD6FE]">
              <UserCheck className="w-3.5 h-3.5 text-[#6846F5]" />
              <span>Student Account Centre</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-[#10132D] tracking-tight">
              Settings &amp; Account Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your personal student details, credentials, notification alerts, and international study criteria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 sm:gap-2 mt-5 pt-2 overflow-x-auto scrollbar-none border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'account', label: 'Account & Profile', icon: <UserCheck className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Access', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'study', label: 'Study Preferences', icon: <Compass className="w-4 h-4" /> },
            { id: 'privacy', label: 'Privacy & Data', icon: <Lock className="w-4 h-4" /> },
            ...(isAuthorizedAdmin
              ? [{ id: 'admin', label: 'Admin Controls', icon: <Database className="w-4 h-4" /> }]
              : []),
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer border-b-2 -mb-[2px] active:scale-[0.98] ${
                  isActive
                    ? 'text-[#6846F5] border-[#6846F5] bg-white'
                    : 'text-slate-500 hover:text-slate-900 border-transparent hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'admin' && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-[#6846F5]">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* ========================================================================= */}
        {/* TAB 1: ACCOUNT & PROFILE */}
        {/* ========================================================================= */}
        {activeTab === 'account' && (
          <form onSubmit={handleSaveAccount} className="space-y-6 max-w-2xl animate-in fade-in duration-150">
            {/* Feedback Banners */}
            {accountError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-rose-900">Unable to save profile</p>
                  <p className="text-xs text-rose-700 leading-relaxed">{accountError}</p>
                </div>
              </div>
            )}

            {accountSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-900">Profile Updated</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">{accountSuccess}</p>
                </div>
              </div>
            )}

            {/* Scholar Identity Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FD] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#6846F5] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {fullName ? fullName.substring(0, 2).toUpperCase() : 'SC'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#10132D]">{fullName || 'Campus Connect Scholar'}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Student</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{email || user?.email || 'scholar@campusconnect.edu'}</p>
                </div>
              </div>

              {/* Student Reference ID with copy button */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-600">
                  <span className="text-slate-400">Student ID: </span>
                  <span className="font-semibold text-slate-700">{getFormattedStudentId(user?.id)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyStudentId}
                  className="p-1 text-slate-400 hover:text-[#6846F5] transition-colors cursor-pointer"
                  title="Copy Student Reference ID"
                >
                  {copiedStudentId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Section 1: Personal & Contact Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                Personal &amp; Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Account Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="scholar@campusconnect.edu"
                      required
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Updated across your student profile and account credentials where supported.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Phone / WhatsApp Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Used for admissions WhatsApp alerts and deadline notices.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Current School or Institution (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentSchool}
                      onChange={(e) => setCurrentSchool(e.target.value)}
                      placeholder="e.g. Achimota School / Prempeh College"
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic Standing & Citizenship */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                Academic Profile &amp; Location
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CountrySelect
                  id="account-nationality"
                  label="Nationality / Citizenship"
                  mode="nationality"
                  value={nationality}
                  onChange={setNationality}
                  required
                />

                <CountrySelect
                  id="account-residence"
                  label="Country of Residence"
                  mode="country"
                  value={residence}
                  onChange={(val) => {
                    setResidence(val);
                    setStudyPriorityCountry(val);
                  }}
                  required
                  helperText="Universities in this country appear first by default."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Target Degree Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  >
                    <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor&apos;s)</option>
                    <option value="Postgraduate (Master's)">Postgraduate (Master&apos;s)</option>
                    <option value="Doctoral (Ph.D.)">Doctoral (Ph.D.)</option>
                    <option value="Diploma & Certificate">Diploma &amp; Certificate</option>
                    <option value="High School Diploma">High School Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Academic Field of Study <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science, Public Health, Economics"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                  Expected Completion / Graduation Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full sm:w-64 h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                >
                  <option value="2024">2024 (Completed)</option>
                  <option value="2025">2025 (Graduating)</option>
                  <option value="2026">2026 (Upcoming Intake)</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032+">2032+</option>
                </select>
              </div>
            </div>

            {/* Section 3: Preferred Study Destinations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                Preferred Study Destinations
              </h4>
              <p className="text-xs text-slate-500">
                Select the destination countries where you are targeting admissions, scholarships, and visa opportunities.
              </p>
              <CountryMultiSelect
                label=""
                selectedCountries={destinations}
                onChange={setDestinations}
              />
            </div>

            {/* Form Action Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingAccount}
                className="w-full sm:w-auto min-h-[44px] justify-center bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold px-6 inline-flex items-center gap-2"
              >
                {isSavingAccount ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={handleResetAccount}
                disabled={isSavingAccount}
                className="w-full sm:w-auto min-h-[44px] justify-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SECURITY & ACCESS */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
            {/* 1. Change Password Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6846F5] flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">Change Account Password</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update your account password securely. Re-authenticating with your current password is required for your protection.
                  </p>
                </div>
              </div>

              {/* Password Change Feedback Banners */}
              {passwordChangeError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-900">Password Update Error</p>
                    <p className="text-rose-700 leading-relaxed">{passwordChangeError}</p>
                  </div>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-emerald-900">Password Updated</p>
                    <p className="text-emerald-700 leading-relaxed">{passwordChangeSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      autoComplete="current-password"
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 chars (letters & numbers)"
                        required
                        minLength={PASSWORD_MIN_LENGTH}
                        autoComplete="new-password"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showNewPassword ? 'Hide new password' : 'Show new password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Minimum 8 characters, including letters and numbers. Must differ from current password.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        minLength={PASSWORD_MIN_LENGTH}
                        autoComplete="new-password"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto min-h-[44px] justify-center bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold px-6 inline-flex items-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* 2. Reset Forgotten Password via Email Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">Reset Forgotten Password</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Forgot your password? Send a secure password reset link directly to your registered email address.
                  </p>
                </div>
              </div>

              {/* Reset Feedback Banners */}
              {resetError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-900">Reset Error</p>
                    <p className="text-rose-700 leading-relaxed">{resetError}</p>
                  </div>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-emerald-900">Reset Link Dispatched</p>
                    <p className="text-emerald-700 leading-relaxed">{resetSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendPasswordReset} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Registered Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@domain.edu"
                      required
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    type="submit"
                    variant="outline"
                    size="md"
                    disabled={isSendingReset}
                    className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-800 inline-flex items-center gap-2"
                  >
                    {isSendingReset ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Dispatching Email...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* 3. Active Session & Device Management Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F9FD] border border-[#E2E8F0] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#6846F5]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Login Session &amp; Token Security
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Active &amp; Verified</span>
                </span>
              </div>

              {sessionNotice && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-[#5835E5] flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#6846F5] shrink-0" />
                  <span>{sessionNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Current Device &amp; Browser</span>
                  <p className="font-semibold text-[#10132D]">
                    {sessionDetails?.deviceSummary || 'Web Browser (Standard)'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Sign-in Method</span>
                  <p className="font-semibold text-[#10132D]">
                    {sessionDetails?.providerId === 'password'
                      ? 'Email & Password'
                      : 'Secure Account Sign-in'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Last Authenticated</span>
                  <p className="font-semibold text-slate-700">
                    {sessionDetails?.lastSignInTime
                      ? new Date(sessionDetails.lastSignInTime).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Current Session'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Account Created</span>
                  <p className="font-semibold text-slate-700">
                    {sessionDetails?.creationTime
                      ? new Date(sessionDetails.creationTime).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Verified Scholar'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">Security Notice: </span>
                Changing your password automatically revokes refresh tokens on all other devices and forces re-authentication.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleRefreshSessionToken}
                  disabled={isRefreshingSession}
                  className="w-full sm:w-auto min-h-[44px] justify-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSession ? 'animate-spin text-[#6846F5]' : ''}`} />
                  <span>{isRefreshingSession ? 'Refreshing Token...' : 'Verify & Refresh Session Token'}</span>
                </button>
              </div>
            </div>

            {/* 4. Secure Sign Out Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-rose-100 space-y-3 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-rose-900">Sign Out of Account</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Safely terminate your current student session. All session tokens and cached credentials on this device will be cleared immediately.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-slate-500 text-xs break-all">
                  Signed in as: <strong className="text-slate-800">{user?.fullName || 'Scholar'}</strong> ({user?.email})
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleSecureSignOut}
                  disabled={isSigningOut}
                  leftIcon={<LogOut className="w-4 h-4 text-rose-600" />}
                  className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out Securely'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTIFICATIONS & ALERTS */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
            <form onSubmit={handleSaveNotifications} className="space-y-6">
            {/* Header Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6846F5] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">Student Notification Preferences</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Control which alerts and progress reminders you receive. Preferences are saved directly to your student profile and automatically restored when you sign in.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FD] border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Notice: </span>
                These settings configure real-time in-app dashboard alerts, opportunity deadline warnings, and application tracker notifications across Campus Connect.
              </div>
            </div>

            {/* Notification Feedback Banners */}
            {notificationErrorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-rose-900">Notification Preferences Error</p>
                  <p className="text-rose-700 leading-relaxed">{notificationErrorMessage}</p>
                </div>
              </div>
            )}

            {notificationSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-900">Preferences Saved</p>
                  <p className="text-emerald-700 leading-relaxed">{notificationSuccessMessage}</p>
                </div>
              </div>
            )}

            {/* 4 Required Notification Categories */}
            <div className="space-y-3">
              {/* 1. Scholarship and application deadlines */}
              <label className="p-4 rounded-xl border border-slate-200 hover:border-[#6846F5]/40 transition-colors flex items-start justify-between gap-4 cursor-pointer bg-white">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#10132D] block">
                    Scholarship &amp; Application Deadlines
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block">
                    Countdown alerts and warnings 14 days and 48 hours prior to official university intake and scholarship application closing dates.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.deadlineAlerts}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, deadlineAlerts: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#6846F5] focus:ring-[#6846F5] border-slate-300 mt-0.5 cursor-pointer"
                />
              </label>

              {/* 2. Saved university and scholarship updates */}
              <label className="p-4 rounded-xl border border-slate-200 hover:border-[#6846F5]/40 transition-colors flex items-start justify-between gap-4 cursor-pointer bg-white">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#10132D] block">
                    Saved University &amp; Scholarship Updates
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block">
                    Alerts when universities on your saved shortlist update their admissions requirements, tuition waiver programs, or funding availability.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.savedUpdatesAlerts}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, savedUpdatesAlerts: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#6846F5] focus:ring-[#6846F5] border-slate-300 mt-0.5 cursor-pointer"
                />
              </label>

              {/* 3. Application tracker reminders */}
              <label className="p-4 rounded-xl border border-slate-200 hover:border-[#6846F5]/40 transition-colors flex items-start justify-between gap-4 cursor-pointer bg-white">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#10132D] block">
                    Application Tracker Reminders
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block">
                    Milestone reminders to help you advance and finalize applications across saved, preparing, and submitted stages.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.trackerReminders}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, trackerReminders: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#6846F5] focus:ring-[#6846F5] border-slate-300 mt-0.5 cursor-pointer"
                />
              </label>

              {/* 4. Important university admission updates */}
              <label className="p-4 rounded-xl border border-slate-200 hover:border-[#6846F5]/40 transition-colors flex items-start justify-between gap-4 cursor-pointer bg-white">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#10132D] block">
                    Important University Admission Updates
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block">
                    Critical updates regarding international student visa guidelines, standardized test policies (SAT/GRE/IELTS), and new accredited programs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.admissionUpdates}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, admissionUpdates: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#6846F5] focus:ring-[#6846F5] border-slate-300 mt-0.5 cursor-pointer"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingNotifications}
                className="w-full sm:w-auto min-h-[44px] justify-center bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold px-6 inline-flex items-center gap-2"
              >
                {isSavingNotifications ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Preferences...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Notification Preferences</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={handleResetNotifications}
                disabled={isSavingNotifications}
                className="w-full sm:w-auto min-h-[44px] justify-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
            </form>

            {/* Real Email Opportunity Alerts & Deadline Reminders Management */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#10132D]">
                      Email Opportunity Alerts &amp; Deadline Digests
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Receive verified admissions updates, scholarships, fee waivers, SAT-free options, and upcoming deadline reminders tailored to your study profile.
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center self-start px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 ${
                    emailAlertConsentStatus === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : emailAlertConsentStatus === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isLoadingEmailAlerts
                    ? 'Checking...'
                    : emailAlertConsentStatus === 'confirmed'
                    ? 'Confirmed & Active'
                    : emailAlertConsentStatus === 'pending'
                    ? 'Confirmation Pending'
                    : emailAlertConsentStatus === 'unsubscribed'
                    ? 'Unsubscribed'
                    : 'Not Subscribed'}
                </span>
              </div>

              {(!firestoreAlertsReady || !emailDeliveryReady) && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    {!firestoreAlertsReady
                      ? 'Server-side Firestore subscriber storage awaits FIREBASE_SERVICE_ACCOUNT_JSON configuration.'
                      : 'Email delivery provider credentials (RESEND_API_KEY / SENDGRID_API_KEY + EMAIL_FROM) are not yet configured on the server.'}
                  </span>
                </div>
              )}

              {emailAlertError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{emailAlertError}</span>
                </div>
              )}

              {emailAlertSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{emailAlertSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="settings-alert-email" className="text-xs font-bold text-[#10132D] block">
                    Alert Delivery Email
                  </label>
                  <input
                    id="settings-alert-email"
                    type="email"
                    value={emailAlertEmail}
                    onChange={(e) => setEmailAlertEmail(e.target.value)}
                    disabled={emailAlertConsentStatus === 'confirmed' || isSavingEmailAlerts}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6846F5]/30 disabled:opacity-70"
                    placeholder="student@university.edu"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="settings-alert-frequency" className="text-xs font-bold text-[#10132D] block">
                    Alert Cadence
                  </label>
                  <select
                    id="settings-alert-frequency"
                    value={emailAlertFrequency}
                    onChange={(e) =>
                      setEmailAlertFrequency(e.target.value === 'immediate' ? 'immediate' : 'weekly')
                    }
                    disabled={isSavingEmailAlerts}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#6846F5]/30"
                  >
                    <option value="weekly">Weekly Digest + Deadline Reminders</option>
                    <option value="immediate">Immediate Matching Alerts + Deadlines</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#10132D] block">
                  Opportunity Categories
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EMAIL_ALERT_CATEGORIES.map((cat) => {
                    const checked = emailAlertCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#F0EDFF] border-[#6846F5]/40 text-[#10132D]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleEmailAlertCategory(cat.id)}
                          disabled={isSavingEmailAlerts}
                          className="w-4 h-4 rounded text-[#6846F5] focus:ring-[#6846F5] border-slate-300 cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSaveEmailAlertSubscription}
                  disabled={isSavingEmailAlerts}
                  className="w-full sm:w-auto min-h-[42px] justify-center bg-[#10132D] hover:bg-[#1E214F] text-white text-xs font-bold px-5 inline-flex items-center gap-2"
                >
                  {isSavingEmailAlerts ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Alert Settings...</span>
                    </>
                  ) : emailAlertConsentStatus === 'confirmed' || emailAlertConsentStatus === 'pending' ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Email Alert Preferences</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Subscribe to Email Alerts</span>
                    </>
                  )}
                </Button>

                {(emailAlertConsentStatus === 'confirmed' || emailAlertConsentStatus === 'pending') && (
                  <button
                    type="button"
                    onClick={handleUnsubscribeEmailAlerts}
                    disabled={isSavingEmailAlerts}
                    className="w-full sm:w-auto min-h-[42px] justify-center inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Unsubscribe</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STUDY PREFERENCES & RECOMMENDATIONS ALIGNMENT */}
        {/* ========================================================================= */}
        {activeTab === 'study' && (
          <form onSubmit={handleSaveStudyPrefs} className="space-y-6 max-w-3xl animate-in fade-in duration-150">
            {/* Context Info Banner */}
            <div className="p-4 rounded-2xl bg-[#F0EDFF]/80 border border-[#DDD6FE] space-y-1">
              <div className="flex items-center gap-2 text-[#6846F5] font-bold text-xs">
                <Compass className="w-4 h-4 shrink-0" />
                <span>Personalized Study & Opportunity Recommendations</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Campus Connect uses your study preferences to personalize dashboard recommendations,
                tailor scholarship deadlines, and prioritize universities in your target destinations by default,
                while keeping all international institutions available for exploration anytime.
              </p>
            </div>

            {/* Error Notification Banner */}
            {studyPrefsError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{studyPrefsError}</div>
              </div>
            )}

            {/* Success Notification Banner */}
            {studyPrefsSuccess && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{studyPrefsSuccess}</div>
              </div>
            )}

            {/* 1. Preferred Study Destinations (Single or Multiple) */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-[#10132D] font-bold text-sm">
                <Globe className="w-4 h-4 text-[#6846F5]" />
                <span>1. Preferred Study Destinations</span>
              </div>
              <p className="text-xs text-slate-500">
                Select one or multiple countries where you wish to pursue your higher education. Search across 200+ verified countries or pick from popular destinations.
              </p>

              <CountryMultiSelect
                label="Target Destination Countries"
                selectedCountries={studyDestinations}
                onChange={setStudyDestinations}
              />

              <div className="pt-2 border-t border-slate-100">
                <CountrySelect
                  id="pref-priority-country"
                  label="Default Country to Prioritize in Directory"
                  mode="country"
                  value={studyPriorityCountry}
                  onChange={setStudyPriorityCountry}
                  helperText="Universities located in this selected country will be displayed first by default in Explore Universities."
                />
              </div>
            </div>

            {/* 2. Target Degree Level & 3. Fields of Study */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-[#10132D] font-bold text-sm">
                <GraduationCap className="w-4 h-4 text-[#6846F5]" />
                <span>2. Degree Level & Academic Fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Degree Level Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Preferred Degree Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studyDegreeLevel}
                    onChange={(e) => setStudyDegreeLevel(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  >
                    <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor&apos;s)</option>
                    <option value="Master's (Postgraduate)">Master&apos;s Degree (Postgraduate)</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                    <option value="Associate Degree / Diploma">Associate Degree / Diploma</option>
                    <option value="Postgraduate Certificate / Diploma">Postgraduate Certificate / Diploma</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Filters scholarship eligibility and faculty levels.</p>
                </div>

                {/* Primary Field of Study */}
                <div>
                  <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                    Primary Academic Field of Study <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studyField}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStudyField(val);
                      if (val.trim() && !studyFieldsList.includes(val.trim())) {
                        setStudyFieldsList([val.trim(), ...studyFieldsList.filter((f) => f !== studyField)]);
                      }
                    }}
                    placeholder="e.g. Computer Science, Public Health, Mechanical Engineering"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Used to rank university departments and scholarship fields.</p>
                </div>
              </div>

              {/* Quick Select & Multiple Fields of Study Tags */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-[#10132D]">
                  Preferred Fields &amp; Subject Areas (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Computer Science & AI',
                    'Software Engineering',
                    'Data Science & Analytics',
                    'Engineering & Applied Sciences',
                    'Business, Economics & Finance',
                    'Medicine, Nursing & Public Health',
                    'Natural & Biological Sciences',
                    'Law, Governance & Public Policy',
                    'Environmental Science & Energy',
                    'Humanities & Social Sciences',
                  ].map((field) => {
                    const isSelected = studyFieldsList.includes(field) || studyField === field;
                    return (
                      <button
                        key={field}
                        type="button"
                        onClick={() => handleToggleStudyField(field)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#6846F5] text-white border-[#6846F5] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span>{field}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Preferred Study Mode */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#10132D] font-bold text-sm">
                <Laptop className="w-4 h-4 text-[#6846F5]" />
                <span>3. Preferred Study Mode</span>
              </div>
              <p className="text-xs text-slate-500">
                Choose how you prefer instruction delivered across your chosen institutions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {[
                  {
                    id: 'on-campus',
                    title: 'On-Campus',
                    tagline: 'Traditional In-Person',
                    description: 'Physical campus classes, laboratories, university housing, and student life.',
                  },
                  {
                    id: 'online',
                    title: 'Online',
                    tagline: '100% Distance Learning',
                    description: 'Fully remote degree programs with live lectures and asynchronous coursework.',
                  },
                  {
                    id: 'hybrid',
                    title: 'Hybrid',
                    tagline: 'Blended Format',
                    description: 'Combines digital coursework with on-campus intensive modules and residencies.',
                  },
                ].map((mode) => {
                  const isSelected = studyMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setStudyMode(mode.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#6846F5] bg-[#F0EDFF]/60 ring-2 ring-[#6846F5]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#6846F5]' : 'text-[#10132D]'}`}>
                            {mode.title}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#6846F5] bg-[#6846F5]' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          {mode.tagline}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-snug pt-1">
                          {mode.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Preferred Funding Type */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#10132D] font-bold text-sm">
                <Building className="w-4 h-4 text-[#6846F5]" />
                <span>4. Preferred Funding &amp; Financial Aid Type</span>
              </div>
              <p className="text-xs text-slate-500">
                Specify the level of financial support you require for tuition and living expenses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  {
                    id: 'fully_funded',
                    title: 'Fully Funded Only',
                    badge: '100% Full-Ride',
                    description: 'Full tuition coverage, monthly living stipend, campus accommodation, and travel grants.',
                  },
                  {
                    id: 'partially_funded',
                    title: 'Partially Funded & Merit',
                    badge: 'Tuition Waivers',
                    description: 'Partial tuition discounts, academic merit scholarships, and departmental bursaries.',
                  },
                  {
                    id: 'self_funded',
                    title: 'Self-Funded / Standard Tuition',
                    badge: 'Standard Admission',
                    description: 'Standard tuition rate programs without requiring institutional scholarship aid.',
                  },
                  {
                    id: 'all',
                    title: 'All Opportunities',
                    badge: 'Full Directory',
                    description: 'Display all verified institutions and scholarships regardless of funding structure.',
                  },
                ].map((item) => {
                  const isSelected = fundingType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFundingType(item.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#6846F5] bg-[#F0EDFF]/60 ring-2 ring-[#6846F5]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#6846F5]' : 'text-[#10132D]'}`}>
                            {item.title}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#6846F5] bg-[#6846F5]' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          {item.badge}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-snug pt-1">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSavingStudyPrefs}
                className="w-full sm:w-auto min-h-[44px] justify-center bg-[#6846F5] hover:bg-[#5835E5] text-white text-xs font-bold px-6 inline-flex items-center gap-2"
              >
                {isSavingStudyPrefs ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Preferences...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Study Preferences</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={handleResetStudyPrefs}
                disabled={isSavingStudyPrefs}
                className="w-full sm:w-auto min-h-[44px] justify-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Saved Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PRIVACY & ACCOUNT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
            {/* Context Info Banner */}
            <div className="p-4 rounded-2xl bg-[#F0EDFF]/80 border border-[#DDD6FE] space-y-1">
              <div className="flex items-center gap-2 text-[#6846F5] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Student Privacy &amp; Data Protection Centre</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Campus Connect puts you in full control of your personal information. Review data held in your account,
                download an offline data copy, manage active device sessions, inspect our student privacy policy, or permanently delete your account.
              </p>
            </div>

            {/* Error & Success Feedback Banners */}
            {accountDeletionError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{accountDeletionError}</div>
              </div>
            )}

            {accountDeletionSuccess && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{accountDeletionSuccess}</div>
              </div>
            )}

            {signOutAllError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{signOutAllError}</div>
              </div>
            )}

            {signOutAllSuccess && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{signOutAllSuccess}</div>
              </div>
            )}

            {exportSuccessMessage && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{exportSuccessMessage}</div>
              </div>
            )}

            {/* 1. Account & Personal Data Review */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#10132D] font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-[#6846F5]" />
                  <span>1. Account &amp; Personal Data Information Review</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active &amp; Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Summary of the personal, academic, and activity data associated with your student profile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Full Legal Name
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block truncate">
                    {user?.fullName || 'Not provided'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Registered Contact Email
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block truncate">
                    {user?.email || 'Not provided'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Student Reference ID
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#10132D] truncate">
                      {getFormattedStudentId(user?.id)}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyStudentId}
                      title="Copy Student Reference ID"
                      className="p-1 text-slate-400 hover:text-[#6846F5] rounded transition-colors cursor-pointer shrink-0"
                    >
                      {copiedStudentId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Nationality &amp; Residence
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block truncate">
                    {user?.profile?.nationality || 'Ghanaian'} (Residing in {user?.profile?.countryOfResidence || user?.country || 'Ghana'})
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Target Degree &amp; Major
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block truncate">
                    {user?.profile?.intendedDegree || user?.degreeLevel || 'Undergraduate'} in {user?.profile?.fieldOfStudy || user?.studyField || 'Computer Science'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Saved Universities &amp; Applications
                  </span>
                  <span className="text-xs font-bold text-[#10132D] block">
                    {user?.savedOpportunities?.length || 0} Saved Universities &bull; {Object.keys(user?.applicationTracker || {}).length} Tracker Milestones
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FD] border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Lock className="w-3.5 h-3.5 text-[#6846F5] shrink-0" />
                  <span>
                    Your personal information and academic records are protected by strict student data privacy standards.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Request Copy of Personal Data (Data Portability) */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">2. Request a Copy of Personal Data</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Under student data privacy principles and data portability guidelines, you have the right to receive an export
                    of all your personal data held on Campus Connect, including your academic profile, target universities,
                    application tracker history, and notification preferences in a standard offline format.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  disabled={isExportingData}
                  leftIcon={isExportingData ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-800"
                >
                  {isExportingData ? 'Generating Data Archive...' : 'Download Personal Data Copy (JSON)'}
                </Button>
              </div>
            </div>

            {/* 3. Sign Out Securely from All Supported Sessions */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">3. Sign Out Securely from All Sessions</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Instantly terminate your current authentication session, invalidate cached session tokens, and sign out
                    of your student account across this device and browser.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOutAllSessions}
                  disabled={isSigningOutAllSessions}
                  leftIcon={isSigningOutAllSessions ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 text-slate-700" />}
                  className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-800"
                >
                  {isSigningOutAllSessions ? 'Signing Out...' : 'Sign Out of All Sessions'}
                </Button>
              </div>
            </div>

            {/* 4. Platform Privacy Policy */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6846F5] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#10132D]">4. Campus Connect Student Privacy Policy</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Campus Connect is committed to complete transparency in how student information is collected, safeguarded, and utilized.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrivacyPolicyExpanded(!isPrivacyPolicyExpanded)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#6846F5] hover:bg-[#F0EDFF]/50 transition-colors cursor-pointer shrink-0 min-h-[38px]"
                >
                  <span>{isPrivacyPolicyExpanded ? 'Hide Policy' : 'View Full Policy'}</span>
                  {isPrivacyPolicyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Inline Highlight Commitment */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-[#6846F5]" />
                  <span>Zero Commercial Sale Guarantee</span>
                </div>
                <p className="leading-relaxed text-[11px] text-slate-600">
                  Your academic records, test scores, target universities, and identity details are strictly confidential.
                  Campus Connect never sells, licenses, or monetizes student data to third-party advertisers or recruitment brokers.
                </p>
              </div>

              {/* Expanded Full Privacy Policy Document */}
              {isPrivacyPolicyExpanded && (
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-700 space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-sm font-bold text-[#10132D]">Official Student Data Privacy Policy</h4>
                    <p className="text-[11px] text-slate-500">Last updated: October 2026 &bull; Standard Academic Year 2026/2027</p>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-200/60">
                    <div className="pt-2 space-y-1">
                      <h5 className="font-bold text-[#10132D]">1. Information We Collect</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        We collect information provided directly by you when creating an account: full name, contact email, nationality,
                        country of residence, target degree level, academic fields of study, expected graduation year, saved institutions,
                        and application milestone stages.
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <h5 className="font-bold text-[#10132D]">2. How We Use Your Information</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Your information is used solely to provide and improve the Campus Connect directory service: personalizing university
                        and scholarship recommendations, notifying you about upcoming deadlines, calculating admission requirements, and
                        synchronizing your application milestones.
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <h5 className="font-bold text-[#10132D]">3. Data Security &amp; Protection</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Student profiles and records are protected in private, role-enforced account partitions. All data
                        in transit and at rest is safeguarded using industry-standard security protocols and strict access controls.
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <h5 className="font-bold text-[#10132D]">4. Student Rights (GDPR &amp; FERPA)</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        You hold complete rights over your data at all times: the right to inspect your account data, the right to rectify
                        inaccuracies, the right to data portability (offline JSON download), and the right to permanent erasure (account deletion).
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <h5 className="font-bold text-[#10132D]">5. Data Protection Inquiries</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        For questions regarding your student data rights or data governance, contact our designated Data Protection team at{' '}
                        <a href="mailto:privacy@campusconnect.edu" className="text-[#6846F5] underline font-medium">
                          privacy@campusconnect.edu
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Target List Data Cleanup */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#10132D]">Manage Target Radar List</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You currently have <strong>{savedOpportunitiesCount}</strong> universities saved in your personal radar board.
                  </p>
                </div>
              </div>

              {showClearConfirm ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2 animate-in fade-in duration-150">
                  <p className="text-xs font-semibold text-rose-800">
                    Are you sure you want to remove all saved universities from your target list?
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleConfirmClearSaved}
                      className="w-full sm:w-auto min-h-[44px] justify-center bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Yes, Clear Target List
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClearConfirm(false)}
                      className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearConfirm(true)}
                    disabled={savedOpportunitiesCount === 0}
                    className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-semibold text-slate-700 border-slate-300 disabled:opacity-40"
                  >
                    Clear Target List
                  </Button>
                </div>
              )}
            </div>

            {/* 5. Permanent Account Deletion with Clear Confirmation Step */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200 space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-rose-950">5. Permanent Account Deletion (Right to Erasure)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Permanently delete your Campus Connect account and erase all associated profile records.
                    This operation is immediate and irreversible.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1 text-xs text-rose-900">
                <span className="font-bold block">What happens when you delete your account:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                  <li>Your student profile and account data are permanently deleted.</li>
                  <li>All saved universities, application deadlines, and application tracker progress are wiped.</li>
                  <li>Your account sign-in credentials and active sessions are revoked.</li>
                  <li>You will be securely signed out immediately.</li>
                </ul>
              </div>

              {showDeleteConfirmStep ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label htmlFor="confirm-delete-input" className="block text-xs font-bold text-rose-950">
                      Confirmation Required: Type &ldquo;DELETE&rdquo; to proceed
                    </label>
                    <p className="text-[11px] text-rose-700">
                      Please confirm that you understand this action cannot be undone.
                    </p>
                  </div>

                  <input
                    id="confirm-delete-input"
                    type="text"
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full h-11 px-3 rounded-xl border border-rose-300 bg-white text-xs font-bold text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount || deleteConfirmationInput.trim().toUpperCase() !== 'DELETE'}
                      className="w-full sm:w-auto min-h-[44px] justify-center bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-40"
                    >
                      {isDeletingAccount ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting Account...</span>
                        </>
                      ) : (
                        <span>Permanently Delete My Account</span>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDeleteConfirmStep(false);
                        setDeleteConfirmationInput('');
                        setAccountDeletionError(null);
                      }}
                      disabled={isDeletingAccount}
                      className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDeleteConfirmStep(true);
                      setDeleteConfirmationInput('');
                      setAccountDeletionError(null);
                    }}
                    className="w-full sm:w-auto min-h-[44px] justify-center text-xs font-bold text-rose-600 border-rose-300 hover:bg-rose-50"
                  >
                    Request Permanent Account Deletion
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ADMINISTRATOR CONTROLS (RESTRICTED TO AUTHORIZED ADMINS) */}
        {/* ========================================================================= */}
        {activeTab === 'admin' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
            {isAuthorizedAdmin ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-purple-50 border border-[#DDD6FE] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-[#6846F5]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#10132D]">Authorized Platform Administration</h4>
                      <p className="text-[11px] text-slate-500">
                        Authenticated as <strong>{user?.email}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#6846F5] text-white">
                    Root Admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Database Status</span>
                    <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Live &amp; Connected</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Verified Records</span>
                    <p className="font-bold text-[#10132D]">{opportunitiesCount} Institutions</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Security Rules</span>
                    <p className="font-bold text-[#10132D]">ABAC Enforced</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
                  <h4 className="text-xs font-bold text-[#10132D] uppercase tracking-wider">
                    Database Maintenance &amp; Synchronization
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Verify cloud connectivity and synchronize verified institutional records across all international
                    partitions.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onManualDbSync}
                    disabled={dbState.isSyncing}
                    leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${dbState.isSyncing ? 'animate-spin' : ''}`} />}
                    className="text-xs font-semibold text-slate-800 border-slate-300"
                  >
                    {dbState.isSyncing ? 'Synchronizing Directory Records...' : 'Re-verify & Sync Directory Database'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="text-sm font-bold text-amber-900">Administrative Access Restricted</h4>
                <p className="text-xs text-amber-700 max-w-sm mx-auto">
                  This console is restricted to authorized platform administrators. Regular students manage their profile
                  via the student account tabs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
